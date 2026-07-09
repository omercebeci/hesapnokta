import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateCargoShipment } from '../../../lib/alisverisCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState, serializeRows, deserializeRows } from '../../../hooks/useQueryParamState.js';

let rowIdCounter = 0;
const createRow = (lengthCm = '', widthCm = '', heightCm = '', weightKg = '', quantity = '1') => ({ id: rowIdCounter++, lengthCm, widthCm, heightCm, weightKg, quantity });
const ROW_FIELDS = ['lengthCm', 'widthCm', 'heightCm', 'weightKg', 'quantity'];
const DEFAULT_ROWS = [createRow('40', '30', '25', '8', '1')];

export default function KargoDesiHesaplama() {
  const [rows, setRows] = useQueryParamState('koliler', DEFAULT_ROWS, {
    serialize: (value) => serializeRows(value, ROW_FIELDS),
    deserialize: (text) => deserializeRows(text, ROW_FIELDS, (v) => createRow(v.lengthCm, v.widthCm, v.heightCm, v.weightKg, v.quantity)) ?? DEFAULT_ROWS,
  });

  const updateRow = (id, field, value) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };
  const addRow = () => setRows((current) => [...current, createRow()]);
  const removeRow = (id) => setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));

  const { result, error } = useMemo(() => {
    const parsedRows = rows.map((row) => ({
      lengthCm: parseLocaleNumber(row.lengthCm),
      widthCm: parseLocaleNumber(row.widthCm),
      heightCm: parseLocaleNumber(row.heightCm),
      weightKg: parseLocaleNumber(row.weightKg),
      quantity: parseLocaleNumber(row.quantity),
    }));

    const validRows = parsedRows.filter((row) => [row.lengthCm, row.widthCm, row.heightCm, row.weightKg].every((v) => Number.isFinite(v) && v > 0));

    if (validRows.length === 0) {
      return { result: null, error: 'Lütfen en az bir koli için geçerli en, boy, yükseklik ve ağırlık girin.' };
    }

    return { result: calculateCargoShipment(validRows), error: null };
  }, [rows]);

  return (
    <CalculatorLayout calculatorId="kargo-desi-hesaplama">
      <div className="calc-card">
        <h2>Koli bilgileri</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((row, index) => (
            <div className="form-grid" key={row.id}>
              <FormField label={`${index + 1}. koli — en (cm)`} htmlFor={`l-${row.id}`}>
                <input id={`l-${row.id}`} type="text" inputMode="decimal" value={row.lengthCm} onChange={(e) => updateRow(row.id, 'lengthCm', e.target.value)} />
              </FormField>
              <FormField label="Boy (cm)" htmlFor={`w-${row.id}`}>
                <input id={`w-${row.id}`} type="text" inputMode="decimal" value={row.widthCm} onChange={(e) => updateRow(row.id, 'widthCm', e.target.value)} />
              </FormField>
              <FormField label="Yükseklik (cm)" htmlFor={`h-${row.id}`}>
                <input id={`h-${row.id}`} type="text" inputMode="decimal" value={row.heightCm} onChange={(e) => updateRow(row.id, 'heightCm', e.target.value)} />
              </FormField>
              <FormField label="Ağırlık (kg)" htmlFor={`wt-${row.id}`}>
                <input id={`wt-${row.id}`} type="text" inputMode="decimal" value={row.weightKg} onChange={(e) => updateRow(row.id, 'weightKg', e.target.value)} />
              </FormField>
              <FormField label="Adet" htmlFor={`q-${row.id}`}>
                <input id={`q-${row.id}`} type="text" inputMode="numeric" value={row.quantity} onChange={(e) => updateRow(row.id, 'quantity', e.target.value)} />
              </FormField>
              {rows.length > 1 && (
                <button type="button" className="header-home-link" style={{ justifySelf: 'start' }} onClick={() => removeRow(row.id)}>
                  Bu koliyi kaldır
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" style={{ justifySelf: 'start' }} onClick={addRow}>+ Koli ekle</button>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Faturalanacak toplam ağırlık" value={`${formatNumber(result.totalBillableWeight)} kg`} note="Desi ile gerçek ağırlıktan hangisi büyükse o esas alınır" />
          <ResultMetrics
            items={[
              { label: 'Toplam desi', value: formatNumber(result.totalDesi) },
              { label: 'Toplam gerçek ağırlık', value: `${formatNumber(result.totalWeight)} kg` },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Desi nasıl hesaplanır?</h2>
        <p>Desi = (en × boy × yükseklik [cm]) ÷ 3000. Kargo firmaları her koli için desi ile gerçek ağırlığı (kg) karşılaştırır ve hangisi büyükse o değeri esas alarak faturalar; hafif ama hacimli kargolarda desi, ağır ama küçük kargolarda ise gerçek ağırlık geçerli olur.</p>
      </div>
    </CalculatorLayout>
  );
}
