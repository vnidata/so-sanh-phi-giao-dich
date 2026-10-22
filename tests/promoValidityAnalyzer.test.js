import { describe, it, expect } from 'vitest';
import { 
  extractPublishedDate, 
  isWithinOneYear, 
  extractExpiryDate, 
  evaluatePromoValidity, 
  filterActiveAndRecentPromos,
  DEFAULT_REFERENCE_DATE 
} from '../src/utils/promoValidityAnalyzer.js';

describe('Promo Validity & 1-Year Date Filter Suite', () => {
  it('should extract published dates accurately from text and url', () => {
    // 1. From URL
    const d1 = extractPublishedDate('', 'https://bsc.com.vn/tin-tuc/2026/03/15/uu-dai-margin.html');
    expect(d1).not.toBeNull();
    expect(d1.getUTCFullYear()).toBe(2026);
    expect(d1.getUTCMonth()).toBe(2); // 0-indexed March
    expect(d1.getUTCDate()).toBe(15);

    // 2. From Vietnamese text format "ngày 10 tháng 01 năm 2026"
    const text2 = 'Chương trình công bố chính thức ngày 10 tháng 01 năm 2026 tại Hà Nội.';
    const d2 = extractPublishedDate(text2);
    expect(d2).not.toBeNull();
    expect(d2.getUTCFullYear()).toBe(2026);
    expect(d2.getUTCMonth()).toBe(0);
    expect(d2.getUTCDate()).toBe(10);

    // 3. From text dd/mm/yyyy
    const text3 = 'Cập nhật: 25/12/2025 - Áp dụng chính sách ưu đãi mở mới.';
    const d3 = extractPublishedDate(text3);
    expect(d3).not.toBeNull();
    expect(d3.getUTCFullYear()).toBe(2025);
    expect(d3.getUTCMonth()).toBe(11);
    expect(d3.getUTCDate()).toBe(25);
  });

  it('should verify if a published date is within 1 year of reference date', () => {
    const ref = new Date('2026-10-22T00:00:00.000Z');

    // 6 months ago (April 2026) -> Within 1 year
    const recent = new Date('2026-04-15T00:00:00.000Z');
    expect(isWithinOneYear(recent, ref)).toBe(true);

    // 11 months ago (November 2025) -> Within 1 year
    const late2025 = new Date('2025-11-01T00:00:00.000Z');
    expect(isWithinOneYear(late2025, ref)).toBe(true);

    // 2 years ago (October 2024) -> OUT OF 1 YEAR
    const oldDate = new Date('2024-10-01T00:00:00.000Z');
    expect(isWithinOneYear(oldDate, ref)).toBe(false);

    // 3 years ago (2023) -> OUT OF 1 YEAR
    const veryOldDate = new Date('2023-05-10T00:00:00.000Z');
    expect(isWithinOneYear(veryOldDate, ref)).toBe(false);
  });

  it('should detect expiry date in Vietnamese text', () => {
    const text1 = 'Chương trình áp dụng đến hết ngày 31/12/2026 trên toàn hệ thống.';
    const exp1 = extractExpiryDate(text1);
    expect(exp1).not.toBeNull();
    expect(exp1.getUTCFullYear()).toBe(2026);
    expect(exp1.getUTCMonth()).toBe(11);
    expect(exp1.getUTCDate()).toBe(31);

    const text2 = 'Thời hạn đến ngày 30 tháng 06 năm 2026.';
    const exp2 = extractExpiryDate(text2);
    expect(exp2).not.toBeNull();
    expect(exp2.getUTCFullYear()).toBe(2026);
    expect(exp2.getUTCMonth()).toBe(5);
    expect(exp2.getUTCDate()).toBe(30);
  });

  it('should correctly evaluate promo validity status', () => {
    const ref = new Date('2026-10-22T00:00:00.000Z');

    // Case 1: Active promo with future expiry
    const eval1 = evaluatePromoValidity(
      'Gói Margin T+ ưu đãi lãi suất 7.5%. Áp dụng đến hết ngày 31/12/2026.',
      { publishedDate: new Date('2026-02-01'), referenceDate: ref }
    );
    expect(eval1.isActive).toBe(true);
    expect(eval1.status).toBe('active');

    // Case 2: Expired promo with past expiry (published within 1 year: Jan 2026, expired March 2026)
    const eval2 = evaluatePromoValidity(
      'Ưu đãi mở mới tài khoản Quý 1/2026. Áp dụng đến hết ngày 31/03/2026.',
      { publishedDate: new Date('2026-01-05'), referenceDate: ref }
    );
    expect(eval2.isActive).toBe(false);
    expect(eval2.status).toBe('expired_date');

    // Case 3: Promo with explicit "đã kết thúc" text
    const eval3 = evaluatePromoValidity(
      'Chương trình hoàn phí giao dịch đã kết thúc do hết ngân sách.',
      { publishedDate: new Date('2026-05-01'), referenceDate: ref }
    );
    expect(eval3.isActive).toBe(false);
    expect(eval3.status).toBe('expired_explicit');

    // Case 4: Promo older than 1 year (published in 2024)
    const eval4 = evaluatePromoValidity(
      'Chương trình khuyến mại giao dịch chứng khoán mùa thu.',
      { publishedDate: new Date('2024-09-15'), referenceDate: ref }
    );
    expect(eval4.isActive).toBe(false);
    expect(eval4.status).toBe('expired_outdated');
  });

  it('should filter out outdated and expired promos from array', () => {
    const ref = new Date('2026-10-22T00:00:00.000Z');
    const articles = [
      {
        title: 'Ưu đãi Lãi suất Margin 7.5% - Đang áp dụng đến khi có thông báo mới',
        publishedDate: '2026-03-01',
        url: 'https://example.com/margin'
      },
      {
        title: 'Chương trình giảm 50% phí giao dịch đã kết thúc',
        publishedDate: '2026-01-01',
        url: 'https://example.com/fee-old'
      },
      {
        title: 'Ưu đãi sinh nhật năm 2024 (Áp dụng đến hết 31/10/2024)',
        publishedDate: '2024-09-01',
        url: 'https://example.com/birthday-2024'
      },
      {
        title: 'Miễn phí giao dịch trọn đời Zero-Fee cho tài khoản mở mới',
        publishedDate: '2025-12-15',
        url: 'https://example.com/zero-fee'
      }
    ];

    const activeList = filterActiveAndRecentPromos(articles, ref);
    expect(activeList).toHaveLength(2);
    expect(activeList[0].title).toContain('Lãi suất Margin 7.5%');
    expect(activeList[1].title).toContain('Zero-Fee');
  });
});
