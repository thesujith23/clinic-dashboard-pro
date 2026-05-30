export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const recording_id = url.searchParams.get("recording_id");
  const call_uuid = url.searchParams.get("call_uuid");

  if (!recording_id || !call_uuid) {
    return new Response(JSON.stringify({ error: "Missing recording_id or call_uuid parameter" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const authId = process.env.PLIVO_AUTH_ID;
  const authToken = process.env.PLIVO_AUTH_TOKEN;

  if (!authId || !authToken) {
    return new Response(JSON.stringify({ error: "Plivo credentials are not configured." }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const headers = {
    Authorization: `Basic ${btoa(`${authId}:${authToken}`)}`,
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  try {
    const listUrl = `https://api.plivo.com/v1/Account/${authId}/Transcription/?limit=20`;
    
    // First, try to GET the transcription list
    const getRes = await fetch(listUrl, { headers });
    
    if (getRes.ok) {
      const data = await getRes.json() as any;
      const transcript = data.objects?.find((t: any) => t.call_uuid === call_uuid);
      // If it has text, return it
      if (transcript && transcript.transcription_text) {
        return new Response(JSON.stringify({
          status: "completed",
          text: transcript.transcription_text,
          data: transcript
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // If it doesn't exist or not completed, try to POST to trigger it using recording_id
    const postUrl = `https://api.plivo.com/v1/Account/${authId}/Transcription/${recording_id}/`;
    const postRes = await fetch(postUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });

    if (postRes.ok) {
      return new Response(JSON.stringify({
        status: "queued",
        text: null,
        message: "Transcription triggered successfully."
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
      // It might return an error if it's already queued or failed
      const errData = await postRes.json().catch(() => null);
      return new Response(JSON.stringify({
        status: "error",
        error: "Failed to trigger transcription.",
        details: errData
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to reach Plivo." }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
