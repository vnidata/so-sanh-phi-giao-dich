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

          const fallbackUrl = reqUrl.searchParams.get('fallbackUrl');

          try {
            const browserHeaders = {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 VietSecScanner/2.0',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
              'Cache-Control': 'no-cache'
            };

            let activeUrl = targetUrl;
            let sourceType = 'direct';
            let fetchRes;
            try {
              fetchRes = await fetch(activeUrl, {
                headers: browserHeaders,
                signal: AbortSignal.timeout(3500),
                redirect: 'follow'
              });
            } catch (_) {
              fetchRes = { status: 408 };
            }

            // 1. Thử fallbackUrl nếu URL chính không trả về HTTP 200
            if (fetchRes.status !== 200 && fallbackUrl) {
              try {
                const fbRes = await fetch(fallbackUrl, {
                  headers: browserHeaders,
                  signal: AbortSignal.timeout(3500),
                  redirect: 'follow'
                });
                if (fbRes.status === 200) {
                  fetchRes = fbRes;
                  activeUrl = fallbackUrl;
                  sourceType = fallbackUrl.includes('r.jina.ai') ? 'anti_waf_gateway' : 'fallback';
                }
              } catch (_) {}
            }

            // 2. Thử Anti-WAF Gateway nếu vẫn bị 403 Cloudflare
            if (fetchRes.status === 403 && !activeUrl.includes('r.jina.ai')) {
              try {
                const bypassUrl = fallbackUrl && !fallbackUrl.includes('r.jina.ai') ? fallbackUrl : targetUrl;
                const jinaUrl = 'https://r.jina.ai/' + bypassUrl;
                const jinaRes = await fetch(jinaUrl, {
                  headers: { 'Accept': 'text/plain, text/markdown' },
                  signal: AbortSignal.timeout(4500)
                });
                if (jinaRes.status === 200) {
                  const jText = await jinaRes.text();
                  if (jText.length > 500) {
                    fetchRes = { status: 200, text: async () => jText };
                    activeUrl = jinaUrl;
                    sourceType = 'anti_waf_gateway';
                  }
                }
              } catch (_) {}
            }

            const status = fetchRes.status;
            let text = '';
            if (status === 200) {
              text = await fetchRes.text();
            }

            const isAccessible = status === 200 && text.length > 300;
            const signals = isAccessible ? analyzeFinancialKeywords(text) : null;

            const result = {
              id: brokerId,
              url: activeUrl,
              httpStatus: status,
              isAccessible,
              sourceType,
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
