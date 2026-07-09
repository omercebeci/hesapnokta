import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import HealthResultDisclaimer from '../../../components/HealthResultDisclaimer.jsx';
import PrintableMeasurementLog from '../../../components/PrintableMeasurementLog.jsx';
import { calculateGlucoseLog } from '../../../lib/saglikCalculators.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';
import { formatNumber, formatDateTr } from '../../../utils/format.js';
import { useQueryParamState, serializeRows, deserializeRows } from '../../../hooks/useQueryParamState.js';

const HYPO_DATA = GUNCEL_VERILER.hipoglisemiEsikleri;
const HYPER_DATA = GUNCEL_VERILER.hiperglisemiAcilEsigi;
const FORMULA_DATA = GUNCEL_VERILER.hba1cOrtalamaGlukozFormulu;
const ROW_FIELDS = ['date', 'fasting', 'postprandial'];

let rowIdCounter = 0;
function todayMinusDays(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
const createRow = (date = '', fasting = '', postprandial = '') => ({ id: rowIdCounter++, date, fasting, postprandial });
const DEFAULT_ROWS = [createRow(todayMinusDays(1), '95', '138'), createRow(todayMinusDays(0), '102', '145')];

const PRINT_COLUMNS = [
  { key: 'date', label: 'Tarih' },
  { key: 'fasting', label: 'Açlık (mg/dL)' },
  { key: 'postprandial', label: 'Tokluk (mg/dL)' },
];

function buildGlucoseAction({ hasSevereLow, hasVeryHigh }) {
  const parts = [];
  if (hasSevereLow) {
    parts.push(`Kayıtlarınızda ${HYPO_DATA.seviye2CiddiEsik} mg/dL altında ölçüm var; bu düzey ciddi hipoglisemi sayılır. Bilinç bulanıklığı veya bayılma gibi belirtiler varsa hemen 112'yi arayın; değilse en kısa sürede hekiminize bildirin.`);
  }
  if (hasVeryHigh) {
    parts.push(`Kayıtlarınızda ${HYPER_DATA.esikMgdl} mg/dL veya üzerinde, düşmeyen bir ölçüm var. Vakit kaybetmeden bir sağlık kuruluşuna başvurun; bulantı, kusma veya nefes almada güçlük gibi belirtileriniz varsa hemen 112'yi arayın.`);
  }
  return parts.join(' ');
}

export default function SekerOlcumOrtalamasiHesaplama() {
  const [rows, setRows] = useQueryParamState('olcumler', DEFAULT_ROWS, {
    serialize: (value) => serializeRows(value, ROW_FIELDS),
    deserialize: (text) => {
      const parsed = deserializeRows(text, ROW_FIELDS, (v) => createRow(v.date, v.fasting, v.postprandial));
      return parsed && parsed.length > 0 ? parsed : DEFAULT_ROWS;
    },
  });

  const updateRow = (id, field, value) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };
  const addRow = () => setRows((current) => [...current, createRow(todayMinusDays(0))]);
  const removeRow = (id) => setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));

  const result = useMemo(() => calculateGlucoseLog(rows), [rows]);

  const rowFlags = useMemo(() => {
    const map = new Map();
    if (result.valid) {
      result.rows.forEach((row) => map.set(row.id, { hasLow: row.hasLow, hasSevereLow: row.hasSevereLow, hasVeryHigh: row.hasVeryHigh }));
    }
    return map;
  }, [result]);

  const printRows = useMemo(() => rows
    .filter((row) => row.fasting || row.postprandial)
    .map((row) => ({
      id: row.id,
      date: row.date ? formatDateTr(row.date) : '—',
      fasting: row.fasting || '—',
      postprandial: row.postprandial || '—',
    })), [rows]);

  const summaryRows = result.valid ? [{
    label: 'Ortalamalar',
    values: {
      fasting: result.avgFasting ? formatNumber(result.avgFasting, { decimals: 0 }) : '—',
      postprandial: result.avgPostprandial ? formatNumber(result.avgPostprandial, { decimals: 0 }) : '—',
    },
  }] : [];

  let tone;
  if (result.valid && (result.hasSevereLow || result.hasVeryHigh)) tone = 'danger';
  else if (result.valid && result.hasLow) tone = 'warning';

  return (
    <CalculatorLayout calculatorId="seker-olcum-ortalamasi">
      <div className="calc-card">
        <h2>Ev ölçümleriniz</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem', marginTop: -6 }}>Her gün için açlık ve/veya tokluk (yemekten ~2 saat sonra) ölçümünüzü mg/dL cinsinden girin.</p>
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((row, index) => {
            const flags = rowFlags.get(row.id);
            const rowClass = flags?.hasSevereLow || flags?.hasVeryHigh ? 'measurement-row-danger' : flags?.hasLow ? 'measurement-row-warning' : '';
            return (
              <div key={row.id} className={rowClass} style={{ display: 'grid', gap: 8, padding: '10px 0', borderBottom: index < rows.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
                <div className="form-grid">
                  <FormField label={`${index + 1}. gün — tarih`} htmlFor={`date-${row.id}`}>
                    <input id={`date-${row.id}`} type="date" value={row.date} onChange={(e) => updateRow(row.id, 'date', e.target.value)} />
                  </FormField>
                  <FormField label="Açlık (mg/dL)" htmlFor={`fasting-${row.id}`}>
                    <input id={`fasting-${row.id}`} type="text" inputMode="decimal" value={row.fasting} onChange={(e) => updateRow(row.id, 'fasting', e.target.value)} />
                  </FormField>
                  <FormField label="Tokluk (mg/dL)" htmlFor={`post-${row.id}`}>
                    <input id={`post-${row.id}`} type="text" inputMode="decimal" value={row.postprandial} onChange={(e) => updateRow(row.id, 'postprandial', e.target.value)} />
                  </FormField>
                </div>
                {(flags?.hasSevereLow || flags?.hasVeryHigh) && <span className="field-error">⚠️ Bu satırda kritik eşik dışında bir ölçüm var</span>}
                {flags?.hasLow && !flags?.hasSevereLow && !flags?.hasVeryHigh && <span className="hint">⚠️ Uyarı eşiğinin (70 mg/dL) altında</span>}
                {rows.length > 1 && (
                  <button type="button" className="header-home-link" style={{ justifySelf: 'start' }} onClick={() => removeRow(row.id)}>Bu günü kaldır</button>
                )}
              </div>
            );
          })}
          <button type="button" className="btn-primary" style={{ justifySelf: 'start' }} onClick={addRow}>+ Gün ekle</button>
        </div>
      </div>

      {!result.valid ? (
        <ResultError message="Ortalama ve tahmini HbA1c hesaplamak için en az bir açlık ya da tokluk ölçümü girin." />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Genel ortalama"
            value={`${formatNumber(result.overallAvg, { decimals: 0 })} mg/dL`}
            tone={tone}
            note={result.estimatedA1c ? `Tahmini HbA1c karşılığı: %${formatNumber(result.estimatedA1c, { decimals: 1 })}` : null}
            action={tone === 'danger' ? buildGlucoseAction(result) : null}
          />
          <ResultMetrics
            items={[
              { label: 'Açlık ortalaması', value: result.avgFasting ? `${formatNumber(result.avgFasting, { decimals: 0 })} mg/dL` : '—' },
              { label: 'Tokluk ortalaması', value: result.avgPostprandial ? `${formatNumber(result.avgPostprandial, { decimals: 0 })} mg/dL` : '—' },
            ]}
          />
          {tone === 'warning' && (
            <p className="rate-disclaimer">⚠️ Kayıtlarınızda uyarı eşiği (70 mg/dL) altında en az bir ölçüm var. Tekrarlayan düşük ölçümleri hekiminize bildirin.</p>
          )}
          <p className="rate-disclaimer">ℹ️ Tahmini HbA1c karşılığı, girdiğiniz ölçümlerin ortalamasından ADAG formülüyle hesaplanır; laboratuvar HbA1c sonucunun yerini tutmaz.</p>
          <DataPeriodNote period={FORMULA_DATA.period} lastUpdated={FORMULA_DATA.lastUpdated} source={FORMULA_DATA.source} />
          <DataPeriodNote period={HYPO_DATA.period} lastUpdated={HYPO_DATA.lastUpdated} source={HYPO_DATA.source} />
          <HealthResultDisclaimer />
          <PrintableMeasurementLog
            columns={PRINT_COLUMNS}
            rows={printRows}
            summaryRows={summaryRows}
            note="Bu çizelge kullanıcı tarafından girilen ev ölçümlerine dayanır; laboratuvar HbA1c sonucunun yerini tutmaz."
          />
          <p className="hint">Bu sayfanın adres çubuğundaki bağlantıyı kaydederek ölçümlerinizi daha sonra tekrar açabilir veya paylaşabilirsiniz.</p>
        </div>
      )}

      <div className="info-card">
        <h2>HbA1c ile günlük ölçüm neden farklı olabilir?</h2>
        <p>Buradaki "tahmini HbA1c" yalnızca girdiğiniz ölçümlerin ortalamasına dayanır; laboratuvarda ölçülen gerçek HbA1c, son 2-3 ayın tamamını ve ölçmediğiniz saatleri de kapsar. Az sayıda ölçüm girdiyseniz tahmin gerçek değerden sapabilir.</p>
      </div>
    </CalculatorLayout>
  );
}
