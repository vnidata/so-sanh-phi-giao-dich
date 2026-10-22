import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { analyzeFinancialKeywords } from './src/utils/financialKeywords.js';

// Custom plugin to provide native Node-based crawler endpoint during dev
function crawlerDevPlugin() {
  return {
    name: 'crawler-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/scan-single', async (req, res) => {
        try {
          const reqUrl = new URL(req.url, 'http://localhost');
          const brokerId = reqUrl.searchParams.get('id');
          const targetUrl = reqUrl.searchParams.get('url');

          if (!targetUrl) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing target url parameter' }));
            return;
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 7000);

          try {
            const fetchRes = await fetch(targetUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 VietSecScanner/2.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
              },
              signal: controller.signal,
              redirect: 'follow'
            });
            clearTimeout(timeoutId);

            const status = fetchRes.status;
            let text = '';
            if (status === 200) {
              text = await fetchRes.text();
            }

            const signals = status === 200 ? analyzeFinancialKeywords(text) : null;

            const result = {
              id: brokerId,
              url: targetUrl,
              httpStatus: status,
              isAccessible: status === 200,
              contentLength: text.length,
              signals,
              scannedAt: new Date().toISOString()
            };

            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify(result));
          } catch (err) {
            clearTimeout(timeoutId);
            const isTimeout = err.name === 'AbortError';
            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({
              id: brokerId,
              url: targetUrl,
              httpStatus: isTimeout ? 'Timeout' : 'Fetch Error',
              isAccessible: false,
              contentLength: 0,
              signals: null,
              unscannableReason: isTimeout ? 'Timeout > 7s' : err.message,
              scannedAt: new Date().toISOString()
            }));
          }
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crawlerDevPlugin()],
  base: '/so-sanh-phi-giao-dich/', // Absolute base path for GitHub Pages deployment
});
