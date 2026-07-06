import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculatePregnancy } from '../../../lib/saglikCalculators.js';
import { formatInteger } from '../../../utils/format.js';

const today = new Date().toISOString().slice(0, 10);

export default function GebelikHaftasiHesaplama() {
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [referenceDate, setReferenceDate] = useState(today);

  const { result, error } = useMemo(() => {
    if (!lastPeriodDate) {
      return { result: null, error: 'Lütfen son adet tarihinizi seçin.' };
    }
    const computed = calculatePregnancy({ lastPeriodDate, referenceDate });
    if (!computed.valid) {
      return { result: null, error: 'Son adet tarihi, referans tarihinden sonra olamaz.' };
    }
    return { result: computed, error: null };
  }, [lastPeriodDate, referenceDate]);

  return (
    <CalculatorLayout calculatorId="gebelik-haftasi-hesaplama">
      <div className="calc-card">
        <h2>Tarih bilgileri</h2>
        <div className="form-grid">
          <FormField label="Son adet tarihi (LMP)" htmlFor="lastPeriodDate">
            <input id="lastPeriodDate" type="date" value={lastPeriodDate} onChange={(e) => setLastPeriodDate(e.target.value)} />
          </FormField>
          <FormField label="Hangi tarihe göre?" htmlFor="referenceDate" hint="Varsayılan: bugün">
            <input id="referenceDate" type="date" value={referenceDate} onChange={(e) => setReferenceDate(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Gebelik haftası"
            value={`${result.weeks} hafta ${result.days} gün`}
            note={`${result.trimester}. trimester`}
          />
          <ResultMetrics
            items={[
              { label: 'Tahmini doğum tarihi', value: new Date(result.dueDate).toLocaleDateString('tr-TR') },
              { label: 'Doğuma kalan gün', value: `${formatInteger(result.daysRemaining)} gün` },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Naegele kuralı kullanılır: son adet tarihine 280 gün (40 hafta) eklenerek tahmini doğum tarihi bulunur. Bu, ortalama 28 günlük döngü varsayımına dayanır; kesin tarih için ultrason ölçümü daha güvenilirdir. Herhangi bir sağlık kararı için doktorunuza danışın.</p>
      </div>
    </CalculatorLayout>
  );
}
