import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard } from '../../../components/Result.jsx';
import RatioBar from '../../../components/RatioBar.jsx';
import { calculateLineItemBudget } from '../../../lib/insaatTadilatCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState, serializeRows, deserializeRows } from '../../../hooks/useQueryParamState.js';

const ITEMS = [
  { key: 'temel', label: 'Hafriyat ve temel', defaultAmount: '150000' },
  { key: 'kabaYapi', label: 'Duvar/karkas (kaba yapı)', defaultAmount: '200000' },
  { key: 'cati', label: 'Çatı', defaultAmount: '100000' },
  { key: 'tesisat', label: 'Su/atık su tesisatı', defaultAmount: '60000' },
  { key: 'elektrik', label: 'Elektrik tesisatı', defaultAmount: '50000' },
  { key: 'sivaBoya', label: 'Sıva ve boya', defaultAmount: '70000' },
  { key: 'zemin', label: 'Zemin kaplaması', defaultAmount: '60000' },
  { key: 'dograma', label: 'Doğrama (kapı/pencere)', defaultAmount: '80000' },
  { key: 'disCephe', label: 'Dış cephe kaplama/yalıtım', defaultAmount: '90000' },
];

const ROW_FIELDS = ['enabled', 'amount'];
const createRow = (enabled, amount) => ({ enabled, amount });
const DEFAULT_ROWS = ITEMS.map((item) => createRow('1', item.defaultAmount));

export default function EvYapimMaliyetiPlanlayici() {
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
    <CalculatorLayout calculatorId="ev-yapim-maliyeti-planlayici">
      <div className="calc-card">
        <h2>Kaba yapı ve ince iş kalemleri</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem', marginTop: -6 }}>İhtiyacınız olmayan kalemleri kapatabilir (ör. hazır arsanız/temeliniz varsa "Hafriyat ve temel"i kapatabilirsiniz), her kalem için kendi teklif tutarınızı girebilirsiniz.</p>
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((row, index) => (
            <div className="form-grid" key={ITEMS[index].key}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                <input type="checkbox" checked={row.enabled === '1'} onChange={() => toggleRow(index)} />
                {ITEMS[index].label}
              </label>
              <FormField label="Teklif/tahmini tutar (TL)" htmlFor={`amount-${ITEMS[index].key}`}>
                <input
                  id={`amount-${ITEMS[index].key}`}
                  type="text"
                  inputMode="decimal"
                  value={row.amount}
                  disabled={row.enabled !== '1'}
                  onChange={(e) => updateAmount(index, e.target.value)}
                />
              </FormField>
            </div>
          ))}
        </div>
        <p className="hint" style={{ marginTop: 4 }}>Bu tutarlar site tarafından önerilmez; bölgenizdeki müteahhit/ustalardan aldığınız güncel teklifleri girin.</p>
      </div>

      <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
        <ResultCard label="Toplam tahmini yapım maliyeti" value={formatCurrency(result.total)} />
        {result.breakdown.length > 0 && (
          <div className="result-metric" style={{ display: 'grid', gap: 16 }}>
            {result.breakdown.map((item) => (
              <RatioBar key={item.label} label={item.label} value={item.ratio} tone="accent" />
            ))}
          </div>
        )}
      </div>

      <div className="info-card">
        <h2>Köyde/arsada sıfırdan ev yapımı için not</h2>
        <p>Köyde veya müstakil arsada sıfırdan ev yapımında genellikle şehir imarındaki hazır altyapı (yol, su, elektrik bağlantısı) bulunmayabilir; bu durumda "Hafriyat ve temel" ve "Dış cephe" kalemlerine ek olarak altyapı bağlantı maliyetlerini de ayrı bir kalem olarak bütçenize eklemeniz gerekebilir. Kalemlerin sırası genellikle temel → kaba yapı → çatı → tesisat/elektrik → sıva/boya → zemin/doğrama şeklindedir.</p>
      </div>
    </CalculatorLayout>
  );
}
