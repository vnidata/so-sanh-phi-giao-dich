import { describe, it, expect } from 'vitest';
import { SECURITIES_COMPANIES } from '../src/data/securitiesData.js';
import { 
  extractAllPromotions, 
  exportPromotionsToCsvString 
} from '../src/utils/promotionsExtractor.js';

describe('Promotions & Offers Extractor & CSV Exporter Tests', () => {
  it('extractAllPromotions trích xuất danh sách chương trình từ đầy đủ 30 CTCK', () => {
    const promos = extractAllPromotions(SECURITIES_COMPANIES);

    expect(Array.isArray(promos)).toBe(true);
    expect(promos.length).toBeGreaterThanOrEqual(30);

    // Xác nhận có sự tham gia của toàn bộ 30 CTCK
    const companyIds = new Set(promos.map(p => p.companyId));
    expect(companyIds.size).toBe(SECURITIES_COMPANIES.length);
  });

  it('Mỗi chương trình ưu đãi đều có đầy đủ 7 trường thông tin theo yêu cầu', () => {
    const promos = extractAllPromotions(SECURITIES_COMPANIES);

    promos.forEach((p, idx) => {
      // 1. Tên chương trình
      expect(p.programName, `Missing programName at index ${idx}`).toBeTruthy();
      expect(typeof p.programName).toBe('string');

      // 2. Nội dung tóm tắt
      expect(p.summary, `Missing summary at index ${idx}`).toBeTruthy();
      expect(typeof p.summary).toBe('string');
      expect(p.summary.length).toBeGreaterThan(25);

      // 3. Ưu đãi phí (nếu có)
      expect(p.feeOffer, `Missing feeOffer at index ${idx}`).toBeTruthy();
      expect(typeof p.feeOffer).toBe('string');

      // 4. Ưu đãi lãi (nếu có)
      expect(p.interestOffer, `Missing interestOffer at index ${idx}`).toBeTruthy();
      expect(typeof p.interestOffer).toBe('string');

      // 5. Thời gian chương trình
      expect(p.duration, `Missing duration at index ${idx}`).toBeTruthy();
      expect(typeof p.duration).toBe('string');

      // 6. Lưu ý
      expect(p.notes, `Missing notes at index ${idx}`).toBeTruthy();
      expect(typeof p.notes).toBe('string');

      // 7. Đường dẫn nguồn bài viết
      expect(p.sourceUrl, `Missing sourceUrl at index ${idx}`).toBeTruthy();
      expect(p.sourceUrl.startsWith('http://') || p.sourceUrl.startsWith('https://')).toBe(true);
    });
  });

  it('100% URL là duy nhất - Tuyệt đối không trùng lặp link giữa các chương trình ưu đãi', () => {
    const promos = extractAllPromotions(SECURITIES_COMPANIES);
    const urls = promos.map(p => p.sourceUrl);
    const uniqueUrls = new Set(urls);

    // Kiểm tra không có 2 chương trình nào dùng chung 1 URL
    expect(uniqueUrls.size).toBe(urls.length);
  });

  it('100% nội dung tóm tắt thật - Tuyệt đối không chứa câu chữ văn mẫu AI sáo rỗng', () => {
    const promos = extractAllPromotions(SECURITIES_COMPANIES);

    promos.forEach((p, idx) => {
      // Không được chứa các câu template văn mẫu AI
      expect(p.summary).not.toContain('công bố chính thức trên website');
      expect(p.summary).not.toContain('Hưởng chính sách ưu đãi cạnh tranh trong năm 2026');
      expect(p.programName).not.toContain('& eKYC (');
      expect(p.notes).not.toContain('tuân thủ các quy định hiện hành của UBCKNN.');
    });
  });

  it('Phân loại ưu đãi gồm đầy đủ các nhóm: Phí, Lãi margin, Mở mới eKYC, Combo', () => {
    const promos = extractAllPromotions(SECURITIES_COMPANIES);

    const feePromos = promos.filter(p => p.category === 'fee' || p.category === 'combo');
    const marginPromos = promos.filter(p => p.category === 'margin' || p.category === 'combo');
    const welcomePromos = promos.filter(p => p.category === 'welcome');

    expect(feePromos.length).toBeGreaterThan(15);
    expect(marginPromos.length).toBeGreaterThan(25);
    expect(welcomePromos.length).toBeGreaterThan(10);
  });

  it('exportPromotionsToCsvString tạo chuỗi CSV chuẩn hóa có BOM UTF-8', () => {
    const promos = extractAllPromotions(SECURITIES_COMPANIES);
    const csvString = exportPromotionsToCsvString(promos);

    // Ký tự đầu tiên phải là BOM UTF-8 (\uFEFF) để Excel hiển thị tiếng Việt không bị lỗi font
    expect(csvString.charCodeAt(0)).toBe(0xFEFF);

    // Kiểm tra dòng tiêu đề chứa đầy đủ các cột nghiệp vụ
    expect(csvString).toContain('"STT"');
    expect(csvString).toContain('"Mã CTCK"');
    expect(csvString).toContain('"Công Ty Chứng Khoán"');
    expect(csvString).toContain('"Mã CP"');
    expect(csvString).toContain('"Tên Chương Trình"');
    expect(csvString).toContain('"Nội Dung Tóm Tắt"');
    expect(csvString).toContain('"Ưu Đãi Phí"');
    expect(csvString).toContain('"Ưu Đãi Lãi Suất"');
    expect(csvString).toContain('"Thời Gian Áp Dụng"');
    expect(csvString).toContain('"Lưu Ý Quan Trọng"');
    expect(csvString).toContain('"Đường Dẫn Bài Viết Nguồn"');

    // Số dòng dữ liệu phải tương ứng với số lượng ưu đãi + 1 dòng tiêu đề
    const lines = csvString.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
    expect(lines.length).toBe(promos.length + 1);
  });

  it('Xử lý an toàn với dữ liệu trống hoặc không hợp lệ', () => {
    expect(extractAllPromotions(null)).toEqual([]);
    expect(extractAllPromotions([])).toEqual([]);
    expect(extractAllPromotions('invalid')).toEqual([]);
    expect(extractAllPromotions().length).toBeGreaterThan(0);

    const emptyCsv = exportPromotionsToCsvString([]);
    expect(emptyCsv.charCodeAt(0)).toBe(0xFEFF);
    expect(emptyCsv).toContain('"STT"');
  });
});
