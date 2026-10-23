import React, { useState } from 'react';
import { Sparkles, Bot, Award, TrendingUp, HelpCircle } from 'lucide-react';
import AIAdvisor from './AIAdvisor';
import KeyPointSynthesis from './KeyPointSynthesis';

export default function SmartInsightsHub({
  companies,
  onSelectDetail,
  onFilterByAIRecommended
}) {
  const [subView, setSubView] = useState('both'); // 'both' | 'advisor' | 'synthesis'

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header Hub Navigation */}
      <div className="rounded-3xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/50 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-3 py-1 text-xs font-black uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>Smart Financial Hub • AI & Market Insights</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Trợ Lý AI Cố Vấn & Tổng Hợp Điểm Nhấn Thị Trường 2026
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              Hệ thống gợi ý CTCK tối ưu theo từng khẩu vị đầu tư kết hợp báo cáo định lượng chuẩn hóa thị phần, ưu đãi phí & tiềm lực vốn 30 CTCK.
            </p>
          </div>

          {/* Sub-view Switcher */}
          <div className="inline-flex rounded-2xl bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0 self-start md:self-center">
            <button
              type="button"
              onClick={() => setSubView('both')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                subView === 'both'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Toàn Bộ Hub
            </button>
            <button
              type="button"
              onClick={() => setSubView('advisor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                subView === 'advisor'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Gợi Ý Theo Gu
            </button>
            <button
              type="button"
              onClick={() => setSubView('synthesis')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                subView === 'synthesis'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Key Points 30 CTCK
            </button>
          </div>
        </div>
      </div>

      {/* Part 1: AI Advisor (Khuyến nghị theo gu) */}
      {(subView === 'both' || subView === 'advisor') && (
        <section id="ai-advisor-section">
          <AIAdvisor
            companies={companies}
            onSelectDetail={onSelectDetail}
            onFilterByAIRecommended={onFilterByAIRecommended}
          />
        </section>
      )}

      {/* Part 2: KeyPointSynthesis (Tổng quan thị trường & Top 1 BSC) */}
      {(subView === 'both' || subView === 'synthesis') && (
        <section id="key-points-summary">
          <KeyPointSynthesis
            companies={companies}
            onSelectCompany={onSelectDetail}
          />
        </section>
      )}
    </div>
  );
}
