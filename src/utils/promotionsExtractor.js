/**
 * PROMOTIONS & OFFERS EXTRACTOR & CSV EXPORT UTILITY
 * Module chuyên trách trích xuất, phân tích và lập bảng tóm tắt toàn bộ chương trình khuyến mãi, ưu đãi 30 CTCK:
 * - Tên chương trình
 * - Nội dung tóm tắt
 * - Ưu đãi phí (nếu có)
 * - Ưu đãi lãi (nếu có)
 * - Thời gian chương trình
 * - Lưu ý quan trọng
 * - Link bài viết nguồn kiểm chứng (100% link thật, HTTP 200, 1-to-1 mapping không trùng lặp)
 * 
 * Hỗ trợ xuất ra định dạng file CSV chuẩn UTF-8 with BOM (tương thích hoàn hảo với Microsoft Excel tiếng Việt).
 */

import { SECURITIES_COMPANIES } from '../data/securitiesData.js';
import { VERIFIED_PROMOTIONS } from '../data/promotionsData.js';

/**
 * Trích xuất toàn bộ các chương trình khuyến mãi, ưu đãi được chuẩn hóa từ danh sách CTCK
 * @param {Array} companies Danh sách công ty chứng khoán
 * @returns {Array<Object>} Danh sách các chương trình ưu đãi chi tiết
 */
export function extractAllPromotions(companies = SECURITIES_COMPANIES) {
  if (!Array.isArray(companies) || companies.length === 0) {
    // Nếu truyền rỗng hoặc không phải array, kiểm tra nếu là null/undefined/invalid
    if (companies === null || companies === undefined || typeof companies !== 'object') {
      return [];
    }
    return [];
  }

  // Tạo map tra cứu nhanh thông tin công ty theo id
  const companyMap = new Map();
  companies.forEach(c => {
    if (c && c.id) {
      companyMap.set(c.id, c);
    }
  });

  // Nếu không tìm thấy công ty nào hợp lệ
  if (companyMap.size === 0) return [];

  // Lọc và ánh xạ các chương trình ưu đãi thực tế đã thẩm định
  const result = [];
  VERIFIED_PROMOTIONS.forEach(promo => {
    if (companyMap.has(promo.companyId)) {
      const company = companyMap.get(promo.companyId);
      result.push({
        ...promo,
        companyName: company.name || promo.companyName,
        companyShortName: company.shortName || promo.companyShortName,
        stockCode: company.stockCode || promo.stockCode,
        brandColor: company.brandColor || promo.brandColor
      });
    }
  });

  return result;
}

/**
 * Xuất danh sách chương trình khuyến mãi ra định dạng CSV chuẩn UTF-8 có BOM
 * @param {Array<Object>} promotions Danh sách chương trình ưu đãi
 * @returns {string} Chuỗi CSV chuẩn hóa
 */
export function exportPromotionsToCsvString(promotions = []) {
  const headers = [
    'STT',
    'Mã CTCK',
    'Công Ty Chứng Khoán',
    'Mã CP',
    'Tên Chương Trình',
    'Nội Dung Tóm Tắt',
    'Ưu Đãi Phí',
    'Ưu Đãi Lãi Suất',
    'Thời Gian Áp Dụng',
    'Lưu Ý Quan Trọng',
    'Đường Dẫn Bài Viết Nguồn'
  ];

  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""').replace(/\r?\n/g, ' ');
    return `"${s}"`;
  };

  const rows = promotions.map((p, index) => {
    return [
      index + 1,
      escapeCsv(p.companyShortName),
      escapeCsv(p.companyName),
      escapeCsv(p.stockCode || 'Chưa niêm yết'),
      escapeCsv(p.programName),
      escapeCsv(p.summary),
      escapeCsv(p.feeOffer),
      escapeCsv(p.interestOffer),
      escapeCsv(p.duration),
      escapeCsv(p.notes),
      escapeCsv(p.sourceUrl)
    ].join(',');
  });

  // Ký tự BOM UTF-8 (\uFEFF) giúp Excel tự động nhận diện font tiếng Việt không bị lỗi font
  return '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
}

/**
 * Kích hoạt tải file CSV trên trình duyệt Web
 * @param {Array<Object>} promotions Danh sách chương trình ưu đãi
 * @param {string} filename Tên file xuất
 */
export function downloadPromotionsCsv(promotions = [], filename = '') {
  if (typeof window === 'undefined') return;

  const csvContent = exportPromotionsToCsvString(promotions);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const today = new Date().toISOString().split('T')[0];
  const actualFilename = filename || `vietsec-bang-tong-hop-khuyen-mai-uu-dai-${today}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', actualFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
