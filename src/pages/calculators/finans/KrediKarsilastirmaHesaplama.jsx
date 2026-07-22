import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import RelatedTools from '../../../components/RelatedTools.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { compareTwoLoanOffers } from '../../../lib/finansCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function KrediKarsilastirmaHesaplama() {
  const [bankNameA, setBankNameA] = useQueryParamState('bankaA', '');
  const [amountA, setAmountA] = useQueryParamState('tutarA', '100000');
  const [rateA, setRateA] = useQueryParamState('faizA', '3');
  const [monthsA, setMonthsA] = useQueryParamState('vadeA', '12');
  const [feeA, setFeeA] = useQueryParamState('masrafA', '');

  const [bankNameB, setBankNameB] = useQueryParamState('bankaB', '');
  const [amountB, setAmountB] = useQueryParamState('tutarB', '100000');
  const [rateB, setRateB] = useQueryParamState('faizB', '2,75');
  const [monthsB, setMonthsB] = useQueryParamState('vadeB', '12');
  const [feeB, setFeeB] = useQueryParamState('masrafB', '');

  const { result, error } = useMemo(() => {
    const a = { amount: parseLocaleNumber(amountA), monthlyRate: parseLocaleNumber(rateA), months: parseLocaleNumber(monthsA), fee: parseLocaleNumber(feeA) || 0 };
    const b = { amount: parseLocaleNumber(amountB), monthlyRate: parseLocaleNumber(rateB), months: parseLocaleNumber(monthsB), fee: parseLocaleNumber(feeB) || 0 };

    if (!Number.isFinite(a.amount) || a.amount <= 0 || !Number.isFinite(b.amount) || b.amount <= 0) {
      return { result: null, error: 'Lütfen her iki teklif için de geçerli bir kredi tutarı girin.' };
    }
    if (!Number.isFinite(a.monthlyRate) || a.monthlyRate < 0 || !Number.isFinite(b.monthlyRate) || b.monthlyRate < 0) {
      return { result: null, error: 'Lütfen her iki teklif için de geçerli bir aylık faiz oranı girin.' };
    }
    if (!Number.isFinite(a.months) || a.months <= 0 || !Number.isFinite(b.months) || b.months <= 0) {
      return { result: null, error: 'Lütfen her iki teklif için de geçerli bir vade (ay) girin.' };
    }

    return { result: compareTwoLoanOffers({ offerA: a, offerB: b }), error: null };
  }, [amountA, rateA, monthsA, feeA, amountB, rateB, monthsB, feeB]);

  const labelA = bankNameA.trim() || 'Teklif A';
  const labelB = bankNameB.trim() || 'Teklif B';

  return (
    <CalculatorLayout calculatorId="kredi-karsilastirma">
      <div className="calc-card">
        <h2>Teklif A</h2>
        <div className="form-grid">
          <FormField label="Banka adı (opsiyonel)" htmlFor="bankNameA" full>
            <input id="bankNameA" type="text" value={bankNameA} onChange={(e) => setBankNameA(e.target.value)} placeholder="ör. X Bankası" />
          </FormField>
          <FormField label="Kredi tutarı (TL)" htmlFor="amountA">
            <AmountInput id="amountA" value={amountA} onChange={setAmountA} />
          </FormField>
          <FormField label="Aylık faiz oranı (%)" htmlFor="rateA">
            <input id="rateA" type="text" inputMode="decimal" value={rateA} onChange={(e) => setRateA(e.target.value)} />
          </FormField>
          <FormField label="Vade (ay)" htmlFor="monthsA">
            <input id="monthsA" type="text" inputMode="numeric" value={monthsA} onChange={(e) => setMonthsA(e.target.value)} />
          </FormField>
          <FormField label="Dosya masrafı (TL, opsiyonel)" htmlFor="feeA">
            <AmountInput id="feeA" value={feeA} onChange={setFeeA} />
          </FormField>
        </div>
      </div>

      <div className="calc-card">
        <h2>Teklif B</h2>
        <div className="form-grid">
          <FormField label="Banka adı (opsiyonel)" htmlFor="bankNameB" full>
            <input id="bankNameB" type="text" value={bankNameB} onChange={(e) => setBankNameB(e.target.value)} placeholder="ör. Y Bankası" />
          </FormField>
          <FormField label="Kredi tutarı (TL)" htmlFor="amountB">
            <AmountInput id="amountB" value={amountB} onChange={setAmountB} />
          </FormField>
          <FormField label="Aylık faiz oranı (%)" htmlFor="rateB">
            <input id="rateB" type="text" inputMode="decimal" value={rateB} onChange={(e) => setRateB(e.target.value)} />
          </FormField>
          <FormField label="Vade (ay)" htmlFor="monthsB">
            <input id="monthsB" type="text" inputMode="numeric" value={monthsB} onChange={(e) => setMonthsB(e.target.value)} />
          </FormField>
          <FormField label="Dosya masrafı (TL, opsiyonel)" htmlFor="feeB">
            <AmountInput id="feeB" value={feeB} onChange={setFeeB} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label={result.cheaperOffer === 'esit' ? 'İki teklif de eşit maliyetli' : `${result.cheaperOffer === 'A' ? labelA : labelB} daha ucuz`}
            value={result.cheaperOffer === 'esit' ? formatCurrency(0) : formatCurrency(result.costDifference)}
            note={result.cheaperOffer === 'esit' ? 'Toplam maliyet birebir aynı' : 'İki teklif arasındaki toplam maliyet farkı'}
          />
          <ResultMetrics
            items={[
              { label: `${labelA} — aylık taksit`, value: formatCurrency(result.offerA.monthlyPayment) },
              { label: `${labelB} — aylık taksit`, value: formatCurrency(result.offerB.monthlyPayment) },
              { label: `${labelA} — toplam maliyet`, value: formatCurrency(result.offerA.totalCost) },
              { label: `${labelB} — toplam maliyet`, value: formatCurrency(result.offerB.totalCost) },
              { label: `${labelA} — toplam faiz`, value: formatCurrency(result.offerA.totalInterest) },
              { label: `${labelB} — toplam faiz`, value: formatCurrency(result.offerB.totalInterest) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl yorumlanır?</h2>
        <ul>
          <li>"Toplam maliyet", aylık taksitlerin (vade boyunca) toplamına varsa dosya masrafının eklenmesiyle bulunur — iki teklifi adil karşılaştırmanın en doğru yolu budur (sadece faiz oranına ya da sadece aylık taksite bakmak yanıltıcı olabilir).</li>
          <li>Düşük aylık taksitli bir teklif, uzun vade nedeniyle toplamda daha PAHALIYA gelebilir — her iki metriği birlikte değerlendirin.</li>
          <li>BSMV/KKDF gibi ek vergi/fon kesintileri bu karşılaştırmaya dahil değildir; bankanızın size sunduğu "yıllık maliyet oranı"nı (yıllık maliyet oranı, tüm vergi ve masrafları içerir) da ayrıca karşılaştırmanızı öneririz.</li>
        </ul>
        <RelatedTools items={[
          { to: '/kredi-hesaplama', label: 'Kredi Taksiti Hesaplama' },
          { to: '/kredi-yapilandirma-hesaplama', label: 'Kredi Yapılandırma Karşılaştırma' },
          { to: '/kredi-notu-araligi', label: 'Kredi Notu Aralığı' },
        ]} />
      </div>
    </CalculatorLayout>
  );
}
