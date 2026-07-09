import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateRecipeScale } from '../../../lib/gunlukYasamCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState, serializeRows, deserializeRows } from '../../../hooks/useQueryParamState.js';

let rowIdCounter = 0;
const createRow = (name = '', amount = '', unit = 'gram') => ({ id: rowIdCounter++, name, amount, unit });
const ROW_FIELDS = ['name', 'amount', 'unit'];
const DEFAULT_ROWS = [
  createRow('Un', '400', 'gram'),
  createRow('Şeker', '200', 'gram'),
  createRow('Yumurta', '2', 'adet'),
  createRow('Süt', '250', 'ml'),
];

export default function TarifPorsiyonOlceklemeHesaplama() {
  const [originalServings, setOriginalServings] = useQueryParamState('mevcutPorsiyon', '4');
  const [targetServings, setTargetServings] = useQueryParamState('hedefPorsiyon', '7');
  const [rows, setRows] = useQueryParamState('malzemeler', DEFAULT_ROWS, {
    serialize: (value) => serializeRows(value, ROW_FIELDS),
    deserialize: (text) => deserializeRows(text, ROW_FIELDS, (v) => createRow(v.name, v.amount, v.unit)) ?? DEFAULT_ROWS,
  });

  const updateRow = (id, field, value) => setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  const addRow = () => setRows((current) => [...current, createRow()]);
  const removeRow = (id) => setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));

  const { result, error } = useMemo(() => {
    const parsedOriginal = parseLocaleNumber(originalServings);
    const parsedTarget = parseLocaleNumber(targetServings);

    if (!Number.isFinite(parsedOriginal) || parsedOriginal <= 0) {
      return { result: null, error: 'Lütfen tarifin mevcut porsiyon sayısını girin.' };
    }
    if (!Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      return { result: null, error: 'Lütfen hedef porsiyon sayısını girin.' };
    }

    const parsedIngredients = rows
      .map((row) => ({ name: row.name?.trim() || 'Malzeme', unit: row.unit, amount: parseLocaleNumber(row.amount) }))
      .filter((row) => Number.isFinite(row.amount) && row.amount > 0);

    if (parsedIngredients.length === 0) {
      return { result: null, error: 'Lütfen en az bir malzeme için geçerli bir miktar girin.' };
    }

    return {
      result: calculateRecipeScale({ originalServings: parsedOriginal, targetServings: parsedTarget, ingredients: parsedIngredients }),
      error: null,
    };
  }, [originalServings, targetServings, rows]);

  return (
    <CalculatorLayout calculatorId="tarif-porsiyon-olcekleme-hesaplama">
      <div className="calc-card">
        <h2>Porsiyon bilgisi</h2>
        <div className="form-grid">
          <FormField label="Tarifin mevcut porsiyon sayısı" htmlFor="originalServings">
            <input id="originalServings" type="text" inputMode="decimal" value={originalServings} onChange={(e) => setOriginalServings(e.target.value)} />
          </FormField>
          <FormField label="Hedef porsiyon sayısı" htmlFor="targetServings">
            <input id="targetServings" type="text" inputMode="decimal" value={targetServings} onChange={(e) => setTargetServings(e.target.value)} />
          </FormField>
        </div>
      </div>

      <div className="calc-card">
        <h2>Malzeme listesi</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((row) => (
            <div className="form-grid" key={row.id}>
              <FormField label="Malzeme" htmlFor={`name-${row.id}`}>
                <input id={`name-${row.id}`} type="text" value={row.name} onChange={(e) => updateRow(row.id, 'name', e.target.value)} />
              </FormField>
              <FormField label="Miktar" htmlFor={`amount-${row.id}`}>
                <input id={`amount-${row.id}`} type="text" inputMode="decimal" value={row.amount} onChange={(e) => updateRow(row.id, 'amount', e.target.value)} />
              </FormField>
              <FormField label="Birim" htmlFor={`unit-${row.id}`}>
                <input id={`unit-${row.id}`} type="text" value={row.unit} onChange={(e) => updateRow(row.id, 'unit', e.target.value)} placeholder="gram, ml, adet, yk..." />
              </FormField>
              {rows.length > 1 && (
                <button type="button" className="header-home-link" style={{ justifySelf: 'start' }} onClick={() => removeRow(row.id)}>
                  Bu malzemeyi kaldır
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" style={{ justifySelf: 'start' }} onClick={addRow}>+ Malzeme ekle</button>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Ölçekleme oranı" value={`× ${formatNumber(result.ratio)}`} />
          <ResultMetrics
            items={result.scaledIngredients.map((ing) => ({
              label: ing.name,
              value: `${formatNumber(ing.scaledAmount)} ${ing.unit}`,
            }))}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>
          Ölçekleme oranı, hedef porsiyon sayısının mevcut porsiyon sayısına bölünmesiyle bulunur (ör. 4 kişilik
          tarifi 7 kişiye çıkarmak için oran 7 ÷ 4 = 1,75'tir). Her malzemenin miktarı bu oranla çarpılır. Yumurta
          gibi bölünemeyen malzemelerde çıkan ondalıklı sonucu tarifin gerektirdiği şekilde yuvarlayabilirsiniz;
          tuz, baharat gibi tada göre ayarlanan malzemelerde ise oranı bir başlangıç noktası olarak kullanıp damak tadınıza göre düzeltme yapmanız önerilir.
        </p>
      </div>
    </CalculatorLayout>
  );
}
