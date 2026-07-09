import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { convertGoldUnits, GOLD_UNIT_GRAMS } from '../../../lib/alisverisCalculators.js';
import { formatNumber, formatCurrency, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const UNIT_OPTIONS = [
  { id: 'gram', label: 'Gram Altın' },
  { id: 'ceyrek', label: 'Çeyrek Altın' },
  { id: 'yarim', label: 'Yarım Altın' },
  { id: 'tam', label: 'Tam Altın' },
  { id: 'cumhuriyet', label: 'Cumhuriyet Altını' },
];
const UNIT_LABEL = Object.fromEntries(UNIT_OPTIONS.map((opt) => [opt.id, opt.label]));

export default function AltinCevirici() {
  const [amount, setAmount] = useQueryParamState('miktar', '1');
  const [fromUnit, setFromUnit] = useQueryParamState('kaynak', 'ceyrek');
  const [toUnit, setToUnit] = useQueryParamState('hedef', 'gram');
  const [gramPrice, setGramPrice] = useQueryParamState('fiyat', '');

  const { result, error } = useMemo(() => {
    const parsedAmount = parseLocaleNumber(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return { result: null, error: 'Lütfen geçerli bir miktar girin.' };
    }
    const parsedPrice = gramPrice === '' ? 0 : parseLocaleNumber(gramPrice);

    return {
      result: convertGoldUnits({ amount: parsedAmount, fromUnit, toUnit, gramPrice: Number.isFinite(parsedPrice) ? parsedPrice : 0 }),
      error: null,
    };
  }, [amount, fromUnit, toUnit, gramPrice]);

  return (
    <CalculatorLayout calculatorId="altin-cevirici">
      <div className="calc-card">
        <h2>Çevirim bilgileri</h2>
        <div className="form-grid">
          <FormField label="Miktar" htmlFor="amount">
            <input id="amount" type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </FormField>
          <FormField label="Hangi birimden" htmlFor="fromUnit">
            <select id="fromUnit" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
              {UNIT_OPTIONS.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
            </select>
          </FormField>
          <FormField label="Hangi birime" htmlFor="toUnit">
            <select id="toUnit" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
              {UNIT_OPTIONS.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
            </select>
          </FormField>
          <FormField label="Gram fiyatı (TL, opsiyonel)" htmlFor="gramPrice" hint="Güncel kur için kuyumcunuza bakın.">
            <input id="gramPrice" type="text" inputMode="decimal" value={gramPrice} onChange={(e) => setGramPrice(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label={`${UNIT_LABEL[toUnit]} karşılığı`}
            value={`${formatNumber(result.convertedAmount)} ${UNIT_LABEL[toUnit]}`}
          />
          <ResultMetrics
            items={[
              { label: 'Toplam has gram', value: `${formatNumber(result.totalGrams)} gr` },
              ...(result.totalPrice !== null ? [{ label: 'Tahmini tutar', value: formatCurrency(result.totalPrice) }] : []),
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>
          Her altın türünün standart bir gram karşılığı vardır: çeyrek altın {formatNumber(GOLD_UNIT_GRAMS.ceyrek)} gr,
          yarım altın {formatNumber(GOLD_UNIT_GRAMS.yarim)} gr, tam altın {formatNumber(GOLD_UNIT_GRAMS.tam)} gr,
          Cumhuriyet altını {formatNumber(GOLD_UNIT_GRAMS.cumhuriyet)} gr olarak kabul edilir. Girdiğiniz miktar önce
          bu karşılıklarla grama çevrilir, ardından hedef birime bölünür. Gram fiyatı girerseniz toplam has gram
          üzerinden yaklaşık bir tutar hesaplanır; bu araçta gömülü/güncel bir kur bulunmaz, tutarı kuyumcunuzdan
          aldığınız güncel gram fiyatıyla hesaplarsınız.
        </p>
      </div>
    </CalculatorLayout>
  );
}
