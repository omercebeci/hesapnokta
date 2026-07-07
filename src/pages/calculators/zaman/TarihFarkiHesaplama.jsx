import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateDateDiff } from '../../../lib/zamanCalculators.js';
import { formatInteger } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const today = new Date().toISOString().slice(0, 10);

export default function TarihFarkiHesaplama() {
  const [startDate, setStartDate] = useQueryParamState('baslangic', today);
  const [endDate, setEndDate] = useQueryParamState('bitis', today);

  const { result, error } = useMemo(() => {
    if (!startDate || !endDate) {
      return { result: null, error: 'Lütfen her iki tarihi de seçin.' };
    }
    const computed = calculateDateDiff({ startDate, endDate });
    if (!computed.valid) {
      return { result: null, error: 'Lütfen geçerli iki tarih girin.' };
    }
    return { result: computed, error: null };
  }, [startDate, endDate]);

  return (
    <CalculatorLayout calculatorId="tarih-farki-hesaplama">
      <div className="calc-card">
        <h2>Tarih aralığı</h2>
        <div className="form-grid">
          <FormField label="Başlangıç tarihi" htmlFor="startDate">
            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </FormField>
          <FormField label="Bitiş tarihi" htmlFor="endDate">
            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Fark"
            value={`${result.years} yıl ${result.months} ay ${result.days} gün`}
            note={result.reversed ? 'Bitiş tarihi başlangıçtan önce girildi; mutlak fark gösteriliyor.' : undefined}
          />
          <ResultMetrics
            items={[
              { label: 'Toplam gün', value: formatInteger(result.totalDays) },
              { label: 'Toplam hafta', value: formatInteger(result.totalWeeks) },
              { label: 'Toplam ay', value: formatInteger(result.totalMonths) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl kullanılır?</h2>
        <p>İki tarih arasındaki süreyi; etkinlik planlama, proje takibi veya geriye sayım gibi ihtiyaçlar için hesaplayın.</p>
      </div>
    </CalculatorLayout>
  );
}
