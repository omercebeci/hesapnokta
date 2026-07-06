import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics } from '../../../components/Result.jsx';
import { calculateCaffeineIntake, CAFFEINE_SOURCES } from '../../../lib/saglikCalculators.js';
import { formatNumber } from '../../../utils/format.js';

let rowIdCounter = 0;
const createRow = (drinkType = 'filtreKahve', count = '1') => ({ id: rowIdCounter++, drinkType, count });

export default function KafeinTakibiHesaplama() {
  const [rows, setRows] = useState(() => [createRow('filtreKahve', '2'), createRow('kola', '1')]);
  const [isPregnant, setIsPregnant] = useState(false);

  const updateRow = (id, field, value) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };
  const addRow = () => setRows((current) => [...current, createRow()]);
  const removeRow = (id) => setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));

  const result = useMemo(() => {
    const items = rows.map((row) => ({ drinkType: row.drinkType, count: Number(row.count) }));
    return calculateCaffeineIntake({ items, isPregnant });
  }, [rows, isPregnant]);

  return (
    <CalculatorLayout calculatorId="kafein-takibi-hesaplama">
      <div className="calc-card">
        <h2>Günlük içecekleriniz</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((row, index) => (
            <div className="form-grid" key={row.id}>
              <FormField label={`${index + 1}. içecek türü`} htmlFor={`drink-${row.id}`}>
                <select id={`drink-${row.id}`} value={row.drinkType} onChange={(e) => updateRow(row.id, 'drinkType', e.target.value)}>
                  {Object.entries(CAFFEINE_SOURCES).map(([key, source]) => (
                    <option key={key} value={key}>{source.label}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Adet" htmlFor={`count-${row.id}`}>
                <input id={`count-${row.id}`} type="text" inputMode="numeric" value={row.count} onChange={(e) => updateRow(row.id, 'count', e.target.value)} />
              </FormField>
              {rows.length > 1 && (
                <button type="button" className="header-home-link" style={{ justifySelf: 'start' }} onClick={() => removeRow(row.id)}>
                  Bu satırı kaldır
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" style={{ justifySelf: 'start' }} onClick={addRow}>+ İçecek ekle</button>
          <FormField label="Gebelik / emzirme dönemindeyim" htmlFor="isPregnant" full>
            <div className="segmented" role="group" aria-label="Gebelik durumu">
              <button type="button" className={!isPregnant ? 'active' : ''} onClick={() => setIsPregnant(false)}>Hayır</button>
              <button type="button" className={isPregnant ? 'active' : ''} onClick={() => setIsPregnant(true)}>Evet</button>
            </div>
          </FormField>
        </div>
      </div>

      <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
        <ResultCard
          label="Toplam günlük kafein"
          value={`${formatNumber(result.totalMg, { decimals: 0 })} mg`}
          note={result.isOverLimit ? `Güvenli sınır olan ${result.safeLimitMg} mg aşıldı` : `Güvenli sınırın %${formatNumber(result.percentageOfLimit, { decimals: 0 })}'i`}
        />
        <ResultMetrics items={[{ label: 'Güvenli günlük üst sınır', value: `${result.safeLimitMg} mg` }]} />
      </div>

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Her içecek türü için ortalama kafein miktarı (mg) adet ile çarpılıp toplanır. EFSA'ya göre sağlıklı yetişkinlerde güvenli günlük üst sınır yaklaşık 400 mg, gebelik/emzirme döneminde ise yaklaşık 200 mg'dır. Bu değerler ortalamadır; kişisel toleransınız ve sağlık durumunuza göre daha düşük bir sınır uygun olabilir.</p>
      </div>
    </CalculatorLayout>
  );
}
