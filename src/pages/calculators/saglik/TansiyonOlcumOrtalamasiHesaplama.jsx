import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import HealthResultDisclaimer from '../../../components/HealthResultDisclaimer.jsx';
import PrintableMeasurementLog from '../../../components/PrintableMeasurementLog.jsx';
import { calculateBloodPressureAverages } from '../../../lib/saglikCalculators.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';
import { formatNumber, formatDateTr } from '../../../utils/format.js';
import { useQueryParamState, serializeRows, deserializeRows } from '../../../hooks/useQueryParamState.js';

const BP_CLASSIFICATION_DATA = GUNCEL_VERILER.tansiyonSiniflandirma;
const BP_EMERGENCY_DATA = GUNCEL_VERILER.hipertansifAcilEsigi;
const ROW_FIELDS = ['date', 'morningSys', 'morningDia', 'eveningSys', 'eveningDia'];

let rowIdCounter = 0;
function todayMinusDays(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
const createRow = (date = '', morningSys = '', morningDia = '', eveningSys = '', eveningDia = '') => ({
  id: rowIdCounter++, date, morningSys, morningDia, eveningSys, eveningDia,
});
const DEFAULT_ROWS = [
  createRow(todayMinusDays(2), '128', '82', '124', '80'),
  createRow(todayMinusDays(1), '131', '84', '126', '81'),
  createRow(todayMinusDays(0), '129', '83', '123', '79'),
];

const PRINT_COLUMNS = [
  { key: 'date', label: 'Tarih' },
  { key: 'morning', label: 'Sabah (S/D)' },
  { key: 'evening', label: 'Akşam (S/D)' },
  { key: 'dayAvg', label: 'Günün ortalaması' },
];

export default function TansiyonOlcumOrtalamasiHesaplama() {
  const [rows, setRows] = useQueryParamState('olcumler', DEFAULT_ROWS, {
    serialize: (value) => serializeRows(value, ROW_FIELDS),
    deserialize: (text) => {
      const parsed = deserializeRows(text, ROW_FIELDS, (v) => createRow(v.date, v.morningSys, v.morningDia, v.eveningSys, v.eveningDia));
      return parsed && parsed.length > 0 ? parsed : DEFAULT_ROWS;
    },
  });

  const updateRow = (id, field, value) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };
  const addRow = () => setRows((current) => [...current, createRow(todayMinusDays(0))]);
  const removeRow = (id) => setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));

  const result = useMemo(() => calculateBloodPressureAverages(rows), [rows]);

  const printRows = useMemo(() => rows
    .filter((row) => (row.morningSys && row.morningDia) || (row.eveningSys && row.eveningDia))
    .map((row) => {
      const hasMorning = row.morningSys && row.morningDia;
      const hasEvening = row.eveningSys && row.eveningDia;
      let dayAvg = '—';
      if (hasMorning && hasEvening) {
        const sys = Math.round((Number(row.morningSys) + Number(row.eveningSys)) / 2);
        const dia = Math.round((Number(row.morningDia) + Number(row.eveningDia)) / 2);
        dayAvg = `${sys}/${dia}`;
      } else if (hasMorning) {
        dayAvg = `${row.morningSys}/${row.morningDia}`;
      } else if (hasEvening) {
        dayAvg = `${row.eveningSys}/${row.eveningDia}`;
      }
      return {
        id: row.id,
        date: row.date ? formatDateTr(row.date) : '—',
        morning: hasMorning ? `${row.morningSys}/${row.morningDia}` : '—',
        evening: hasEvening ? `${row.eveningSys}/${row.eveningDia}` : '—',
        dayAvg,
      };
    }), [rows]);

  const summaryRows = result.valid ? [{
    label: 'Ortalamalar',
    values: {
      morning: result.morningAvgSys ? `${formatNumber(result.morningAvgSys, { decimals: 0 })}/${formatNumber(result.morningAvgDia, { decimals: 0 })}` : '—',
      evening: result.eveningAvgSys ? `${formatNumber(result.eveningAvgSys, { decimals: 0 })}/${formatNumber(result.eveningAvgDia, { decimals: 0 })}` : '—',
      dayAvg: `${formatNumber(result.overallAvgSys, { decimals: 0 })}/${formatNumber(result.overallAvgDia, { decimals: 0 })}`,
    },
  }] : [];

  return (
    <CalculatorLayout calculatorId="tansiyon-olcum-ortalamasi">
      <div className="calc-card">
        <h2>Ev ölçümleriniz</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem', marginTop: -6 }}>Her gün için sabah ve/veya akşam ölçümünüzü girin; boş bıraktığınız hücreler hesaba katılmaz.</p>
        <div style={{ display: 'grid', gap: 14 }}>
          {rows.map((row, index) => (
            <div key={row.id} style={{ display: 'grid', gap: 8, padding: '10px 0', borderBottom: index < rows.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
              <div className="form-grid">
                <FormField label={`${index + 1}. gün — tarih`} htmlFor={`date-${row.id}`}>
                  <input id={`date-${row.id}`} type="date" value={row.date} onChange={(e) => updateRow(row.id, 'date', e.target.value)} />
                </FormField>
              </div>
              <div className="form-grid">
                <FormField label="Sabah — büyük" htmlFor={`msys-${row.id}`}>
                  <input id={`msys-${row.id}`} type="text" inputMode="decimal" value={row.morningSys} onChange={(e) => updateRow(row.id, 'morningSys', e.target.value)} />
                </FormField>
                <FormField label="Sabah — küçük" htmlFor={`mdia-${row.id}`}>
                  <input id={`mdia-${row.id}`} type="text" inputMode="decimal" value={row.morningDia} onChange={(e) => updateRow(row.id, 'morningDia', e.target.value)} />
                </FormField>
                <FormField label="Akşam — büyük" htmlFor={`esys-${row.id}`}>
                  <input id={`esys-${row.id}`} type="text" inputMode="decimal" value={row.eveningSys} onChange={(e) => updateRow(row.id, 'eveningSys', e.target.value)} />
                </FormField>
                <FormField label="Akşam — küçük" htmlFor={`edia-${row.id}`}>
                  <input id={`edia-${row.id}`} type="text" inputMode="decimal" value={row.eveningDia} onChange={(e) => updateRow(row.id, 'eveningDia', e.target.value)} />
                </FormField>
              </div>
              {rows.length > 1 && (
                <button type="button" className="header-home-link" style={{ justifySelf: 'start' }} onClick={() => removeRow(row.id)}>Bu günü kaldır</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" style={{ justifySelf: 'start' }} onClick={addRow}>+ Gün ekle</button>
        </div>
      </div>

      {!result.valid ? (
        <ResultError message="Ortalama hesaplamak için en az bir günün sabah ya da akşam ölçümünü girin." />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Genel ortalama ve kategori"
            value={`${formatNumber(result.overallAvgSys, { decimals: 0 })}/${formatNumber(result.overallAvgDia, { decimals: 0 })} mmHg`}
            tone={result.assessment.category.tone}
            note={result.assessment.category.label}
            action={result.assessment.isEmergencyRange ? `Ortalama ölçümünüz ${BP_EMERGENCY_DATA.sistolik}/${BP_EMERGENCY_DATA.diastolik} mmHg eşiğinin üzerinde. Vakit kaybetmeden bir sağlık kuruluşuna başvurun; belirtileriniz de varsa 112'yi arayın.` : null}
          />
          <ResultMetrics
            items={[
              { label: 'Sabah ortalaması', value: result.morningAvgSys ? `${formatNumber(result.morningAvgSys, { decimals: 0 })}/${formatNumber(result.morningAvgDia, { decimals: 0 })} mmHg` : '—' },
              { label: 'Akşam ortalaması', value: result.eveningAvgSys ? `${formatNumber(result.eveningAvgSys, { decimals: 0 })}/${formatNumber(result.eveningAvgDia, { decimals: 0 })} mmHg` : '—' },
              { label: 'Değerlendirilen ölçüm sayısı', value: `${result.readingCount} ölçüm / ${result.dayCount} gün` },
            ]}
          />
          <DataPeriodNote period={BP_CLASSIFICATION_DATA.period} lastUpdated={BP_CLASSIFICATION_DATA.lastUpdated} source={BP_CLASSIFICATION_DATA.source} />
          <HealthResultDisclaimer />
          <PrintableMeasurementLog
            columns={PRINT_COLUMNS}
            rows={printRows}
            summaryRows={summaryRows}
            note="Bu çizelge kullanıcı tarafından girilen ev ölçümlerine dayanır; tanı ve tedavi kararı için hekiminizin poliklinik/ofis ölçümlerini esas alması gerekir."
          />
          <p className="hint">Bu sayfanın adres çubuğundaki bağlantıyı kaydederek ölçümlerinizi daha sonra tekrar açabilir veya paylaşabilirsiniz.</p>
        </div>
      )}

      <div className="info-card">
        <h2>Ev tansiyon takibi neden önemli?</h2>
        <p>Poliklinikte tek seferlik ölçülen tansiyon, "beyaz önlük etkisi" gibi nedenlerle gerçek değerinizden farklı çıkabilir. Kılavuzlar, birkaç gün boyunca sabah ve akşam alınan ölçümlerin ortalamasının daha güvenilir bir tablo verdiğini belirtir. İlk gün ölçümünü değerlendirme dışı bırakmak isterseniz o günün hücrelerini boş bırakabilirsiniz.</p>
      </div>
    </CalculatorLayout>
  );
}
