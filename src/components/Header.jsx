import React from 'react';
import { 
  ShieldCheck, 
  Moon, 
  Sun, 
  Github, 
  BarChart3, 
  Calculator, 
  Award, 
  Sparkles, 
  Database,
  Lock,
  LogOut,
  UserCheck,
  Menu,
  X,
  RefreshCw
} from 'lucide-react';

export default function Header({ 
  darkMode, 
  setDarkMode, 
  scrollToSection, 
  activeTab = 'existing',
  onSelectTab,
  onOpenFeedback, 
  onOpenDataManager,
  onOpenCrawler,
  currentUser,
  onLogoutAdmin,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  unreadFeedbackCount = 0
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1580px] items-center justify-between px-3 sm:px-6 lg:px-8 xl:px-10 gap-2">
        {/* Logo & Brand */}
        <div 
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer shrink-0" 
          onClick={() => scrollToSection('top')}
        >
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20">
            <BarChart3 className="h-4.5 w-4.5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                So Sánh <span className="text-blue-600 dark:text-blue-400">Chi Phí GD</span>
              </span>
              <span className="hidden xl:inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 whitespace-nowrap">
                30 CTCK
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap truncate max-w-[280px]">
              Dữ liệu biểu phí & margin 30 CTCK Việt Nam
            </p>
          </div>
        </div>

        {/* Desktop Navigation links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5 xl:gap-3 text-xs lg:text-sm font-semibold text-slate-600 dark:text-slate-300 shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab ? onSelectTab('existing') : scrollToSection('comparison-table')}
            className={`transition-all flex items-center gap-1.5 whitespace-nowrap py-1.5 px-2.5 rounded-xl font-bold ${
              activeTab === 'existing'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 shadow-2xs ring-1 ring-blue-200 dark:ring-blue-800'
                : 'hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Award className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span>So Sánh</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab ? onSelectTab('short_term_margin') : scrollToSection('comparison-table')}
            className={`transition-all flex items-center gap-1 whitespace-nowrap py-1.5 px-2.5 rounded-xl font-bold ${
              activeTab === 'short_term_margin'
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 shadow-2xs ring-1 ring-amber-200 dark:ring-amber-800'
                : 'hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="text-amber-500 font-black">⚡</span>
            <span>Margin T+</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab ? onSelectTab('promotions_summary') : scrollToSection('comparison-table')}
            className={`transition-all flex items-center gap-1.5 whitespace-nowrap py-1.5 px-2.5 rounded-xl font-bold ${
              activeTab === 'promotions_summary'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 shadow-2xs ring-1 ring-emerald-200 dark:ring-emerald-800'
                : 'hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="rounded-full bg-emerald-500 text-white text-[9px] px-1 font-black">CSV</span>
            <span>Tổng Hợp Ưu Đãi</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab ? onSelectTab('calculator') : scrollToSection('calculator-section')}
            className={`transition-all flex items-center gap-1.5 whitespace-nowrap py-1.5 px-2.5 rounded-xl font-bold ${
              activeTab === 'calculator'
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 shadow-2xs ring-1 ring-teal-200 dark:ring-teal-800'
                : 'hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="h-3.5 w-3.5 text-teal-500 shrink-0" />
            <span>Mô Phỏng Chi Phí</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab ? onSelectTab('ai_insights') : scrollToSection('ai-advisor-section')}
            className={`transition-all flex items-center gap-1.5 whitespace-nowrap py-1.5 px-2.5 rounded-xl font-bold ${
              activeTab === 'ai_insights'
                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 shadow-2xs ring-1 ring-purple-200 dark:ring-purple-800'
                : 'hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-500 shrink-0" />
            <span>Gợi Ý AI</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab ? onSelectTab('guide') : scrollToSection('faq-section')}
            className={`transition-all flex items-center gap-1.5 whitespace-nowrap py-1.5 px-2.5 rounded-xl font-bold ${
              activeTab === 'guide'
                ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-100 shadow-2xs'
                : 'hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span>Tiêu Chí</span>
          </button>

          {/* Live Web Crawler & Fee Sync Button */}
          <button
            type="button"
            onClick={onOpenCrawler}
            className="transition-all flex items-center gap-1.5 whitespace-nowrap py-1 px-2.5 rounded-lg text-xs font-bold border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/70 shadow-2xs hover:scale-105 active:scale-95"
            title="Mở bảng điều khiển quét & crawl dữ liệu biểu phí live 30 CTCK"
          >
            <RefreshCw className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Quét Dữ Liệu</span>
          </button>

          {/* Data Management with Admin Auth Badge */}
          <button
            onClick={onOpenDataManager}
            className={`transition-all flex items-center gap-1.5 whitespace-nowrap py-1 px-2 rounded-lg text-xs font-bold border ${
              currentUser
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'border-slate-200 hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:text-slate-300 dark:hover:border-blue-700'
            }`}
            title={currentUser ? "Bạn đang đăng nhập quyền Quản trị viên" : "Yêu cầu đăng nhập Quản trị viên để chỉnh sửa"}
          >
            {currentUser ? (
              <>
                <Database className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Dữ Liệu (Admin)</span>
                {unreadFeedbackCount > 0 && (
                  <span className="ml-1 rounded-full bg-rose-500 text-white px-1.5 py-0.2 text-[9px] font-black leading-none animate-pulse">
                    {unreadFeedbackCount}
                  </span>
                )}
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>Dữ Liệu</span>
              </>
            )}
          </button>
        </nav>

        {/* Right actions: Theme toggle, Admin status, GitHub, CTA & Mobile Hamburger */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Admin user indicator if logged in */}
          {currentUser && (
            <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/70 dark:border-emerald-800 dark:text-emerald-300">
              <UserCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600 shrink-0" />
              <span className="truncate max-w-[80px] sm:max-w-[120px]">Admin</span>
              <button
                type="button"
                onClick={onLogoutAdmin}
                className="ml-0.5 text-slate-400 hover:text-rose-600 transition-colors"
                title="Đăng xuất quyền quản trị"
              >
                <LogOut className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Theme switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg p-1.5 sm:p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors shrink-0"
            title={darkMode ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />}
          </button>

          <a
            href="https://github.com/kiennt701/so-sanh-phi-giao-dich"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>

          <button
            onClick={() => scrollToSection('comparison-table')}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-all whitespace-nowrap shrink-0"
          >
            Mở Tài Khoản
          </button>

          {/* Mobile Hamburger Menu Button */}
          {setIsMobileMenuOpen && (
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 text-blue-600" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
