import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import HealthResultDisclaimer from '../../../components/HealthResultDisclaimer.jsx';
import { classifyBloodPressure } from '../../../lib/saglikCalculators.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const BP_CLASSIFICATION_DATA = GUNCEL_VERILER.tansiyonSiniflandirma;
const BP_EMERGENCY_DATA = GUNCEL_VERILER.hipertansifAcilEsigi;
const BOOL_PARAM = { serialize: (v) => (v ? '1' : '0'), deserialize: (v) => v === '1' };

function buildEmergencyAction(hasSymptoms) {
  if (hasSymptoms) {
    return `Bu belirtilerle birlikte ${BP_EMERGENCY_DATA.sistolik}/${BP_EMERGENCY_DATA.diastolik} mmHg üzerinde bir ölçüm tıbbi acil durum olabilir. Hemen 112'yi arayın.`;
  }
  return `Ölçümünüz ${BP_EMERGENCY_DATA.sistolik}/${BP_EMERGENCY_DATA.diastolik} mmHg eşiğinin üzerinde. Vakit kaybetmeden bir sağlık kuruluşuna başvurun.`;
}

export default function TansiyonDegerlendirmeHesaplama() {
  const [systolic, setSystolic] = useQueryParamState('buyuk', '120');
  const [diastolic, setDiastolic] = useQueryParamState('kucuk', '80');
  const [hasSymptoms, setHasSymptoms] = useQueryParamState('belirti', false, BOOL_PARAM);

  const { result, error } = useMemo(() => {
    const sys = parseLocaleNumber(systolic);
    const dia = parseLocaleNumber(diastolic);
    if (!Number.isFinite(sys) || sys <= 0 || sys > 300) {
      return { result: null, error: 'Lütfen geçerli bir büyük tansiyon (sistolik) değeri girin (mmHg).' };
    }
    if (!Number.isFinite(dia) || dia <= 0 || dia > 200) {
      return { result: null, error: 'Lütfen geçerli bir küçük tansiyon (diastolik) değeri girin (mmHg).' };
    }
    const computed = classifyBloodPressure({ systolic: sys, diastolic: dia });
    if (!computed.valid) {
      return { result: null, error: 'Girdiğiniz değerler bir tansiyon ölçümü için geçerli aralıkta değil.' };
    }
    return { result: computed, error: null };
  }, [systolic, diastolic]);

  return (
    <CalculatorLayout calculatorId="tansiyon-degerlendirme">
      <div className="calc-card">
        <h2>Tansiyon ölçümünüz</h2>
        <div className="form-grid">
          <FormField label="Büyük tansiyon / sistolik (mmHg)" htmlFor="systolic">
            <input id="systolic" type="text" inputMode="decimal" value={systolic} onChange={(e) => setSystolic(e.target.value)} />
          </FormField>
          <FormField label="Küçük tansiyon / diastolik (mmHg)" htmlFor="diastolic">
            <input id="diastolic" type="text" inputMode="decimal" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} />
          </FormField>
          <FormField label="Göğüs ağrısı, nefes darlığı, görme ya da konuşma bozukluğu gibi belirtileriniz var mı?" htmlFor="hasSymptoms" full>
            <div className="segmented" role="group" aria-label="Acil belirti durumu">
              <button type="button" className={!hasSymptoms ? 'active' : ''} onClick={() => setHasSymptoms(false)}>Hayır</button>
              <button type="button" className={hasSymptoms ? 'active' : ''} onClick={() => setHasSymptoms(true)}>Evet</button>
            </div>
          </FormField>
        </div>
        <p className="hint" style={{ marginTop: 4 }}>Tek ölçüm teşhis değildir; en isabetli sonuç için birkaç dakika dinlendikten sonra, uygun manşon ile, otururken ölçüm yapın.</p>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Tansiyon kategorisi"
            value={result.category.label}
            tone={result.category.tone}
            note={`${result.systolic}/${result.diastolic} mmHg`}
            action={result.isEmergencyRange ? buildEmergencyAction(hasSymptoms) : null}
          />
          <ResultMetrics
            items={[
              { label: 'Nabız basıncı', value: `${formatNumber(result.pulsePressure, { decimals: 1 })} mmHg` },
              { label: 'Ortalama arter basıncı (MAP)', value: `${formatNumber(result.map, { decimals: 1 })} mmHg` },
            ]}
          />
          {result.isIsolatedSystolic && (
            <p className="rate-disclaimer">ℹ️ Büyük (sistolik) tansiyonunuz yüksek, küçük (diastolik) tansiyonunuz ise normal aralıkta: buna izole sistolik hipertansiyon denir.</p>
          )}
          <DataPeriodNote period={BP_CLASSIFICATION_DATA.period} lastUpdated={BP_CLASSIFICATION_DATA.lastUpdated} source={BP_CLASSIFICATION_DATA.source} />
          {result.isEmergencyRange && (
            <DataPeriodNote period={BP_EMERGENCY_DATA.period} lastUpdated={BP_EMERGENCY_DATA.lastUpdated} source={BP_EMERGENCY_DATA.source} />
          )}
          <HealthResultDisclaimer />
        </div>
      )}

      <div className="info-card">
        <h2>Tansiyon kategorileri (ESH 2023 / Türk Hipertansiyon Uzlaşı Raporu 2025)</h2>
        <ul>
          {BP_CLASSIFICATION_DATA.value.filter((item) => item.key !== 'izoleSistolik').map((item) => (
            <li key={item.key}>
              <strong>{item.label}:</strong>{' '}
              {item.sistolikMin ? `${item.sistolikMin}${item.sistolikMax ? `-${item.sistolikMax}` : '+'}` : `<${(item.sistolikMax ?? 0) + 1}`} sistolik
              {' '}ve/veya{' '}
              {item.diastolikMin ? `${item.diastolikMin}${item.diastolikMax ? `-${item.diastolikMax}` : '+'}` : `<${(item.diastolikMax ?? 0) + 1}`} diastolik
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 10 }}>Sistolik ve diastolik değerden hangisi daha yüksek kategorideyse, kategori o değere göre belirlenir. Tek bir yüksek ölçüm hipertansiyon tanısı için yeterli değildir; farklı günlerde tekrarlanan ölçümler esas alınır.</p>
      </div>
    </CalculatorLayout>
  );
}
