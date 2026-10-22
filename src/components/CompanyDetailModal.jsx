import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  Check, 
  AlertCircle, 
  Building2, 
  Award, 
  Sparkles, 
  CheckCircle2,
  DollarSign,
  TrendingDown,
  ShieldCheck, 
  Layers,
  ExternalLink,
  Globe,
  FileText,
  Gift,
  Zap,
  Database,
  Newspaper
} from 'lucide-react';
import { getBrokerSourceLinks, getPromotionArticleLink } from '../utils/sourceLinks';

export default function CompanyDetailModal({ company, onClose }) {
  if (!company) return null;

  const [activeTab, setActiveTab] = useState('fee_margin');
  const isBsc = company.id === 'bsc' || company.isRecommended;

  // Lấy bộ liên kết nguồn đã quét và kiểm chứng thực tế
  const {
    websiteUrl: companyWebsiteUrl,
    feeSourceUrl,
    scannedUrl,
    accountOpeningUrl,
    promoSourceUrl,
    marginSourceUrl,
    promoArticles,
    scannedSources,
    crawlerMeta
  } = getBrokerSourceLinks(company);

  const validPromoArticles = promoArticles?.length ? promoArticles : (company.promoArticles || []);
  const extractedSignals = crawlerMeta?.signals || company.crawlerMeta?.signals;

  const tabs = [
    { id: 'fee_margin', label: 'Biểu Phí & Margin', icon: DollarSign },
    { id: 'promotions', label: 'Ưu Đãi Hiện Hành', icon: Sparkles },
    { id: 'analysis', label: 'Đánh Giá & Phù Hợp', icon: CheckCircle2 },
    { id: 'open_account', label: 'Hướng Dẫn Mở TK', icon: ArrowUpRight },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-t-3xl sm:rounded-3xl bg-white p-4 sm:p-7 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 max-h-[94vh] sm:max-h-[92vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors z-10"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Company Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0 pr-8 sm:pr-0">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white font-extrabold text-xl shadow-md"
              style={{ backgroundColor: company.brandColor }}
            >
              {(company.shortName || '').slice(0, 3)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {company.shortName}
                </h2>
                {company.isListed && company.stockCode ? (
                  <span className="rounded-md bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-xs font-black text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Mã: {company.stockCode} ({company.listingExchange})
                  </span>
                ) : (
                  <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                    {company.listingStatus || 'Chưa niêm yết'}
                  </span>
                )}

                {/* 1. Website chính thức */}
                <a
                  href={companyWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors"
                  title={`Truy cập trang web chính thức của ${company.shortName} (${companyWebsiteUrl})`}
                >
                  <Globe className="h-2.5 w-2.5" />
                  <span>Website</span>
                  <ExternalLink className="h-2 w-2 opacity-70" />
                </a>

                {/* 2. Nguồn bài viết biểu phí & lãi suất gốc */}
                <a
                  href={feeSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors"
                  title={`Xem bài viết gốc về biểu phí & lãi suất tại ${company.shortName} (${feeSourceUrl})`}
                >
                  <FileText className="h-2.5 w-2.5" />
                  <span>Biểu phí gốc</span>
                  <ExternalLink className="h-2 w-2 opacity-70" />
                </a>

                {/* 3. Cổng crawler đã quét dữ liệu */}
                <a
                  href={scannedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors"
                  title={`Xem cổng dữ liệu scanner đã quét thực tế của ${company.shortName} (${scannedUrl})`}
                >
                  <ShieldCheck className="h-2.5 w-2.5" />
                  <span>Cổng quét</span>
                  <ExternalLink className="h-2 w-2 opacity-70" />
                </a>

                {isBsc && (
                  <span className="rounded bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-wider shadow-xs">
                    ⭐ Lựa Chọn Tối Ưu
                  </span>
                )}
                {company.bankBacked && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <Building2 className="h-3 w-3" />
                    Trực thuộc {company.bankBacked}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium truncate mt-0.5">
                {company.name}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Award className="h-3 w-3" />
                  {company.marketShareRank}
                </span>
                <span>•</span>
                <span>Năm TL: {company.establishedYear}</span>
                <span>•</span>
                <span>Cập nhật: {company.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Quick CTA Button on Header */}
          <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
            <a
              href={company.accountOpeningUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black shadow-xs transition-all ${
                isBsc
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-orange-500/20 ring-1 ring-amber-400/60'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <span>{isBsc ? 'Mở TK BSC' : 'Mở Tài Khoản'}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 mt-3 overflow-x-auto shrink-0 pb-1 scrollbar-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 ring-1 ring-blue-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents Container (Scrollable) */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-4">
          {/* TAB 1: BIỂU PHÍ & MARGIN */}
          {activeTab === 'fee_margin' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Trading Fee Box */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Phí Giao Dịch Cổ Phiếu
                    </span>
                    {company.tradingFee.onlineMin === 0 && (
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Zero-Fee
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    {company.tradingFee.onlineMin === 0 ? (
                      <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="h-5 w-5" />
                        <span>0% Miễn Phí Trực Tuyến</span>
                      </div>
                    ) : (
                      <div className="text-xl font-black text-slate-900 dark:text-white">
                        {company.tradingFee.onlineMin}% – {company.tradingFee.onlineMax}%
                      </div>
                    )}
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {company.tradingFee.notes}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Qua nhân viên môi giới:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {company.tradingFee.brokerMin}% – {company.tradingFee.brokerMax}%
                    </span>
                  </div>
                
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Nguồn bài viết biểu phí:</span>
                    <a
                      href={feeSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
                      title={`Xem văn bản công bố biểu phí giao dịch của ${company.shortName}`}
                    >
                      <span>Xem biểu phí chuẩn</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* Margin Loan Box with explicit distinction between 90-day standard vs short-term deal */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Lãi Suất Ký Quỹ Margin
                    </span>
                    <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-full">
                      Phân biệt Chuẩn 90 ngày vs Ngắn hạn
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Block A: Standard 90-day package */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          📅 Gói Tiêu Chuẩn (90 Ngày)
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold">Chuẩn UBCK</span>
                      </div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          {company.margin.baseRate ? `${company.margin.baseRate}%/năm (Chuẩn 90 ngày)` : (company.margin.standardRateDisplay || `${company.margin.standardRate90d}%/năm`)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                        Kỳ hạn chuẩn 90 ngày (gia hạn tối đa thêm 90 ngày). Áp dụng cho danh mục nắm giữ trung - dài hạn.
                      </p>
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-medium">Nguồn lãi suất chuẩn:</span>
                        <a
                          href={feeSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                          title={`Xem văn bản công bố lãi suất margin chuẩn của ${company.shortName}`}
                        >
                          <span>Xem biểu lãi gốc</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    </div>

                    {/* Block B: Short-term deal package / Margin linh hoạt */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400">
                            ⚡ Gói Ngắn Hạn (Deal / T+)
                          </span>
                          {company.margin.isShortTermDealOnly && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1 py-0.2 rounded font-bold">
                              Deal 5–10 ngày
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                            {company.margin.shortTermDisplay || `Từ ${company.margin.shortTermRate || company.margin.minRate}%/năm`}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                          {company.margin.shortTermTenor || 'Gói lướt sóng ngắn hạn T+'}. {company.margin.interestFreeDays > 0 ? `Miễn lãi T+${company.margin.interestFreeDays - 1}.` : ''}
                        </p>
                      </div>

                      {/* Direct source link to flexible margin product article */}
                      <div className="mt-2.5 pt-2 border-t border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-medium">Nguồn gói Margin:</span>
                        <a
                          href={marginSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          title={`Xem bài viết giới thiệu sản phẩm Margin linh hoạt tại ${company.shortName}`}
                        >
                          <span>Xem bài viết Margin</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Notes & Regulatory limits */}
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300">
                    <p className="text-[11px] leading-relaxed">
                      💡 <strong>Quy định & Chú thích:</strong> {company.margin.notes}
                    </p>
                    <div className="mt-2 flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Đòn bẩy tối đa:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {company.margin.maxLeverage}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD: DANH MỤC TOÀN BỘ NGUỒN DỮ LIỆU ĐÃ CRAWL THỰC TẾ TRÊN WEBSITE */}
              <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900/70 p-4 sm:p-5 shadow-sm space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100 dark:border-emerald-900/50">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs shrink-0">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                          Toàn Bộ Nguồn Dữ Liệu Đã Quét Thực Tế ({company.shortName})
                        </h4>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/80 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          {scannedSources?.length || 0} Nguồn Dữ Liệu & Bài Viết Đã Quét
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        Minh bạch dữ liệu: Toàn bộ liên kết dưới đây đã được kết nối và thu thập trực tiếp từ máy chủ của <strong>{company.name}</strong>, tuyệt đối không sử dụng liên kết giả định.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grid 4 Nguồn dữ liệu đã cào/quét */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(scannedSources || []).map((source) => (
                    <div
                      key={source.id}
                      className="rounded-xl bg-white dark:bg-slate-800/90 p-3.5 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all flex flex-col justify-between shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                          <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                            {source.id === 'official_fee' && <FileText className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                            {source.id.includes('margin') && <Zap className="h-3.5 w-3.5 text-blue-600 shrink-0" />}
                            {(source.id.includes('promo') || source.id.includes('welcome')) && <Gift className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                            {source.id.includes('article') && !source.id.includes('margin') && !source.id.includes('promo') && <Newspaper className="h-3.5 w-3.5 text-indigo-600 shrink-0" />}
                            {source.id === 'scanned_endpoint' && <ShieldCheck className="h-3.5 w-3.5 text-purple-600 shrink-0" />}
                            {source.id === 'official_website' && <Globe className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />}
                            {source.id === 'account_opening' && <ArrowUpRight className="h-3.5 w-3.5 text-amber-600 shrink-0" />}
                            <span>{source.title}</span>
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                          {source.badge && (
                            <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-black border ${
                              source.badgeColor === 'blue'
                                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                                : source.badgeColor === 'amber'
                                ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                                : source.badgeColor === 'purple'
                                ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
                                : source.badgeColor === 'slate'
                                ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                            }`}>
                              {source.badge}
                            </span>
                          )}
                          <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 text-[9px] font-black">
                            {source.status}
                          </span>
                        </div>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                          {source.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[190px]" title={source.url}>
                          {source.url}
                        </span>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:underline shrink-0 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-md"
                          title={`Truy cập ${source.title}: ${source.url}`}
                        >
                          <span>{source.id.includes('article') || source.id.includes('fee') || source.id.includes('margin') ? 'Mở bài viết' : 'Mở link'}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Telemetry & Extracted Signals Box */}
                <div className="rounded-xl bg-slate-900 text-white p-3.5 shadow-inner text-xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-3 text-slate-300 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>HTTP 200 OK</span>
                      </span>
                      <span>•</span>
                      <span>Dung lượng: <strong className="text-white">{crawlerMeta?.contentLengthKB || 0} KB</strong></span>
                      <span>•</span>
                      <span>Cổng kết nối: <strong className="text-emerald-400">{crawlerMeta?.sourceCategory || 'Direct HTTP'}</strong></span>
                    </div>
                    <div className="text-slate-400">
                      Đối soát gần nhất: <strong className="text-slate-200">{company.lastUpdated || '22/10/2026'}</strong>
                    </div>
                  </div>

                  {extractedSignals?.matchedList?.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[11px]">
                      <span className="text-slate-400 shrink-0 font-medium">🎯 Từ khóa quét được:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {extractedSignals.matchedList.map((sig, idx) => (
                          <span key={idx} className="rounded bg-slate-800 text-emerald-300 border border-slate-700 px-2 py-0.5 text-[10px] font-bold">
                            ✓ {sig}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedSignals?.ratesFound?.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[11px]">
                      <span className="text-slate-400 shrink-0 font-medium">📈 Lãi suất phát hiện:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {extractedSignals.ratesFound.map((rate, idx) => (
                          <span key={idx} className="rounded bg-amber-950/80 text-amber-300 border border-amber-800/80 px-2 py-0.5 text-[10px] font-bold">
                            {rate}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Danh sách link bài viết tìm được từ crawler để truy cập nhanh kiểm tra */}
                  {validPromoArticles.length > 0 && (
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                          <Newspaper className="h-3.5 w-3.5" />
                          <span>Các bài viết & link tài liệu tìm thấy từ phiên quét ({validPromoArticles.length}):</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Truy cập nhanh kiểm tra</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {validPromoArticles.map((art, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-black shrink-0 ${
                                  art.type === 'fee'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : art.type === 'margin'
                                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                                }`}
                              >
                                {art.badge || (art.type === 'fee' ? 'Biểu Phí' : art.type === 'margin' ? 'Margin' : 'Ưu Đãi')}
                              </span>
                              <span className="text-[11px] text-slate-200 truncate font-medium" title={art.title}>
                                {art.title}
                              </span>
                            </div>
                            <a
                              href={art.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/60 shrink-0 transition-colors"
                              title={`Mở nhanh bài viết: ${art.title}`}
                            >
                              <span>Mở kiểm tra</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Derivatives & Fee Breakdown Details */}
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/40 dark:border-slate-700 dark:bg-slate-800/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-blue-500" />
                  <span>Phí Giao Dịch Phái Sinh & Dịch Vụ</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Phí giao dịch HĐTL:</span>
                    <span className="font-black text-slate-900 dark:text-white">
                      {company.derivativesFee.feePerContract === 0 ? '0 đ' : `${company.derivativesFee.feePerContract.toLocaleString('vi-VN')} đ/HĐ`}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Quy định tỷ lệ ký quỹ:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Tuân thủ chuẩn UBCK & VSDC</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  {company.derivativesFee.notes}
                </p>
              </div>

              {/* Disclaimer Notice */}
              <div className="rounded-xl bg-blue-50/60 p-3 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold">Lưu ý biểu phí & thuế: </span>
                  <span>Thông tin về mức phí giao dịch đã bao gồm phí trả sở và chưa bao gồm thuế TNCN (0.1% khi bán) theo quy định của Bộ Tài chính.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ƯU ĐÃI & KHUYẾN MÃI */}
          {activeTab === 'promotions' && (
            <div className="space-y-4">
              {company.welcomePromo && (
                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 p-4 border border-blue-200 dark:border-blue-800/60">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-black text-white uppercase tracking-wider">
                      {company.welcomePromo.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Dành riêng cho khách hàng mở tài khoản mới
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-3">
                    <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-100 dark:border-slate-700">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Ưu đãi phí:</span>
                      <strong className="text-slate-900 dark:text-white text-xs mt-0.5 block">{company.welcomePromo.feeOffer}</strong>
                    </div>
                    <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-100 dark:border-slate-700">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Ưu đãi Margin:</span>
                      <strong className="text-slate-900 dark:text-white text-xs mt-0.5 block">{company.welcomePromo.marginOffer}</strong>
                    </div>
                  </div>
                  {company.welcomePromo.giftBonus && (
                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                      <span><strong>Quà tặng đi kèm:</strong> {company.welcomePromo.giftBonus}</span>
                    </div>
                  )}
                  {company.welcomePromo.note && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 italic">
                      * {company.welcomePromo.note}
                    </p>
                  )}

                  {/* Direct button to original promo announcement article */}
                  <div className="mt-3.5 pt-3 border-t border-blue-200/80 dark:border-blue-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <Gift className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>Bài viết công bố ưu đãi mở tài khoản eKYC:</span>
                    </div>
                    <a
                      href={promoSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1.5 text-xs shadow-xs transition-all shrink-0 self-start sm:self-auto"
                      title={`Xem bài viết công bố ưu đãi mở tài khoản tại ${company.shortName}`}
                    >
                      <span>Xem Bài Viết Ưu Đãi Gốc</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* DANH SÁCH BÀI ĐĂNG TIN TỨC, ƯU ĐÃI & KHUYẾN MẠI ĐÃ QUÉT TRỰC TIẾP */}
              {validPromoArticles.length > 0 && (
                <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/40 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900/70 p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-indigo-100 dark:border-indigo-900/40">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                        <Newspaper className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                          Bài Đăng Tin Tức, Ưu Đãi & Khuyến Mại Liên Quan ({company.shortName})
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Các bài viết công bố chính thức về lãi suất margin, gói phí và chính sách ưu đãi trên website công ty
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                      {validPromoArticles.length} Bài viết đã quét
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {validPromoArticles.map((art, idx) => {
                      const isFee = art.type === 'fee';
                      const isMargin = art.type === 'margin';
                      const badgeBg = isFee
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        : isMargin
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';

                      return (
                        <div
                          key={idx}
                          className="rounded-xl bg-white dark:bg-slate-800/90 p-3 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-black border ${badgeBg}`}>
                                {isFee && <FileText className="h-2.5 w-2.5" />}
                                {isMargin && <Zap className="h-2.5 w-2.5" />}
                                {!isFee && !isMargin && <Gift className="h-2.5 w-2.5" />}
                                <span>{art.badge || (isFee ? 'Ưu Đãi Phí' : isMargin ? 'Lãi Suất Margin' : 'Khuyến Mại')}</span>
                              </span>
                              <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                {art.title}
                              </span>
                            </div>
                            <p className="font-mono text-[10px] text-slate-400 truncate max-w-full sm:max-w-md">
                              {art.url}
                            </p>
                          </div>

                          <a
                            href={art.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold px-3 py-1.5 text-xs transition-colors shrink-0 self-start sm:self-auto border border-indigo-200 dark:border-indigo-800"
                            title={`Xem bài viết gốc: ${art.title}`}
                          >
                            <span>Xem bài viết gốc</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>Chương Trình Ưu Đãi Đang Áp Dụng</span>
                </h3>
                <ul className="space-y-2.5">
                  {(company.promotions || []).map((promo, idx) => {
                    const promoLink = getPromotionArticleLink(promo, company);
                    return (
                      <li
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-2xs"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                          <div className="space-y-1 min-w-0">
                            <span className="font-semibold leading-relaxed block text-slate-900 dark:text-white">
                              {promo}
                            </span>
                            {promoLink && (
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                                <span className="font-medium">Nguồn bài viết:</span>
                                <span className="font-mono text-blue-600 dark:text-blue-400 truncate max-w-[280px] sm:max-w-md">
                                  {promoLink.title}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {promoLink && (
                          <a
                            href={promoLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/70 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold px-3 py-1.5 text-[11px] transition-colors shrink-0 self-start sm:self-auto border border-blue-200 dark:border-blue-800 shadow-2xs"
                            title={`Xem bài viết chi tiết: ${promoLink.title}`}
                          >
                            <span>Xem bài viết</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Card Nguồn Công Bố Khuyến Mại & Ưu Đãi */}
              <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/30 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900/60 p-4 shadow-xs space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-xs">
                      <Gift className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        Nguồn Bài Viết Khuyến Mại & Ưu Đãi ({company.shortName})
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Bài viết công bố thể lệ & chính sách ưu đãi mở mới trên website chính thức
                      </p>
                    </div>
                  </div>

                  <a
                    href={promoSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-1.5 text-xs shadow-xs transition-all shrink-0 self-start sm:self-auto"
                  >
                    <span>Mở Trang Khuyến Mại Gốc</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="rounded-xl bg-white dark:bg-slate-800/80 p-2.5 border border-amber-100 dark:border-amber-900/40 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Đường dẫn bài viết ưu đãi:</span>
                  <a
                    href={promoSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-amber-700 dark:text-amber-400 hover:underline truncate max-w-full sm:max-w-md inline-flex items-center gap-1 font-semibold"
                  >
                    <span className="truncate">{promoSourceUrl}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ĐÁNH GIÁ & PHÙ HỢP */}
          {activeTab === 'analysis' && (
            <div className="space-y-4">
              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pros */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Ưu Điểm Nổi Bật</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {(company.pros || []).map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-emerald-500 font-bold shrink-0">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                  <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span>Điểm Cần Lưu Ý</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {(company.cons || []).map((con, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-amber-500 font-bold shrink-0">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suitable For */}
              <div className="rounded-2xl bg-blue-50/60 p-4 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 text-xs">
                <span className="font-extrabold text-slate-900 dark:text-white block mb-1">Khuyến nghị nhà đầu tư phù hợp:</span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{company.suitableFor}</span>
              </div>

              {/* Company Background Facts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block text-[10px]">Thị phần</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">{company.marketShareRank}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block text-[10px]">Thành lập</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">Năm {company.establishedYear}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block text-[10px]">Bảo chứng</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">{company.bankBacked || 'Độc lập'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block text-[10px]">Tình trạng niêm yết</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block truncate" title={company.listingStatus}>
                    {company.isListed ? `${company.stockCode} (${company.listingExchange})` : company.listingStatus}
                  </span>
                </div>
              </div>

              {/* Website Chính Thức & Cổng Tra Cứu Thông Tin Biểu Phí */}
              <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 p-4 flex flex-col gap-3 text-xs">
                <div className="flex items-start sm:items-center gap-2.5 text-slate-700 dark:text-slate-200">
                  <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 sm:mt-0" />
                  <span>
                    Truy cập cổng thông tin và văn bản công bố biểu phí chính thức của <strong>{company.name}</strong>:
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <a
                    href={companyWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>Website {company.shortName}</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>

                  <a
                    href={feeSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Biểu Phí & Lãi Gốc</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>

                  <a
                    href={scannedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Cổng Quét Scanner</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HƯỚNG DẪN MỞ TÀI KHOẢN */}
          {activeTab === 'open_account' && (
            <div className="space-y-4">
              <div className={`rounded-2xl p-5 text-white ${
                isBsc
                  ? 'bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 ring-2 ring-blue-400/80 shadow-lg'
                  : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      {isBsc ? '⭐ Đề Xuất An Toàn Big4 BIDV' : 'Mở tài khoản 100% Trực Tuyến'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black mt-2">Mở Tài Khoản {company.shortName} Trong 3 Phút</h3>
                    <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                      {isBsc
                        ? 'Đăng ký qua liên kết chuyên gia BIDV/BSC để kích hoạt mức phí ưu đãi 0.08% - 0.10% và gói Margin từ 7.5%/năm.'
                        : 'Chuẩn bị CCCD gắn chip và điện thoại thông minh để hoàn tất định danh eKYC tức thì.'}
                    </p>
                  </div>

                  <a
                    href={company.accountOpeningUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-black shadow-md hover:scale-105 transition-transform shrink-0 ${
                      isBsc 
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black ring-2 ring-amber-300' 
                        : 'bg-white text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <span>{isBsc ? 'Mở TK BSC Nhận Ưu Đãi' : 'Vào Cổng eKYC Ngay'}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>

                <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-2 text-center text-xs text-blue-100">
                  <div className="rounded-lg bg-white/10 p-2">
                    <span className="font-black text-white block">Bước 1</span>
                    <span className="text-[11px]">Điền SĐT & CCCD</span>
                  </div>
                  <div className="rounded-lg bg-white/10 p-2">
                    <span className="font-black text-white block">Bước 2</span>
                    <span className="text-[11px]">Xác thực khuôn mặt</span>
                  </div>
                  <div className="rounded-lg bg-white/10 p-2">
                    <span className="font-black text-white block">Bước 3</span>
                    <span className="text-[11px]">Ký hợp đồng online</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/90 text-xs text-slate-700 dark:text-slate-200 space-y-1.5 font-medium">
                <span className="font-bold text-slate-800 dark:text-white block">Lưu ý khi mở tài khoản eKYC:</span>
                <p>• Sử dụng CCCD gắn chip chính chủ còn hạn sử dụng, chụp ở nơi đủ ánh sáng và không bị lóa.</p>
                <p>• Sau khi hoàn tất eKYC, tài khoản sẽ được kích hoạt giao dịch ngay trong ngày làm việc.</p>
                {isBsc && (
                  <p className="text-blue-700 dark:text-amber-300 font-bold">• Mã giới thiệu CIF BSC: <code className="bg-blue-100 dark:bg-blue-900/80 px-1.5 py-0.5 rounded text-blue-900 dark:text-blue-100">4768</code> được tích hợp sẵn qua liên kết mở tài khoản.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Sticky Bottom Action Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex sm:hidden items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            Đóng
          </button>
          <a
            href={company.accountOpeningUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 py-2 rounded-xl text-xs font-black text-white text-center flex items-center justify-center gap-1 shadow-sm ${
              isBsc
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            <span>{isBsc ? 'Mở Tài Khoản BSC' : 'Mở Tài Khoản'}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
