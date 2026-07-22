import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import RelatedTools from '../../../components/RelatedTools.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateLoanLateFee } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const GECIKME_FAIZI_VERISI = GUNCEL_VERILER.tuketiciKredisiGecikmeFaizTavani;

export default function KrediGecikmeFaiziHesaplama() {
  const [installmentAmount, setInstallmentAmount] = useQueryParamState('taksit', '5000');
  const [daysLate, setDaysLate] = useQueryParamState('gecikmeGun', '10');
  const [contractMonthlyRate, setContractMonthlyRate] = useQueryParamState('akdiFaiz', '3');

  const { result, error } = useMemo(() => {
    const installment = parseLocaleNumber(installmentAmount);
    const days = parseLocaleNumber(daysLate);
    const rate = parseLocaleNumber(contractMonthlyRate);

    if (!Number.isFinite(installment) || installment <= 0) {
      return { result: null, error: 'Lütfen geçerli bir geciken taksit tutarı girin.' };
    }
    if (!Number.isFinite(days) || days < 0) {
      return { result: null, error: 'Lütfen geçerli bir gecikme günü sayısı girin.' };
    }
    if (!Number.isFinite(rate) || rate < 0) {
      return { result: null, error: 'Lütfen geçerli bir akdi faiz oranı girin.' };
    }

    return {
      result: calculateLoanLateFee({ installmentAmount: installment, daysLate: days, contractMonthlyRate: rate }),
      error: null,
    };
  }, [installmentAmount, daysLate, contractMonthlyRate]);

  const isLate = result && parseLocaleNumber(daysLate) > 0;

  return (
    <CalculatorLayout calculatorId="kredi-gecikme-faizi-hesaplama">
      <div className="calc-card">
        <h2>Gecikme bilgileri</h2>
        <div className="form-grid">
          <FormField label="Geciken taksit tutarı (TL)" htmlFor="installmentAmount">
            <AmountInput id="installmentAmount" value={installmentAmount} onChange={setInstallmentAmount} />
          </FormField>
          <FormField label="Gecikme günü sayısı" htmlFor="daysLate">
            <input id="daysLate" type="text" inputMode="numeric" value={daysLate} onChange={(e) => setDaysLate(e.target.value)} />
          </FormField>
          <FormField label="Akdi (sözleşmedeki) aylık faiz oranı (%)" htmlFor="contractMonthlyRate" full hint="Kredi sözleşmenizdeki aylık faiz oranı — değiştirebilirsiniz">
            <input id="contractMonthlyRate" type="text" inputMode="decimal" value={contractMonthlyRate} onChange={(e) => setContractMonthlyRate(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            tone={isLate ? 'warning' : undefined}
            label="Toplam ödenecek tutar"
            value={formatCurrency(result.totalPayable)}
            note={isLate ? `Gecikme bedeli dahildir: ${formatCurrency(result.lateFeeAmount)}` : 'Gecikme yok, sadece taksit tutarı'}
          />
          <ResultMetrics
            items={[
              { label: 'Azami gecikme faizi (aylık)', value: `%${formatNumber(result.maxLateMonthlyRate, { decimals: 2 })}` },
              { label: 'Günlük gecikme oranı', value: `%${formatNumber(result.dailyRate, { decimals: 3 })}` },
              { label: 'Gecikme bedeli', value: formatCurrency(result.lateFeeAmount) },
            ]}
          />
          <DataPeriodNote period={GECIKME_FAIZI_VERISI.period} lastUpdated={GECIKME_FAIZI_VERISI.lastUpdated} source={GECIKME_FAIZI_VERISI.source} />
          {isLate && (
            <p className="rate-disclaimer" style={{ color: 'var(--danger)', fontWeight: 600 }}>
              ⚠️ Gecikmeleriniz Kredi Kayıt Bürosu'na (KKB) bildirilir ve Findeks kredi notunuzu olumsuz etkiler; gecikme ne kadar
              uzarsa etki de o kadar büyür ve sonraki kredi/kredi kartı başvurularınızda sorun yaşayabilirsiniz. Ödemenizi en kısa
              sürede yapın veya bankanızla yapılandırma seçeneklerini görüşün.
            </p>
          )}
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl yorumlanır?</h2>
        <ul>
          <li>Gecikme (temerrüt) faizi, sözleşmenizdeki akdi faiz oranının %{formatNumber((GECIKME_FAIZI_VERISI.azamiCarpan - 1) * 100, { decimals: 0 })} fazlasını GEÇEMEZ ({GECIKME_FAIZI_VERISI.source}) — bankanız bu tavanın altında bir oran uygulayabilir, ekstrenizden kontrol edin.</li>
          <li>Gecikme bedeli, geciken taksit tutarı üzerinden, gecikilen her gün için günlük orana (aylık azami oranın 30'a bölünmesiyle) göre hesaplanır.</li>
          <li>Bu hesaplama sadece o taksit için gecikme bedelini gösterir; ödemeyi hiç yapmazsanız kredi türüne göre muacceliyet (kalan borcun tamamının talep edilmesi) gibi ek sonuçlar doğabilir.</li>
        </ul>
        <RelatedTools items={[
          { to: '/kredi-notu-araligi', label: 'Kredi Notu Aralığı' },
          { to: '/kredi-karti-asgari-odeme-hesaplama', label: 'Kredi Kartı Asgari Ödeme' },
          { to: '/kredi-yapilandirma-hesaplama', label: 'Kredi Yapılandırma Karşılaştırma' },
        ]} />
      </div>
    </CalculatorLayout>
  );
}
