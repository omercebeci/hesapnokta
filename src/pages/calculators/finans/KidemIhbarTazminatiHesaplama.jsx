import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateSeveranceAndNotice } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';

const today = new Date().toISOString().slice(0, 10);

export default function KidemIhbarTazminatiHesaplama() {
  const [grossSalary, setGrossSalary] = useState('50000');
  const [startDate, setStartDate] = useState('2021-01-01');
  const [endDate, setEndDate] = useState(today);

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
            <input id="grossSalary" type="text" inputMode="decimal" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} />
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
            note={result.isCapped ? 'Kıdem tazminatı 2026 2. dönem tavanına takıldı' : `${formatNumber(result.totalYears)} yıllık kıdeme göre hesaplandı`}
          />
          <ResultMetrics
            items={[
              { label: 'Kıdem tazminatı', value: formatCurrency(result.severancePay) },
              { label: 'İhbar tazminatı', value: formatCurrency(result.noticePay) },
              { label: 'İhbar süresi', value: `${result.noticeWeeks} hafta` },
              { label: 'Toplam kıdem', value: `${formatNumber(result.totalYears)} yıl` },
            ]}
          />
        </div>
      )}

      <div className="info-card" style={{ gridColumn: '1 / -1' }}>
        <h2>Varsayımlar ve kaynaklar</h2>
        <ul>
          <li>Kıdem tazminatı, her tam yıl için 30 günlük brüt ücret üzerinden hesaplanır ve 2026 2. dönem (Temmuz-Aralık) tavanı olan 73.729,87 TL ile sınırlıdır.</li>
          <li>İhbar süreleri İş Kanunu m.17'deki sabit tabloya göre belirlenir: 6 aya kadar 2 hafta, 1,5 yıla kadar 4 hafta, 3 yıla kadar 6 hafta, 3 yıldan fazla 8 hafta. İhbar tazminatına tavan uygulanmaz.</li>
          <li>Bu hesaplama yalnızca temel ücret üzerinden yapılır; ikramiye, yol/yemek ücreti gibi "giydirilmiş ücret" unsurları dahil değildir. Kesin tutar için İK/mali müşavir kontrolü önerilir.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
