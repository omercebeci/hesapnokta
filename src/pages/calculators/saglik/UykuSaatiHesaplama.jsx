import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateSleepSchedule } from '../../../lib/saglikCalculators.js';

export default function UykuSaatiHesaplama() {
  const [mode, setMode] = useState('wakeup');
  const [time, setTime] = useState('07:00');

  const { result, error } = useMemo(() => {
    if (!time) {
      return { result: null, error: 'Lütfen bir saat girin.' };
    }
    const computed = calculateSleepSchedule({ time, mode });
    if (!computed.valid) {
      return { result: null, error: 'Lütfen geçerli bir saat girin.' };
    }
    return { result: computed, error: null };
  }, [time, mode]);

  const recommended = result?.options?.[1]; // 5 döngü (~7,5 saat), yetişkinler için en yaygın önerilen süre

  return (
    <CalculatorLayout calculatorId="uyku-saati-hesaplama">
      <div className="calc-card">
        <h2>Saat bilgisi</h2>
        <div className="form-grid">
          <FormField label="Ne hesaplamak istersiniz?" htmlFor="mode" full>
            <div className="segmented" role="group" aria-label="Hesaplama modu">
              <button type="button" className={mode === 'wakeup' ? 'active' : ''} onClick={() => setMode('wakeup')}>Kalkış saatim belli</button>
              <button type="button" className={mode === 'bedtime' ? 'active' : ''} onClick={() => setMode('bedtime')}>Yatma saatim belli</button>
            </div>
          </FormField>
          <FormField label={mode === 'wakeup' ? 'Kalkmak istediğiniz saat' : 'Yatmayı planladığınız saat'} htmlFor="time" full>
            <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label={mode === 'wakeup' ? 'Önerilen yatma saati' : 'Önerilen kalkış saati'}
            value={recommended.time}
            note={`${recommended.cycles} uyku döngüsü (~${recommended.sleepHours} saat) — en yaygın önerilen süre`}
          />
          <ResultMetrics
            items={result.options
              .filter((option) => option !== recommended)
              .map((option) => ({ label: `${option.cycles} döngü (~${option.sleepHours} saat)`, value: option.time }))}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Uyku, yaklaşık 90 dakikalık döngüler halinde ilerler; bir döngü ortasında uyanmak yerine döngü tamamlandığında uyanmak kendinizi daha dinç hissetmenizi sağlar. Hesaplama, uykuya dalmak için ortalama 15 dakika eklenmiş 3-6 döngülük seçenekler sunar. Yetişkinler için genellikle 5-6 döngü (7,5-9 saat) önerilir.</p>
      </div>
    </CalculatorLayout>
  );
}
