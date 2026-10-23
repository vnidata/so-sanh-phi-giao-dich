import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MasterNavigationTabs from './components/MasterNavigationTabs';
import FilterBar from './components/FilterBar';
import SecuritiesTable from './components/SecuritiesTable';
import SecuritiesCards from './components/SecuritiesCards';
import WelcomePromoComparator from './components/WelcomePromoComparator';
import ShortTermMarginComparator from './components/ShortTermMarginComparator';
import PromotionsSummaryTable from './components/PromotionsSummaryTable';
import CostCalculator from './components/CostCalculator';
import SmartInsightsHub from './components/SmartInsightsHub';
import HeadToHeadModal from './components/HeadToHeadModal';
import CompanyDetailModal from './components/CompanyDetailModal';
import FeedbackModal from './components/FeedbackModal';
import CriteriaGuide from './components/CriteriaGuide';
import DataManagementModal from './components/DataManagementModal';
import LiveCrawlerModal from './components/LiveCrawlerModal';
import GoogleAuthModal from './components/GoogleAuthModal';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import { SECURITIES_COMPANIES } from './data/securitiesData';
import { getCurrentUser, logoutAdmin } from './utils/auth';
import { getStoredFeedbacks } from './utils/feedbackStorage';

export default function App() {
  // Authentication & Admin Authorization state
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Dynamic Companies Data state (supports manual overrides & in-app updates)
  const [companiesData, setCompaniesData] = useState(() => {
    try {
      const saved = localStorage.getItem('vietsec_custom_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Lỗi khi nạp dữ liệu tùy chỉnh:', e);
    }
    return SECURITIES_COMPANIES;
  });

  const handleApplyOverrides = (newData) => {
    setCompaniesData(newData);
    try {
      localStorage.setItem('vietsec_custom_data', JSON.stringify(newData));
    } catch (e) {
      console.error('Lỗi khi lưu dữ liệu:', e);
    }
  };

  const handleResetToDefault = () => {
    setCompaniesData(SECURITIES_COMPANIES);
    localStorage.removeItem('vietsec_custom_data');
  };

  // Primary Active Workspace Tab:
  // 'existing' | 'short_term_margin' | 'welcome_promo' | 'promotions_summary' | 'calculator' | 'ai_insights' | 'guide'
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['existing', 'short_term_margin', 'welcome_promo', 'promotions_summary', 'calculator', 'ai_insights', 'guide'];
      if (validTabs.includes(hash)) return hash;
    }
    return 'existing';
  });

  // Display Layout: 'tabbed' (gọn gàng theo từng tab - khuyên dùng) | 'all' (cuộn dọc xem tất cả)
  const [viewLayout, setViewLayout] = useState('tabbed');

  // URL Hash synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['existing', 'short_term_margin', 'welcome_promo', 'promotions_summary', 'calculator', 'ai_insights', 'guide'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tabId}`);
    }
    if (viewLayout === 'all') {
      scrollToSection(tabId);
    } else {
      scrollToSection('main-workspace');
    }
  };

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'cards';
    }
    return 'table';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Comparison & Detail Modals state
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [activeCompanyDetail, setActiveCompanyDetail] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);
  const [isCrawlerModalOpen, setIsCrawlerModalOpen] = useState(false);

  // Feedback Inbox state
  const [feedbacks, setFeedbacks] = useState(() => getStoredFeedbacks());

  useEffect(() => {
    const handleSyncFeedbacks = () => {
      setFeedbacks(getStoredFeedbacks());
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('vietsec_feedback_updated', handleSyncFeedbacks);
      window.addEventListener('storage', handleSyncFeedbacks);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('vietsec_feedback_updated', handleSyncFeedbacks);
        window.removeEventListener('storage', handleSyncFeedbacks);
      }
    };
  }, []);

  // Đếm số lượng góp ý mới chưa xử lý
  const unreadFeedbackCount = useMemo(() => feedbacks.filter(f => f.status === 'new').length, [feedbacks]);

  // Filtered companies calculation for existing clients standard rates
  const filteredCompanies = useMemo(() => {
    return companiesData.filter((company) => {
      // 1. Text Search matching
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        company.shortName.toLowerCase().includes(query) ||
        company.name.toLowerCase().includes(query) ||
        (company.stockCode && company.stockCode.toLowerCase().includes(query)) ||
        (company.listingExchange && company.listingExchange.toLowerCase().includes(query)) ||
        (company.listingStatus && company.listingStatus.toLowerCase().includes(query)) ||
        (company.parentStockCode && company.parentStockCode.toLowerCase().includes(query)) ||
        (company.bankBacked && company.bankBacked.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // 2. Category Filter matching (Existing Client Standard Rates)
      if (activeFilter === 'zero_fee') {
        return company.tradingFee.onlineMin === 0 || company.tradingFee.zeroFeeOffer;
      }
      if (activeFilter === 'low_margin') {
        return company.margin.baseRate <= 11.5;
      }
      if (activeFilter === 'bank_backed') {
        return Boolean(company.bankBacked);
      }
      if (activeFilter === 'high_leverage') {
        return (
          company.margin.maxLeverage.includes('3:7') ||
          company.margin.maxLeverage.includes('HTKD') ||
          company.margin.maxLeverage.includes('Hợp tác') ||
          company.margin.maxLeverage.includes('Deal')
        );
      }

      return true;
    });
  }, [companiesData, searchQuery, activeFilter]);

  // Always resolve compared companies from current companiesData so admin updates are reflected
  const comparedCompanies = useMemo(() => {
    return selectedForCompare.map(sel => companiesData.find(c => c.id === sel.id) || sel);
  }, [selectedForCompare, companiesData]);

  // Always resolve active company detail from current companiesData so admin updates are reflected
  const currentDetailCompany = useMemo(() => {
    if (!activeCompanyDetail) return null;
    return companiesData.find(c => c.id === activeCompanyDetail.id) || activeCompanyDetail;
  }, [activeCompanyDetail, companiesData]);

  // Handle comparison selection
  const handleToggleCompare = (company) => {
    if (selectedForCompare.some((c) => c.id === company.id)) {
      setSelectedForCompare(selectedForCompare.filter((c) => c.id !== company.id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('Bạn chỉ có thể chọn tối đa 3 công ty chứng khoán để so sánh đối đầu cùng lúc.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, company]);
    }
  };

  const handleRemoveFromCompare = (companyId) => {
    setSelectedForCompare(selectedForCompare.filter((c) => c.id !== companyId));
  };

  const handleClearCompare = () => {
    setSelectedForCompare([]);
  };

  const handleOpenCompareModal = () => {
    if (selectedForCompare.length >= 2) {
      setIsCompareModalOpen(true);
    }
  };

  // Smooth scroll handler
  const scrollToSection = (sectionId) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Admin Auth Handlers
  const handleOpenDataManager = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      setIsDataManagerOpen(true);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsDataManagerOpen(true);
  };

  const handleLogoutAdmin = () => {
    logoutAdmin();
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Header Navigation */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        scrollToSection={scrollToSection}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        onOpenDataManager={handleOpenDataManager}
        onOpenCrawler={() => setIsCrawlerModalOpen(true)}
        currentUser={currentUser}
        onLogoutAdmin={handleLogoutAdmin}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        unreadFeedbackCount={unreadFeedbackCount}
      />

      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        scrollToSection={scrollToSection}
        onSelectTab={handleSelectTab}
      />

      {/* Main Content Body with Optimized Responsive Width */}
      <main id="main-workspace" className="mx-auto w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1580px] min-w-0 flex-1 px-3 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-8 space-y-6 sm:space-y-8 pb-24 md:pb-12 scroll-mt-20">
        
        {/* Sticky Master Navigation Tab Bar */}
        <MasterNavigationTabs
          activeTab={activeTab}
          setActiveTab={handleSelectTab}
          viewLayout={viewLayout}
          setViewLayout={setViewLayout}
          scrollToWorkspace={scrollToSection}
        />

        {/* WORKSPACE RENDERING: TABBED VIEW (Default - Clean & Focused) */}
        {viewLayout === 'tabbed' ? (
          <div className="min-h-[500px]">
            {/* Tab 1: Biểu Phí Chuẩn 90 Ngày */}
            {activeTab === 'existing' && (
              <section id="comparison-table" className="space-y-4 sm:space-y-5 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Ma Trận Biểu Phí Chuẩn (Khách Hàng Hiện Hữu)
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      Biểu Phí Giao Dịch &amp; Lãi Suất Vay Margin Tiêu Chuẩn 90 Ngày
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Cập nhật mới nhất: <strong>Tháng 09/2026</strong>
                  </p>
                </div>

                {/* Filter Bar with Category Pills & View Mode */}
                <FilterBar
                  showModeSwitcher={false}
                  comparisonTab="existing"
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  selectedForCompare={selectedForCompare}
                  openCompareModal={handleOpenCompareModal}
                  clearCompare={handleClearCompare}
                  filteredCount={filteredCompanies.length}
                />

                {/* Table or Cards */}
                {filteredCompanies.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Không tìm thấy công ty chứng khoán nào phù hợp với bộ lọc tìm kiếm.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('all');
                      }}
                      className="mt-3 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Đặt lại bộ lọc tìm kiếm
                    </button>
                  </div>
                ) : viewMode === 'table' ? (
                  <SecuritiesTable
                    companies={filteredCompanies}
                    selectedForCompare={selectedForCompare}
                    toggleCompare={handleToggleCompare}
                    onSelectDetail={(company) => setActiveCompanyDetail(company)}
                    searchQuery={searchQuery}
                  />
                ) : (
                  <SecuritiesCards
                    companies={filteredCompanies}
                    selectedForCompare={selectedForCompare}
                    toggleCompare={handleToggleCompare}
                    onSelectDetail={(company) => setActiveCompanyDetail(company)}
                    searchQuery={searchQuery}
                  />
                )}
              </section>
            )}

            {/* Tab 2: Margin Ngắn Ngày (T+, Quick, Deal) */}
            {activeTab === 'short_term_margin' && (
              <section id="short-term-margin" className="animate-fade-in">
                <ShortTermMarginComparator
                  companies={companiesData}
                  onSelectDetail={(company) => setActiveCompanyDetail(company)}
                />
              </section>
            )}

            {/* Tab 3: Ưu Đãi Mở Mới eKYC */}
            {activeTab === 'welcome_promo' && (
              <section id="welcome-promo" className="animate-fade-in">
                <WelcomePromoComparator
                  companies={companiesData}
                  onSelectDetail={(company) => setActiveCompanyDetail(company)}
                />
              </section>
            )}

            {/* Tab 4: Bảng Tổng Hợp Khuyến Mãi (Xuất CSV) */}
            {activeTab === 'promotions_summary' && (
              <section id="promotions-summary" className="animate-fade-in">
                <PromotionsSummaryTable
                  companies={companiesData}
                  onSelectDetail={(company) => setActiveCompanyDetail(company)}
                />
              </section>
            )}

            {/* Tab 5: Mô Phỏng Chi Phí */}
            {activeTab === 'calculator' && (
              <section id="calculator-section" className="animate-fade-in">
                <CostCalculator
                  companies={companiesData}
                  onSelectDetail={(company) => setActiveCompanyDetail(company)}
                  onSwitchToPromoTab={() => handleSelectTab('welcome_promo')}
                />
              </section>
            )}

            {/* Tab 6: AI Cố Vấn & Điểm Nhấn Thị Trường */}
            {activeTab === 'ai_insights' && (
              <section id="ai-insights-section" className="animate-fade-in">
                <SmartInsightsHub
                  companies={companiesData}
                  onSelectDetail={(company) => setActiveCompanyDetail(company)}
                  onFilterByAIRecommended={(recommendedIds) => {
                    setSearchQuery('');
                    setActiveFilter('all');
                    handleSelectTab('existing');
                  }}
                />
              </section>
            )}

            {/* Tab 7: Cẩm Nang & Tiêu Chí */}
            {activeTab === 'guide' && (
              <section id="faq-section" className="animate-fade-in">
                <CriteriaGuide scrollToSection={scrollToSection} />
              </section>
            )}
          </div>
        ) : (
          /* WORKSPACE RENDERING: ALL-IN-ONE CONTINUOUS VIEW */
          <div className="space-y-10 sm:space-y-14">
            {/* 1. Comparison Matrix */}
            <section id="existing" className="scroll-mt-28 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Phần 1 • Ma Trận Biểu Phí
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Biểu Phí Giao Dịch &amp; Margin Chuẩn 90 Ngày (30 CTCK)
                  </h2>
                </div>
              </div>

              <FilterBar
                showModeSwitcher={false}
                comparisonTab="existing"
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedForCompare={selectedForCompare}
                openCompareModal={handleOpenCompareModal}
                clearCompare={handleClearCompare}
                filteredCount={filteredCompanies.length}
              />

              {viewMode === 'table' ? (
                <SecuritiesTable
                  companies={filteredCompanies}
                  selectedForCompare={selectedForCompare}
                  toggleCompare={handleToggleCompare}
                  onSelectDetail={(company) => setActiveCompanyDetail(company)}
                  searchQuery={searchQuery}
                />
              ) : (
                <SecuritiesCards
                  companies={filteredCompanies}
                  selectedForCompare={selectedForCompare}
                  toggleCompare={handleToggleCompare}
                  onSelectDetail={(company) => setActiveCompanyDetail(company)}
                  searchQuery={searchQuery}
                />
              )}
            </section>

            {/* 2. Short-Term Margin */}
            <section id="short_term_margin" className="scroll-mt-28">
              <ShortTermMarginComparator
                companies={companiesData}
                onSelectDetail={(company) => setActiveCompanyDetail(company)}
              />
            </section>

            {/* 3. Welcome Promos */}
            <section id="welcome_promo" className="scroll-mt-28">
              <WelcomePromoComparator
                companies={companiesData}
                onSelectDetail={(company) => setActiveCompanyDetail(company)}
              />
            </section>

            {/* 4. Promotions Summary & CSV Export */}
            <section id="promotions_summary" className="scroll-mt-28">
              <PromotionsSummaryTable
                companies={companiesData}
                onSelectDetail={(company) => setActiveCompanyDetail(company)}
              />
            </section>

            {/* 5. Cost Calculator */}
            <section id="calculator" className="scroll-mt-28">
              <CostCalculator
                companies={companiesData}
                onSelectDetail={(company) => setActiveCompanyDetail(company)}
                onSwitchToPromoTab={() => handleSelectTab('welcome_promo')}
              />
            </section>

            {/* 6. AI Insights Hub */}
            <section id="ai_insights" className="scroll-mt-28">
              <SmartInsightsHub
                companies={companiesData}
                onSelectDetail={(company) => setActiveCompanyDetail(company)}
                onFilterByAIRecommended={(recommendedIds) => {
                  setSearchQuery('');
                  setActiveFilter('all');
                  handleSelectTab('existing');
                }}
              />
            </section>

            {/* 7. Criteria Guide */}
            <section id="guide" className="scroll-mt-28">
              <CriteriaGuide scrollToSection={scrollToSection} />
            </section>
          </div>
        )}
      </main>

      {/* Modals */}
      <HeadToHeadModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        companies={comparedCompanies}
        onRemoveCompany={handleRemoveFromCompare}
      />

      <CompanyDetailModal
        company={currentDetailCompany}
        onClose={() => setActiveCompanyDetail(null)}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        companies={companiesData}
        onFeedbackSubmitted={(item) => {
          setFeedbacks(getStoredFeedbacks());
        }}
      />

      <DataManagementModal
        isOpen={isDataManagerOpen}
        onClose={() => setIsDataManagerOpen(false)}
        companies={companiesData}
        onApplyOverrides={handleApplyOverrides}
        onResetToDefault={handleResetToDefault}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsAuthModalOpen(true)}
        onLogoutAdmin={handleLogoutAdmin}
        onOpenCrawler={() => setIsCrawlerModalOpen(true)}
        feedbacks={feedbacks}
        onFeedbacksChange={setFeedbacks}
      />

      <LiveCrawlerModal
        isOpen={isCrawlerModalOpen}
        onClose={() => setIsCrawlerModalOpen(false)}
        currentCompanies={companiesData}
        onApplyData={handleApplyOverrides}
      />

      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <Footer 
        scrollToSection={scrollToSection} 
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
      />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        scrollToSection={scrollToSection}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isMenuOpen={isMobileMenuOpen}
        setIsMenuOpen={setIsMobileMenuOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        onOpenDataManager={handleOpenDataManager}
        onOpenCrawler={() => setIsCrawlerModalOpen(true)}
        currentUser={currentUser}
        onLogoutAdmin={handleLogoutAdmin}
        selectedForCompare={selectedForCompare}
        openCompareModal={handleOpenCompareModal}
        unreadFeedbackCount={unreadFeedbackCount}
      />
    </div>
  );
}
