import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Search, 
  Filter, 
  Gift, 
  Zap, 
  FileText, 
  ExternalLink, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Layers,
  ArrowUpDown,
  Building2,
  Percent
} from 'lucide-react';
import { extractAllPromotions, downloadPromotionsCsv } from '../utils/promotionsExtractor';

export default function PromotionsSummaryTable({
  companies = [],
  onSelectDetail
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'fee' | 'margin' | 'welcome'
  const [selectedBroker, setSelectedBroker] = useState('all');
  const [sortField, setSortField] = useState('company'); // 'company' | 'program' | 'duration'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Trích xuất toàn bộ danh mục khuyến mãi & ưu đãi từ dữ liệu hiện hành
  const allPromotions = useMemo(() => {
    return extractAllPromotions(companies);
  }, [companies]);

  // Danh sách các công ty để đưa vào bộ lọc dropdown
  const uniqueBrokers = useMemo(() => {
    const map = new Map();
    allPromotions.forEach(p => {
      if (!map.has(p.companyId)) {
        map.set(p.companyId, { id: p.companyId, shortName: p.companyShortName, name: p.companyName });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.shortName.localeCompare(b.shortName));
  }, [allPromotions]);

  // Bộ lọc tìm kiếm và phân loại
  const filteredPromotions = useMemo(() => {
    return allPromotions.filter(item => {
      // 1. Tìm kiếm văn bản
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        item.programName.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.companyShortName.toLowerCase().includes(q) ||
        item.companyName.toLowerCase().includes(q) ||
        (item.stockCode && item.stockCode.toLowerCase().includes(q)) ||
        item.feeOffer.toLowerCase().includes(q) ||
        item.interestOffer.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // 2. Lọc theo danh mục ưu đãi
      if (selectedCategory === 'fee') {
        const isFee = item.category === 'fee' || 
          (!item.feeOffer.includes('Không áp dụng') && !item.feeOffer.includes('Theo biểu phí chuẩn'));
        if (!isFee) return false;
      }
      if (selectedCategory === 'margin') {
        const isMargin = item.category === 'margin' || 
          (!item.interestOffer.includes('Không áp dụng') && !item.interestOffer.includes('Theo biểu lãi chuẩn'));
        if (!isMargin) return false;
      }
      if (selectedCategory === 'welcome') {
        if (item.category !== 'welcome') return false;
      }

      // 3. Lọc theo CTCK
      if (selectedBroker !== 'all' && item.companyId !== selectedBroker) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortField === 'company') {
        const cmp = a.companyShortName.localeCompare(b.companyShortName);
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      if (sortField === 'program') {
        const cmp = a.programName.localeCompare(b.programName);
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
  }, [allPromotions, searchQuery, selectedCategory, selectedBroker, sortField, sortOrder]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    return {
      total: allPromotions.length,
      feeCount: allPromotions.filter(p => p.category === 'fee' || (!p.feeOffer.includes('Không áp dụng') && !p.feeOffer.includes('Theo biểu phí chuẩn'))).length,
      marginCount: allPromotions.filter(p => p.category === 'margin' || (!p.interestOffer.includes('Không áp dụng') && !p.interestOffer.includes('Theo biểu lãi chuẩn'))).length,
      welcomeCount: allPromotions.filter(p => p.category === 'welcome').length
    };
  }, [allPromotions]);

  // Xử lý xuất file CSV
  const handleExportCsv = () => {
    downloadPromotionsCsv(filteredPromotions);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      
      {/* Banner Tiêu Đề & Thống Kê Tổng Hợp */}
      <div className="rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-3 py-1 text-xs font-black uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Bảng Tổng Hợp Ưu Đãi Đang Áp Dụng (30 CTCK)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Tóm Tắt Toàn Bộ Chương Trình Khuyến Mãi, Ưu Đãi Phí & Lãi Suất
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Tổng hợp chi tiết thể lệ, ưu đãi mức phí, ưu đãi lãi vay ký quỹ, thời gian áp dụng và lưu ý quan trọng. Toàn bộ 100% dữ liệu được liên kết trực tiếp với bài viết nguồn công bố chính thức.
            </p>
          </div>

          {/* Nút Xuất CSV Nổi Bật */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black px-4 sm:px-5 py-3 text-xs sm:text-sm shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all transform active:scale-95"
              title="Xuất toàn bộ bảng tóm tắt ưu đãi ra file CSV tương thích Microsoft Excel tiếng Việt"
            >
              <Download className="h-4 w-4" />
              <span>Xuất File CSV (Excel)</span>
            </button>
          </div>
        </div>

        {/* Thông báo tải thành công */}
        {downloadSuccess && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-bold animate-fade-in border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="h-4 w-4" />
            <span>Đã xuất thành công file CSV bảng tổng hợp ưu đãi! Bạn có thể mở trực tiếp trong Excel.</span>
          </div>
        )}

        {/* Thống kê nhanh dạng thẻ */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">Tổng chương trình:</span>
            <strong className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5 block">
              {stats.total} ưu đãi
            </strong>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 shadow-2xs">
            <span className="text-emerald-700 dark:text-emerald-300 block text-[11px] font-medium flex items-center gap-1">
              <Percent className="h-3 w-3" />
              Ưu đãi phí giao dịch:
            </span>
            <strong className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5 block">
              {stats.feeCount} chương trình
            </strong>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 shadow-2xs">
            <span className="text-blue-700 dark:text-blue-300 block text-[11px] font-medium flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Ưu đãi lãi suất margin:
            </span>
            <strong className="text-lg sm:text-xl font-black text-blue-700 dark:text-blue-300 mt-0.5 block">
              {stats.marginCount} chương trình
            </strong>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 shadow-2xs">
            <span className="text-amber-700 dark:text-amber-300 block text-[11px] font-medium flex items-center gap-1">
              <Gift className="h-3 w-3" />
              Ưu đãi mở mới eKYC:
            </span>
            <strong className="text-lg sm:text-xl font-black text-amber-700 dark:text-amber-300 mt-0.5 block">
              {stats.welcomeCount} chương trình
            </strong>
          </div>
        </div>
      </div>

      {/* Thanh Bộ Lọc & Tìm Kiếm Nhanh */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Ô tìm kiếm */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm chương trình, tên công ty (BSC, VPS, SSI...), ưu đãi phí, lãi suất..."
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdown Lọc Theo Công Ty */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
              Công ty:
            </label>
            <select
              value={selectedBroker}
              onChange={(e) => setSelectedBroker(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tất cả 30 CTCK ({allPromotions.length} ưu đãi)</option>
              {uniqueBrokers.map(b => (
                <option key={b.id} value={b.id}>
                  {b.shortName} - {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nút Lọc Phân Loại Ưu Đãi (Pills) */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Lọc theo:
            </span>

            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Tất cả ({allPromotions.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('fee')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedCategory === 'fee'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100'
              }`}
            >
              Ưu đãi phí ({stats.feeCount})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('margin')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedCategory === 'margin'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100'
              }`}
            >
              Ưu đãi lãi Margin ({stats.marginCount})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('welcome')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedCategory === 'welcome'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
              }`}
            >
              Mở tài khoản eKYC ({stats.welcomeCount})
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Hiển thị <strong>{filteredPromotions.length}</strong> / {allPromotions.length} chương trình
          </div>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU TỔNG HỢP (DESKTOP & TABLET VIEW) */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 text-[11px] font-black uppercase tracking-wider">
                <th className="py-3.5 px-3 w-12 text-center">STT</th>
                <th className="py-3.5 px-4 w-44">Công ty</th>
                <th className="py-3.5 px-4 min-w-[200px]">Tên chương trình</th>
                <th className="py-3.5 px-4 min-w-[220px]">Nội dung tóm tắt</th>
                <th className="py-3.5 px-4 w-44">Ưu đãi phí</th>
                <th className="py-3.5 px-4 w-44">Ưu đãi lãi suất</th>
                <th className="py-3.5 px-3 w-36">Thời gian</th>
                <th className="py-3.5 px-4 min-w-[180px]">Lưu ý</th>
                <th className="py-3.5 px-3 w-28 text-center">Nguồn gốc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredPromotions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    Không tìm thấy chương trình ưu đãi nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredPromotions.map((promo, idx) => {
                  const isBsc = promo.companyId === 'bsc';
                  const compObj = companies.find(c => c.id === promo.companyId);

                  return (
                    <tr 
                      key={promo.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors ${
                        isBsc ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      {/* STT */}
                      <td className="py-3 px-3 text-center font-mono text-slate-400 text-[11px]">
                        {idx + 1}
                      </td>

                      {/* Công ty */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="h-8 w-8 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-2xs cursor-pointer hover:opacity-90"
                            style={{ backgroundColor: promo.brandColor }}
                            onClick={() => onSelectDetail && compObj && onSelectDetail(compObj)}
                            title={`Xem chi tiết ${promo.companyName}`}
                          >
                            {promo.companyShortName.slice(0, 3)}
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => onSelectDetail && compObj && onSelectDetail(compObj)}
                              className="font-extrabold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-left truncate block"
                            >
                              {promo.companyShortName}
                            </button>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {promo.stockCode ? `Mã: ${promo.stockCode}` : 'Chưa niêm yết'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Tên chương trình */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <strong className="text-slate-900 dark:text-white font-bold leading-snug block">
                            {promo.programName}
                          </strong>
                          <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${
                            promo.category === 'fee'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : promo.category === 'margin'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {promo.badge}
                          </span>
                        </div>
                      </td>

                      {/* Nội dung tóm tắt */}
                      <td className="py-3 px-4 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {promo.summary}
                      </td>

                      {/* Ưu đãi phí */}
                      <td className="py-3 px-4">
                        {promo.feeOffer.includes('Không áp dụng') || promo.feeOffer.includes('Theo biểu phí chuẩn') ? (
                          <span className="text-slate-400 text-[11px] italic">
                            {promo.feeOffer}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                            {promo.feeOffer}
                          </span>
                        )}
                      </td>

                      {/* Ưu đãi lãi */}
                      <td className="py-3 px-4">
                        {promo.interestOffer.includes('Không áp dụng') || promo.interestOffer.includes('Theo biểu lãi chuẩn') ? (
                          <span className="text-slate-400 text-[11px] italic">
                            {promo.interestOffer}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 px-2 py-1 text-[11px] font-bold text-blue-800 dark:text-blue-300">
                            {promo.interestOffer}
                          </span>
                        )}
                      </td>

                      {/* Thời gian chương trình */}
                      <td className="py-3 px-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 shrink-0 text-slate-400" />
                          <span>{promo.duration}</span>
                        </div>
                      </td>

                      {/* Lưu ý */}
                      <td className="py-3 px-4 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                        {promo.notes}
                      </td>

                      {/* Nguồn link kiểm chứng */}
                      <td className="py-3 px-3 text-center">
                        <a
                          href={promo.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] transition-colors border border-indigo-200 dark:border-indigo-800"
                          title={`Xem bài viết gốc: ${promo.sourceUrl}`}
                        >
                          <span>Mở bài</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DẠNG THẺ TRÊN THIẾT BỊ DI ĐỘNG (MOBILE CARDS VIEW) */}
      <div className="space-y-3 md:hidden">
        {filteredPromotions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            Không tìm thấy chương trình ưu đãi nào phù hợp.
          </div>
        ) : (
          filteredPromotions.map((promo, idx) => (
            <div 
              key={promo.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="h-8 w-8 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-2xs"
                    style={{ backgroundColor: promo.brandColor }}
                  >
                    {promo.companyShortName.slice(0, 3)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-xs">
                      {promo.companyShortName}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {promo.stockCode ? `Mã: ${promo.stockCode}` : 'Chưa niêm yết'}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                  promo.category === 'fee'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : promo.category === 'margin'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {promo.badge}
                </span>
              </div>

              <div>
                <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                  {promo.programName}
                </strong>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {promo.summary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Ưu đãi phí:</span>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block mt-0.5">
                    {promo.feeOffer}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Ưu đãi lãi:</span>
                  <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 block mt-0.5">
                    {promo.interestOffer}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 shrink-0 text-slate-400" />
                  <span>{promo.duration}</span>
                </div>
                <p className="italic text-[10px] text-slate-400">
                  * {promo.notes}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-mono text-[9px] text-slate-400 truncate max-w-[200px]">
                  {promo.sourceUrl}
                </span>
                <a
                  href={promo.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs"
                >
                  <span>Mở bài viết</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
