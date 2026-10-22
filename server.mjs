import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeFinancialKeywords } from './src/utils/financialKeywords.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 4173;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let reqPath = decodeURIComponent(parsedUrl.pathname);

  // Support GitHub Pages base path prefix locally
  if (reqPath.startsWith('/so-sanh-phi-giao-dich')) {
    reqPath = reqPath.slice('/so-sanh-phi-giao-dich'.length);
  }

  // API endpoint for live single broker crawl
  if (reqPath === '/api/scan-single') {
    const brokerId = parsedUrl.searchParams.get('id');
    const targetUrl = parsedUrl.searchParams.get('url');
    const fallbackUrl = parsedUrl.searchParams.get('fallbackUrl');

    if (!targetUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing target url parameter' }));
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      const browserHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 VietSecScanner/2.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache'
      };

      let activeUrl = targetUrl;
      let sourceType = 'direct';
      let fetchRes = await fetch(activeUrl, {
        headers: browserHeaders,
        signal: controller.signal,
        redirect: 'follow'
      });

      // 1. Thử fallbackUrl nếu URL chính không trả về 200
      if (fetchRes.status !== 200 && fallbackUrl) {
        try {
          const fbRes = await fetch(fallbackUrl, {
            headers: browserHeaders,
            signal: AbortSignal.timeout(5000),
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
            signal: AbortSignal.timeout(6000)
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
      clearTimeout(timeoutId);

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
      return;
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
      return;
    }
  }

  if (!reqPath || reqPath === '/') {
    reqPath = '/index.html';
  }

  let filePath = path.join(DIST_DIR, reqPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback: serve index.html for client-side routing
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('500 Lỗi máy chủ: Không tìm thấy dist/index.html. Vui lòng chạy npm run build trước.');
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        res.end(content);
      });
      return;
    }

    // Serve static file
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Static cache for assets
    const isAsset = reqPath.startsWith('/assets/');
    const cacheControl = isAsset ? 'public, max-age=31536000, immutable' : 'no-cache';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log('====================================================');
  console.log('  VIETSEC FEE COMPARATOR - PRODUCTION SERVER GOLIVE');
  console.log('====================================================');
  console.log(`  > Local URL:    http://localhost:${PORT}/`);
  console.log(`  > IPv4 Loopback:http://127.0.0.1:${PORT}/`);
  console.log(`  > Network (LAN):http://10.21.184.240:${PORT}/`);
  console.log('  > Trạng thái:   Hoạt động 24/7 (Dual-stack IPv4 + IPv6)');
  console.log('====================================================');
});
