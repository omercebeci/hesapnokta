import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateAverageCost } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState, serializeRows, deserializeRows } from '../../../hooks/useQueryParamState.js';

let rowIdCounter = 0;
const createRow = (quantity = '', price = '') => ({ id: rowIdCounter++, quantity, price });
const ROW_FIELDS = ['quantity', 'price'];
const DEFAULT_ROWS = [createRow('10', '100'), createRow('5', '130')];

export default function OrtalamaMaliyetHesaplama() {
  const [rows, setRows] = useQueryParamState('kalemler', DEFAULT_ROWS, {
    serialize: (value) => serializeRows(value, ROW_FIELDS),
    deserialize: (text) => deserializeRows(text, ROW_FIELDS, (v) => createRow(v.quantity, v.price)) ?? DEFAULT_ROWS,
  });

  const updateRow = (id, field, value) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };
  const addRow = () => setRows((current) => [...current, createRow()]);
  const removeRow = (id) => setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));

  const { result, error } = useMemo(() => {
    const parsedRows = rows.map((row) => ({
      quantity: parseLocaleNumber(row.quantity),
      price: parseLocaleNumber(row.price),
    }));

    const validRows = parsedRows.filter((row) => Number.isFinite(row.quantity) && Number.isFinite(row.price) && row.quantity > 0);

    if (validRows.length === 0) {
      return { result: null, error: 'Lütfen en az bir alım için geçerli miktar ve fiyat girin.' };
    }

    return { result: calculateAverageCost(validRows), error: null };
  }, [rows]);

  return (
    <CalculatorLayout calculatorId="ortalama-maliyet-hesaplama">
      <div className="calc-card">
        <h2>Alım kalemleri</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((row, index) => (
            <div className="form-grid" key={row.id}>
              <FormField label={`${index + 1}. alım — miktar`} htmlFor={`qty-${row.id}`}>
                <input id={`qty-${row.id}`} type="text" inputMode="decimal" value={row.quantity} onChange={(e) => updateRow(row.id, 'quantity', e.target.value)} />
              </FormField>
              <FormField label="Birim fiyat (TL)" htmlFor={`price-${row.id}`}>
                <AmountInput id={`price-${row.id}`} value={row.price} onChange={(raw) => updateRow(row.id, 'price', raw)} />
              </FormField>
              {rows.length > 1 && (
                <button type="button" className="header-home-link" style={{ justifySelf: 'start' }} onClick={() => removeRow(row.id)}>
                  Bu satırı kaldır
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" style={{ justifySelf: 'start' }} onClick={addRow}>+ Alım ekle</button>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Ağırlıklı ortalama maliyet" value={formatCurrency(result.averageCost)} />
          <ResultMetrics
            items={[
              { label: 'Toplam miktar', value: formatNumber(result.totalQuantity) },
              { label: 'Toplam tutar', value: formatCurrency(result.totalCost) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl kullanılır?</h2>
        <p>Farklı zamanlarda farklı fiyattan yaptığınız alımların (hisse, döviz, ürün vb.) ağırlıklı ortalama maliyetini hesaplar.</p>
      </div>
    </CalculatorLayout>
  );
}
