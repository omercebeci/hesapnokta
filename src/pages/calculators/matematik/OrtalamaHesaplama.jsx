import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateAverage } from '../../../lib/matematikCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState, serializeRows, deserializeRows } from '../../../hooks/useQueryParamState.js';

let rowIdCounter = 0;
const createRow = (value = '', weight = '1') => ({ id: rowIdCounter++, value, weight });
const ROW_FIELDS = ['value', 'weight'];
const DEFAULT_ROWS = [createRow('70', '40'), createRow('85', '60')];

export default function OrtalamaHesaplama() {
  const [rows, setRows] = useQueryParamState('degerler', DEFAULT_ROWS, {
    serialize: (value) => serializeRows(value, ROW_FIELDS),
    deserialize: (text) => deserializeRows(text, ROW_FIELDS, (v) => createRow(v.value, v.weight)) ?? DEFAULT_ROWS,
  });

  const updateRow = (id, field, value) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };
  const addRow = () => setRows((current) => [...current, createRow()]);
  const removeRow = (id) => setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));

  const { result, error } = useMemo(() => {
    const parsedRows = rows.map((row) => ({
      value: parseLocaleNumber(row.value),
      weight: parseLocaleNumber(row.weight),
    }));

    const validRows = parsedRows.filter((row) => Number.isFinite(row.value) && Number.isFinite(row.weight) && row.weight > 0);
    if (validRows.length === 0) {
      return { result: null, error: 'Lütfen en az bir değer ve geçerli bir ağırlık/kredi girin.' };
    }

    return { result: calculateAverage(validRows), error: null };
  }, [rows]);

  return (
    <CalculatorLayout calculatorId="ortalama-hesaplama">
      <div className="calc-card">
        <h2>Değerler</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((row, index) => (
            <div className="form-grid" key={row.id}>
              <FormField label={`${index + 1}. değer (ör. not)`} htmlFor={`value-${row.id}`}>
                <input id={`value-${row.id}`} type="text" inputMode="decimal" value={row.value} onChange={(e) => updateRow(row.id, 'value', e.target.value)} />
              </FormField>
              <FormField label="Ağırlık / kredi (opsiyonel)" htmlFor={`weight-${row.id}`} hint="Basit ortalama için hepsine 1 yazın">
                <input id={`weight-${row.id}`} type="text" inputMode="decimal" value={row.weight} onChange={(e) => updateRow(row.id, 'weight', e.target.value)} />
              </FormField>
              {rows.length > 1 && (
                <button type="button" className="header-home-link" style={{ justifySelf: 'start' }} onClick={() => removeRow(row.id)}>
                  Bu satırı kaldır
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" style={{ justifySelf: 'start' }} onClick={addRow}>+ Değer ekle</button>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Ağırlıklı ortalama" value={formatNumber(result.weightedAverage)} />
          <ResultMetrics
            items={[
              { label: 'Basit ortalama', value: formatNumber(result.simpleAverage) },
              { label: 'Toplam ağırlık', value: formatNumber(result.totalWeight) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl kullanılır?</h2>
        <p>Basit ortalama tüm değerleri eşit sayar. Ağırlıklı ortalama, her değerin ağırlık/kredi alanına girdiğiniz katsayıyla çarpılıp toplamın toplam ağırlığa bölünmesiyle bulunur — örneğin vize %40, final %60 ağırlıklı not ortalaması hesabı için kullanılabilir.</p>
      </div>
    </CalculatorLayout>
  );
}
