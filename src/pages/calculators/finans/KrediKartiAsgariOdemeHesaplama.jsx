import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateCreditCardPayment } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatInteger, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
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

  return (
    <CalculatorLayout calculatorId="kredi-karti-asgari-odeme-hesaplama">
      <div className="calc-card">
        <h2>Kart bilgileri</h2>
        <div className="form-grid">
          <FormField label="Kart limiti (TL)" htmlFor="cardLimit" hint="Asgari ödeme oranı limite göre belirlenir">
            <input id="cardLimit" type="text" inputMode="decimal" value={cardLimit} onChange={(e) => setCardLimit(e.target.value)} />
          </FormField>
          <FormField label="Dönem borcu (TL)" htmlFor="statementBalance">
            <input id="statementBalance" type="text" inputMode="decimal" value={statementBalance} onChange={(e) => setStatementBalance(e.target.value)} />
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

      <div className="info-card">
        <h2>Nasıl yorumlanır?</h2>
        <ul>
          <li>Asgari ödeme oranı, {ASGARI_ODEME.period} BDDK düzenlemesine göre kart limiti {formatNumber(ASGARI_ODEME.esikTutar, { decimals: 0 })} TL ve altında %{formatNumber(ASGARI_ODEME.esikAltiOran * 100, { decimals: 0 })}, üzerinde %{formatNumber(ASGARI_ODEME.esikUstuOran * 100, { decimals: 0 })}'tir.</li>
          <li>Sadece asgari ödeme yapıp kalan bakiyeyi ödemezseniz, kalan tutara akdi faiz işlemeye devam eder.</li>
          <li>Ödemeyi geciktirirseniz, dönem borcunun tamamı üzerinden ayrıca gecikme (temerrüt) faizi hesaplanır.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
