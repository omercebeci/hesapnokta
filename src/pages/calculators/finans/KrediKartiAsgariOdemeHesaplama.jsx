import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import DebtPayoffChart from '../../../components/DebtPayoffChart.jsx';
import RelatedTools from '../../../components/RelatedTools.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateCreditCardPayment, simulateMinimumPaymentPayoff, simulateFixedPaymentPayoff } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatInteger, formatNumber, formatPercent, parseLocaleNumber } from '../../../utils/format.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const FAIZ_ORANLARI = GUNCEL_VERILER.krediKartiFaizOranlari;
const ASGARI_ODEME = GUNCEL_VERILER.krediKartiAsgariOdeme;
const EN_DUSUK_DILIM = FAIZ_ORANLARI.value[0];

export default function KrediKartiAsgariOdemeHesaplama() {
  const [cardLimit, setCardLimit] = useQueryParamState('limit', '30000');
  const [statementBalance, setStatementBalance] = useQueryParamState('borc', '10000');
  const [monthlyInterestRate, setMonthlyInterestRate] = useQueryParamState('faiz', String(EN_DUSUK_DILIM.akdiFaiz * 100));
  const [lateInterestRate, setLateInterestRate] = useQueryParamState('gecikmeFaiz', String(EN_DUSUK_DILIM.gecikmeFaizi * 100));
  const [daysLate, setDaysLate] = useQueryParamState('gecikmeGun', '0');
  const [fixedPayment, setFixedPayment] = useQueryParamState('sabitOdeme', '');

  const { result, error } = useMemo(() => {
    const parsedLimit = parseLocaleNumber(cardLimit);
    const parsedBalance = parseLocaleNumber(statementBalance);
    const parsedMonthlyRate = parseLocaleNumber(monthlyInterestRate);
    const parsedLateRate = parseLocaleNumber(lateInterestRate);
    const parsedDaysLate = parseLocaleNumber(daysLate);

    if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
      return { result: null, error: 'Lütfen geçerli bir kart limiti girin.' };
    }
    if (!Number.isFinite(parsedBalance) || parsedBalance <= 0) {
      return { result: null, error: 'Lütfen geçerli bir dönem borcu girin.' };
    }

    return {
      result: calculateCreditCardPayment({
        cardLimit: parsedLimit,
        statementBalance: parsedBalance,
        monthlyInterestRate: Number.isFinite(parsedMonthlyRate) ? parsedMonthlyRate : EN_DUSUK_DILIM.akdiFaiz * 100,
        lateInterestRate: Number.isFinite(parsedLateRate) ? parsedLateRate : EN_DUSUK_DILIM.gecikmeFaizi * 100,
        daysLate: Number.isFinite(parsedDaysLate) ? parsedDaysLate : 0,
      }),
      error: null,
    };
  }, [cardLimit, statementBalance, monthlyInterestRate, lateInterestRate, daysLate]);

  const payoffSimulation = useMemo(() => {
    if (error || !result) return null;
    const parsedLimit = parseLocaleNumber(cardLimit);
    const parsedBalance = parseLocaleNumber(statementBalance);
    const parsedMonthlyRate = parseLocaleNumber(monthlyInterestRate);
    const parsedFixedPayment = parseLocaleNumber(fixedPayment);

    const minimumOnly = simulateMinimumPaymentPayoff({
      cardLimit: parsedLimit,
      statementBalance: parsedBalance,
      monthlyInterestRate: parsedMonthlyRate,
    });

    const hasFixedComparison = Number.isFinite(parsedFixedPayment) && parsedFixedPayment > 0;
    const fixed = hasFixedComparison
      ? simulateFixedPaymentPayoff({ statementBalance: parsedBalance, monthlyInterestRate: parsedMonthlyRate, fixedPayment: parsedFixedPayment })
      : null;

    return { minimumOnly, fixed, hasFixedComparison, startBalance: parsedBalance };
  }, [error, result, cardLimit, statementBalance, monthlyInterestRate, fixedPayment]);

  return (
    <CalculatorLayout calculatorId="kredi-karti-asgari-odeme-hesaplama">
      <div className="calc-card">
        <h2>Kart bilgileri</h2>
        <div className="form-grid">
          <FormField label="Kart limiti (TL)" htmlFor="cardLimit" hint="Asgari ödeme oranı limite göre belirlenir">
            <AmountInput id="cardLimit" value={cardLimit} onChange={setCardLimit} />
          </FormField>
          <FormField label="Dönem borcu (TL)" htmlFor="statementBalance">
            <AmountInput id="statementBalance" value={statementBalance} onChange={setStatementBalance} />
          </FormField>
          <FormField label="Aylık akdi faiz (%)" htmlFor="monthlyInterestRate">
            <input id="monthlyInterestRate" type="text" inputMode="decimal" value={monthlyInterestRate} onChange={(e) => setMonthlyInterestRate(e.target.value)} />
          </FormField>
          <FormField label="Aylık gecikme faizi (%)" htmlFor="lateInterestRate">
            <input id="lateInterestRate" type="text" inputMode="decimal" value={lateInterestRate} onChange={(e) => setLateInterestRate(e.target.value)} />
          </FormField>
          <FormField label="Gecikilen gün sayısı" htmlFor="daysLate" full hint="Gecikme yoksa 0 bırakın">
            <input id="daysLate" type="text" inputMode="numeric" value={daysLate} onChange={(e) => setDaysLate(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label={`Asgari ödeme tutarı (%${formatInteger(result.minimumPaymentRate)})`}
            value={formatCurrency(result.minimumPayment)}
            note="Yalnızca asgari ödeme yapılırsa kalan bakiyeye faiz işlemeye devam eder"
          />
          <ResultMetrics
            items={[
              { label: 'Kalan bakiye', value: formatCurrency(result.remainingIfMinimumPaid) },
              { label: 'Sonraki dönem faizi', value: formatCurrency(result.nextCycleInterest) },
              { label: 'Gecikme faizi', value: formatCurrency(result.lateInterestAmount) },
              { label: 'Sonraki dönem toplam borç', value: formatCurrency(result.totalNextCycleDebt) },
            ]}
          />
          <DataPeriodNote period={FAIZ_ORANLARI.period} lastUpdated={FAIZ_ORANLARI.lastUpdated} source={FAIZ_ORANLARI.source} />
          <p className="rate-disclaimer">⚠️ Akdi/gecikme faizi oranları TCMB tarafından belirlenen azami oranlardır ve bankanız daha düşük uygulayabilir; oranlar değişmiş olabilir, güncel değerleri kart ekstrenizden kontrol edin.</p>
        </div>
      )}

      {!error && payoffSimulation && (
        <div className="calc-card" style={{ gridColumn: '1 / -1' }}>
          <h2>Sadece asgariyi ödersem borcum kaç ayda kapanır?</h2>
          <p className="hint" style={{ marginBottom: 12 }}>
            Her ay yalnızca o ayın asgari tutarını ödediğinizi (aylık akdi faiz oranı sabit kalmak üzere) varsayan bir simülasyondur. Asgari ödeme tutarı her ay kalan bakiyeye göre yeniden hesaplanır.
          </p>
          <div className="form-grid">
            <FormField label="Karşılaştırma için sabit aylık ödeme (TL, opsiyonel)" htmlFor="fixedPayment" full hint="Asgari yerine her ay sabit bir tutar ödeseydiniz farkı görün">
              <AmountInput id="fixedPayment" value={fixedPayment} onChange={setFixedPayment} />
            </FormField>
          </div>

          {payoffSimulation.minimumOnly.neverPaysOff ? (
            <ResultCard
              tone="danger"
              label="Bu senaryoda borç asla kapanmıyor"
              value="Süresiz büyüyor"
              note={`Aylık %${formatNumber(parseLocaleNumber(monthlyInterestRate), { decimals: 2 })} faiz, asgari ödemenin karşıladığından daha hızlı işliyor.`}
              action="Sadece asgari ödemeye devam ederseniz borcunuz KÜÇÜLMEZ, tam tersine büyümeye devam eder — mutlaka asgarinin üzerinde ödeme yapın."
            />
          ) : (
            <>
              <ResultMetrics
                items={[
                  { label: 'Kapanma süresi', value: `${formatInteger(payoffSimulation.minimumOnly.monthsToPayoff)} ay` },
                  { label: 'Ödenen toplam', value: formatCurrency(payoffSimulation.minimumOnly.totalPaid) },
                  { label: 'Toplam faiz', value: formatCurrency(payoffSimulation.minimumOnly.totalInterest) },
                  { label: 'Faiz / anapara oranı', value: formatPercent(payoffSimulation.minimumOnly.interestToPrincipalRatio, { decimals: 0 }) },
                ]}
              />
              <p className="rate-disclaimer">⚠️ Yalnızca asgari ödeyerek bu krediyi kapatmak {formatInteger(payoffSimulation.minimumOnly.monthsToPayoff)} ay sürüyor ve anaparanın %{formatNumber(payoffSimulation.minimumOnly.interestToPrincipalRatio, { decimals: 0 })}'i kadar ekstra faiz ödüyorsunuz.</p>
            </>
          )}

          {payoffSimulation.hasFixedComparison && (
            payoffSimulation.fixed.neverPaysOff ? (
              <ResultCard
                tone="danger"
                label="Sabit ödeme senaryosunda da borç kapanmıyor"
                value="Süresiz büyüyor"
                note="Girdiğiniz sabit tutar bu bakiyenin aylık faizini bile karşılamıyor."
                action="Sabit ödeme tutarını, en azından ilk ayki faiz tutarının üzerine çıkacak şekilde artırın."
              />
            ) : (
              <div className="calc-card" style={{ marginTop: 14, background: 'var(--bg-soft)' }}>
                <h2 style={{ fontSize: '1.05rem' }}>Karşılaştırma: asgari yerine ayda {formatCurrency(parseLocaleNumber(fixedPayment))} ödeseydiniz</h2>
                <ResultMetrics
                  items={[
                    { label: 'Asgari ile kapanma', value: `${formatInteger(payoffSimulation.minimumOnly.monthsToPayoff)} ay` },
                    { label: 'Sabit ödeme ile kapanma', value: `${formatInteger(payoffSimulation.fixed.monthsToPayoff)} ay` },
                    { label: 'Asgari ile toplam faiz', value: formatCurrency(payoffSimulation.minimumOnly.totalInterest) },
                    { label: 'Sabit ödeme ile toplam faiz', value: formatCurrency(payoffSimulation.fixed.totalInterest) },
                  ]}
                />
                <p className="rate-disclaimer">
                  {payoffSimulation.minimumOnly.monthsToPayoff - payoffSimulation.fixed.monthsToPayoff > 0
                    ? `Sabit ödeme ile ${formatInteger(payoffSimulation.minimumOnly.monthsToPayoff - payoffSimulation.fixed.monthsToPayoff)} ay daha erken kapanır ve ${formatCurrency(payoffSimulation.minimumOnly.totalInterest - payoffSimulation.fixed.totalInterest)} daha az faiz ödersiniz.`
                    : 'Girdiğiniz sabit tutar asgari ödemeden düşük kaldığı için bir avantaj sağlamıyor.'}
                </p>
              </div>
            )
          )}

          {!payoffSimulation.minimumOnly.neverPaysOff && (
            <div style={{ marginTop: 14 }}>
              <DebtPayoffChart
                ariaLabel="Borç erime grafiği"
                series={[
                  {
                    label: 'Sadece asgari ödeme',
                    color: 'var(--chart-line-1)',
                    data: [{ month: 0, remaining: payoffSimulation.startBalance }, ...payoffSimulation.minimumOnly.schedule],
                  },
                  ...(payoffSimulation.hasFixedComparison && !payoffSimulation.fixed.neverPaysOff ? [{
                    label: 'Sabit ödeme',
                    color: 'var(--chart-line-2)',
                    data: [{ month: 0, remaining: payoffSimulation.startBalance }, ...payoffSimulation.fixed.schedule],
                  }] : []),
                ]}
              />
            </div>
          )}
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl yorumlanır?</h2>
        <ul>
          <li>Asgari ödeme oranı, {ASGARI_ODEME.period} BDDK düzenlemesine göre kart limiti {formatNumber(ASGARI_ODEME.esikTutar, { decimals: 0 })} TL ve altında %{formatNumber(ASGARI_ODEME.esikAltiOran * 100, { decimals: 0 })}, üzerinde %{formatNumber(ASGARI_ODEME.esikUstuOran * 100, { decimals: 0 })}'tir.</li>
          <li>Sadece asgari ödeme yapıp kalan bakiyeyi ödemezseniz, kalan tutara akdi faiz işlemeye devam eder.</li>
          <li>Ödemeyi geciktirirseniz, dönem borcunun tamamı üzerinden ayrıca gecikme (temerrüt) faizi hesaplanır.</li>
        </ul>
        <RelatedTools items={[
          { to: '/kredi-gecikme-faizi-hesaplama', label: 'Kredi Gecikme Faizi' },
          { to: '/kredi-notu-araligi', label: 'Kredi Notu Aralığı' },
          { to: '/taksit-karsilastirma-hesaplama', label: 'Taksit Karşılaştırma' },
        ]} />
      </div>
    </CalculatorLayout>
  );
}
