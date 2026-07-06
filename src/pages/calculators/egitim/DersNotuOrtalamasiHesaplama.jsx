import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateGradeAverage } from '../../../lib/egitimCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';

export default function DersNotuOrtalamasiHesaplama() {
  const [midtermScore, setMidtermScore] = useState('60');
  const [midtermWeight, setMidtermWeight] = useState('40');
  const [finalWeight, setFinalWeight] = useState('60');
  const [finalScore, setFinalScore] = useState('');
  const [passingGrade, setPassingGrade] = useState('50');

  const { result, error } = useMemo(() => {
    const parsedMidterm = parseLocaleNumber(midtermScore);
    const parsedMidtermWeight = parseLocaleNumber(midtermWeight);
    const parsedFinalWeight = parseLocaleNumber(finalWeight);
    const parsedPassingGrade = parseLocaleNumber(passingGrade);
    const parsedFinal = finalScore.trim() === '' ? undefined : parseLocaleNumber(finalScore);

    if (!Number.isFinite(parsedMidterm) || parsedMidterm < 0 || parsedMidterm > 100) {
      return { result: null, error: 'Vize notu 0-100 arasında olmalıdır.' };
    }
    if (!Number.isFinite(parsedMidtermWeight) || !Number.isFinite(parsedFinalWeight) || parsedMidtermWeight < 0 || parsedFinalWeight <= 0) {
      return { result: null, error: 'Lütfen geçerli ağırlık değerleri girin.' };
    }
    if (parsedFinal !== undefined && (!Number.isFinite(parsedFinal) || parsedFinal < 0 || parsedFinal > 100)) {
      return { result: null, error: 'Final notu 0-100 arasında olmalıdır.' };
    }

    return {
      result: calculateGradeAverage({
        midtermScore: parsedMidterm,
        midtermWeight: parsedMidtermWeight,
        finalScore: parsedFinal,
        finalWeight: parsedFinalWeight,
        passingGrade: Number.isFinite(parsedPassingGrade) ? parsedPassingGrade : 50,
      }),
      error: null,
    };
  }, [midtermScore, midtermWeight, finalWeight, finalScore, passingGrade]);

  return (
    <CalculatorLayout calculatorId="ders-notu-ortalamasi-hesaplama">
      <div className="calc-card">
        <h2>Not bilgileri</h2>
        <div className="form-grid">
          <FormField label="Vize notu" htmlFor="midtermScore">
            <input id="midtermScore" type="text" inputMode="decimal" value={midtermScore} onChange={(e) => setMidtermScore(e.target.value)} />
          </FormField>
          <FormField label="Vize ağırlığı (%)" htmlFor="midtermWeight">
            <input id="midtermWeight" type="text" inputMode="decimal" value={midtermWeight} onChange={(e) => setMidtermWeight(e.target.value)} />
          </FormField>
          <FormField label="Final notu (opsiyonel)" htmlFor="finalScore" hint="Boş bırakırsanız sadece gereken minimum final notu hesaplanır">
            <input id="finalScore" type="text" inputMode="decimal" value={finalScore} onChange={(e) => setFinalScore(e.target.value)} />
          </FormField>
          <FormField label="Final ağırlığı (%)" htmlFor="finalWeight">
            <input id="finalWeight" type="text" inputMode="decimal" value={finalWeight} onChange={(e) => setFinalWeight(e.target.value)} />
          </FormField>
          <FormField label="Geçme notu" htmlFor="passingGrade" full>
            <input id="passingGrade" type="text" inputMode="decimal" value={passingGrade} onChange={(e) => setPassingGrade(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          {result.weightedAverage !== null ? (
            <ResultCard
              label="Ağırlıklı ortalama"
              value={formatNumber(result.weightedAverage)}
              note={result.passed ? 'Geçme notunun üzerindesiniz ✓' : 'Geçme notunun altında'}
            />
          ) : result.isAlreadyGuaranteed ? (
            <ResultCard label="Durum" value="Geçme garantilendi" note="Finalden 0 alsanız bile ortalamanız geçme notunun üzerinde kalır" />
          ) : result.isImpossible ? (
            <ResultCard label="Durum" value="Bu vizeyle geçmek mümkün değil" note="Finalden 100 alsanız bile ortalama geçme notuna ulaşmıyor" />
          ) : (
            <ResultCard label="Finalden gereken minimum not" value={formatNumber(result.requiredFinalScore)} />
          )}
          {result.weightedAverage !== null && (
            <ResultMetrics items={[{ label: 'Finalden gereken minimum not (referans)', value: formatNumber(result.requiredFinalScore) }]} />
          )}
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Ağırlıklı ortalama, vize ve final notlarının kendi ağırlıklarıyla çarpılıp toplanması ve toplam ağırlığa bölünmesiyle bulunur. Gereken minimum final notu ise geçme notuna ulaşmak için gerekli finali, ağırlıklar ve vize notunuza göre tersine çözerek hesaplar.</p>
      </div>
    </CalculatorLayout>
  );
}
