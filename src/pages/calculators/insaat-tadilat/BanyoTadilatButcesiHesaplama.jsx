import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics } from '../../../components/Result.jsx';
import RatioBar from '../../../components/RatioBar.jsx';
import Icon from '../../../components/Icon.jsx';
import StepStrip from '../../../components/StepStrip.jsx';
import PrintableBudgetPlan from '../../../components/PrintableBudgetPlan.jsx';
import PrintableQuoteRequest from '../../../components/PrintableQuoteRequest.jsx';
import { calculateLineItemBudget } from '../../../lib/insaatTadilatCalculators.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState, serializeRows, deserializeRows } from '../../../hooks/useQueryParamState.js';

const STEPS = ['Yıkım', 'Su/tesisat', 'Elektrik', 'Seramik', 'Vitrifiye/Duşakabin', 'Mobilya', 'Boya/tavan'];

const ITEMS = [
  { key: 'yikim', label: 'Yıkım ve moloz atımı', defaultAmount: '5000' },
  { key: 'tesisat', label: 'Su/tesisat işleri', defaultAmount: '8000' },
  { key: 'elektrik', label: 'Elektrik tesisatı', defaultAmount: '4000' },
  { key: 'seramik', label: 'Seramik (malzeme + işçilik)', defaultAmount: '12000', linkTo: 'fayans-seramik-hesaplama', linkLabel: 'kaç kutu gerekir?' },
  { key: 'vitrifiye', label: 'Vitrifiye (klozet, lavabo, batarya)', defaultAmount: '15000' },
  { key: 'dusakabin', label: 'Duşakabin/küvet', defaultAmount: '10000' },
  { key: 'mobilya', label: 'Banyo mobilyası', defaultAmount: '9000' },
  { key: 'boya', label: 'Boya/tavan', defaultAmount: '3000', linkTo: 'boya-hesaplama', linkLabel: 'kaç litre gerekir?' },
];

const ROW_FIELDS = ['enabled', 'amount'];
const createRow = (enabled, amount) => ({ enabled, amount });
const DEFAULT_ROWS = ITEMS.map((item) => createRow('1', item.defaultAmount));

export default function BanyoTadilatButcesiHesaplama() {
  const [rows, setRows] = useQueryParamState('kalemler', DEFAULT_ROWS, {
    serialize: (value) => serializeRows(value, ROW_FIELDS),
    deserialize: (text) => {
      const parsed = deserializeRows(text, ROW_FIELDS, (v) => createRow(v.enabled, v.amount));
      return parsed && parsed.length === ITEMS.length ? parsed : DEFAULT_ROWS;
    },
  });

  const toggleRow = (index) => {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, enabled: row.enabled === '1' ? '0' : '1' } : row)));
  };
  const updateAmount = (index, value) => {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, amount: value } : row)));
  };

  const result = useMemo(() => {
    const items = rows.map((row, index) => ({
      label: ITEMS[index].label,
      amount: parseLocaleNumber(row.amount),
      enabled: row.enabled === '1',
    }));
    return calculateLineItemBudget(items);
  }, [rows]);

  return (
    <CalculatorLayout calculatorId="banyo-tadilat-butcesi-hesaplama">
      <div className="calc-card">
        <h2>Bütçe kalemleri</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem', marginTop: -6 }}>İhtiyacınız olmayan kalemleri kapatabilir, her kalem için kendi teklif tutarınızı girebilirsiniz.</p>
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((row, index) => (
            <div className="form-grid" key={ITEMS[index].key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                  <input type="checkbox" checked={row.enabled === '1'} onChange={() => toggleRow(index)} />
                  {ITEMS[index].label}
                </label>
                {ITEMS[index].linkTo && (
                  <Link to={`/${ITEMS[index].linkTo}`} className="line-item-link">
                    <Icon name="arrow-right" size={12} /> {ITEMS[index].linkLabel}
                  </Link>
                )}
              </div>
              <FormField label="Teklif/tahmini tutar (TL)" htmlFor={`amount-${ITEMS[index].key}`}>
                <AmountInput id={`amount-${ITEMS[index].key}`} value={row.amount} disabled={row.enabled !== '1'} onChange={(raw) => updateAmount(index, raw)} />
              </FormField>
            </div>
          ))}
        </div>
        <p className="hint" style={{ marginTop: 4 }}>Bu tutarlar site tarafından önerilmez; ustanızdan/satıcınızdan aldığınız güncel teklifleri girin.</p>
      </div>

      <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
        <ResultCard label="Toplam banyo tadilat bütçesi" value={formatCurrency(result.total)} />
        <ResultMetrics
          items={[
            { label: 'Açık kalem', value: `${result.enabledCount} / ${result.totalCount}` },
            ...(result.topItem ? [{ label: 'En büyük kalem', value: `${result.topItem.label} (%${formatNumber(result.topItem.ratio, { decimals: 0 })})` }] : []),
          ]}
        />
        {result.topItemWarning && (
          <p className="rate-disclaimer">⚠️ Bu kaleme dikkat: "{result.topItem.label}" tek başına bütçenin %{formatNumber(result.topItem.ratio, { decimals: 0 })}'ini oluşturuyor. Bu kalem için birden fazla teklif almanız özellikle önemli.</p>
        )}
        {result.breakdown.length > 0 && (
          <div className="result-metric" style={{ display: 'grid', gap: 16 }}>
            {result.breakdown.map((item) => (
              <RatioBar key={item.label} label={item.label} value={item.ratio} tone="accent" />
            ))}
          </div>
        )}
        <PrintableBudgetPlan items={result.breakdown} total={result.total} />
        <PrintableQuoteRequest sections={[{ heading: 'İş Kalemleri', items: result.breakdown.map((item) => ({ label: item.label })) }]} />
      </div>

      <div className="info-card">
        <h2>Nereden başlamalı?</h2>
        <StepStrip steps={STEPS} />
        <p style={{ marginTop: 12 }}>Kalemleri açıp kapatarak yalnızca yaptırmayı planladığınız işleri bütçeye dahil edebilir, birden fazla ustadan/firmadan aldığınız teklifleri karşılaştırarak buraya girebilirsiniz.</p>
      </div>
    </CalculatorLayout>
  );
}
