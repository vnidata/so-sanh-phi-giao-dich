import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SECURITIES_COMPANIES } from '../src/data/securitiesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkUrl(item) {
  const { url, broker, id, field, articleTitle } = item;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi,en;q=0.9',
        'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Upgrade-Insecure-Requests': '1'
      },
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(timeoutId);

    const status = res.status;
    const finalUrl = res.url;
    let html = '';
    try {
      html = await res.text();
    } catch (e) {
      html = '';
    }

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
    const h1 = h1Match ? h1Match[1].trim() : '';

    const lowerTitle = title.toLowerCase();
    const lowerH1 = h1.toLowerCase();
    const lowerFinal = finalUrl.toLowerCase();
    const lowerHtml = html.slice(0, 3000).toLowerCase();

    let isDead = false;
    let deadReason = '';

    if (status === 404) {
      isDead = true;
      deadReason = `HTTP 404 (${title || 'Not Found'})`;
    } else if (status >= 400 && status !== 403) {
      // 403 can be Cloudflare/WAF anti-bot (e.g. TCBS, MBS, VNDIRECT block headless fetch), so 403 isn't necessarily 404
      isDead = true;
      deadReason = `HTTP ${status}`;
    } else if (lowerTitle === '404' || lowerTitle.includes('404 not found') || lowerTitle.includes('404 - ') || lowerTitle.includes('trang không tìm thấy') || lowerTitle.includes('không tìm thấy trang') || lowerTitle.includes('page not found')) {
      isDead = true;
      deadReason = `Title 404: "${title}"`;
    } else if (lowerH1.includes('404') || lowerH1.includes('không tìm thấy trang') || lowerH1.includes('trang bạn tìm kiếm không tồn tại') || lowerH1.includes('page not found')) {
      isDead = true;
      deadReason = `H1 404: "${h1}"`;
    } else if (lowerFinal.includes('/404') || lowerFinal.endsWith('/error.page') || lowerFinal.endsWith('/not-found')) {
      isDead = true;
      deadReason = `Redirect to 404 URL: ${finalUrl}`;
    } else if (status === 200 && html.length < 1500 && (lowerHtml.includes('404') || lowerHtml.includes('not found') || lowerHtml.includes('không tìm thấy'))) {
      isDead = true;
      deadReason = `Short body with 404/not found (${html.length} bytes)`;
    }

    return {
      broker,
      brokerId: id,
      field,
      articleTitle: articleTitle || '',
      url,
      status,
      finalUrl,
      title: title.slice(0, 100),
      h1: h1.slice(0, 100),
      isDead,
      deadReason
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      broker,
      brokerId: id,
      field,
      articleTitle: articleTitle || '',
      url,
      status: err.name === 'AbortError' ? 'TIMEOUT' : 'ERROR',
      finalUrl: url,
      title: '',
      h1: '',
      isDead: true,
      deadReason: `Network error: ${err.message}`
    };
  }
}

// Chạy hàng đợi với concurrency giới hạn = 4 để tránh nghẽn
async function asyncPool(limit, items, iteratorFn) {
  const ret = [];
  const executing = new Set();
  for (const item of items) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean, clean);
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(ret);
}

async function main() {
  console.log('--- SCANNING ALL 224 URLS IN SECURITIES_COMPANIES ---');
  const allUrls = [];
  SECURITIES_COMPANIES.forEach(c => {
    if (c.website) allUrls.push({ broker: c.shortName, id: c.id, field: 'website', url: c.website });
    if (c.sourceUrl) allUrls.push({ broker: c.shortName, id: c.id, field: 'sourceUrl', url: c.sourceUrl });
    if (c.margin?.sourceUrl) allUrls.push({ broker: c.shortName, id: c.id, field: 'margin.sourceUrl', url: c.margin.sourceUrl });
    if (c.welcomePromo?.sourceUrl) allUrls.push({ broker: c.shortName, id: c.id, field: 'welcomePromo.sourceUrl', url: c.welcomePromo.sourceUrl });
    if (c.accountOpeningUrl) allUrls.push({ broker: c.shortName, id: c.id, field: 'accountOpeningUrl', url: c.accountOpeningUrl });
    if (c.promoArticles) {
      c.promoArticles.forEach((a, i) => {
        if (a.url) allUrls.push({ broker: c.shortName, id: c.id, field: `promoArticles[${i}]`, url: a.url, articleTitle: a.title });
      });
    }
  });

  const results = await asyncPool(5, allUrls, checkUrl);

  const deads = results.filter(r => r.isDead);
  console.log(`\n============================================================`);
  console.log(`TOTAL URLS: ${results.length}`);
  console.log(`DEAD / 404 URLS: ${deads.length}`);
  console.log(`============================================================`);

  deads.forEach((d, idx) => {
    console.log(`${idx + 1}. [${d.broker}] (${d.brokerId}) - ${d.field}: ${d.url}`);
    console.log(`   Reason: ${d.deadReason} | Status: ${d.status}`);
    if (d.articleTitle) console.log(`   Title: ${d.articleTitle}`);
    console.log('');
  });

  fs.writeFileSync(
    path.join(__dirname, 'audit-all-224-urls.json'),
    JSON.stringify({ total: results.length, deadCount: deads.length, deads, all: results }, null, 2),
    'utf-8'
  );
}

main();
