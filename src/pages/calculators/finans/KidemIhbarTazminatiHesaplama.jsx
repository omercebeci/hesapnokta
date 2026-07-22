import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateSeveranceAndNotice } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const KIDEM_TAVANI = GUNCEL_VERILER.kidemTazminatiTavani;
const IHBAR_SURELERI = GUNCEL_VERILER.ihbarSureleri;
const today = new Date().toISOString().slice(0, 10);

export default function KidemIhbarTazminatiHesaplama() {
  const [grossSalary, setGrossSalary] = useQueryParamState('maas', '50000');
  const [startDate, setStartDate] = useQueryParamState('baslangic', '2021-01-01');
  const [endDate, setEndDate] = useQueryParamState('bitis', today);

  const { result, error } = useMemo(() => {
    const parsedSalary = parseLocaleNumber(grossSalary);
    if (!Number.isFinite(parsedSalary) || parsedSalary <= 0) {
      return { result: null, error: 'Lütfen geçerli bir brüt maaş girin.' };
    }
    if (!startDate || !endDate) {
      return { result: null, error: 'Lütfen işe başlama ve işten ayrılış tarihlerini seçin.' };
    }
    const computed = calculateSeveranceAndNotice({ grossSalary: parsedSalary, startDate, endDate });
    if (!computed.valid) {
      return { result: null, error: 'İşten ayrılış tarihi, işe başlama tarihinden sonra olmalıdır.' };
    }
    return { result: computed, error: null };
  }, [grossSalary, startDate, endDate]);

  return (
    <CalculatorLayout calculatorId="kidem-ihbar-tazminati-hesaplama">
      <div className="calc-card">
        <h2>Çalışma bilgileri</h2>
        <div className="form-grid">
          <FormField label="Brüt maaş (TL)" htmlFor="grossSalary" full>
            <AmountInput id="grossSalary" value={grossSalary} onChange={setGrossSalary} />
          </FormField>
          <FormField label="İşe başlama tarihi" htmlFor="startDate">
            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </FormField>
          <FormField label="İşten ayrılış tarihi" htmlFor="endDate">
            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Toplam tazminat"
            value={formatCurrency(result.totalPay)}
            note={result.isCapped ? `Kıdem tazminatı ${KIDEM_TAVANI.period} tavanına takıldı` : `${formatNumber(result.totalYears)} yıllık kıdeme göre hesaplandı`}
          />
          <ResultMetrics
            items={[
              { label: 'Kıdem tazminatı', value: formatCurrency(result.severancePay) },
              { label: 'İhbar tazminatı', value: formatCurrency(result.noticePay) },
              { label: 'İhbar süresi', value: `${result.noticeWeeks} hafta` },
              { label: 'Toplam kıdem', value: `${formatNumber(result.totalYears)} yıl` },
            ]}
          />
          <DataPeriodNote period={KIDEM_TAVANI.period} lastUpdated={KIDEM_TAVANI.lastUpdated} source={KIDEM_TAVANI.source} />
        </div>
      )}

      <div className="info-card" style={{ gridColumn: '1 / -1' }}>
        <h2>Varsayımlar ve kaynaklar</h2>
        <ul>
          <li>Kıdem tazminatı, her tam yıl için 30 günlük brüt ücret üzerinden hesaplanır ve {KIDEM_TAVANI.period} tavanı olan {formatCurrency(KIDEM_TAVANI.value)} ile sınırlıdır.</li>
          <li>
            İhbar süreleri İş Kanunu m.17'deki sabit tabloya göre belirlenir:{' '}
            {IHBAR_SURELERI.value.map((row, index) => {
              const isLast = index === IHBAR_SURELERI.value.length - 1;
              const label = isLast
                ? `${formatNumber(IHBAR_SURELERI.value[index - 1].kidemUstSiniriYil)} yıldan fazla ${row.hafta} hafta`
                : `${formatNumber(row.kidemUstSiniriYil)} yıla kadar ${row.hafta} hafta`;
              return `${label}${isLast ? '.' : ', '}`;
            })}{' '}
            İhbar tazminatına tavan uygulanmaz.
          </li>
          <li>Bu hesaplama yalnızca temel ücret üzerinden yapılır; ikramiye, yol/yemek ücreti gibi "giydirilmiş ücret" unsurları dahil değildir. Kesin tutar için İK/mali müşavir kontrolü önerilir.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
