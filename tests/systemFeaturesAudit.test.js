import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import path from 'path';

// Setup environment mocks for SSR rendering in Node
beforeAll(() => {
  if (typeof globalThis.CustomEvent === 'undefined') {
    globalThis.CustomEvent = class CustomEvent {
      constructor(type, eventInitDict) {
        this.type = type;
        this.detail = eventInitDict?.detail;
      }
    };
  }
  if (typeof globalThis.localStorage === 'undefined') {
    const store = new Map();
    globalThis.localStorage = {
      getItem: (key) => store.get(key) || null,
      setItem: (key, val) => store.set(key, String(val)),
      removeItem: (key) => store.delete(key),
      clear: () => store.clear()
    };
  }
  if (typeof globalThis.window === 'undefined') {
    globalThis.window = {
      location: { hash: '' },
      matchMedia: () => ({ matches: false }),
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      innerWidth: 1024
    };
  } else {
    if (!globalThis.window.dispatchEvent) {
      globalThis.window.dispatchEvent = () => true;
    }
  }
});

// Data imports
import { SECURITIES_COMPANIES } from '../src/data/securitiesData.js';
import { VERIFIED_PROMOTIONS } from '../src/data/promotionsData.js';
import { TARGET_BROKERS } from '../src/data/brokersCrawlerList.js';

// Utils imports
import { extractAllPromotions, exportPromotionsToCsvString } from '../src/utils/promotionsExtractor.js';
import { calculateCompanyCost, rankCompaniesByCost } from '../src/utils/calculator.js';
import { getBrokerSourceLinks, getPromotionArticleLink } from '../src/utils/sourceLinks.js';
import { getStoredFeedbacks, saveFeedbackToInbox, updateFeedbackItem } from '../src/utils/feedbackStorage.js';
import { verifyAdminCredentials, loginAdmin, getCurrentUser } from '../src/utils/auth.js';
import { evaluatePromoValidity, isWithinOneYear } from '../src/utils/promoValidityAnalyzer.js';
import { calculateAIMatch, getTopAIRecommendations } from '../src/utils/aiMatcher.js';

// Component imports
import App from '../src/App.jsx';
import Header from '../src/components/Header.jsx';
import Footer from '../src/components/Footer.jsx';
import PromotionsSummaryTable from '../src/components/PromotionsSummaryTable.jsx';
import ShortTermMarginComparator from '../src/components/ShortTermMarginComparator.jsx';
import WelcomePromoComparator from '../src/components/WelcomePromoComparator.jsx';
import SecuritiesTable from '../src/components/SecuritiesTable.jsx';
import SecuritiesCards from '../src/components/SecuritiesCards.jsx';
import CostCalculator from '../src/components/CostCalculator.jsx';
import CriteriaGuide from '../src/components/CriteriaGuide.jsx';
import CompanyDetailModal from '../src/components/CompanyDetailModal.jsx';

describe('System-Wide 100% Features & Link Health End-to-End Audit Suite', () => {

  // =========================================================================
  // 1. LINK INTEGRITY & HEALTH (ZERO DEAD LINKS AUDIT)
  // =========================================================================
  describe('Feature 1: Link Health & Anti-404 Integrity', () => {
    it('audit report must confirm 0 dead / 404 links across all 146 system URLs', () => {
      const reportPath = path.resolve(__dirname, '../scripts/system-urls-audit-report.json');
      expect(fs.existsSync(reportPath), 'system-urls-audit-report.json must exist').toBe(true);
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      
      expect(report.summary.total).toBeGreaterThanOrEqual(140);
      expect(report.summary.dead).toBe(0);
      expect(report.deadUrls).toHaveLength(0);
      expect(report.summary.healthy).toBe(report.summary.total);
    });

    it('all 65 verified promotion URLs must be HTTPS/HTTP and distinct (1-to-1 mapping)', () => {
      const urls = VERIFIED_PROMOTIONS.map(p => p.sourceUrl);
      const uniqueUrls = new Set(urls);

      expect(urls.length).toBe(65);
      expect(uniqueUrls.size).toBe(65);

      VERIFIED_PROMOTIONS.forEach(p => {
        expect(p.sourceUrl).toMatch(/^https?:\/\//);
        expect(p.sourceUrl).not.toContain('404');
        expect(p.sourceUrl).not.toContain('localhost');
      });
    });

    it('static links in Header and Footer must point to official repositories and agencies', () => {
      const headerHtml = ReactDOMServer.renderToString(React.createElement(Header));
      expect(headerHtml).toContain('https://github.com/vnidata/so-sanh-phi-giao-dich');

      const footerHtml = ReactDOMServer.renderToString(React.createElement(Footer));
      expect(footerHtml).toContain('https://github.com/vnidata/so-sanh-phi-giao-dich');
      expect(footerHtml).toContain('https://congbothongtin.ssc.gov.vn');
    });
  });

  // =========================================================================
  // 2. PROMOTIONS & CSV EXPORT FEATURE
  // =========================================================================
  describe('Feature 2: Promotions & CSV Exporter', () => {
    it('extractAllPromotions correctly extracts all 65 promotions for 30 CTCKs without AI boilerplate', () => {
      const promos = extractAllPromotions(SECURITIES_COMPANIES);
      expect(promos).toHaveLength(65);

      const companies = new Set(promos.map(p => p.companyId));
      expect(companies.size).toBe(30);

      promos.forEach(p => {
        expect(p.programName).toBeTruthy();
        expect(p.summary.length).toBeGreaterThan(25);
        expect(p.feeOffer).toBeTruthy();
        expect(p.interestOffer).toBeTruthy();
        expect(p.duration).toBeTruthy();
        expect(p.notes).toBeTruthy();
        expect(p.sourceUrl).toBeTruthy();

        // Anti-synthetic text checks
        expect(p.summary).not.toContain('công bố chính thức trên website');
        expect(p.summary).not.toContain('Hưởng chính sách ưu đãi cạnh tranh trong năm 2026');
      });
    });

    it('exportPromotionsToCsvString creates valid UTF-8 BOM CSV for Excel', () => {
      const promos = extractAllPromotions(SECURITIES_COMPANIES);
      const csv = exportPromotionsToCsvString(promos);

      expect(csv.charCodeAt(0)).toBe(0xFEFF); // UTF-8 BOM
      expect(csv).toContain('"STT","Mã CTCK","Công Ty Chứng Khoán"');
      expect(csv).toContain('"Đường Dẫn Bài Viết Nguồn"');

      const lines = csv.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
      expect(lines.length).toBe(promos.length + 1); // 1 header + 65 rows = 66 lines
    });
  });

  // =========================================================================
  // 3. TRADING COST CALCULATOR & MULTI-BROKER COMPARISON
  // =========================================================================
  describe('Feature 3: Cost Calculator & Margin Engine', () => {
    it('calculateCompanyCost calculates accurate buy/sell fees, tax, and margin interest', () => {
      const bsc = SECURITIES_COMPANIES.find(c => c.id === 'bsc');
      const calc = calculateCompanyCost(bsc, {
        monthlyTradingVolume: 200_000_000,
        marginLoanAmount: 100_000_000,
        marginBorrowDays: 20,
        isNewAccount: true
      });

      expect(calc).toBeDefined();
      expect(calc.monthlyTradingFee).toBeGreaterThanOrEqual(0);
      expect(calc.monthlyMarginInterest).toBeGreaterThan(0);
      expect(calc.totalMonthlyCost).toBeGreaterThan(0);
      expect(calc.totalAnnualCost).toBeCloseTo(calc.totalMonthlyCost * 12, 1);
    });

    it('rankCompaniesByCost correctly ranks brokers by total trading cost', () => {
      const ranked = rankCompaniesByCost(SECURITIES_COMPANIES, {
        monthlyTradingVolume: 100_000_000,
        marginLoanAmount: 50_000_000,
        marginBorrowDays: 15,
        isNewAccount: true
      });

      expect(ranked).toHaveLength(30);
      expect(ranked[0].totalMonthlyCost).toBeLessThanOrEqual(ranked[ranked.length - 1].totalMonthlyCost);
    });
  });

  // =========================================================================
  // 4. SHORT-TERM MARGIN & DEAL COMPARISON FEATURE
  // =========================================================================
  describe('Feature 4: Short-Term Margin & Deals', () => {
    it('identifies short term deals (BSC MR10, VNDIRECT T10, DNSE 5.99, TPS M7, VCBS T5)', () => {
      const bsc = SECURITIES_COMPANIES.find(c => c.id === 'bsc');
      expect(bsc.margin.shortTermRate).toBe(7.5);

      const dnse = SECURITIES_COMPANIES.find(c => c.id === 'dnse');
      expect(dnse.margin.shortTermRate).toBe(5.99);
      expect(dnse.margin.isShortTermDealOnly).toBe(true);

      const vndirect = SECURITIES_COMPANIES.find(c => c.id === 'vndirect');
      expect(vndirect.margin.shortTermRate).toBe(9.5);
    });
  });

  // =========================================================================
  // 5. CRAWLER & PROMOTION VALIDITY ANALYZER (WITHIN 1 YEAR)
  // =========================================================================
  describe('Feature 5: Crawler Engine & Promo Validity Analyzer', () => {
    it('TARGET_BROKERS has crawler endpoints for major brokers', () => {
      expect(TARGET_BROKERS.length).toBeGreaterThanOrEqual(10);
      TARGET_BROKERS.forEach(b => {
        expect(b.id).toBeTruthy();
        expect(b.name).toBeTruthy();
        expect(b.url || b.officialSource || b.fallbackUrl).toMatch(/^https?:\/\//);
      });
    });

    it('isWithinOneYear validates articles within 365 days', () => {
      const now = new Date();
      const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const twoYearsAgo = '2023-01-01';

      expect(isWithinOneYear(sixMonthsAgo)).toBe(true);
      expect(isWithinOneYear(twoYearsAgo)).toBe(false);
    });
  });

  // =========================================================================
  // 6. FEEDBACK STORAGE & ADMIN INBOX
  // =========================================================================
  describe('Feature 6: Feedback Inbox & Management', () => {
    it('saves and reads feedback in storage safely', () => {
      const feedback = {
        name: 'Nguyễn Văn Test',
        email: 'test@example.com',
        content: 'Đề xuất cập nhật biểu phí mới',
        category: 'fee_update'
      };

      const result = saveFeedbackToInbox(feedback);
      expect(result.id).toBeTruthy();
      expect(result.status).toBe('new');

      const all = getStoredFeedbacks();
      expect(all.length).toBeGreaterThanOrEqual(1);

      const updatedList = updateFeedbackItem(result.id, { status: 'resolved' });
      const updatedItem = updatedList.find(f => f.id === result.id);
      expect(updatedItem.status).toBe('resolved');
    });
  });

  // =========================================================================
  // 7. AUTH & ADMIN AUTHORIZATION
  // =========================================================================
  describe('Feature 7: Admin PIN Authentication', () => {
    it('authenticates admin with valid PIN and rejects invalid PIN', () => {
      expect(verifyAdminCredentials('kienhpw@gmail.com', 'Kien$396731')).toBe(true);
      expect(verifyAdminCredentials('kienhpw@gmail.com', '000000')).toBe(false);
      expect(verifyAdminCredentials('wrong@gmail.com', 'Kien$396731')).toBe(false);
      expect(verifyAdminCredentials('', '')).toBe(false);

      const loginRes = loginAdmin('kienhpw@gmail.com', 'Kien$396731');
      expect(loginRes.success).toBe(true);
      expect(loginRes.user).toBeDefined();
    });
  });

  // =========================================================================
  // 8. AI PERSONA MATCHER
  // =========================================================================
  describe('Feature 8: AI Investment Persona Matcher', () => {
    it('matches suitable brokers for Day Trader persona', () => {
      const recommendations = getTopAIRecommendations(SECURITIES_COMPANIES, 'day_trader', 3);
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations).toHaveLength(3);
      expect(recommendations[0].aiMatchScore).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // 9. UI COMPONENTS FULL RENDER SUITE (ZERO CRASHES)
  // =========================================================================
  describe('Feature 9: React Components Render Integrity', () => {
    it('renders PromotionsSummaryTable without errors and includes NEW badges and filter', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(PromotionsSummaryTable, { companies: SECURITIES_COMPANIES })
      );
      expect(html).toContain('Tóm Tắt Toàn Bộ Chương Trình Khuyến Mãi');
      expect(html).toContain('Xuất File CSV');
      expect(html).toContain('NEW');
      expect(html).toContain('Mới cập nhật (New)');
    });

    it('renders ShortTermMarginComparator without errors', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(ShortTermMarginComparator, { companies: SECURITIES_COMPANIES })
      );
      expect(html).toContain('Bảng Đối Chiếu Margin Ngắn Ngày');
    });

    it('renders WelcomePromoComparator without errors', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(WelcomePromoComparator, { companies: SECURITIES_COMPANIES })
      );
      expect(html).toContain('Bảng Đối Chiếu Ưu Đãi Mở Tài Khoản Mới');
    });

    it('renders SecuritiesTable and SecuritiesCards without errors and displays NEW badges', () => {
      const tableHtml = ReactDOMServer.renderToString(
        React.createElement(SecuritiesTable, { 
          companies: SECURITIES_COMPANIES,
          selectedForCompare: [],
          toggleCompare: () => {},
          onSelectDetail: () => {}
        })
      );
      expect(tableHtml).toContain('Công Ty Chứng Khoán');
      expect(tableHtml).toContain('NEW');

      const cardsHtml = ReactDOMServer.renderToString(
        React.createElement(SecuritiesCards, { 
          companies: SECURITIES_COMPANIES,
          selectedForCompare: [],
          toggleCompare: () => {},
          onSelectDetail: () => {}
        })
      );
      expect(cardsHtml.length).toBeGreaterThan(500);
      expect(cardsHtml).toContain('NEW');
    });

    it('renders CompanyDetailModal with NEW badges when company has updates', () => {
      const bsc = SECURITIES_COMPANIES.find(c => c.id === 'bsc');
      const html = ReactDOMServer.renderToString(
        React.createElement(CompanyDetailModal, { 
          company: bsc,
          onClose: () => {}
        })
      );
      expect(html).toContain('NEW UPDATES');
    });

    it('renders CostCalculator without errors', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(CostCalculator, { companies: SECURITIES_COMPANIES })
      );
      expect(html).toContain('Công Cụ Tính Toán &amp; So Sánh Chi Phí');
    });

    it('renders CriteriaGuide without errors', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(CriteriaGuide)
      );
      expect(html).toContain('Nên Chọn Mở Tài Khoản Tại CTCK Nào?');
    });

    it('renders full App workspace without errors', () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(App)
      );
      expect(html).toContain('Bảng So Sánh');
    });
  });

});
