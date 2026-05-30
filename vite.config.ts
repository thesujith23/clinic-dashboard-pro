import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const plivoApiPlugin = (env: Record<string, string>) => {
  return {
    name: 'plivo-api',
    configureServer(server: any) {
      server.middlewares.use('/api/plivo-transcribe', async (req: any, res: any) => {
        const url = new URL(req.url || '/', `http://${req.headers.host}`);
        const recording_id = url.searchParams.get("recording_id");
        const call_uuid = url.searchParams.get("call_uuid");

        if (!recording_id || !call_uuid) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: "Missing recording_id or call_uuid parameter" }));
        }

        const authId = env.PLIVO_AUTH_ID || 'MAY2RJZJI4YJUTNDLHOC';
        const authToken = env.PLIVO_AUTH_TOKEN || 'YTc1YzBkODAtOTNmNS00YTg4LTZkZmItNWEzNTIx';
        
        const headers = {
          Authorization: `Basic ${Buffer.from(`${authId}:${authToken}`).toString('base64')}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        };

        try {
          // First, fetch the transcriptions list and look for our call_uuid
          const listUrl = `https://api.plivo.com/v1/Account/${authId}/Transcription/?limit=20`;
          const getRes = await fetch(listUrl, { headers });
          if (getRes.ok) {
            const data: any = await getRes.json();
            const transcript = data.objects?.find((t: any) => t.call_uuid === call_uuid);
            if (transcript && transcript.transcription_text) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                status: "completed",
                text: transcript.transcription_text,
                data: transcript
              }));
            }
          }

          // If not found, trigger the POST creation using recording_id
          const postUrl = `https://api.plivo.com/v1/Account/${authId}/Transcription/${recording_id}/`;
          const postRes = await fetch(postUrl, { method: 'POST', headers, body: JSON.stringify({}) });
          if (postRes.ok) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              status: "queued",
              text: null,
              message: "Transcription triggered successfully."
            }));
          } else {
            const errData = await postRes.json().catch(() => null);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              status: "error",
              error: "Failed to trigger transcription.",
              details: errData
            }));
          }
        } catch (err) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: "Failed to reach Plivo." }));
        }
      });

      server.middlewares.use('/api/plivo-logs', async (req: any, res: any) => {
        // Use credentials from .env or fallback
        const authId = env.PLIVO_AUTH_ID || 'MAY2RJZJI4YJUTNDLHOC';
        const authToken = env.PLIVO_AUTH_TOKEN || 'YTc1YzBkODAtOTNmNS00YTg4LTZkZmItNWEzNTIx';
        
        try {
          const callsUrl = `https://api.plivo.com/v1/Account/${authId}/Call/?limit=20`;
          const recordingsUrl = `https://api.plivo.com/v1/Account/${authId}/Recording/?limit=20`;
          const transcriptionsUrl = `https://api.plivo.com/v1/Account/${authId}/Transcription/?limit=20`;
          
          const headers = {
            Authorization: `Basic ${Buffer.from(`${authId}:${authToken}`).toString('base64')}`,
            Accept: "application/json",
          };
          
          const [callsRes, recordingsRes, transcriptionsRes] = await Promise.all([
            fetch(callsUrl, { headers }),
            fetch(recordingsUrl, { headers }),
            fetch(transcriptionsUrl, { headers }).catch(() => null)
          ]);
          
          if (!callsRes.ok) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ logs: [], error: `Plivo API ${callsRes.status}` }));
            return;
          }
          
          const callsData: any = await callsRes.json();
          let recordingsData: any = { objects: [] };
          let transcriptionsData: any = { objects: [] };
          
          if (recordingsRes.ok) {
            recordingsData = await recordingsRes.json();
          }
          if (transcriptionsRes && transcriptionsRes.ok) {
            transcriptionsData = await transcriptionsRes.json();
          }
          
          const recordingsMap = new Map();
          recordingsData.objects?.forEach((rec: any) => {
            if (rec.call_uuid && rec.recording_id) {
              recordingsMap.set(rec.call_uuid, rec);
            }
          });
          
          const transcriptsMap = new Map();
          transcriptionsData.objects?.forEach((trans: any) => {
            if (trans.call_uuid && trans.transcription_text) {
              transcriptsMap.set(trans.call_uuid, trans.transcription_text);
            }
          });

          const transcriptReqs: Promise<any>[] = [];
          
          const logs = (callsData.objects ?? []).map((log: any) => {
            const rec = recordingsMap.get(log.call_uuid);
            let transcript = null;
            
            if (rec && rec.recording_id) {
              transcript = transcriptsMap.get(log.call_uuid) || null;
              if (!transcript) {
                transcriptReqs.push(
                  fetch(`https://api.plivo.com/v1/Account/${authId}/Transcription/${rec.recording_id}/`, {
                     method: 'POST',
                     headers: {
                       ...headers,
                       "Content-Type": "application/json"
                     },
                     body: JSON.stringify({})
                  })
                );
              }
            }
            
            const summary = transcript 
              ? (transcript.length > 50 ? transcript.substring(0, 50) + "..." : transcript)
              : null;
              
            return {
              ...log,
              recording_url: rec ? rec.recording_url : null,
              recording_id: rec ? rec.recording_id : null,
              transcript: transcript,
              summary: summary
            };
          });

          if (transcriptReqs.length > 0) {
             Promise.allSettled(transcriptReqs).catch(() => {});
          }
          
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ logs, error: null }));
        } catch (err) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ logs: [], error: "Failed to reach Plivo." }));
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths(),
      plivoApiPlugin(env)
    ],
  };
});
