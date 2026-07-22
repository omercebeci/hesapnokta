import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import RelatedTools from '../../../components/RelatedTools.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateEarlyLoanPayoff } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const KONUT_TAZMINAT = GUNCEL_VERILER.konutKredisiErkenOdemeTazminati;
const GENEL_ERKEN_ODEME = GUNCEL_VERILER.genelTuketiciKredisiErkenOdeme;

export default function KrediErkenKapatmaHesaplama() {
  const [remainingMonths, setRemainingMonths] = useQueryParamState('kalanVade', '12');
  const [monthlyInstallment, setMonthlyInstallment] = useQueryParamState('taksit', '5000');
  const [monthlyRate, setMonthlyRate] = useQueryParamState('faiz', '3');
  const [loanType, setLoanType] = useQueryParamState('tur', 'ihtiyac-tasit');
  const [rateType, setRateType] = useQueryParamState('faizTipi', 'sabit');

  const { result, error } = useMemo(() => {
    const n = parseLocaleNumber(remainingMonths);
    const installment = parseLocaleNumber(monthlyInstallment);
    const rate = parseLocaleNumber(monthlyRate);

    if (!Number.isFinite(n) || n <= 0) {
      return { result: null, error: 'Lütfen geçerli bir kalan vade (ay) girin.' };
    }
    if (!Number.isFinite(installment) || installment <= 0) {
      return { result: null, error: 'Lütfen geçerli bir aylık taksit tutarı girin.' };
    }
    if (!Number.isFinite(rate) || rate < 0) {
      return { result: null, error: 'Lütfen geçerli bir aylık faiz oranı girin.' };
    }

    return {
      result: calculateEarlyLoanPayoff({ remainingMonths: n, monthlyInstallment: installment, monthlyRate: rate, loanType, rateType }),
      error: null,
    };
  }, [remainingMonths, monthlyInstallment, monthlyRate, loanType, rateType]);

  return (
    <CalculatorLayout calculatorId="kredi-erken-kapatma-hesaplama">
      <div className="calc-card">
        <h2>Kredi bilgileri</h2>
        <div className="form-grid">
          <FormField label="Kalan vade (ay)" htmlFor="remainingMonths">
            <input id="remainingMonths" type="text" inputMode="numeric" value={remainingMonths} onChange={(e) => setRemainingMonths(e.target.value)} />
          </FormField>
          <FormField label="Aylık taksit tutarı (TL)" htmlFor="monthlyInstallment">
            <AmountInput id="monthlyInstallment" value={monthlyInstallment} onChange={setMonthlyInstallment} />
          </FormField>
          <FormField label="Aylık faiz oranı (%)" htmlFor="monthlyRate">
            <input id="monthlyRate" type="text" inputMode="decimal" value={monthlyRate} onChange={(e) => setMonthlyRate(e.target.value)} />
          </FormField>
          <FormField label="Kredi türü" htmlFor="loanType" full>
            <div className="segmented" role="group" aria-label="Kredi türü">
              <button type="button" className={loanType === 'ihtiyac-tasit' ? 'active' : ''} onClick={() => setLoanType('ihtiyac-tasit')}>İhtiyaç / Taşıt</button>
              <button type="button" className={loanType === 'konut' ? 'active' : ''} onClick={() => setLoanType('konut')}>Konut</button>
            </div>
          </FormField>
          {loanType === 'konut' && (
            <FormField label="Faiz tipi" htmlFor="rateType" full hint="Erken ödeme tazminatı SADECE sabit faizli konut kredilerinde uygulanır">
              <div className="segmented" role="group" aria-label="Faiz tipi">
                <button type="button" className={rateType === 'sabit' ? 'active' : ''} onClick={() => setRateType('sabit')}>Sabit</button>
                <button type="button" className={rateType === 'degisken' ? 'active' : ''} onClick={() => setRateType('degisken')}>Değişken</button>
              </div>
            </FormField>
          )}
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Erken kapatma tutarı"
            value={formatCurrency(result.payoffAmount)}
            note={
              result.tazminatUygulanir
                ? `Kalan anapara (${formatCurrency(result.remainingPrincipal)}) + %${result.tazminatOrani} erken ödeme tazminatı (${formatCurrency(result.penalty)})`
                : `Kalan anaparanın tamamı — bu kredi türünde erken ödeme tazminatı alınamaz`
            }
          />
          <ResultMetrics
            items={[
              { label: 'Kalan anapara', value: formatCurrency(result.remainingPrincipal) },
              { label: 'Kredi devam etseydi toplam ödeme', value: formatCurrency(result.totalRemainingIfContinued) },
              { label: 'Kurtulunacak faiz', value: formatCurrency(result.interestSaved) },
              { label: 'Erken ödeme tazminatı', value: result.tazminatUygulanir ? formatCurrency(result.penalty) : 'Yok (yasak)' },
            ]}
          />
          <ResultCard
            tone={result.netSaving > 0 ? undefined : 'warning'}
            label="Net kazancınız"
            value={formatCurrency(result.netSaving)}
            note="Kurtulunacak faizden (varsa) erken ödeme tazminatı düşülerek hesaplanmıştır"
          />
          {result.tazminatUygulanir ? (
            <DataPeriodNote period={KONUT_TAZMINAT.period} lastUpdated={KONUT_TAZMINAT.lastUpdated} source={KONUT_TAZMINAT.source} />
          ) : (
            <DataPeriodNote period={GENEL_ERKEN_ODEME.period} lastUpdated={GENEL_ERKEN_ODEME.lastUpdated} source={GENEL_ERKEN_ODEME.source} />
          )}
          <p className="rate-disclaimer">⚠️ Bu hesaplama, kredinizin standart bir eşit taksitli (anüite) kredi olduğunu varsayar; gerçek erken kapatma tutarı için bankanızdan güncel kapanış ekstresi isteyin.</p>
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl yorumlanır?</h2>
        <ul>
          <li><strong>İhtiyaç, taşıt gibi genel tüketici kredilerinde</strong> erken ödeme tazminatı/cezası YASAKTIR — kredi veren yalnızca ödenmemiş faizi indirmekle yükümlüdür ({GENEL_ERKEN_ODEME.source}).</li>
          <li><strong>Konut kredisinde</strong> ve faiz oranı SABİT ise, kalan vadesi {KONUT_TAZMINAT.kalanVadeAyEsigi} ayı aşmayan kredilerde erken ödenen tutarın en fazla %{formatNumber(KONUT_TAZMINAT.tazminatOraniKisaVade * 100, { decimals: 0 })}'i, aşan kredilerde en fazla %{formatNumber(KONUT_TAZMINAT.tazminatOraniUzunVade * 100, { decimals: 0 })}'i tazminat olarak istenebilir ({KONUT_TAZMINAT.source}).</li>
          <li><strong>Konut kredisinde faiz DEĞİŞKEN ise</strong> erken ödeme tazminatı yine hiç istenemez.</li>
          <li>"Kalan anapara" burada, kalan taksitlerinizin bugünkü değeri olarak (anüite formülüyle) tahmin edilir; bankanızın kapanış ekstresindeki tutar küçük farklar gösterebilir.</li>
        </ul>
        <RelatedTools items={[
          { to: '/kredi-yapilandirma-hesaplama', label: 'Kredi Yapılandırma Karşılaştırma' },
          { to: '/kredi-karsilastirma', label: 'İki Kredi Karşılaştırma' },
          { to: '/kredi-notu-araligi', label: 'Kredi Notu Aralığı' },
        ]} />
      </div>
    </CalculatorLayout>
  );
}
