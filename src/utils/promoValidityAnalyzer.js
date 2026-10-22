/**
 * PROMO VALIDITY & DATE ANALYZER
 * Module chuyên trách phân tích ngày phát hành bài viết và thẩm định tính hiệu lực của chương trình ưu đãi phí / lãi suất
 * 
 * QUY TẮC NGHIỆP VỤ BẮT BUỘC:
 * 1. Giới hạn thời gian bài viết trong vòng 1 năm gần nhất (365 ngày tính từ thời điểm đối soát).
 * 2. Tự động phát hiện và loại bỏ các chương trình đã hết hạn áp dụng, dừng triển khai hoặc hết ngân sách.
 * 3. Chỉ phê duyệt (Active) các chương trình còn hiệu lực, đang áp dụng hoặc có hiệu lực đến tương lai / vô thời hạn.
 */

// Mốc tham chiếu mặc định (Hệ thống VietSec Analyzer - Tháng 10/2026)
export const DEFAULT_REFERENCE_DATE = new Date('2026-10-22T00:00:00.000Z');
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Trích xuất ngày phát hành bài viết từ nội dung text hoặc URL
 * @param {string} text Nội dung HTML hoặc text bài viết
 * @param {string} url Đường dẫn bài viết
 * @returns {Date|null} Đối tượng Date hoặc null nếu không xác định được
 */
export function extractPublishedDate(text = '', url = '') {
  if (!text && !url) return null;

  // 1. Tìm kiếm trong URL dạng /2025/11/05/ hoặc /20260315/ hoặc /2025-12-01/
  if (url) {
    const urlPattern1 = /\/(202[4-6])[\/-](\d{1,2})[\/-](\d{1,2})\//;
    const m1 = url.match(urlPattern1);
    if (m1) {
      const year = parseInt(m1[1], 10);
      const month = parseInt(m1[2], 10) - 1;
      const day = parseInt(m1[3], 10);
      const date = new Date(Date.UTC(year, month, day));
      if (!isNaN(date.getTime())) return date;
    }

    const urlPattern2 = /\/(202[4-6])(\d{2})(\d{2})\//;
    const m2 = url.match(urlPattern2);
    if (m2) {
      const year = parseInt(m2[1], 10);
      const month = parseInt(m2[2], 10) - 1;
      const day = parseInt(m2[3], 10);
      const date = new Date(Date.UTC(year, month, day));
      if (!isNaN(date.getTime())) return date;
    }
  }

  if (!text) return null;

  // 2. Tìm meta tags trong HTML: article:published_time, datePublished, pubdate
  const metaRegex = /(?:property|name|itemprop)=["'](?:article:published_time|datePublished|pubdate|publishedDate)["']\s+content=["']([^"']+)["']/i;
  const metaMatch = text.match(metaRegex);
  if (metaMatch && metaMatch[1]) {
    const metaDate = new Date(metaMatch[1]);
    if (!isNaN(metaDate.getTime())) return metaDate;
  }

  // 3. Regex tiếng Việt dạng: "ngày 15 tháng 03 năm 2026" hoặc "15/03/2026"
  const vnTextRegex1 = /(?:ngày|đăng ngày|cập nhật|thời gian|áp dụng từ|hiệu lực từ)[:\s]*(\d{1,2})\s+tháng\s+(\d{1,2})\s+năm\s+(202[4-6])/i;
  const vm1 = text.match(vnTextRegex1);
  if (vm1) {
    const day = parseInt(vm1[1], 10);
    const month = parseInt(vm1[2], 10) - 1;
    const year = parseInt(vm1[3], 10);
    const date = new Date(Date.UTC(year, month, day));
    if (!isNaN(date.getTime())) return date;
  }

  // 4. Regex dạng: "15/03/2026" hoặc "15-03-2026" sau các từ khóa chỉ thời gian
  const vnTextRegex2 = /(?:ngày|đăng ngày|cập nhật|thời gian|áp dụng từ|hiệu lực từ)[:\s]*(\d{1,2})[/\.-](\d{1,2})[/\.-](202[4-6])/i;
  const vm2 = text.match(vnTextRegex2);
  if (vm2) {
    const day = parseInt(vm2[1], 10);
    const month = parseInt(vm2[2], 10) - 1;
    const year = parseInt(vm2[3], 10);
    const date = new Date(Date.UTC(year, month, day));
    if (!isNaN(date.getTime())) return date;
  }

  // 5. Tìm ngày tổng quát đầu tiên xuất hiện dạng dd/mm/yyyy trong đoạn mở đầu bài viết (500 ký tự đầu)
  const introText = text.slice(0, 1500);
  const generalDateRegex = /\b(\d{1,2})[/\.-](\d{1,2})[/\.-](202[4-6])\b/;
  const gm = introText.match(generalDateRegex);
  if (gm) {
    const day = parseInt(gm[1], 10);
    const month = parseInt(gm[2], 10) - 1;
    const year = parseInt(gm[3], 10);
    const date = new Date(Date.UTC(year, month, day));
    if (!isNaN(date.getTime())) return date;
  }

  return null;
}

/**
 * Kiểm tra xem ngày phát hành có nằm trong giới hạn 1 năm gần nhất không
 * @param {Date|string|null} publishedDate Ngày phát hành bài viết
 * @param {Date} referenceDate Mốc thời gian đối soát (mặc định tháng 10/2026)
 * @returns {boolean} true nếu trong vòng 1 năm
 */
export function isWithinOneYear(publishedDate, referenceDate = DEFAULT_REFERENCE_DATE) {
  if (!publishedDate) return true; // Nếu bài viết thuộc trang biểu phí tĩnh chính thức không ghi ngày, mặc định coi là tài liệu hiện hành
  const pubTime = publishedDate instanceof Date ? publishedDate.getTime() : new Date(publishedDate).getTime();
  if (isNaN(pubTime)) return true;

  const refTime = referenceDate.getTime();
  const diffMs = refTime - pubTime;

  // Nếu bài viết nằm trong tương lai (vừa công bố cho chu kỳ tới) hoặc trong vòng 365 ngày qua
  return diffMs <= ONE_YEAR_MS && diffMs >= -30 * 24 * 60 * 60 * 1000;
}

/**
 * Trích xuất ngày hết hạn hiệu lực nếu có trong văn bản
 * @param {string} text Nội dung bài viết
 * @returns {Date|null}
 */
export function extractExpiryDate(text = '') {
  if (!text) return null;

  // Regex dạng: "áp dụng đến hết ngày 31/12/2025" hoặc "hạn chót ngày 30-06-2026"
  const expiryRegex = /(?:áp dụng đến hết|kết thúc vào|thời hạn đến|hết hiệu lực từ|đến hết ngày)[:\s]*(\d{1,2})[/\.-](\d{1,2})[/\.-](202[4-6])/i;
  const m = text.match(expiryRegex);
  if (m) {
    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10) - 1;
    const year = parseInt(m[3], 10);
    const date = new Date(Date.UTC(year, month, day, 23, 59, 59));
    if (!isNaN(date.getTime())) return date;
  }

  const expiryVnRegex = /(?:áp dụng đến hết|kết thúc vào|thời hạn đến|đến hết ngày)[:\s]*ngày\s+(\d{1,2})\s+tháng\s+(\d{1,2})\s+năm\s+(202[4-6])/i;
  const vm = text.match(expiryVnRegex);
  if (vm) {
    const day = parseInt(vm[1], 10);
    const month = parseInt(vm[2], 10) - 1;
    const year = parseInt(vm[3], 10);
    const date = new Date(Date.UTC(year, month, day, 23, 59, 59));
    if (!isNaN(date.getTime())) return date;
  }

  return null;
}

/**
 * Thẩm định tính hiệu lực của chương trình ưu đãi
 * @param {string} text Nội dung bài viết hoặc mô tả ưu đãi
 * @param {Object} options Tùy chọn gồm url, publishedDate, referenceDate
 * @returns {Object} Kết quả đánh giá hiệu lực chi tiết
 */
export function evaluatePromoValidity(text = '', options = {}) {
  const referenceDate = options.referenceDate || DEFAULT_REFERENCE_DATE;
  const textLower = (text || '').toLowerCase();

  // 1. Trích xuất ngày phát hành và ngày hết hạn
  const publishedDate = options.publishedDate || extractPublishedDate(text, options.url);
  const expiryDate = options.expiryDate || extractExpiryDate(text);
  const withinOneYear = isWithinOneYear(publishedDate, referenceDate);

  // 2. Kiểm tra tín hiệu từ khóa hết hạn rõ ràng
  const expiredKeywords = [
    'đã kết thúc',
    'hết hạn áp dụng',
    'hết thời gian áp dụng',
    'chương trình đã tạm dừng',
    'dừng triển khai',
    'đã hết ngân sách',
    'hết hạn tham gia',
    'kết thúc chương trình',
    'chương trình cũ'
  ];

  const matchedExpiredKeyword = expiredKeywords.find(kw => textLower.includes(kw));

  // 3. Kiểm tra ngày hết hạn so với mốc đối soát
  let isPastExpiry = false;
  if (expiryDate && !isNaN(expiryDate.getTime())) {
    isPastExpiry = expiryDate.getTime() < referenceDate.getTime();
  }

  // 4. Kiểm tra tín hiệu còn hiệu lực (Active Signals)
  const activeKeywords = [
    'đang áp dụng',
    'hiệu lực từ',
    'áp dụng đến khi có thông báo mới',
    'cho đến khi có thông báo thay thế',
    'áp dụng trong năm 2026',
    'áp dụng đến hết 31/12/2026',
    'áp dụng trọn đời',
    'chính sách hiện hành',
    'vô thời hạn'
  ];

  const hasActiveSignal = activeKeywords.some(kw => textLower.includes(kw));

  // 5. Kết luận trạng thái
  let status = 'active';
  let reason = 'Ưu đãi còn hiệu lực và nằm trong khung thời gian 1 năm gần nhất.';
  let isActive = true;

  if (!withinOneYear) {
    status = 'expired_outdated';
    isActive = false;
    reason = `Bài viết công bố trước 1 năm gần nhất (${publishedDate ? publishedDate.toISOString().split('T')[0] : 'Cũ'}). Đã tự động loại bỏ.`;
  } else if (matchedExpiredKeyword) {
    status = 'expired_explicit';
    isActive = false;
    reason = `Phát hiện tín hiệu hết hạn: "${matchedExpiredKeyword}".`;
  } else if (isPastExpiry) {
    status = 'expired_date';
    isActive = false;
    reason = `Chương trình đã kết thúc vào ngày ${expiryDate.toLocaleDateString('vi-VN')}.`;
  } else if (hasActiveSignal) {
    status = 'active_confirmed';
    isActive = true;
    reason = 'Xác nhận tín hiệu ưu đãi đang áp dụng / đến khi có thông báo mới.';
  }

  return {
    isActive,
    status,
    reason,
    isWithinOneYear: withinOneYear,
    publishedDate: publishedDate ? publishedDate.toISOString().split('T')[0] : null,
    expiryDate: expiryDate ? expiryDate.toISOString().split('T')[0] : null,
    formattedPublishedDate: publishedDate ? publishedDate.toLocaleDateString('vi-VN') : 'Hiện hành',
    formattedExpiryDate: expiryDate ? expiryDate.toLocaleDateString('vi-VN') : 'Đến khi có thông báo mới'
  };
}

/**
 * Lọc danh sách bài viết ưu đãi, chỉ giữ lại các bài viết còn hiệu lực trong 1 năm gần nhất
 * @param {Array} articles Danh sách bài viết
 * @param {Date} referenceDate Mốc thời gian đối soát
 * @returns {Array} Danh sách bài viết hợp lệ
 */
export function filterActiveAndRecentPromos(articles = [], referenceDate = DEFAULT_REFERENCE_DATE) {
  if (!Array.isArray(articles)) return [];

  return articles
    .map(art => {
      const validity = evaluatePromoValidity(art.title + ' ' + (art.content || art.description || ''), {
        url: art.url,
        publishedDate: art.publishedDate ? new Date(art.publishedDate) : null,
        expiryDate: art.expiryDate ? new Date(art.expiryDate) : null,
        referenceDate
      });

      return {
        ...art,
        isActive: validity.isActive,
        isWithinOneYear: validity.isWithinOneYear,
        status: validity.status,
        validityReason: validity.reason,
        publishedDate: validity.publishedDate,
        expiryDate: validity.expiryDate,
        formattedPublishedDate: validity.formattedPublishedDate,
        formattedExpiryDate: validity.formattedExpiryDate
      };
    })
    .filter(art => art.isActive && art.isWithinOneYear);
}
