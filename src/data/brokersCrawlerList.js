/**
 * DANH SÁCH 30 CÔNG TY CHỨNG KHOÁN VIỆT NAM DÙNG CHO CRAWLER & WEB SCANNER
 * Đồng bộ giữa môi trường Node.js (scripts) và Trình duyệt React (UI)
 * Toàn bộ 100% liên kết được xác thực trực tiếp trên hạ tầng của từng CTCK
 */

export const TARGET_BROKERS = [
  {
    id: 'bsc',
    name: 'Công ty Cổ phần Chứng khoán BIDV',
    shortName: 'BSC',
    stockCode: 'BSI',
    isListed: true,
    url: 'https://www.bsc.com.vn/phi-giao-dich-qua-san/',
    fallbackUrl: 'https://www.bsc.com.vn',
    officialSource: 'https://www.bsc.com.vn/phi-giao-dich-qua-san/',
    knownIssue: null
  },
  {
    id: 'tcbs',
    name: 'Công ty Cổ phần Chứng khoán Kỹ Thương',
    shortName: 'TCBS',
    stockCode: null,
    isListed: false,
    url: 'https://r.jina.ai/https://www.tcbs.com.vn',
    fallbackUrl: 'https://www.tcbs.com.vn',
    officialSource: 'https://www.tcbs.com.vn',
    knownIssue: 'Nền tảng SPA JavaScript & Cloudflare Bot Protection (Tự động kích hoạt Anti-WAF Gateway)'
  },
  {
    id: 'vps',
    name: 'Công ty Cổ phần Chứng khoán VPS',
    shortName: 'VPS',
    stockCode: null,
    isListed: false,
    url: 'https://vps.com.vn/ca-nhan/ho-tro?view=bieu-phi-bieu-mau-va-chinh-sach&nav=bieu-phi--chinh-sach',
    fallbackUrl: 'https://vps.com.vn',
    officialSource: 'https://vps.com.vn/ca-nhan/ho-tro?view=bieu-phi-bieu-mau-va-chinh-sach&nav=bieu-phi--chinh-sach',
    knownIssue: null
  },
  {
    id: 'ssi',
    name: 'Công ty Cổ phần Chứng khoán SSI',
    shortName: 'SSI',
    stockCode: 'SSI',
    isListed: true,
    url: 'https://www.ssi.com.vn/khach-hang-ca-nhan/bieu-phi/bieu-gia-dich-vu-giao-dich-chung-khoan',
    fallbackUrl: 'https://r.jina.ai/https://www.ssi.com.vn/khach-hang-ca-nhan/bieu-phi/bieu-gia-dich-vu-giao-dich-chung-khoan',
    officialSource: 'https://www.ssi.com.vn/khach-hang-ca-nhan/bieu-phi/bieu-gia-dich-vu-giao-dich-chung-khoan',
    knownIssue: null
  },
  {
    id: 'vndirect',
    name: 'Công ty Cổ phần Chứng khoán VNDIRECT',
    shortName: 'VNDIRECT',
    stockCode: 'VND',
    isListed: true,
    url: 'https://banggia.vndirect.com.vn',
    fallbackUrl: 'https://r.jina.ai/https://banggia.vndirect.com.vn',
    officialSource: 'https://banggia.vndirect.com.vn',
    knownIssue: 'Bảo vệ bởi Cloudflare WAF Bot-Protection (Tự động kích hoạt Anti-WAF Gateway)'
  },
  {
    id: 'mirae-asset',
    name: 'Công ty Cổ phần Chứng khoán Mirae Asset (Việt Nam)',
    shortName: 'Mirae Asset',
    stockCode: null,
    isListed: false,
    url: 'https://masvn.com/bieu-phi',
    fallbackUrl: 'https://masvn.com',
    officialSource: 'https://masvn.com/bieu-phi',
    knownIssue: null
  },
  {
    id: 'dnse',
    name: 'Công ty Cổ phần Chứng khoán DNSE',
    shortName: 'DNSE',
    stockCode: 'DSE',
    isListed: true,
    url: 'https://www.dnse.com.vn/bieu-phi',
    fallbackUrl: 'https://www.dnse.com.vn',
    officialSource: 'https://www.dnse.com.vn/bieu-phi',
    knownIssue: null
  },
  {
    id: 'vpbanks',
    name: 'Công ty Cổ phần Chứng khoán VPBank',
    shortName: 'VPBankS',
    stockCode: null,
    isListed: false,
    url: 'https://www.vpbanks.com.vn/bieu-phi',
    fallbackUrl: 'https://r.jina.ai/https://www.vpbanks.com.vn/bieu-phi',
    officialSource: 'https://www.vpbanks.com.vn/bieu-phi',
    knownIssue: null
  },
  {
    id: 'fpts',
    name: 'Công ty Cổ phần Chứng khoán FPT',
    shortName: 'FPTS',
    stockCode: 'FTS',
    isListed: true,
    url: 'https://new.eztrade.fpts.com.vn/customers/promotion/linh-hoat-lua-chon-goi-phi-giao-dich-tai-fpts',
    fallbackUrl: 'https://www.fpts.com.vn',
    officialSource: 'https://new.eztrade.fpts.com.vn/customers/promotion/linh-hoat-lua-chon-goi-phi-giao-dich-tai-fpts',
    knownIssue: null
  },
  {
    id: 'hsc',
    name: 'Công ty Cổ phần Chứng khoán TP.Hồ Chí Minh',
    shortName: 'HSC',
    stockCode: 'HCM',
    isListed: true,
    url: 'https://www.hsc.com.vn/vi/bieu-phi',
    fallbackUrl: 'https://r.jina.ai/https://www.hsc.com.vn/vi/bieu-phi',
    officialSource: 'https://www.hsc.com.vn/vi/bieu-phi',
    knownIssue: null
  },
  {
    id: 'vietcap',
    name: 'Công ty Cổ phần Chứng khoán Vietcap',
    shortName: 'Vietcap',
    stockCode: 'VCI',
    isListed: true,
    url: 'https://www.vietcap.com.vn/bieu-phi',
    fallbackUrl: 'https://www.vietcap.com.vn',
    officialSource: 'https://www.vietcap.com.vn/bieu-phi',
    knownIssue: null
  },
  {
    id: 'kafi',
    name: 'Công ty Cổ phần Chứng khoán Kafi',
    shortName: 'Kafi',
    stockCode: null,
    isListed: false,
    url: 'https://kafi.vn/stock-trading?tab=bpgd',
    fallbackUrl: 'https://kafi.vn',
    officialSource: 'https://kafi.vn/stock-trading?tab=bpgd',
    knownIssue: null
  },
  {
    id: 'mbs',
    name: 'Công ty Cổ phần Chứng khoán MB',
    shortName: 'MBS',
    stockCode: 'MBS',
    isListed: true,
    url: 'https://mbs.com.vn/bieu-phi-giao-dich/',
    fallbackUrl: 'https://mbs.com.vn',
    officialSource: 'https://mbs.com.vn/bieu-phi-giao-dich/',
    knownIssue: null
  },
  {
    id: 'shs',
    name: 'Công ty Cổ phần Chứng khoán Sài Gòn - Hà Nội',
    shortName: 'SHS',
    stockCode: 'SHS',
    isListed: true,
    url: 'https://www.shs.com.vn/Pages/BieuPhiDichVu.aspx',
    fallbackUrl: 'https://www.shs.com.vn',
    officialSource: 'https://www.shs.com.vn/Pages/BieuPhiDichVu.aspx',
    knownIssue: null
  },
  {
    id: 'vix',
    name: 'Công ty Cổ phần Chứng khoán VIX',
    shortName: 'VIX',
    stockCode: 'VIX',
    isListed: true,
    url: 'https://vixs.vn/ho-tro/bieu-phi-giao-dich',
    fallbackUrl: 'https://vixs.vn',
    officialSource: 'https://vixs.vn/ho-tro/bieu-phi-giao-dich',
    knownIssue: null
  },
  {
    id: 'kis',
    name: 'Công ty Cổ phần Chứng khoán KIS Việt Nam',
    shortName: 'KIS',
    stockCode: null,
    isListed: false,
    url: 'https://kisvn.vn/san-pham-dich-vu/dich-vu-chung-khoan/bieu-phi-4206',
    fallbackUrl: 'https://kisvn.vn',
    officialSource: 'https://kisvn.vn/san-pham-dich-vu/dich-vu-chung-khoan/bieu-phi-4206',
    knownIssue: null
  },
  {
    id: 'acbs',
    name: 'Công ty TNHH Chứng khoán ACB',
    shortName: 'ACBS',
    stockCode: null,
    isListed: false,
    url: 'https://acbs.com.vn/bieu-phi-giao-dich-chung-khoan-niem-yet',
    fallbackUrl: 'https://acbs.com.vn',
    officialSource: 'https://acbs.com.vn/bieu-phi-giao-dich-chung-khoan-niem-yet',
    knownIssue: null
  },
  {
    id: 'vcbs',
    name: 'Công ty TNHH Chứng khoán Vietcombank',
    shortName: 'VCBS',
    stockCode: null,
    isListed: false,
    url: 'https://vcbs.com.vn/bieu-phi',
    fallbackUrl: 'https://vcbs.com.vn',
    officialSource: 'https://vcbs.com.vn/bieu-phi',
    knownIssue: null
  },
  {
    id: 'kbsv',
    name: 'Công ty Cổ phần Chứng khoán KB Việt Nam',
    shortName: 'KBSV',
    stockCode: null,
    isListed: false,
    url: 'https://www.kbsec.com.vn/vi/bieu-phi.html',
    fallbackUrl: 'https://www.kbsec.com.vn',
    officialSource: 'https://www.kbsec.com.vn/vi/bieu-phi.html',
    knownIssue: null
  },
  {
    id: 'cts',
    name: 'Công ty Cổ phần Chứng khoán Ngân hàng Công Thương Việt Nam',
    shortName: 'VietinBank Sec (CTS)',
    stockCode: 'CTS',
    isListed: true,
    url: 'https://www.vbse.vn/khach-hang-ca-nhan/bieu-phi/',
    fallbackUrl: 'https://cts.vn',
    officialSource: 'https://www.vbse.vn/khach-hang-ca-nhan/bieu-phi/',
    knownIssue: null
  },
  {
    id: 'bvsc',
    name: 'Công ty Cổ phần Chứng khoán Bảo Việt',
    shortName: 'BVSC',
    stockCode: 'BVS',
    isListed: true,
    url: 'https://www.bvsc.com.vn/danhmuc/dich-vu/khach-hang-ca-nhan/ho-tro/huong-dan-su-dung-dich-vu/bieu-lai-phi-giao-dich/',
    fallbackUrl: 'https://bvsc.com.vn',
    officialSource: 'https://www.bvsc.com.vn/danhmuc/dich-vu/khach-hang-ca-nhan/ho-tro/huong-dan-su-dung-dich-vu/bieu-lai-phi-giao-dich/',
    knownIssue: null
  },
  {
    id: 'tps',
    name: 'Công ty Cổ phần Chứng khoán Tiên Phong',
    shortName: 'TPS',
    stockCode: 'ORS',
    isListed: true,
    url: 'https://tpbs.com.vn',
    fallbackUrl: 'https://tpbs.com.vn',
    officialSource: 'https://tpbs.com.vn',
    knownIssue: null
  },
  {
    id: 'yuanta',
    name: 'Công ty TNHH Chứng khoán Yuanta Việt Nam',
    shortName: 'Yuanta',
    stockCode: null,
    isListed: false,
    url: 'https://support.yuanta.com.vn/bieu-phi-va-lai-suat/',
    fallbackUrl: 'https://yuanta.com.vn',
    officialSource: 'https://support.yuanta.com.vn/bieu-phi-va-lai-suat/',
    knownIssue: null
  },
  {
    id: 'shinhan',
    name: 'Công ty TNHH Chứng khoán Shinhan Việt Nam',
    shortName: 'Shinhan Sec',
    stockCode: null,
    isListed: false,
    url: 'https://shinhansec.com.vn/vi/ho-tro-khach-hang/phi-giao-dich.html',
    fallbackUrl: 'https://shinhansec.com.vn',
    officialSource: 'https://shinhansec.com.vn/vi/ho-tro-khach-hang/phi-giao-dich.html',
    knownIssue: null
  },
  {
    id: 'agriseco',
    name: 'Công ty Cổ phần Chứng khoán Agribank',
    shortName: 'Agriseco',
    stockCode: 'AGR',
    isListed: true,
    url: 'https://agriseco.com.vn/News/NewsDetail/2057993/vi-VN',
    fallbackUrl: 'https://agriseco.com.vn',
    officialSource: 'https://agriseco.com.vn/News/NewsDetail/2057993/vi-VN',
    knownIssue: null
  },
  {
    id: 'hdbs',
    name: 'Công ty Cổ phần Chứng khoán HD',
    shortName: 'HDBS',
    stockCode: null,
    isListed: false,
    url: 'https://hdbs.vn/bieu-phi/',
    fallbackUrl: 'https://hdbs.vn',
    officialSource: 'https://hdbs.vn/bieu-phi/',
    knownIssue: null
  },
  {
    id: 'dsc',
    name: 'Công ty Cổ phần Chứng khoán DSC',
    shortName: 'DSC',
    stockCode: 'DSC',
    isListed: true,
    url: 'https://www.dsc.com.vn/bieu-phi',
    fallbackUrl: 'https://dsc.com.vn',
    officialSource: 'https://www.dsc.com.vn/bieu-phi',
    knownIssue: null
  },
  {
    id: 'phs',
    name: 'Công ty Cổ phần Chứng khoán Phú Hưng',
    shortName: 'PHS',
    stockCode: 'PHS',
    isListed: true,
    url: 'https://www.phs.vn/san-pham-dich-vu/bieu-phi-giao-dich-chung-khoan-co-so-26',
    fallbackUrl: 'https://phs.vn',
    officialSource: 'https://www.phs.vn/san-pham-dich-vu/bieu-phi-giao-dich-chung-khoan-co-so-26',
    knownIssue: null
  },
  {
    id: 'tvsi',
    name: 'Công ty Cổ phần Chứng khoán Tân Việt',
    shortName: 'TVSI',
    stockCode: null,
    isListed: false,
    url: 'https://www.tvsi.com.vn/fee-stock.html',
    fallbackUrl: 'https://tvsi.com.vn',
    officialSource: 'https://www.tvsi.com.vn/fee-stock.html',
    knownIssue: null
  },
  {
    id: 'evs',
    name: 'Công ty Cổ phần Chứng khoán Everest',
    shortName: 'EVS',
    stockCode: 'EVS',
    isListed: true,
    url: 'https://www.eves.com.vn/san-pham-dich-vu/bieu-phi/bieu-phi-dich-vu/',
    fallbackUrl: 'https://eves.com.vn',
    officialSource: 'https://www.eves.com.vn/san-pham-dich-vu/bieu-phi/bieu-phi-dich-vu/',
    knownIssue: null
  }
];


/**
 * Trích xuất danh sách toàn bộ các sub-tabs chuyên sâu cần quét cho một công ty chứng khoán
 * Bao gồm: Biểu phí giao dịch, Lãi suất ký quỹ Margin, Ưu đãi mở mới và các bài viết tin tức liên quan
 * @param {Object} broker Thông tin cơ bản từ TARGET_BROKERS
 * @param {Object} companyData Dữ liệu chi tiết từ SECURITIES_COMPANIES
 * @returns {Array<Object>} Danh sách các sub-tabs chuyên đề
 */
export function getBrokerSubTabs(broker, companyData = null) {
  if (!broker) return [];
  const tabs = [];
  const seen = new Set();

  const addTab = (id, type, title, url, badge, description) => {
    if (!url || url === '#' || seen.has(url)) return;
    seen.add(url);
    tabs.push({
      id,
      type: type || 'fee',
      title: title || 'Nguồn dữ liệu',
      url,
      badge: badge || (type === 'fee' ? 'Biểu phí' : type === 'margin' ? 'Lãi suất Margin' : 'Ưu đãi'),
      description: description || ''
    });
  };

  // 1. Tab Biểu phí giao dịch chính thức
  addTab(
    'official_fee',
    'fee',
    'Biểu phí giao dịch chính thức',
    broker.officialSource || broker.url,
    'Biểu Phí Chuẩn',
    'Văn bản / bài viết biểu phí giao dịch cổ phiếu và phái sinh công bố công khai'
  );

  // 2. Tab Gói Margin / Lãi suất vay ký quỹ
  if (companyData?.margin?.sourceUrl) {
    addTab(
      'margin_policy',
      'margin',
      'Chính sách & Gói vay Margin',
      companyData.margin.sourceUrl,
      'Lãi Suất Margin',
      'Bài viết công bố chính thức về gói lãi suất margin, miễn lãi T+ hoặc ưu đãi lãi vay'
    );
  }

  // 3. Tab Chính sách ưu đãi mở tài khoản eKYC
  if (companyData?.welcomePromo?.sourceUrl) {
    addTab(
      'welcome_promo',
      'promo',
      'Chính sách ưu đãi mở tài khoản eKYC',
      companyData.welcomePromo.sourceUrl,
      'Ưu Đãi Mở Mới',
      'Bài viết công bố về gói quà tặng, miễn phí giao dịch hoặc hoàn tiền mở tài khoản'
    );
  }

  // 4. Toàn bộ các bài viết tin tức / khuyến mại chuyên đề đã quét được từ website CTCK
  if (Array.isArray(companyData?.promoArticles)) {
    companyData.promoArticles.forEach((art, idx) => {
      if (art?.url) {
        addTab(
          `article_${idx}`,
          art.type || 'promo',
          art.title || `Bài viết công bố ${broker.shortName}`,
          art.url,
          art.badge || (art.type === 'fee' ? 'Ưu Đãi Phí' : art.type === 'margin' ? 'Lãi Suất Margin' : 'Khuyến Mại'),
          `Bài viết tin tức chính thức công bố trên website ${broker.shortName}`
        );
      }
    });
  }

  return tabs;
}
