// src/data/guncelVeriler.js içindeki "tur: 'mevzuat'" kayıtlarının "lastUpdated"
// tarihini ve "period" alanındaki yılı kontrol eder; 90 günden eski güncellemeleri
// veya içinde bulunduğumuz yıldan eski bir yıl geçen "period" değerlerini
// raporlar (bkz. .github/workflows/haftalik-saglik-kontrolu.yml). "tur:
// 'bilimsel-referans'" kayıtları (bilimsel kılavuz/çalışma referansları) bu
// kontrolden muaftır — bir çalışmanın yayın yılı (ör. "2008 ADAG çalışması")
// verinin bayatladığı anlamına gelmez.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const reportDir = path.join(root, 'ci-reports');
const FRESHNESS_LIMIT_DAYS = 90;

// GUNCEL_VERILER içindeki her "yaprak kayıt" (hem "period" hem "lastUpdated"
// alanına sahip nesneler) yapıya bakmaksızın otomatik olarak bulunur; yeni bir
// değer eklendiğinde bu script'in güncellenmesine gerek yoktur.
function collectLeafRecords(node, pathParts, results) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return;
  const isLeafRecord = Object.prototype.hasOwnProperty.call(node, 'period')
    && Object.prototype.hasOwnProperty.call(node, 'lastUpdated');
  if (isLeafRecord) {
    results.push({ path: pathParts.join('.'), period: node.period, lastUpdated: node.lastUpdated, tur: node.tur });
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    collectLeafRecords(value, [...pathParts, key], results);
  }
}

async function main() {
  const dataUrl = pathToFileURL(path.join(root, 'src', 'data', 'guncelVeriler.js')).href;
  const { GUNCEL_VERILER } = await import(dataUrl);

  const records = [];
  collectLeafRecords(GUNCEL_VERILER, [], records);

  const now = new Date();
  const currentYear = now.getFullYear();
  const findings = [];
  // Sadece 'tur: mevzuat' işaretli kayıtlar tazelik kontrolüne girer. 'tur' alanı
  // TAMAMEN eksik bırakılan bir kayıt (unutulmuş sınıflandırma) güvenli tarafta
  // kalınarak yine de kontrol edilir; muafiyet yalnızca 'mevzuat' DIŞINDA açıkça
  // bir tür verilmiş kayıtlara tanınır ('bilimsel-referans' bilimsel kılavuz/
  // çalışma referansları için, başka türler de olabilir — ör. 'sektor-kaynagi':
  // resmi bir kurumun yayımlamadığı ama yaygın kullanılan sektörel referans
  // tablolar; bunların da yayın yılı "bayatlık" anlamına gelmez).
  const checkedRecords = records.filter((record) => (record.tur ? record.tur === 'mevzuat' : true));

  for (const record of checkedRecords) {
    if (record.lastUpdated && record.lastUpdated !== 'N/A') {
      const lastUpdatedDate = new Date(record.lastUpdated);
      if (!Number.isNaN(lastUpdatedDate.getTime())) {
        const days = Math.floor((now.getTime() - lastUpdatedDate.getTime()) / 86400000);
        if (days > FRESHNESS_LIMIT_DAYS) {
          findings.push(`- \`${record.path}\`: son güncelleme ${record.lastUpdated} tarihinde yapılmış (${days} gün önce, ${FRESHNESS_LIMIT_DAYS} günlük sınırı aştı).`);
        }
      }
    }

    if (record.period) {
      const yearMatch = String(record.period).match(/\b(20\d{2})\b/);
      if (yearMatch && Number(yearMatch[1]) < currentYear) {
        findings.push(`- \`${record.path}\`: period alanı ("${record.period}") ${currentYear} yılından eski görünüyor.`);
      }
    }
  }

  if (findings.length === 0) {
    const exemptCount = records.length - checkedRecords.length;
    console.log(`✅ ${checkedRecords.length} mevzuat kaydı tarandı, hepsi tazeliğini koruyor. (${exemptCount} mevzuat-dışı referans kaydı muaf tutuldu.)`);
    process.exit(0);
  }

  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'freshness.md'), `${findings.join('\n')}\n`);
  console.log(`⚠️ ${findings.length} bayat veri bulundu:\n${findings.join('\n')}`);
  process.exit(1);
}

main();
