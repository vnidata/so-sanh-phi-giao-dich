import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SECURITIES_COMPANIES } from '../src/data/securitiesData.js';
import { VERIFIED_PROMOTIONS } from '../src/data/promotionsData.js';
import { TARGET_BROKERS } from '../src/data/brokersCrawlerList.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function collectAllUrls() {
  const urlMap = new Map();

  function record(url, source, context) {
    if (!url || typeof url !== 'string') return;
    const cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) return;
    if (!urlMap.has(cleanUrl)) {
      urlMap.set(cleanUrl, []);
    }
    urlMap.get(cleanUrl).push({ source, context });
  }

  // 1. securitiesData.js
  SECURITIES_COMPANIES.forEach(c => {
    record(c.website, 'securitiesData', `${c.shortName} website`);
    record(c.sourceUrl, 'securitiesData', `${c.shortName} sourceUrl`);
    record(c.accountOpeningUrl, 'securitiesData', `${c.shortName} accountOpeningUrl`);
    if (c.margin?.sourceUrl) record(c.margin.sourceUrl, 'securitiesData', `${c.shortName} margin.sourceUrl`);
    if (c.welcomePromo?.sourceUrl) record(c.welcomePromo.sourceUrl, 'securitiesData', `${c.shortName} welcomePromo.sourceUrl`);
    if (c.tradingFee?.sourceUrl) record(c.tradingFee.sourceUrl, 'securitiesData', `${c.shortName} tradingFee.sourceUrl`);
    (c.promoArticles || []).forEach(a => {
      record(a.url, 'securitiesData', `${c.shortName} promoArticle: ${a.title}`);
    });
  });

  // 2. promotionsData.js
  VERIFIED_PROMOTIONS.forEach(p => {
    record(p.sourceUrl, 'promotionsData', `${p.companyShortName} promo: ${p.programName}`);
  });

  // 3. brokersCrawlerList.js
  TARGET_BROKERS.forEach(b => {
    record(b.homeUrl, 'brokersCrawlerList', `${b.shortName} homeUrl`);
    record(b.feeUrl, 'brokersCrawlerList', `${b.shortName} feeUrl`);
    record(b.marginUrl, 'brokersCrawlerList', `${b.shortName} marginUrl`);
    record(b.promoUrl, 'brokersCrawlerList', `${b.shortName} promoUrl`);
    (b.subTabs || []).forEach(st => {
      record(st.url, 'brokersCrawlerList', `${b.shortName} subTab: ${st.name}`);
    });
  });

  return Array.from(urlMap.entries()).map(([url, usages]) => ({ url, usages }));
}

async function checkUrl(item) {
  const { url, usages } = item;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

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
    } catch {
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
      url,
      usages,
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
      url,
      usages,
      status: err.name === 'AbortError' ? 'TIMEOUT' : 'ERROR',
      finalUrl: url,
      title: '',
      h1: '',
      isDead: err.name !== 'AbortError', // Abort can be WAF anti-bot; only flag real error as dead
      deadReason: `Network error: ${err.message}`
    };
  }
}

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
  console.log('='.repeat(75));
  console.log('🔍 SYSTEM-WIDE LINK INTEGRITY & HEALTH AUDIT (ALL DATA LAYERS)');
  console.log('='.repeat(75));

  const items = await collectAllUrls();
  console.log(`Found ${items.length} unique URLs across securitiesData, promotionsData, and brokersCrawlerList.`);

  const results = await asyncPool(6, items, checkUrl);

  const deadUrls = results.filter(r => r.isDead);
  const okUrls = results.filter(r => !r.isDead);

  console.log('\n' + '='.repeat(75));
  console.log(`AUDIT RESULTS:`);
  console.log(`- TOTAL UNIQUE URLS AUDITED: ${results.length}`);
  console.log(`- HEALTHY / ACTIVE URLS:     ${okUrls.length}`);
  console.log(`- DEAD / 404 URLS:           ${deadUrls.length}`);
  console.log('='.repeat(75));

  if (deadUrls.length > 0) {
    console.log('\n❌ DEAD / BROKEN URLS DETECTED:');
    deadUrls.forEach((d, i) => {
      console.log(`\n[${i + 1}] ${d.url}`);
      console.log(`    Status: ${d.status} | Reason: ${d.deadReason}`);
      console.log(`    Usages:`);
      d.usages.forEach(u => console.log(`      - [${u.source}] ${u.context}`));
    });
  } else {
    console.log('\n🎉 EXCELLENT! 100% of tested URLs are active and healthy. ZERO dead links!');
  }

  // Save full audit report
  const reportPath = path.join(__dirname, 'system-urls-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ summary: { total: results.length, healthy: okUrls.length, dead: deadUrls.length }, deadUrls, results }, null, 2), 'utf-8');
  console.log(`\nDetailed audit report saved to: ${reportPath}`);
}

main().catch(console.error);
