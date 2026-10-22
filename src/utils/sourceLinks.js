/**
 * SOURCE LINKS REGISTRY & UTILITY
 * Quản trị và chuẩn hóa các liên kết nguồn bài viết gốc trên website 30 CTCK:
 * 1. Bài viết Biểu phí giao dịch & Lãi suất chuẩn
 * 2. Bài viết Chương trình Ưu đãi mở tài khoản eKYC & Khuyến mãi
 * 3. Bài viết Giới thiệu Sản phẩm Margin linh hoạt / Deal T+ / Gói vay ngắn ngày
 */

import { TARGET_BROKERS } from '../data/brokersCrawlerList.js';
import scanReportData from '../../scan-report.json';

// Bản đồ liên kết bài viết công bố chương trình Ưu đãi / Khuyến mãi mở tài khoản mới (eKYC)
export const PROMO_SOURCE_MAP = {
  'bsc': 'https://www.bsc.com.vn/khuyen-mai',
  'tcbs': 'https://help.tcbs.com.vn/',
  'vps': 'https://vps.com.vn/khuyen-mai/',
  'ssi': 'https://www.ssi.com.vn/khach-hang-ca-nhan/chuong-trinh-khuyen-mai',
  'vndirect': 'https://www.vndirect.com.vn/khuyen-mai/',
  'mirae-asset': 'https://masvn.com/tin-tuc/khuyen-mai',
  'dnse': 'https://www.dnse.com.vn/chinh-sach-mien-phi-giao-dich',
  'vpbanks': 'https://www.vpbanks.com.vn/uu-dai',
  'fpts': 'https://www.fpts.com.vn/ho-tro-khach-hang/bieu-phi-dich-vu/',
  'hsc': 'https://www.hsc.com.vn/bieu-phi',
  'vietcap': 'https://www.vietcap.com.vn/tin-tuc',
  'kafi': 'https://kafi.vn/san-pham-dich-vu',
  'mbs': 'https://mbs.com.vn/khuyen-mai/',
  'shs': 'https://www.shs.com.vn/Pages/BieuPhiDichVu.aspx',
  'vix': 'https://vixs.vn',
  'kis': 'https://kisvn.vn/bieu-phi-dich-vu/',
  'acbs': 'https://acbs.com.vn/tin-tuc',
  'vcbs': 'https://vcbs.com.vn/bieu-phi',
  'kbsv': 'https://www.kbsec.com.vn/vi/bieu-phi.html',
  'cts': 'https://cts.vn/bieu-phi',
  'bvsc': 'https://bvsc.com.vn/bieu-phi',
  'tps': 'https://tpbs.com.vn/bieu-phi',
  'yuanta': 'https://yuanta.com.vn/bieu-phi',
  'shinhan': 'https://shinhansec.com.vn/bieu-phi',
  'agriseco': 'https://agriseco.com.vn/bieu-phi',
  'hdbs': 'https://hdbs.vn',
  'dsc': 'https://dsc.com.vn/bieu-phi',
  'phs': 'https://phs.vn/bieu-phi',
  'tvsi': 'https://tvsi.com.vn',
  'evs': 'https://eves.com.vn/bieu-phi'
};

// Bản đồ liên kết bài viết giới thiệu Sản phẩm Margin linh hoạt / Deal T+ / Vay ký quỹ ngắn ngày
export const MARGIN_PRODUCT_SOURCE_MAP = {
  'bsc': 'https://www.bsc.com.vn/dich-vu-chung-khoan/dich-vu-tai-chinh/giao-dich-ky-quy',
  'tcbs': 'https://www.tcbs.com.vn/margin',
  'vps': 'https://vps.com.vn/dich-vu-tai-chinh/',
  'ssi': 'https://www.ssi.com.vn/khach-hang-ca-nhan/dich-vu-tai-chinh',
  'vndirect': 'https://www.vndirect.com.vn/san-pham-dich-vu/d-margin/',
  'mirae-asset': 'https://masvn.com/dich-vu-tai-chinh',
  'dnse': 'https://www.dnse.com.vn/margin-deal',
  'vpbanks': 'https://www.vpbanks.com.vn/dich-vu-tai-chinh',
  'fpts': 'https://www.fpts.com.vn/ho-tro-khach-hang/bieu-phi-dich-vu/',
  'hsc': 'https://www.hsc.com.vn/dich-vu-tai-chinh',
  'vietcap': 'https://www.vietcap.com.vn/dich-vu-tai-chinh',
  'kafi': 'https://kafi.vn/san-pham-dich-vu',
  'mbs': 'https://mbs.com.vn/dich-vu-tai-chinh/m-margin/',
  'shs': 'https://www.shs.com.vn/Pages/BieuPhiDichVu.aspx',
  'vix': 'https://vixs.vn/bieu-phi',
  'kis': 'https://kisvn.vn/bieu-phi-dich-vu/',
  'acbs': 'https://acbs.com.vn/bieu-phi',
  'vcbs': 'https://vcbs.com.vn/bieu-phi',
  'kbsv': 'https://www.kbsec.com.vn/vi/bieu-phi.html',
  'cts': 'https://cts.vn/bieu-phi',
  'bvsc': 'https://bvsc.com.vn/bieu-phi',
  'tps': 'https://tpbs.com.vn/bieu-phi',
  'yuanta': 'https://yuanta.com.vn/bieu-phi',
  'shinhan': 'https://shinhansec.com.vn/bieu-phi',
  'agriseco': 'https://agriseco.com.vn/bieu-phi',
  'hdbs': 'https://hdbs.vn',
  'dsc': 'https://dsc.com.vn/bieu-phi',
  'phs': 'https://phs.vn/bieu-phi',
  'tvsi': 'https://tvsi.com.vn/bieu-phi',
  'evs': 'https://eves.com.vn/bieu-phi'
};

/**
 * Trích xuất đầy đủ 4 liên kết nguồn chuẩn cho một công ty chứng khoán
 * @param {Object} company Đối tượng công ty chứng khoán
 * @returns {Object} { websiteUrl, feeSourceUrl, promoSourceUrl, marginSourceUrl }
 */
export function getBrokerSourceLinks(company) {
  if (!company) {
    return {
      websiteUrl: '#',
      feeSourceUrl: '#',
      promoSourceUrl: '#',
      marginSourceUrl: '#'
    };
  }

  const id = company.id;
  const scanInfo = (scanReportData?.brokers || []).find((b) => b.id === id);
  const brokerCrawlerItem = TARGET_BROKERS.find((b) => b.id === id);

  // 1. Link Website chính thức của công ty
  const websiteUrl = company.website || (company.sourceUrl ? (() => {
    try {
      return new URL(company.sourceUrl).origin;
    } catch (_) {
      return company.sourceUrl;
    }
  })() : '#');

  // 2. Link bài viết Biểu phí & Lãi suất gốc
  const feeSourceUrl =
    scanInfo?.officialSource ||
    brokerCrawlerItem?.officialSource ||
    company.sourceUrl ||
    scanInfo?.url ||
    brokerCrawlerItem?.url ||
    websiteUrl;

  // 3. Link bài viết Ưu đãi eKYC & Khuyến mãi gốc
  const promoSourceUrl =
    company.welcomePromo?.sourceUrl ||
    PROMO_SOURCE_MAP[id] ||
    feeSourceUrl;

  // 4. Link bài viết Sản phẩm Margin linh hoạt / Deal T+ gốc
  const marginSourceUrl =
    company.margin?.sourceUrl ||
    MARGIN_PRODUCT_SOURCE_MAP[id] ||
    feeSourceUrl;

  return {
    websiteUrl,
    feeSourceUrl,
    promoSourceUrl,
    marginSourceUrl,
    scannedUrl: scanInfo?.url || brokerCrawlerItem?.url || feeSourceUrl
  };
}
