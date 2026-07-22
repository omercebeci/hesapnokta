import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateSubscriptionCost } from '../../../lib/gunlukYasamCalculators.js';
import { formatCurrency, formatInteger, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState, serializeRows, deserializeRows } from '../../../hooks/useQueryParamState.js';

let rowIdCounter = 0;
const createRow = (name = '', monthlyAmount = '') => ({ id: rowIdCounter++, name, monthlyAmount });
const ROW_FIELDS = ['name', 'monthlyAmount'];
const DEFAULT_ROWS = [
  createRow('Netflix', '150'),
  createRow('Spotify', '80'),
  createRow('Bulut depolama', '45'),
];

export default function AbonelikMaliyetiHesaplama() {
  const [rows, setRows] = useQueryParamState('abonelikler', DEFAULT_ROWS, {
    serialize: (value) => serializeRows(value, ROW_FIELDS),
    deserialize: (text) => deserializeRows(text, ROW_FIELDS, (v) => createRow(v.name, v.monthlyAmount)) ?? DEFAULT_ROWS,
  });

  const updateRow = (id, field, value) => setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  const addRow = () => setRows((current) => [...current, createRow()]);
  const removeRow = (id) => setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));

  const { result, error } = useMemo(() => {
    const parsedRows = rows
      .map((row) => ({ name: row.name?.trim() || 'Abonelik', monthlyAmount: parseLocaleNumber(row.monthlyAmount) }))
      .filter((row) => Number.isFinite(row.monthlyAmount) && row.monthlyAmount > 0);

    if (parsedRows.length === 0) {
      return { result: null, error: 'Lütfen en az bir abonelik için geçerli bir aylık tutar girin.' };
    }

    return { result: calculateSubscriptionCost(parsedRows), error: null };
  }, [rows]);

  return (
    <CalculatorLayout calculatorId="abonelik-maliyeti-hesaplama">
      <div className="calc-card">
        <h2>Abonelikleriniz</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((row) => (
            <div className="form-grid" key={row.id}>
              <FormField label="Abonelik adı" htmlFor={`name-${row.id}`}>
                <input id={`name-${row.id}`} type="text" value={row.name} onChange={(e) => updateRow(row.id, 'name', e.target.value)} />
              </FormField>
              <FormField label="Aylık tutar (TL)" htmlFor={`amount-${row.id}`}>
                <AmountInput id={`amount-${row.id}`} value={row.monthlyAmount} onChange={(raw) => updateRow(row.id, 'monthlyAmount', raw)} />
              </FormField>
              {rows.length > 1 && (
                <button type="button" className="header-home-link" style={{ justifySelf: 'start' }} onClick={() => removeRow(row.id)}>
                  Bu aboneliği kaldır
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" style={{ justifySelf: 'start' }} onClick={addRow}>+ Abonelik ekle</button>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Yıllık toplam abonelik maliyeti" value={formatCurrency(result.yearlyTotal)} />
          <ResultMetrics
            items={[
              { label: 'Aylık toplam', value: formatCurrency(result.monthlyTotal) },
              { label: 'Asgari ücrete göre karşılığı', value: `Yılda ${formatInteger(result.minWageDaysPerYear)} günlük net asgari ücret` },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Neden bu kadar çarpıcı görünüyor?</h2>
        <p>
          Tek tek bakıldığında küçük görünen abonelik ücretleri, yıla yayıldığında ve net asgari ücretin günlük
          karşılığıyla kıyaslandığında toplam maliyetin ne kadar büyük olduğunu daha net gösterir. Kullanmadığınız
          veya nadiren kullandığınız abonelikleri bu listeden çıkarıp yeniden hesaplayarak potansiyel tasarrufunuzu görebilirsiniz.
        </p>
      </div>
    </CalculatorLayout>
  );
}
