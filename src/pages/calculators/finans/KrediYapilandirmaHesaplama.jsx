import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import RelatedTools from '../../../components/RelatedTools.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateLoanRestructure } from '../../../lib/finansCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function KrediYapilandirmaHesaplama() {
  const [currentRemainingBalance, setCurrentRemainingBalance] = useQueryParamState('kalanBorc', '100000');
  const [currentInstallment, setCurrentInstallment] = useQueryParamState('mevcutTaksit', '6000');
  const [currentRemainingMonths, setCurrentRemainingMonths] = useQueryParamState('mevcutVade', '20');
  const [newMonthlyRate, setNewMonthlyRate] = useQueryParamState('yeniFaiz', '2,5');
  const [newMonths, setNewMonths] = useQueryParamState('yeniVade', '24');
  const [newFee, setNewFee] = useQueryParamState('dosyaMasrafi', '');

  const { result, error } = useMemo(() => {
    const balance = parseLocaleNumber(currentRemainingBalance);
    const installment = parseLocaleNumber(currentInstallment);
    const months = parseLocaleNumber(currentRemainingMonths);
    const rate = parseLocaleNumber(newMonthlyRate);
    const n = parseLocaleNumber(newMonths);
    const fee = parseLocaleNumber(newFee);

    if (!Number.isFinite(balance) || balance <= 0) {
      return { result: null, error: 'Lütfen geçerli bir kalan borç tutarı girin.' };
    }
    if (!Number.isFinite(installment) || installment <= 0) {
      return { result: null, error: 'Lütfen geçerli bir mevcut taksit tutarı girin.' };
    }
    if (!Number.isFinite(months) || months <= 0) {
      return { result: null, error: 'Lütfen geçerli bir mevcut kalan vade (ay) girin.' };
    }
    if (!Number.isFinite(rate) || rate < 0) {
      return { result: null, error: 'Lütfen geçerli bir yeni faiz oranı girin.' };
    }
    if (!Number.isFinite(n) || n <= 0) {
      return { result: null, error: 'Lütfen geçerli bir yeni vade (ay) girin.' };
    }

    return {
      result: calculateLoanRestructure({
        currentRemainingBalance: balance,
        currentInstallment: installment,
        currentRemainingMonths: months,
        newMonthlyRate: rate,
        newMonths: n,
        newFee: Number.isFinite(fee) ? fee : 0,
      }),
      error: null,
    };
  }, [currentRemainingBalance, currentInstallment, currentRemainingMonths, newMonthlyRate, newMonths, newFee]);

  return (
    <CalculatorLayout calculatorId="kredi-yapilandirma-hesaplama">
      <div className="calc-card">
        <h2>Mevcut kredi</h2>
        <div className="form-grid">
          <FormField label="Kalan borç (TL)" htmlFor="currentRemainingBalance">
            <AmountInput id="currentRemainingBalance" value={currentRemainingBalance} onChange={setCurrentRemainingBalance} />
          </FormField>
          <FormField label="Mevcut aylık taksit (TL)" htmlFor="currentInstallment">
            <AmountInput id="currentInstallment" value={currentInstallment} onChange={setCurrentInstallment} />
          </FormField>
          <FormField label="Mevcut kalan vade (ay)" htmlFor="currentRemainingMonths" full>
            <input id="currentRemainingMonths" type="text" inputMode="numeric" value={currentRemainingMonths} onChange={(e) => setCurrentRemainingMonths(e.target.value)} />
          </FormField>
        </div>
      </div>

      <div className="calc-card">
        <h2>Yeni yapılandırma teklifi</h2>
        <div className="form-grid">
          <FormField label="Yeni aylık faiz oranı (%)" htmlFor="newMonthlyRate">
            <input id="newMonthlyRate" type="text" inputMode="decimal" value={newMonthlyRate} onChange={(e) => setNewMonthlyRate(e.target.value)} />
          </FormField>
          <FormField label="Yeni vade (ay)" htmlFor="newMonths">
            <input id="newMonths" type="text" inputMode="numeric" value={newMonths} onChange={(e) => setNewMonths(e.target.value)} />
          </FormField>
          <FormField label="Dosya masrafı (TL, opsiyonel)" htmlFor="newFee">
            <AmountInput id="newFee" value={newFee} onChange={setNewFee} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            tone={result.isNewOfferCheaper ? undefined : 'warning'}
            label={result.isNewOfferCheaper ? 'Yeni teklif daha avantajlı' : 'Mevcut kredi ile devam etmek daha avantajlı'}
            value={formatCurrency(Math.abs(result.totalDifference))}
            note={result.isNewOfferCheaper ? 'Yapılandırma ile bu kadar daha az ödersiniz' : 'Yapılandırma ile bu kadar daha fazla ödersiniz'}
          />
          <ResultMetrics
            items={[
              { label: 'Mevcut kredi ile toplam ödeme', value: formatCurrency(result.currentTotalIfContinued) },
              { label: 'Yeni aylık taksit', value: formatCurrency(result.newMonthlyPayment) },
              { label: 'Yeni teklif ile toplam ödeme (masraf dahil)', value: formatCurrency(result.newTotalPayment) },
              { label: 'Aylık taksit farkı', value: `${result.monthlyPaymentDifference >= 0 ? '+' : ''}${formatCurrency(result.monthlyPaymentDifference)}` },
            ]}
          />
          <p className="rate-disclaimer">⚠️ Yapılandırma/refinansman teklifleri bankadan bankaya değişir; burada girdiğiniz oran ve vade sizin aldığınız TEKLİFTİR — araç bunu üretmez, sadece karşılaştırır. Erken kapatma/yapılandırma sırasında ayrıca bir masraf veya tazminat uygulanıp uygulanmayacağını bankanızdan teyit edin.</p>
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl yorumlanır?</h2>
        <ul>
          <li>"Mevcut kredi ile toplam ödeme", kalan taksitlerinizi olduğu gibi (mevcut oranla) ödemeye devam etmeniz durumunda ödeyeceğiniz toplam tutardır.</li>
          <li>"Yeni teklif ile toplam ödeme", kalan borcunuzun yeni faiz oranı ve yeni vadeyle yeniden yapılandırılması ile (varsa dosya masrafı dahil) ödeyeceğiniz toplam tutardır.</li>
          <li>Vadeyi uzatmak aylık taksiti düşürür ama genelde toplam maliyeti artırır — kısa vadede nakit akışı rahatlığı ile uzun vadede toplam maliyet artışını birlikte değerlendirin.</li>
          <li>Bu araç bir "kredi erken kapatma tazminatı" içermez; mevcut kredinizi kapatıp yeni krediye geçerken erken ödeme tazminatı doğabilirse (bkz. Kredi Erken Kapatma aracı) bunu ayrıca hesaba katın.</li>
        </ul>
        <RelatedTools items={[
          { to: '/kredi-erken-kapatma-hesaplama', label: 'Kredi Erken Kapatma' },
          { to: '/kredi-karsilastirma', label: 'İki Kredi Karşılaştırma' },
          { to: '/kredi-hesaplama', label: 'Kredi Taksiti Hesaplama' },
        ]} />
      </div>
    </CalculatorLayout>
  );
}
