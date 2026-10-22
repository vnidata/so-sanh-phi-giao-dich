/**
 * DANH SÁCH 30 CÔNG TY CHỨNG KHOÁN VIỆT NAM DÙNG CHO CRAWLER & WEB SCANNER
 * Đồng bộ giữa môi trường Node.js (scripts) và Trình duyệt React (UI)
 */

export const TARGET_BROKERS = [
  {
    id: 'bsc',
    name: 'Công ty Cổ phần Chứng khoán BIDV',
    shortName: 'BSC',
    stockCode: 'BSI',
    isListed: true,
    url: 'https://www.bsc.com.vn/bieu-phi',
    fallbackUrl: 'https://www.bsc.com.vn/phi-giao-dich-qua-san/',
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
    fallbackUrl: 'https://r.jina.ai/https://www.tcbs.com.vn',
    officialSource: 'https://www.tcbs.com.vn',
    knownIssue: 'Nền tảng SPA JavaScript & Cloudflare Bot Protection (Tự động kích hoạt Anti-WAF Gateway)'
  },
  {
    id: 'vps',
    name: 'Công ty Cổ phần Chứng khoán VPS',
    shortName: 'VPS',
    stockCode: null,
    isListed: false,
    url: 'https://vps.com.vn',
    fallbackUrl: 'https://vps.com.vn/bieu-phi-dich-vu/',
    officialSource: 'https://vps.com.vn',
    knownIssue: null
  },
  {
    id: 'ssi',
    name: 'Công ty Cổ phần Chứng khoán SSI',
    shortName: 'SSI',
    stockCode: 'SSI',
    isListed: true,
    url: 'https://r.jina.ai/https://www.ssi.com.vn/khach-hang-ca-nhan/bieu-phi',
    fallbackUrl: 'https://www.ssi.com.vn/khach-hang-ca-nhan/bieu-phi',
    officialSource: 'https://www.ssi.com.vn',
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
    url: 'https://r.jina.ai/https://www.vpbanks.com.vn',
    fallbackUrl: 'https://www.vpbanks.com.vn',
    officialSource: 'https://www.vpbanks.com.vn/bieu-phi',
    knownIssue: null
  },
  {
    id: 'fpts',
    name: 'Công ty Cổ phần Chứng khoán FPT',
    shortName: 'FPTS',
    stockCode: 'FTS',
    isListed: true,
    url: 'https://www.fpts.com.vn',
    fallbackUrl: 'https://www.fpts.com.vn',
    officialSource: 'https://www.fpts.com.vn',
    knownIssue: null
  },
  {
    id: 'hsc',
    name: 'Công ty Cổ phần Chứng khoán TP.Hồ Chí Minh',
    shortName: 'HSC',
    stockCode: 'HCM',
    isListed: true,
    url: 'https://r.jina.ai/https://www.hsc.com.vn',
    fallbackUrl: 'https://www.hsc.com.vn',
    officialSource: 'https://www.hsc.com.vn/bieu-phi',
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
    url: 'https://kafi.vn',
    fallbackUrl: 'https://kafi.vn',
    officialSource: 'https://kafi.vn',
    knownIssue: null
  },
  {
    id: 'mbs',
    name: 'Công ty Cổ phần Chứng khoán MB',
    shortName: 'MBS',
    stockCode: 'MBS',
    isListed: true,
    url: 'https://mbs.com.vn/bieu-phi/',
    fallbackUrl: 'https://mbs.com.vn',
    officialSource: 'https://mbs.com.vn/bieu-phi/',
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
    url: 'https://r.jina.ai/https://vixs.vn',
    fallbackUrl: 'https://r.jina.ai/https://vixs.vn',
    officialSource: 'https://vixs.vn',
    knownIssue: null
  },
  {
    id: 'kis',
    name: 'Công ty Cổ phần Chứng khoán KIS Việt Nam',
    shortName: 'KIS',
    stockCode: null,
    isListed: false,
    url: 'https://kisvn.vn',
    fallbackUrl: 'https://kisvn.vn',
    officialSource: 'https://kisvn.vn',
    knownIssue: null
  },
  {
    id: 'acbs',
    name: 'Công ty TNHH Chứng khoán ACB',
    shortName: 'ACBS',
    stockCode: null,
    isListed: false,
    url: 'https://acbs.com.vn/bieu-phi',
    fallbackUrl: 'https://acbs.com.vn',
    officialSource: 'https://acbs.com.vn/bieu-phi',
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
    fallbackUrl: 'https://www.kbsec.com.vn/vi/bieu-phi.html',
    officialSource: 'https://www.kbsec.com.vn/vi/bieu-phi.html',
    knownIssue: null
  },
  {
    id: 'cts',
    name: 'Công ty Cổ phần Chứng khoán Ngân hàng Công Thương Việt Nam',
    shortName: 'VietinBank Sec (CTS)',
    stockCode: 'CTS',
    isListed: true,
    url: 'https://cts.vn/bieu-phi',
    fallbackUrl: 'https://cts.vn',
    officialSource: 'https://cts.vn/bieu-phi',
    knownIssue: null
  },
  {
    id: 'bvsc',
    name: 'Công ty Cổ phần Chứng khoán Bảo Việt',
    shortName: 'BVSC',
    stockCode: 'BVS',
    isListed: true,
    url: 'https://bvsc.com.vn/bieu-phi',
    fallbackUrl: 'https://bvsc.com.vn',
    officialSource: 'https://bvsc.com.vn/bieu-phi',
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
    url: 'https://yuanta.com.vn/bieu-phi',
    fallbackUrl: 'https://yuanta.com.vn',
    officialSource: 'https://yuanta.com.vn/bieu-phi',
    knownIssue: null
  },
  {
    id: 'shinhan',
    name: 'Công ty TNHH Chứng khoán Shinhan Việt Nam',
    shortName: 'Shinhan Sec',
    stockCode: null,
    isListed: false,
    url: 'https://shinhansec.com.vn',
    fallbackUrl: 'https://shinhansec.com.vn',
    officialSource: 'https://shinhansec.com.vn',
    knownIssue: null
  },
  {
    id: 'agriseco',
    name: 'Công ty Cổ phần Chứng khoán Agribank',
    shortName: 'Agriseco',
    stockCode: 'AGR',
    isListed: true,
    url: 'https://agriseco.com.vn',
    fallbackUrl: 'https://agriseco.com.vn',
    officialSource: 'https://agriseco.com.vn',
    knownIssue: null
  },
  {
    id: 'hdbs',
    name: 'Công ty Cổ phần Chứng khoán HD',
    shortName: 'HDBS',
    stockCode: null,
    isListed: false,
    url: 'https://hdbs.vn',
    fallbackUrl: 'https://hdbs.vn/bieu-phi',
    officialSource: 'https://hdbs.vn',
    knownIssue: null
  },
  {
    id: 'dsc',
    name: 'Công ty Cổ phần Chứng khoán DSC',
    shortName: 'DSC',
    stockCode: 'DSC',
    isListed: true,
    url: 'https://dsc.com.vn/bieu-phi',
    fallbackUrl: 'https://dsc.com.vn',
    officialSource: 'https://dsc.com.vn/bieu-phi',
    knownIssue: null
  },
  {
    id: 'phs',
    name: 'Công ty Cổ phần Chứng khoán Phú Hưng',
    shortName: 'PHS',
    stockCode: 'PHS',
    isListed: true,
    url: 'https://phs.vn',
    fallbackUrl: 'https://phs.vn',
    officialSource: 'https://phs.vn',
    knownIssue: null
  },
  {
    id: 'tvsi',
    name: 'Công ty Cổ phần Chứng khoán Tân Việt',
    shortName: 'TVSI',
    stockCode: null,
    isListed: false,
    url: 'https://tvsi.com.vn',
    fallbackUrl: 'https://tvsi.com.vn/bieu-phi',
    officialSource: 'https://tvsi.com.vn',
    knownIssue: null
  },
  {
    id: 'evs',
    name: 'Công ty Cổ phần Chứng khoán Everest',
    shortName: 'EVS',
    stockCode: 'EVS',
    isListed: true,
    url: 'https://eves.com.vn',
    fallbackUrl: 'https://eves.com.vn',
    officialSource: 'https://eves.com.vn',
    knownIssue: null
  }
];
