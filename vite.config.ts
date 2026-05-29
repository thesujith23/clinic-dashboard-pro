import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const plivoApiPlugin = (env: Record<string, string>) => {
  return {
    name: 'plivo-api',
    configureServer(server: any) {
      server.middlewares.use('/api/plivo-logs', async (req: any, res: any) => {
        // Use credentials from .env or fallback
        const authId = env.PLIVO_AUTH_ID || 'MAY2RJZJI4YJUTNDLHOC';
        const authToken = env.PLIVO_AUTH_TOKEN || 'YTc1YzBkODAtOTNmNS00YTg4LTZkZmItNWEzNTIx';
        
        try {
          const callsUrl = `https://api.plivo.com/v1/Account/${authId}/Call/?limit=20`;
          const recordingsUrl = `https://api.plivo.com/v1/Account/${authId}/Recording/?limit=20`;
          
          const headers = {
            Authorization: `Basic ${Buffer.from(`${authId}:${authToken}`).toString('base64')}`,
            Accept: "application/json",
          };
          
          const [callsRes, recordingsRes] = await Promise.all([
            fetch(callsUrl, { headers }),
            fetch(recordingsUrl, { headers })
          ]);
          
          if (!callsRes.ok) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ logs: [], error: `Plivo API ${callsRes.status}` }));
            return;
          }
          
          const callsData: any = await callsRes.json();
          let recordingsData: any = { objects: [] };
          if (recordingsRes.ok) {
            recordingsData = await recordingsRes.json();
          }
          
          const recordingsMap = new Map();
          recordingsData.objects?.forEach((rec: any) => {
            if (rec.call_uuid && rec.recording_url) {
              recordingsMap.set(rec.call_uuid, rec.recording_url);
            }
          });
          
          const logs = (callsData.objects ?? []).map((log: any) => ({
            ...log,
            recording_url: recordingsMap.get(log.call_uuid) || null
          }));
          
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
