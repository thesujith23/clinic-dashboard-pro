export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const authId = process.env.PLIVO_AUTH_ID;
  const authToken = process.env.PLIVO_AUTH_TOKEN;

  if (!authId || !authToken) {
    return new Response(JSON.stringify({ logs: [], error: "Plivo credentials are not configured." }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const callsUrl = `https://api.plivo.com/v1/Account/${authId}/Call/?limit=20`;
    const recordingsUrl = `https://api.plivo.com/v1/Account/${authId}/Recording/?limit=20`;
    // Try fetching transcriptions as well
    const transcriptionsUrl = `https://api.plivo.com/v1/Account/${authId}/Transcription/?limit=20`;

    const headers = {
      Authorization: `Basic ${btoa(`${authId}:${authToken}`)}`,
      Accept: "application/json",
    };

    const [callsRes, recordingsRes, transcriptionsRes] = await Promise.all([
      fetch(callsUrl, { headers }),
      fetch(recordingsUrl, { headers }),
      fetch(transcriptionsUrl, { headers }).catch(() => null)
    ]);

    if (!callsRes.ok) {
      return new Response(JSON.stringify({ logs: [], error: `Plivo API ${callsRes.status}` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const callsData = await callsRes.json() as { objects?: any[] };
    let recordingsData: { objects?: any[] } = { objects: [] };
    let transcriptionsData: { objects?: any[] } = { objects: [] };

    if (recordingsRes.ok) {
      recordingsData = await recordingsRes.json();
    }
    if (transcriptionsRes && transcriptionsRes.ok) {
      transcriptionsData = await transcriptionsRes.json();
    }

    const recordingsMap = new Map<string, any>();
    recordingsData.objects?.forEach((rec) => {
      if (rec.call_uuid && rec.recording_id) {
        recordingsMap.set(rec.call_uuid, rec);
      }
    });

    const transcriptsMap = new Map<string, string>();
    transcriptionsData.objects?.forEach((trans) => {
      if (trans.recording_id && trans.transcription_text) {
        transcriptsMap.set(trans.recording_id, trans.transcription_text);
      }
    });

    const transcriptReqs: Promise<any>[] = [];

    const logs = (callsData.objects ?? []).map((log) => {
      const rec = recordingsMap.get(log.call_uuid);
      let transcript = null;
      
      if (rec && rec.recording_id) {
        transcript = transcriptsMap.get(rec.recording_id) || null;
        
        // Auto-trigger transcription if it doesn't exist yet
        if (!transcript) {
          transcriptReqs.push(
            fetch(`https://api.plivo.com/v1/Account/${authId}/Transcription/${rec.recording_id}/`, {
               method: 'POST',
               headers
            })
          );
        }
      }

      // Basic mock summary generation if transcript exists
      const summary = transcript 
        ? (transcript.length > 50 ? transcript.substring(0, 50) + "..." : transcript)
        : null;
        
      return {
        ...log,
        recording_url: rec ? rec.recording_url : null,
        transcript: transcript,
        summary: summary
      };
    });

    // Fire and forget transcription requests
    if (transcriptReqs.length > 0) {
       Promise.allSettled(transcriptReqs).catch(() => {});
    }

    return new Response(JSON.stringify({ logs, error: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ logs: [], error: "Failed to reach Plivo." }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
