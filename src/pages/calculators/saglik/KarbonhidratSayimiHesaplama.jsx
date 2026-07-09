import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import HealthResultDisclaimer from '../../../components/HealthResultDisclaimer.jsx';
import { calculateCarbCounting, CARB_MEAL_OPTIONS } from '../../../lib/saglikCalculators.js';
import { formatNumber } from '../../../utils/format.js';
import { useQueryParamState, serializeRows, deserializeRows } from '../../../hooks/useQueryParamState.js';

let rowIdCounter = 0;
const createRow = (meal = 'kahvalti', item = '', carbGrams = '') => ({ id: rowIdCounter++, meal, item, carbGrams });
const ROW_FIELDS = ['meal', 'item', 'carbGrams'];
const DEFAULT_ROWS = [createRow('kahvalti', '2 dilim tam buğday ekmeği', '30'), createRow('ogle', '1 kase pilav', '45')];

export default function KarbonhidratSayimiHesaplama() {
  const [rows, setRows] = useQueryParamState('kalemler', DEFAULT_ROWS, {
    serialize: (value) => serializeRows(value, ROW_FIELDS),
    deserialize: (text) => {
      const parsed = deserializeRows(text, ROW_FIELDS, (v) => createRow(v.meal, v.item, v.carbGrams));
      return parsed && parsed.length > 0 ? parsed : DEFAULT_ROWS;
    },
  });

  const updateRow = (id, field, value) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };
  const addRow = () => setRows((current) => [...current, createRow()]);
  const removeRow = (id) => setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));

  const result = useMemo(() => calculateCarbCounting(rows), [rows]);

  return (
    <CalculatorLayout calculatorId="karbonhidrat-sayimi">
      <div className="calc-card">
        <h2>Öğün kalemleriniz</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem', marginTop: -6 }}>Karbonhidrat gramını ürün etiketinden veya diyetisyeninizin size verdiği listeden alıp girin; bu araç bir gıda veritabanı içermez.</p>
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((row, index) => (
            <div className="form-grid" key={row.id}>
              <FormField label={`${index + 1}. kalem — öğün`} htmlFor={`meal-${row.id}`}>
                <select id={`meal-${row.id}`} value={row.meal} onChange={(e) => updateRow(row.id, 'meal', e.target.value)}>
                  {CARB_MEAL_OPTIONS.map((opt) => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                </select>
              </FormField>
              <FormField label="Besin (isteğe bağlı)" htmlFor={`item-${row.id}`}>
                <input id={`item-${row.id}`} type="text" value={row.item} onChange={(e) => updateRow(row.id, 'item', e.target.value)} placeholder="ör. 2 dilim ekmek" />
              </FormField>
              <FormField label="Karbonhidrat (g)" htmlFor={`carb-${row.id}`}>
                <input id={`carb-${row.id}`} type="text" inputMode="decimal" value={row.carbGrams} onChange={(e) => updateRow(row.id, 'carbGrams', e.target.value)} />
              </FormField>
              {rows.length > 1 && (
                <button type="button" className="header-home-link" style={{ justifySelf: 'start' }} onClick={() => removeRow(row.id)}>Bu kalemi kaldır</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" style={{ justifySelf: 'start' }} onClick={addRow}>+ Kalem ekle</button>
        </div>
      </div>

      {!result.valid ? (
        <ResultError message="Toplamı görmek için en az bir kalem için karbonhidrat gramı girin." />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Günlük toplam karbonhidrat" value={`${formatNumber(result.dailyTotal, { decimals: 0 })} g`} note={`${result.itemCount} kalem`} />
          <ResultMetrics items={result.mealTotals.map((meal) => ({ label: meal.label, value: `${formatNumber(meal.total, { decimals: 0 })} g` }))} />
          <HealthResultDisclaimer />
        </div>
      )}

      <div className="info-card">
        <h2>Karbonhidrat sayımı nasıl kullanılır?</h2>
        <p>Bu araç yalnızca girdiğiniz gramları öğün ve gün bazında toplar; insülin dozu hesaplamaz ve bir gıda veritabanı içermez. Karbonhidrat/insülin oranınız ve doz ayarlamaları hekiminiz ve diyetisyeninizle birlikte belirlenmelidir.</p>
      </div>
    </CalculatorLayout>
  );
}
