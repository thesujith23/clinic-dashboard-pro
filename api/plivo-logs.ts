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

    const headers = {
      Authorization: `Basic ${btoa(`${authId}:${authToken}`)}`,
      Accept: "application/json",
    };

    const [callsRes, recordingsRes] = await Promise.all([
      fetch(callsUrl, { headers }),
      fetch(recordingsUrl, { headers })
    ]);

    if (!callsRes.ok) {
      return new Response(JSON.stringify({ logs: [], error: `Plivo API ${callsRes.status}` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const callsData = await callsRes.json() as { objects?: any[] };
    let recordingsData: { objects?: any[] } = { objects: [] };

    if (recordingsRes.ok) {
      recordingsData = await recordingsRes.json();
    }

    const recordingsMap = new Map<string, string>();
    recordingsData.objects?.forEach((rec) => {
      if (rec.call_uuid && rec.recording_url) {
        recordingsMap.set(rec.call_uuid, rec.recording_url);
      }
    });

    const logs = (callsData.objects ?? []).map((log) => ({
      ...log,
      recording_url: recordingsMap.get(log.call_uuid) || null
    }));

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
