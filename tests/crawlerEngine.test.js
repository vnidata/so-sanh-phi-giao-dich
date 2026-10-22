import { describe, it, expect, vi } from 'vitest';
import { TARGET_BROKERS } from '../src/data/brokersCrawlerList.js';
import { 
  crawlSingleBroker, 
  calculateScanSummary, 
  syncScanResultsToCompanies,
  KEYWORD_DICTIONARY,
  analyzeFinancialKeywords 
} from '../src/utils/crawlerEngine.js';
import { SECURITIES_COMPANIES } from '../src/data/securitiesData.js';

describe('Crawler & Web Scraper Utility Suite', () => {
  it('should have exactly 30 brokers in TARGET_BROKERS with valid schema', () => {
    expect(TARGET_BROKERS).toHaveLength(30);

    TARGET_BROKERS.forEach((broker) => {
      expect(typeof broker.id).toBe('string');
      expect(typeof broker.name).toBe('string');
      expect(typeof broker.shortName).toBe('string');
      expect(typeof broker.isListed).toBe('boolean');
      expect(broker.url).toMatch(/^https?:\/\//);
      expect(broker.officialSource).toMatch(/^https?:\/\//);

      if (broker.isListed) {
        expect(typeof broker.stockCode).toBe('string');
      } else {
        expect(broker.stockCode).toBeNull();
      }
    });

    // Verify BSC, TCBS, VPS
    const bsc = TARGET_BROKERS.find(b => b.id === 'bsc');
    expect(bsc.stockCode).toBe('BSI');
    expect(bsc.isListed).toBe(true);

    const tcbs = TARGET_BROKERS.find(b => b.id === 'tcbs');
    expect(tcbs.stockCode).toBeNull();
    expect(tcbs.isListed).toBe(false);

    const vps = TARGET_BROKERS.find(b => b.id === 'vps');
    expect(vps.stockCode).toBeNull();
    expect(vps.isListed).toBe(false);
  });

  it('should calculate scan summary metrics accurately', () => {
    const mockResults = [
      { id: 'bsc', isAccessible: true, signals: { hasZeroFeeMention: true, hasMarginMention: true, hasPromoRateMention: true } },
      { id: 'ssi', isAccessible: true, signals: { hasZeroFeeMention: false, hasMarginMention: true, hasPromoRateMention: false } },
      { id: 'tcbs', isAccessible: false, signals: null },
      { id: 'vndirect', isAccessible: false, signals: null }
    ];

    const summary = calculateScanSummary(mockResults);
    expect(summary.total).toBe(4);
    expect(summary.accessible).toBe(2);
    expect(summary.unscannable).toBe(2);
    expect(summary.withZeroFeeSignal).toBe(1);
    expect(summary.withMarginSignal).toBe(2);
    expect(summary.withPromoSignal).toBe(1);
    expect(summary.successRate).toBe(50);
  });

  it('should probe a broker and return structured result', async () => {
    const bsc = TARGET_BROKERS.find(b => b.id === 'bsc');
    const result = await crawlSingleBroker(bsc);

    expect(result).toBeDefined();
    expect(result.id).toBe('bsc');
    expect(result.name).toBe(bsc.name);
    expect(result.shortName).toBe('BSC');
    expect(typeof result.isAccessible).toBe('boolean');
    expect(result.httpStatus).toBeDefined();
    expect(result.scannedAt).toBeTruthy();
  });

  it('should sync scan results into existing companies data without mutating original fields', () => {
    const mockScanResults = [
      {
        id: 'bsc',
        isAccessible: true,
        httpStatus: 200,
        contentLength: 150000,
        signals: { hasZeroFeeMention: true, hasMarginMention: true, hasPromoRateMention: true },
        scannedAt: '2026-10-22T08:00:00.000Z'
      }
    ];

    const updated = syncScanResultsToCompanies(SECURITIES_COMPANIES, mockScanResults);
    expect(updated).toHaveLength(SECURITIES_COMPANIES.length);

    const updatedBsc = updated.find(c => c.id === 'bsc');
    expect(updatedBsc.crawlerMeta).toBeDefined();
    expect(updatedBsc.crawlerMeta.httpStatus).toBe(200);
    expect(updatedBsc.crawlerMeta.isAccessible).toBe(true);
    expect(updatedBsc.tradingFee.onlineMin).toBe(0.08); // preserves core trading fee
    expect(updatedBsc.margin.standardRate90d).toBe(10.5); // preserves core margin
  });

  describe('Financial Keywords & NLP Signal Analyzer', () => {
    it('should have all 7 core financial keyword groups in dictionary', () => {
      const keys = KEYWORD_DICTIONARY.map(k => k.key);
      expect(keys).toContain('tradingFee');
      expect(keys).toContain('zeroFee');
      expect(keys).toContain('interestRate');
      expect(keys).toContain('loanInterest');
      expect(keys).toContain('margin');
      expect(keys).toContain('creditLimit');
      expect(keys).toContain('debtBalance');
    });

    it('should accurately detect and extract keywords from raw text snippet', () => {
      const sampleText = `
        Công ty Chứng khoán thông báo Biểu phí giao dịch cơ sở mới:
        Miễn phí (Zero-fee) cho tài khoản mở mới trong 6 tháng.
        Lãi suất vay ký quỹ (margin) ưu đãi chỉ từ 7.5%/năm và 9.9%/năm.
        Hạn mức vay cấp tín dụng lên tới 10 tỷ đồng.
        Dư nợ margin bình quân được tính theo ngày.
      `;

      const analysis = analyzeFinancialKeywords(sampleText);
      expect(analysis.hasTradingFee).toBe(true);
      expect(analysis.hasZeroFee).toBe(true);
      expect(analysis.hasInterestRate).toBe(true);
      expect(analysis.hasLoanInterest).toBe(true);
      expect(analysis.hasMargin).toBe(true);
      expect(analysis.hasCreditLimit).toBe(true);
      expect(analysis.hasDebtBalance).toBe(true);

      // Check extracted rates
      expect(analysis.ratesFound).toContain('7.5%');
      expect(analysis.ratesFound).toContain('9.9%');

      // Check backward compatibility
      expect(analysis.hasZeroFeeMention).toBe(true);
      expect(analysis.hasMarginMention).toBe(true);
      expect(analysis.hasPromoRateMention).toBe(true);
    });

    it('should safely handle empty or non-string inputs', () => {
      const emptyResult = analyzeFinancialKeywords('');
      expect(emptyResult.hasTradingFee).toBe(false);
      expect(emptyResult.hasMargin).toBe(false);
      expect(emptyResult.matchedList).toEqual([]);
      expect(emptyResult.ratesFound).toEqual([]);

      const nullResult = analyzeFinancialKeywords(null);
      expect(nullResult.hasZeroFee).toBe(false);
    });
  });
});
