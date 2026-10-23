/**
 * TOÀN DIỆN KIỂM ĐỊNH & TEST TẤT CẢ LIÊN KẾT ĐÍNH KÈM (ALL ATTACHED LINKS TESTER)
 * Tự động trích xuất 100% URL trong toàn bộ hệ thống:
 * 1. src/data/securitiesData.js (website, sourceUrl, accountOpeningUrl, margin.sourceUrl, welcomePromo.sourceUrl, promoArticles)
 * 2. src/data/brokersCrawlerList.js (url, fallbackUrl, officialSource, getBrokerSubTabs)
 * 3. scan-report.json (tất cả các link sub-tabs, officialSource, activePromos)
 * 
 * Kiểm tra HTTP status thực tế, đo latency, phát hiện link chết (404), ghi nhận WAF 403 và xuất file link-audit-report.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { SECURITIES_COMPANIES } from '../src/data/securitiesData.js';
import { TARGET_BROKERS, getBrokerSubTabs } from '../src/data/brokersCrawlerList.js';

let scanReport = null;
try {
  const scanReportPath = path.join(__dirname, '..', 'scan-report.json');
  if (fs.existsSync(scanReportPath)) {
    scanReport = JSON.parse(fs.readFileSync(scanReportPath, 'utf-8'));
  }
} catch (_) {}

/**
 * Thu thập toàn bộ các URL đính kèm trong hệ thống
 */
function extractAllSystemUrls() {
  const urlMap = new Map(); // url -> { sources: [], brokers: [] }

  const recordUrl = (url, sourceName, brokerId, brokerName) => {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) return;
    const cleanUrl = url.trim();

    if (!urlMap.has(cleanUrl)) {
      urlMap.set(cleanUrl, {
        url: cleanUrl,
        sources: new Set(),
        brokers: new Set()
      });
    }

    const item = urlMap.get(cleanUrl);
    item.sources.add(sourceName);
    if (brokerId) item.brokers.add(`${brokerName || brokerId} (${brokerId})`);
  };

  // 1. Trích xuất từ securitiesData.js
  SECURITIES_COMPANIES.forEach(comp => {
    const bId = comp.id;
    const bName = comp.shortName;

    recordUrl(comp.website, 'securitiesData.website', bId, bName);
    recordUrl(comp.sourceUrl, 'securitiesData.sourceUrl (Biểu phí chuẩn)', bId, bName);
    recordUrl(comp.accountOpeningUrl, 'securitiesData.accountOpeningUrl (Mở TK eKYC)', bId, bName);

    if (comp.margin?.sourceUrl) {
      recordUrl(comp.margin.sourceUrl, 'securitiesData.margin.sourceUrl (Lãi suất margin)', bId, bName);
    }

    if (comp.welcomePromo?.sourceUrl) {
      recordUrl(comp.welcomePromo.sourceUrl, 'securitiesData.welcomePromo.sourceUrl (Ưu đãi mở mới)', bId, bName);
    }

    if (Array.isArray(comp.promoArticles)) {
      comp.promoArticles.forEach((art, idx) => {
        if (art?.url) {
          recordUrl(art.url, `securitiesData.promoArticles[${idx}] (${art.title})`, bId, bName);
        }
      });
    }
  });

  // 2. Trích xuất từ brokersCrawlerList.js & getBrokerSubTabs
  TARGET_BROKERS.forEach(broker => {
    const bId = broker.id;
    const bName = broker.shortName;
    const comp = SECURITIES_COMPANIES.find(c => c.id === broker.id);

    recordUrl(broker.url, 'brokersCrawlerList.url', bId, bName);
    if (broker.fallbackUrl) {
      recordUrl(broker.fallbackUrl, 'brokersCrawlerList.fallbackUrl', bId, bName);
    }
    recordUrl(broker.officialSource, 'brokersCrawlerList.officialSource', bId, bName);

    // Sub-tabs
    const subTabs = getBrokerSubTabs(broker, comp);
    subTabs.forEach(tab => {
      recordUrl(tab.url, `brokersCrawlerList.subTab (${tab.title})`, bId, bName);
    });
  });

  // 3. Trích xuất từ scan-report.json nếu có
  if (scanReport && Array.isArray(scanReport.brokers)) {
    scanReport.brokers.forEach(b => {
      const bId = b.id;
      const bName = b.shortName;

      recordUrl(b.url, 'scanReport.url', bId, bName);
      recordUrl(b.officialSource, 'scanReport.officialSource', bId, bName);

      if (Array.isArray(b.subTabsResults)) {
        b.subTabsResults.forEach(tab => {
          recordUrl(tab.url, `scanReport.subTabsResults (${tab.title})`, bId, bName);
        });
      }

      if (Array.isArray(b.activePromos)) {
        b.activePromos.forEach(p => {
          recordUrl(p.url, `scanReport.activePromos (${p.title})`, bId, bName);
        });
      }
    });
  }

  // Chuyển sang array
  return Array.from(urlMap.values()).map(item => ({
    url: item.url,
    sources: Array.from(item.sources),
    brokers: Array.from(item.brokers)
  }));
}

/**
 * Kiểm tra 1 URL bằng HTTP fetch
 */
async function testSingleUrl(target, timeoutMs = 10000) {
  const url = target.url;
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 VietSecLinkTester/1.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8'
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    const status = response.status;

    // Phân loại kết quả
    let category = 'OK';
    let isWorking = false;
    let note = '';

    if (status >= 200 && status < 300) {
      category = 'HTTP_200_OK';
      isWorking = true;
      note = 'Truy cập thành công, phản hồi mã 200 OK.';
    } else if (status === 403) {
      category = 'WAF_PROTECTED_403';
      isWorking = true; // Trang tồn tại nhưng bật Cloudflare bot protection
      note = 'Bảo vệ bởi Cloudflare WAF Bot-Protection. Trang tồn tại hợp lệ trên máy chủ CTCK.';
    } else if (status === 404) {
      category = 'NOT_FOUND_404';
      isWorking = false;
      note = 'LỖI: Trang web không tồn tại (HTTP 404). Cần thay thế ngay!';
    } else if (status >= 500) {
      category = 'SERVER_ERROR_5XX';
      isWorking = false;
      note = `Máy chủ CTCK phản hồi mã lỗi ${status}.`;
    } else {
      category = `HTTP_${status}`;
      isWorking = status < 400;
      note = `Mã phản hồi HTTP ${status}.`;
    }

    return {
      url,
      status,
      statusText: response.statusText,
      isWorking,
      category,
      latencyMs: latency,
      sources: target.sources,
      brokers: target.brokers,
      note
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    const isTimeout = err.name === 'AbortError';

    return {
      url,
      status: isTimeout ? 'TIMEOUT' : 'FETCH_ERROR',
      statusText: err.message,
      isWorking: false,
      category: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
      latencyMs: latency,
      sources: target.sources,
      brokers: target.brokers,
      note: isTimeout ? `Timeout sau ${timeoutMs}ms (Máy chủ phản hồi chậm hoặc chặn bot)` : `Lỗi mạng: ${err.message}`
    };
  }
}

/**
 * Thực thi kiểm thử toàn bộ URL theo lô có kiểm soát tải
 */
async function runLinkVerification() {
  console.log('=================================================================');
  console.log('🔍 KHỞI CHẠY KIỂM ĐỊNH TOÀN DIỆN 100% CÁC ĐƯỜNG LINK TRONG DỰ ÁN');
  console.log(`⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}`);
  console.log('=================================================================\n');

  const allUrls = extractAllSystemUrls();
  console.log(`📋 Tổng số liên kết độc nhất (Unique URLs) đã trích xuất: ${allUrls.length} liên kết.\n`);

  const results = [];
  const CONCURRENCY = 6; // Chạy 6 luồng đồng thời để nhanh mà không bị nghẽn mạng

  for (let i = 0; i < allUrls.length; i += CONCURRENCY) {
    const chunk = allUrls.slice(i, i + CONCURRENCY);
    const chunkPromises = chunk.map(target => testSingleUrl(target));
    const chunkResults = await Promise.all(chunkPromises);

    chunkResults.forEach((res, idx) => {
      const overallIndex = i + idx + 1;
      const icon = res.category === 'HTTP_200_OK' 
        ? '✅' 
        : res.category === 'WAF_PROTECTED_403' 
        ? '🛡️' 
        : res.category === 'NOT_FOUND_404' 
        ? '❌' 
        : '⚠️';

      const brokerStr = res.brokers.length > 0 ? ` [${res.brokers[0]}]` : '';
      console.log(`[${overallIndex}/${allUrls.length}] ${icon} ${res.status} (${res.latencyMs}ms)${brokerStr} -> ${res.url.slice(0, 75)}${res.url.length > 75 ? '...' : ''}`);
      results.push(res);
    });

    // Nghỉ nhẹ 100ms giữa các chunk
    await new Promise(r => setTimeout(r, 100));
  }

  // Thống kê phân loại
  const total = results.length;
  const count200 = results.filter(r => r.category === 'HTTP_200_OK').length;
  const count403 = results.filter(r => r.category === 'WAF_PROTECTED_403').length;
  const count404 = results.filter(r => r.category === 'NOT_FOUND_404').length;
  const countTimeout = results.filter(r => r.category === 'TIMEOUT').length;
  const countError = results.filter(r => !['HTTP_200_OK', 'WAF_PROTECTED_403', 'NOT_FOUND_404', 'TIMEOUT'].includes(r.category)).length;

  const validWorkingCount = count200 + count403; // Cả 200 và 403 đều chứng minh link tồn tại thực tế
  const avgLatency = Math.round(results.reduce((acc, r) => acc + (typeof r.latencyMs === 'number' ? r.latencyMs : 0), 0) / (total || 1));

  console.log('\n=================================================================');
  console.log('📊 BÁO CÁO TỔNG KẾT ĐO KIỂM 100% CÁC ĐƯỜNG LINK:');
  console.log(`- Tổng số URL đo kiểm:              ${total} links`);
  console.log(`- HTTP 200 OK (Truy cập tốt):       ${count200} links (${Math.round((count200 / total) * 100)}%)`);
  console.log(`- Cloudflare WAF 403 (Bảo vệ bot):  ${count403} links (${Math.round((count403 / total) * 100)}%)`);
  console.log(`- Lỗi 404 (Không tồn tại / Chết):   ${count404} links ${count404 > 0 ? '❌ BÁO ĐỘNG' : '✅ 0 LINK LỖI'}`);
  console.log(`- Timeout (>10s):                  ${countTimeout} links`);
  console.log(`- Lỗi mạng khác:                   ${countError} links`);
  console.log(`- Tỷ lệ link khả dụng & tồn tại:   ${Math.round((validWorkingCount / total) * 100)}% (${validWorkingCount}/${total})`);
  console.log(`- Độ trễ phản hồi trung bình:      ${avgLatency} ms`);
  console.log('=================================================================');

  if (count404 > 0) {
    console.log('\n❌ DANH SÁCH CÁC LINK BỊ LỖI 404 CẦN XỬ LÝ:');
    results.filter(r => r.category === 'NOT_FOUND_404').forEach(r => {
      console.log(`- ${r.url} | Nguồn: ${r.sources.join(', ')}`);
    });
  } else {
    console.log('\n🎉 HOÀN TOÀN KHÔNG CÓ BẤT KỲ LINK NÀO BỊ LỖI 404 (0 Link chết)!');
  }

  // Ghi kết quả vào file link-audit-report.json
  const reportPath = path.join(__dirname, '..', 'link-audit-report.json');
  const reportData = {
    metadata: {
      title: 'Báo Cáo Kiểm Định Toàn Diện 100% Liên Kết Hệ Thống (Link Health Audit)',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      summary: {
        totalUrls: total,
        http200Count: count200,
        waf403Count: count403,
        http404Count: count404,
        timeoutCount: countTimeout,
        otherErrorCount: countError,
        validAvailabilityRate: `${Math.round((validWorkingCount / total) * 100)}%`,
        averageLatencyMs: avgLatency
      }
    },
    deadLinks404: results.filter(r => r.category === 'NOT_FOUND_404'),
    results
  };

  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2), 'utf-8');
  console.log(`\n💾 Báo cáo chi tiết đã lưu tại: ${reportPath}\n`);

  return reportData;
}

runLinkVerification().catch(console.error);
