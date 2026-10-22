/**
 * BỘ TỪ ĐIỂN TỪ KHÓA CHỨNG KHOÁN & TÀI CHÍNH BÁN LẺ
 * Phân tích và phát hiện tự động các từ khóa cốt lõi:
 * phí giao dịch, zero-fee, lãi suất, lãi vay, ký quỹ (margin), hạn mức, dư nợ...
 */

export const KEYWORD_DICTIONARY = [
  { 
    key: 'tradingFee', 
    label: 'Phí giao dịch', 
    shortLabel: 'Phí GD',
    regex: /phí giao dịch|biểu phí|phí dịch vụ|phí môi giới|phí cơ sở|phí phái sinh|phí sở/i,
    colorClass: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  { 
    key: 'zeroFee', 
    label: 'Zero-Fee / Miễn phí', 
    shortLabel: 'Zero-Fee',
    regex: /miễn phí|zero[- ]?fee|0% phí|0 đồng|0đ\/hđ|miễn 100%|không thu phí/i,
    colorClass: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
  },
  { 
    key: 'interestRate', 
    label: 'Lãi suất', 
    shortLabel: 'Lãi suất',
    regex: /lãi suất|mức lãi suất|lãi suất năm|lãi ngày|lãi suất ưu đãi/i,
    colorClass: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  },
  { 
    key: 'loanInterest', 
    label: 'Lãi vay', 
    shortLabel: 'Lãi vay',
    regex: /lãi vay|tiền lãi vay|lãi suất vay|lãi vay margin|lãi tạm tính|lãi quá hạn/i,
    colorClass: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
  },
  { 
    key: 'margin', 
    label: 'Ký quỹ / Margin', 
    shortLabel: 'Ký quỹ',
    regex: /ký quỹ|giao dịch ký quỹ|margin|tỷ lệ ký quỹ|đòn bẩy|deal ký quỹ|hợp tác đầu tư/i,
    colorClass: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  },
  { 
    key: 'creditLimit', 
    label: 'Hạn mức', 
    shortLabel: 'Hạn mức',
    regex: /hạn mức|hạn mức vay|hạn mức margin|room margin|hạn mức tài khoản|hạn mức cấp tín dụng/i,
    colorClass: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  { 
    key: 'debtBalance', 
    label: 'Dư nợ', 
    shortLabel: 'Dư nợ',
    regex: /dư nợ|dư nợ margin|dư nợ vay|dư nợ tối thiểu|quy mô dư nợ|dư nợ bình quân/i,
    colorClass: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  }
];

/**
 * Phân tích nội dung văn bản và trích xuất các từ khóa tài chính chuyên sâu
 * @param {string} text Nội dung HTML/Văn bản của trang web
 * @returns {Object} Kết quả nhận diện tín hiệu
 */
export function analyzeFinancialKeywords(text = '') {
  if (!text || typeof text !== 'string') {
    return {
      hasTradingFee: false,
      hasZeroFee: false,
      hasInterestRate: false,
      hasLoanInterest: false,
      hasMargin: false,
      hasCreditLimit: false,
      hasDebtBalance: false,
      matchedList: [],
      matchedKeys: [],
      ratesFound: [],
      // Khả năng tương thích ngược
      hasZeroFeeMention: false,
      hasMarginMention: false,
      hasPromoRateMention: false
    };
  }

  const matchedList = [];
  const matchedKeys = [];
  const flags = {};

  KEYWORD_DICTIONARY.forEach(item => {
    const isMatched = item.regex.test(text);
    flags[item.key] = isMatched;
    if (isMatched) {
      matchedList.push(item.label);
      matchedKeys.push(item.key);
    }
  });

  // Tìm các mức lãi suất % cụ thể (từ 4.0% đến 14.9%)
  const rateMatches = text.match(/([4-9][.,][0-9]{1,2}%|1[0-4][.,][0-9]{1,2}%)/g) || [];
  const ratesFound = [...new Set(rateMatches)].slice(0, 6);

  return {
    hasTradingFee: Boolean(flags.tradingFee),
    hasZeroFee: Boolean(flags.zeroFee),
    hasInterestRate: Boolean(flags.interestRate),
    hasLoanInterest: Boolean(flags.loanInterest),
    hasMargin: Boolean(flags.margin),
    hasCreditLimit: Boolean(flags.creditLimit),
    hasDebtBalance: Boolean(flags.debtBalance),
    matchedList,
    matchedKeys,
    ratesFound,
    // Khả năng tương thích ngược
    hasZeroFeeMention: Boolean(flags.zeroFee),
    hasMarginMention: Boolean(flags.margin || flags.interestRate || flags.loanInterest),
    hasPromoRateMention: ratesFound.length > 0
  };
}
