import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateAge } from '../../../lib/zamanCalculators.js';
import { formatInteger } from '../../../utils/format.js';

const today = new Date().toISOString().slice(0, 10);

export default function YasHesaplama() {
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [referenceDate, setReferenceDate] = useState(today);

  const { result, error } = useMemo(() => {
    if (!birthDate) {
      return { result: null, error: 'Lütfen doğum tarihinizi seçin.' };
    }
    const computed = calculateAge({ birthDate, referenceDate });
    if (!computed.valid) {
      return { result: null, error: 'Doğum tarihi, referans tarihinden sonra olamaz.' };
    }
    return { result: computed, error: null };
  }, [birthDate, referenceDate]);

  return (
    <CalculatorLayout calculatorId="yas-hesaplama">
      <div className="calc-card">
        <h2>Tarih bilgileri</h2>
        <div className="form-grid">
          <FormField label="Doğum tarihi" htmlFor="birthDate">
            <input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
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
            label="Yaşınız"
            value={`${result.years} yıl ${result.months} ay ${result.days} gün`}
            note={`Bir sonraki doğum gününe ${formatInteger(result.daysUntilNextBirthday)} gün var`}
          />
          <ResultMetrics
            items={[
              { label: 'Toplam gün', value: formatInteger(result.totalDays) },
              { label: 'Toplam hafta', value: formatInteger(result.totalWeeks) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Yaş; doğum tarihi ile seçilen referans tarihi arasındaki takvim farkına göre yıl, ay ve gün olarak hesaplanır.</p>
      </div>
    </CalculatorLayout>
  );
}
