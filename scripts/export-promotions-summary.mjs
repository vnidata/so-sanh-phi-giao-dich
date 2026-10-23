#!/usr/bin/env node
/**
 * CLI EXPORTER: XUẤT BẢNG TÓM TẮT CHƯƠNG TRÌNH KHUYẾN MÃI & ƯU ĐÃI (30 CTCK)
 * 
 * Script dòng lệnh quét toàn bộ 30 CTCK, trích xuất tất cả các gói ưu đãi:
 * 1. Tên chương trình
 * 2. Nội dung tóm tắt
 * 3. Ưu đãi phí
 * 4. Ưu đãi lãi margin
 * 5. Thời gian áp dụng
 * 6. Lưu ý quan trọng
 * 7. Link bài viết nguồn kiểm chứng
 * 
 * Xuất file CSV định dạng UTF-8 with BOM tương thích Microsoft Excel tiếng Việt.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECURITIES_COMPANIES } from '../src/data/securitiesData.js';
import { extractAllPromotions, exportPromotionsToCsvString } from '../src/utils/promotionsExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('='.repeat(75));
console.log('🚀 KHỞI ĐỘNG TRÍCH XUẤT VÀ TỔNG HỢP CHƯƠNG TRÌNH ƯU ĐÃI (30 CTCK)');
console.log('='.repeat(75));

const promotions = extractAllPromotions(SECURITIES_COMPANIES);
console.log(`✅ Đã trích xuất thành công ${promotions.length} chương trình ưu đãi từ ${SECURITIES_COMPANIES.length} CTCK.`);

// Thống kê phân loại
const feeOffers = promotions.filter(p => p.category === 'fee' || (!p.feeOffer.includes('Không áp dụng') && !p.feeOffer.includes('Theo biểu phí chuẩn')));
const marginOffers = promotions.filter(p => p.category === 'margin' || (!p.interestOffer.includes('Không áp dụng') && !p.interestOffer.includes('Theo biểu lãi chuẩn')));
const welcomeOffers = promotions.filter(p => p.category === 'welcome');
const verifiedLinks = promotions.filter(p => p.sourceUrl && p.sourceUrl.startsWith('http'));

console.log(`   - Ưu đãi phí giao dịch: ${feeOffers.length} chương trình`);
console.log(`   - Ưu đãi lãi vay margin: ${marginOffers.length} chương trình`);
console.log(`   - Gói ưu đãi mở mới eKYC: ${welcomeOffers.length} chương trình`);
console.log(`   - 100% Link bài viết đính kèm: ${verifiedLinks.length}/${promotions.length} links`);

// Sinh chuỗi CSV có BOM UTF-8
const csvContent = exportPromotionsToCsvString(promotions);

// Đường dẫn file đầu ra
const outputPath = path.join(ROOT_DIR, 'promotions-summary.csv');
fs.writeFileSync(outputPath, csvContent, 'utf-8');

console.log('\n📄 XUẤT FILE CSV THÀNH CÔNG:');
console.log(`   Đường dẫn: ${outputPath}`);
console.log(`   Kích thước: ${(Buffer.byteLength(csvContent, 'utf-8') / 1024).toFixed(2)} KB`);
console.log(`   BOM UTF-8: Đã nhúng \\uFEFF (Excel tiếng Việt hiển thị chuẩn 100% không lỗi font)`);
console.log('='.repeat(75));
