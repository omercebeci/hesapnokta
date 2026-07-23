import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics } from '../../../components/Result.jsx';
import PrintableHakedisPlan from '../../../components/PrintableHakedisPlan.jsx';
import { calculateHakedisSummary } from '../../../lib/insaatTadilatCalculators.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState, serializeRows, deserializeRows } from '../../../hooks/useQueryParamState.js';

let rowIdCounter = 0;
const createRow = (label = '', amount = '', percentComplete = '0') => ({ id: rowIdCounter++, label, amount, percentComplete });
const ROW_FIELDS = ['label', 'amount', 'percentComplete'];
const DEFAULT_ROWS = [
  createRow('Yıkım ve tesisat', '15000', '0'),
  createRow('Sıva ve seramik', '35000', '0'),
  createRow('Boya ve zemin kaplaması', '25000', '0'),
];

export default function TadilatHakedisTakibi() {
  const [rows, setRows] = useQueryParamState('kalemler', DEFAULT_ROWS, {
    serialize: (value) => serializeRows(value, ROW_FIELDS),
    deserialize: (text) => deserializeRows(text, ROW_FIELDS, (v) => createRow(v.label, v.amount, v.percentComplete)) ?? DEFAULT_ROWS,
  });
  const [paidAmount, setPaidAmount] = useQueryParamState('odenen', '');

  const updateRow = (id, field, value) => setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  const addRow = () => setRows((current) => [...current, createRow()]);
  const removeRow = (id) => setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));

  const result = useMemo(() => {
    const items = rows
      .map((row) => ({
        label: row.label?.trim() || 'İş kalemi',
        amount: parseLocaleNumber(row.amount),
        percentComplete: parseLocaleNumber(row.percentComplete),
      }))
      .filter((row) => Number.isFinite(row.amount) && row.amount > 0)
      .map((row) => ({ ...row, percentComplete: Number.isFinite(row.percentComplete) ? row.percentComplete : 0 }));

    const parsedPaid = parseLocaleNumber(paidAmount);
    return calculateHakedisSummary({ items, paidAmount: Number.isFinite(parsedPaid) ? parsedPaid : 0 });
  }, [rows, paidAmount]);

  return (
    <CalculatorLayout calculatorId="tadilat-hakedis-takibi">
      <div className="calc-card">
        <h2>İş kalemleri ve tamamlanma oranları</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem', marginTop: -6 }}>Sözleşmenizdeki/anlaştığınız iş kalemlerini ve her birinin tamamlanma yüzdesini girin.</p>
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((row) => (
            <div className="form-grid" key={row.id}>
              <FormField label="Kalem adı" htmlFor={`label-${row.id}`}>
                <input id={`label-${row.id}`} type="text" value={row.label} onChange={(e) => updateRow(row.id, 'label', e.target.value)} />
              </FormField>
              <FormField label="Sözleşme bedeli (TL)" htmlFor={`amount-${row.id}`}>
                <AmountInput id={`amount-${row.id}`} value={row.amount} onChange={(raw) => updateRow(row.id, 'amount', raw)} />
              </FormField>
              <FormField label="Tamamlanma (%)" htmlFor={`percent-${row.id}`}>
                <input id={`percent-${row.id}`} type="text" inputMode="numeric" value={row.percentComplete} onChange={(e) => updateRow(row.id, 'percentComplete', e.target.value)} />
              </FormField>
              {rows.length > 1 && (
                <button type="button" className="header-home-link" style={{ justifySelf: 'start' }} onClick={() => removeRow(row.id)}>
                  Bu kalemi kaldır
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" style={{ justifySelf: 'start' }} onClick={addRow}>+ Kalem ekle</button>
        </div>
        <FormField label="Bugüne kadar ödediğiniz toplam tutar (TL)" htmlFor="paidAmount" full>
          <AmountInput id="paidAmount" value={paidAmount} onChange={setPaidAmount} />
        </FormField>
      </div>

      <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
        <ResultCard
          label="Genel tamamlanma oranı"
          value={`%${formatNumber(result.overallCompletionPercent, { decimals: 0 })}`}
          note={`Hak edilen tutar: ${formatCurrency(result.totalEarnedAmount)} / Sözleşme bedeli: ${formatCurrency(result.totalContractAmount)}`}
          tone={result.overpaymentRisk ? 'warning' : undefined}
        />
        <ResultMetrics
          items={[
            { label: 'Toplam sözleşme bedeli', value: formatCurrency(result.totalContractAmount) },
            { label: 'Hak edilen tutar (tamamlanma oranına göre)', value: formatCurrency(result.totalEarnedAmount) },
            { label: 'Ödenen toplam', value: formatCurrency(result.totalPaidAmount) },
            { label: result.balance >= 0 ? 'Hak edilenden fazla ödenen' : 'Ödenmesi kalan tutar', value: formatCurrency(Math.abs(result.balance)) },
          ]}
        />
        {result.overpaymentRisk && (
          <p className="rate-disclaimer">⚠️ Peşin ödeme riski: Ödediğiniz tutar, kalemlerin tamamlanma oranına göre hak edilen tutardan belirgin şekilde fazla ({formatCurrency(result.balance)}). Bu, işin geri kalanının tamamlanmasını garanti etmez; ilerideki ödemeleri iş ilerledikçe, tamamlanan kısma göre yapmanız genel olarak daha güvenli bir yaklaşımdır.</p>
        )}
        <PrintableHakedisPlan
          items={result.items}
          totalContractAmount={result.totalContractAmount}
          totalEarnedAmount={result.totalEarnedAmount}
          totalPaidAmount={result.totalPaidAmount}
          balance={result.balance}
        />
      </div>

      <div className="info-card">
        <h2>Ödeme planlamasında yaygın iyi uygulamalar</h2>
        <p>Bu bölüm genel bilgilendirme amaçlıdır, hukuki tavsiye değildir; kendi sözleşmenizdeki koşullar esastır.</p>
        <ul>
          <li>İşe başlamadan önce yazılı bir sözleşme yapmak (kapsam, kalemler, birim fiyatlar, süre) ileride yaşanabilecek anlaşmazlıkları azaltır.</li>
          <li>Yaygın olarak tercih edilen bir yaklaşım: başlangıçta malzeme için makul bir avans, iş ilerledikçe tamamlanan kısma göre ara ödemeler, son dilimin ise iş bitip kontrol edildikten sonra ödenmesidir. Oranlar projeye ve tarafların anlaşmasına göre değişir.</li>
          <li>Her ödeme öncesi, o ana kadar tamamlanan işi birlikte gözden geçirip (mümkünse yazılı/fotoğraflı) not almak, bu araçtaki gibi bir takip tablosunu güncel tutmayı kolaylaştırır.</li>
          <li>Büyük tutarlı tek seferlik peşin ödemelerden kaçınmak, iş tamamlanmadan önce ödenen tutarın işin gerçek karşılığını aşmasını önler.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
