import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  ExternalLink, 
  Terminal, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  Database,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { TARGET_BROKERS } from '../data/brokersCrawlerList';
import { 
  crawlSingleBroker, 
  calculateScanSummary, 
  syncScanResultsToCompanies 
} from '../utils/crawlerEngine';

export default function LiveCrawlerModal({
  isOpen,
  onClose,
  currentCompanies = [],
  onApplyData
}) {
  const [isScanning, setIsScanning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scanResults, setScanResults] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'accessible' | 'unscannable'
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const logsEndRef = useRef(null);
  const isScanningRef = useRef(false);
  const isPausedRef = useRef(false);

  // Auto-scroll logs terminal
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Sync refs with state
  useEffect(() => {
    isScanningRef.current = isScanning;
  }, [isScanning]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  if (!isOpen) return null;

  const total = TARGET_BROKERS.length;
  const progressPercent = total > 0 ? Math.round((scanResults.length / total) * 100) : 0;
  const summary = calculateScanSummary(scanResults);
  const isComplete = scanResults.length === total && !isScanning;

  // Add log line helper
  const addLog = (text, type = 'info') => {
    const timeStr = new Date().toLocaleTimeString('vi-VN');
    setLogs(prev => [...prev.slice(-150), { text, type, time: timeStr }]);
  };

  // Start or resume crawler
  const handleStartScan = async () => {
    if (isScanning && !isPaused) return;

    setIsScanning(true);
    setIsPaused(false);
    isScanningRef.current = true;
    isPausedRef.current = false;

    addLog('🚀 Bắt đầu phiên quét & crawl dữ liệu biểu phí 30 CTCK...', 'info');

    let startIndex = currentIndex;
    if (isComplete || currentIndex >= total) {
      // Reset if completed before
      startIndex = 0;
      setCurrentIndex(0);
      setScanResults([]);
      setLogs([]);
      addLog('🔄 Đặt lại tiến trình quét mới từ đầu (0/30)...', 'info');
    }

    for (let i = startIndex; i < total; i++) {
      if (!isScanningRef.current || isPausedRef.current) {
        addLog(`⏸️ Quá trình quét tạm dừng tại ${i}/${total} CTCK.`, 'warn');
        break;
      }

      const broker = TARGET_BROKERS[i];
      setCurrentIndex(i);
      addLog(`[${i + 1}/${total}] Đang kết nối [${broker.shortName}] (${broker.url})...`, 'info');

      try {
        const result = await crawlSingleBroker(broker);
        setScanResults(prev => {
          const filtered = prev.filter(r => r.id !== broker.id);
          return [...filtered, result];
        });

        if (result.isAccessible) {
          addLog(
            `✅ [${broker.shortName}] HTTP 200 OK (${Math.round((result.contentLength || 0) / 1024)} KB) - ${result.elapsedMs}ms`,
            'success'
          );
        } else {
          addLog(
            `⚠️ [${broker.shortName}] HTTP ${result.httpStatus || 403} - ${result.unscannableReason || 'Cloudflare WAF / SPA'}`,
            'warn'
          );
        }
      } catch (err) {
        addLog(`❌ [${broker.shortName}] Lỗi kết nối: ${err.message}`, 'error');
        setScanResults(prev => [
          ...prev.filter(r => r.id !== broker.id),
          {
            id: broker.id,
            name: broker.name,
            shortName: broker.shortName,
            stockCode: broker.stockCode,
            url: broker.url,
            officialSource: broker.officialSource,
            httpStatus: 'Error',
            isAccessible: false,
            signals: null,
            unscannableReason: err.message,
            scannedAt: new Date().toISOString()
          }
        ]);
      }

      setCurrentIndex(i + 1);
    }

    if (isScanningRef.current && !isPausedRef.current) {
      setIsScanning(false);
      addLog(`🎉 Hoàn tất quét toàn bộ ${total} Công ty Chứng khoán!`, 'success');
    }
  };

  const handlePauseScan = () => {
    setIsPaused(true);
    isPausedRef.current = true;
  };

  const handleResetScan = () => {
    setIsScanning(false);
    setIsPaused(false);
    isScanningRef.current = false;
    isPausedRef.current = false;
    setCurrentIndex(0);
    setScanResults([]);
    setLogs([{ text: 'Đã đặt lại dữ liệu phiên quét. Bấm "Bắt đầu quét" để chạy lại.', type: 'info', time: new Date().toLocaleTimeString('vi-VN') }]);
  };

  // Download scan report JSON
  const handleDownloadReport = () => {
    const reportData = {
      summary,
      brokers: scanResults
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vietsec-live-scan-report-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Apply new updates into main app state
  const handleApplyToSystem = () => {
    if (scanResults.length === 0) return;
    const updated = syncScanResultsToCompanies(currentCompanies, scanResults);
    if (onApplyData) {
      onApplyData(updated);
    }
    setAppliedSuccess(true);
    addLog('💾 Đã áp dụng kết quả quét mới vào hệ thống dữ liệu ứng dụng!', 'success');
    setTimeout(() => setAppliedSuccess(false), 3500);
  };

  // Filtered results list
  const filteredList = scanResults.filter(b => {
    if (filterType === 'accessible') return b.isAccessible;
    if (filterType === 'unscannable') return !b.isAccessible;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 sm:px-6 py-4 bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  Quét & Crawl Dữ Liệu Biểu Phí 30 CTCK
                </h2>
                <span className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                  Live Scanner
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kiểm tra trực tuyến kết nối, mã phản hồi HTTP và phân tích biểu phí thời gian thực
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Progress Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Tiến trình quét:
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {scanResults.length} / {total} CTCK ({progressPercent}%)
                  </span>
                  {isScanning && !isPaused && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                      <Activity className="h-3.5 w-3.5" />
                      Đang quét...
                    </span>
                  )}
                  {isPaused && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      <Pause className="h-3.5 w-3.5" />
                      Đang tạm dừng
                    </span>
                  )}
                  {isComplete && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Đã hoàn tất
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {!isScanning || isPaused ? (
                  <button
                    type="button"
                    onClick={handleStartScan}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{scanResults.length > 0 && isPaused ? 'Tiếp Tục Quét' : 'Bắt Đầu Quét Ngay'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePauseScan}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition-all"
                  >
                    <Pause className="h-3.5 w-3.5 fill-current" />
                    <span>Tạm Dừng</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetScan}
                  disabled={isScanning && !isPaused}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                  title="Đặt lại tiến trình"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Quét Lại</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-3">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Đã quét xong</div>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {scanResults.length} / {total}
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 p-3">
              <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Truy cập tốt (200)
              </div>
              <div className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
                {summary.accessible}
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 p-3">
              <div className="text-[11px] font-medium text-amber-700 dark:text-amber-300 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Cần đối chiếu (WAF)
              </div>
              <div className="text-lg font-black text-amber-700 dark:text-amber-300 mt-0.5">
                {summary.unscannable}
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 p-3">
              <div className="text-[11px] font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Tín hiệu Zero-Fee
              </div>
              <div className="text-lg font-black text-blue-700 dark:text-blue-300 mt-0.5">
                {summary.withZeroFeeSignal}
              </div>
            </div>
          </div>

          {/* Terminal Console Log */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-blue-400" />
                <span className="font-bold text-slate-300">Live Terminal Output Stream</span>
              </div>
              <span className="text-[10px] text-slate-500">{logs.length} dòng log</span>
            </div>

            <div className="font-mono text-xs text-slate-300 max-h-36 overflow-y-auto space-y-1 select-text">
              {logs.length === 0 ? (
                <div className="text-slate-600 italic py-2">
                  Chưa có hoạt động. Nhấn "Bắt Đầu Quét Ngay" để khởi chạy crawler trực tiếp...
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-slate-600 text-[10px] shrink-0">[{log.time}]</span>
                    <span className={
                      log.type === 'success' 
                        ? 'text-emerald-400' 
                        : log.type === 'warn' 
                        ? 'text-amber-400' 
                        : log.type === 'error' 
                        ? 'text-rose-400' 
                        : 'text-slate-300'
                    }>
                      {log.text}
                    </span>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Results Table Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Chi Tiết Kết Quả Từng CTCK ({filteredList.length})
              </h3>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Tất cả ({scanResults.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('accessible')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    filterType === 'accessible'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  Tốt ({summary.accessible})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('unscannable')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    filterType === 'unscannable'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  Cần đối chiếu ({summary.unscannable})
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredList.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    Chưa có kết quả nào. Bắt đầu quét để hiển thị danh sách.
                  </div>
                ) : (
                  filteredList.map((broker) => (
                    <div 
                      key={broker.id}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            {broker.shortName}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {broker.name}
                          </span>
                          {broker.stockCode && (
                            <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-600 dark:text-slate-300">
                              {broker.stockCode}
                            </span>
                          )}
                          {broker.isAccessible ? (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                              HTTP 200 OK
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold">
                              {broker.httpStatus} • Cần đối chiếu
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                          {broker.signals?.hasZeroFeeMention && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              ✓ Có từ khóa Zero-Fee
                            </span>
                          )}
                          {broker.signals?.hasMarginMention && (
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                              ✓ Có thông tin Margin
                            </span>
                          )}
                          {broker.unscannableReason && (
                            <span className="text-amber-600 dark:text-amber-400 truncate max-w-sm">
                              {broker.unscannableReason}
                            </span>
                          )}
                        </div>
                      </div>

                      <a
                        href={broker.officialSource || broker.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                        title="Mở liên kết nguồn kiểm tra"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 px-5 sm:px-6 py-3.5 bg-slate-50/90 dark:bg-slate-800/80">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {appliedSuccess ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 animate-bounce">
                <Check className="h-4 w-4" />
                Đã đồng bộ kết quả quét vào ứng dụng thành công!
              </span>
            ) : (
              <span>Dữ liệu quét trực tiếp từ website công khai của các CTCK.</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleDownloadReport}
              disabled={scanResults.length === 0}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Tải JSON</span>
            </button>

            <button
              type="button"
              onClick={handleApplyToSystem}
              disabled={scanResults.length === 0}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all disabled:opacity-40"
            >
              <Database className="h-3.5 w-3.5" />
              <span>Áp Dụng Cập Nhật</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
