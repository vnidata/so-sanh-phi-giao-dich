import React from 'react';
import { 
  Table, 
  Zap, 
  Gift, 
  FileSpreadsheet, 
  Calculator, 
  Sparkles, 
  ShieldCheck,
  LayoutGrid,
  ScrollText,
  Layers
} from 'lucide-react';

export const NAVIGATION_TABS = [
  {
    id: 'existing',
    label: 'Biểu Phí Chuẩn 90 Ngày',
    shortLabel: 'Phí Chuẩn',
    description: 'Biểu phí giao dịch & margin tiêu chuẩn 30 CTCK',
    icon: Table,
    badge: '30 CTCK',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    colorClass: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'short_term_margin',
    label: 'Margin Ngắn Ngày (T+)',
    shortLabel: 'Margin T+',
    description: 'Các gói lướt sóng T+3, T+5, T+10, Deal mã ưu đãi',
    icon: Zap,
    badge: '⚡ Từ 5.99%',
    badgeColor: 'bg-amber-400 text-amber-950',
    colorClass: 'from-amber-500 to-orange-500'
  },
  {
    id: 'welcome_promo',
    label: 'Ưu Đãi Mở Mới eKYC',
    shortLabel: 'Ưu Đãi Mở Mới',
    description: 'Gói miễn phí 3-6 tháng, cashback & quà tặng tài khoản mới',
    icon: Gift,
    badge: '🔥 HOT Deals',
    badgeColor: 'bg-red-500 text-white',
    colorClass: 'from-rose-500 to-pink-600'
  },
  {
    id: 'promotions_summary',
    label: 'Tổng Hợp Khuyến Mại',
    shortLabel: 'Tổng Hợp & CSV',
    description: 'Bảng tóm tắt 86 ưu đãi đầy đủ 7 trường + Xuất file CSV Excel',
    icon: FileSpreadsheet,
    badge: '⚡ Xuất CSV',
    badgeColor: 'bg-emerald-500 text-white',
    colorClass: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'calculator',
    label: 'Mô Phỏng Chi Phí',
    shortLabel: 'Máy Tính Phí',
    description: 'Dự tính chi phí thực tế theo quy mô vốn & tần suất giao dịch',
    icon: Calculator,
    badge: '🧮 Tương tác',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
    colorClass: 'from-teal-600 to-emerald-600'
  },
  {
    id: 'ai_insights',
    label: 'AI Cố Vấn & Thị Trường',
    shortLabel: 'AI Cố Vấn',
    description: 'Khuyến nghị theo 4 gu đầu tư & Key Points thị trường 2026',
    icon: Sparkles,
    badge: '✨ Smart AI',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    colorClass: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'guide',
    label: 'Cẩm Nang & Tiêu Chí',
    shortLabel: 'Cẩm Nang',
    description: '4 Chân dung nhà đầu tư, bẫy phí cần tránh & FAQ',
    icon: ShieldCheck,
    badge: '📖 Hướng dẫn',
    badgeColor: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    colorClass: 'from-slate-700 to-slate-900'
  }
];

export default function MasterNavigationTabs({
  activeTab = 'existing',
  setActiveTab,
  viewLayout = 'tabbed', // 'tabbed' | 'all'
  setViewLayout,
  scrollToWorkspace
}) {
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (viewLayout === 'all' && scrollToWorkspace) {
      scrollToWorkspace(tabId);
    }
  };

  return (
    <div className="sticky top-14 sm:top-16 z-30 w-full transition-all duration-200">
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 sm:p-2 shadow-md shadow-slate-200/50 dark:shadow-black/40">
        
        {/* Top bar on Mobile/Tablet: Active tab indicator & Layout mode toggle */}
        <div className="flex items-center justify-between gap-2 px-1.5 pb-1.5 sm:pb-2 border-b border-slate-100 dark:border-slate-800/80 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Chế Độ: <strong className="text-slate-900 dark:text-white font-extrabold">{NAVIGATION_TABS.find(t => t.id === activeTab)?.label}</strong>
            </span>
          </div>

          {/* Layout Display Switcher: Tabbed vs Full Continuous View */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-[10px] sm:text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setViewLayout('tabbed')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                  viewLayout === 'tabbed'
                    ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400 font-black'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Hiển thị gọn gàng theo từng tab tính năng (Khuyên dùng)"
              >
                <Layers className="h-3 w-3" />
                <span className="hidden sm:inline">Từng Tab</span>
                <span className="sm:hidden">Tab</span>
              </button>

              <button
                type="button"
                onClick={() => setViewLayout('all')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                  viewLayout === 'all'
                    ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400 font-black'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Hiển thị cuộn dọc toàn diện tất cả các khối trên cùng một trang"
              >
                <ScrollText className="h-3 w-3" />
                <span className="hidden sm:inline">Xem Tất Cả</span>
                <span className="sm:hidden">Cuộn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable Tabs List with Custom Scrollbar */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none pb-0.5 -mx-0.5 px-0.5">
          {NAVIGATION_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={`group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-200 shrink-0 select-none ${
                  isActive
                    ? 'bg-gradient-to-r text-white shadow-md shadow-blue-500/20 scale-[1.01] ' + tab.colorClass
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white border border-slate-200/70 dark:border-slate-700/60'
                }`}
                title={tab.description}
              >
                <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                }`} />

                <span className="hidden lg:inline">{tab.label}</span>
                <span className="lg:hidden">{tab.shortLabel}</span>

                {/* Counter / Feature Tag */}
                <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 shadow-2xs ${
                  isActive
                    ? 'bg-white/20 text-white backdrop-blur-xs border border-white/20'
                    : tab.badgeColor
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
