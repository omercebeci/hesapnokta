import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateAcBtuNeed, AC_EXPOSURE_FACTORS } from '../../../lib/insaatTadilatCalculators.js';
import { formatInteger, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const EXPOSURE_OPTIONS = Object.entries(AC_EXPOSURE_FACTORS).map(([key, value]) => ({ key, label: value.label }));

export default function KlimaBtuHesaplama() {
  const [area, setArea] = useQueryParamState('alan', '20');
  const [ceilingHeight, setCeilingHeight] = useQueryParamState('yukseklik', '2,5');
  const [exposureKey, setExposureKey] = useQueryParamState('durum', 'normal');
  const [personCount, setPersonCount] = useQueryParamState('kisi', '2');
  const [deviceCount, setDeviceCount] = useQueryParamState('cihaz', '0');

  const { result, error } = useMemo(() => {
    const parsedArea = parseLocaleNumber(area);
    const parsedHeight = parseLocaleNumber(ceilingHeight);
    const parsedPeople = parseLocaleNumber(personCount);
    const parsedDevices = parseLocaleNumber(deviceCount);

    if (!Number.isFinite(parsedArea) || parsedArea <= 0) {
      return { result: null, error: 'Lütfen geçerli bir oda alanı girin.' };
    }
    if (!Number.isFinite(parsedHeight) || parsedHeight <= 0) {
      return { result: null, error: 'Lütfen geçerli bir tavan yüksekliği girin.' };
    }

    const btu = calculateAcBtuNeed({
      area: parsedArea,
      ceilingHeight: parsedHeight,
      exposureKey,
      personCount: Number.isFinite(parsedPeople) ? parsedPeople : 2,
      deviceCount: Number.isFinite(parsedDevices) ? parsedDevices : 0,
    });

    return { result: btu, error: null };
  }, [area, ceilingHeight, exposureKey, personCount, deviceCount]);

  return (
    <CalculatorLayout calculatorId="klima-btu-hesaplama">
      <div className="calc-card">
        <h2>Oda ve kullanım bilgileri</h2>
        <div className="form-grid">
          <FormField label="Oda alanı (m²)" htmlFor="area">
            <input id="area" type="text" inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} />
          </FormField>
          <FormField label="Tavan yüksekliği (m)" htmlFor="ceilingHeight" hint="Standart konut tavan yüksekliği ~2,5 m'dir; daha yüksek tavanlarda ihtiyaç artar.">
            <input id="ceilingHeight" type="text" inputMode="decimal" value={ceilingHeight} onChange={(e) => setCeilingHeight(e.target.value)} />
          </FormField>
          <FormField label="Kişi sayısı" htmlFor="personCount" hint="2 kişilik oda varsayımının üzerindeki her kişi için ek yük eklenir.">
            <input id="personCount" type="text" inputMode="numeric" value={personCount} onChange={(e) => setPersonCount(e.target.value)} />
          </FormField>
          <FormField label="Isı yayan cihaz sayısı" htmlFor="deviceCount" hint="TV, bilgisayar, sunucu gibi sürekli çalışan cihazlar (varsa)">
            <input id="deviceCount" type="text" inputMode="numeric" value={deviceCount} onChange={(e) => setDeviceCount(e.target.value)} />
          </FormField>
          <FormField label="Kat/cephe/güneş alma durumu" htmlFor="exposureKey" full>
            <div className="segmented" role="group" aria-label="Kat/cephe/güneş alma durumu">
              {EXPOSURE_OPTIONS.map((option) => (
                <button key={option.key} type="button" className={exposureKey === option.key ? 'active' : ''} onClick={() => setExposureKey(option.key)}>{option.label}</button>
              ))}
            </div>
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Önerilen BTU aralığı"
            value={`${formatInteger(result.minBtu)} - ${formatInteger(result.maxBtu)} BTU/h`}
            note={result.recommendedClass ? `Tipik klima sınıfı: ${formatInteger(result.recommendedClass)} BTU` : '24000 BTU üzerinde tek bir klima yeterli olmayabilir; çoklu klima veya salon tipi klima değerlendirin.'}
          />
          <ResultMetrics
            items={[
              { label: 'Tahmini ihtiyaç (orta değer)', value: `${formatInteger(result.estimatedBtu)} BTU/h` },
              { label: 'Maruziyet durumu', value: result.exposureLabel },
            ]}
          />
          <div className="info-card">
            <p>⚠️ Bu sonuç, Türkiye'de yaygın kullanılan pratik bir tahmin yöntemidir; kesin klima seçimi için (özellikle geniş cam yüzeyli, çok katlı veya ticari mekanlarda) yetkili bir klima firması veya mühendisin ısı yükü hesabı yaptırmanız önerilir.</p>
          </div>
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Taban ihtiyaç, oda alanının yaklaşık 600 BTU/m² ile çarpılmasıyla bulunur. Tavan yüksekliği 2,5 metreyi aştıkça oda hacmiyle orantılı olarak ihtiyaç artırılır. Kat/cephe/güneş alma durumu, az güneşli odalarda %5 azaltma, çok güneşli veya üst kat/çatı katı odalarda %15-25 artış olarak uygulanır. 2 kişilik taban varsayımın üzerindeki her kişi ve sürekli çalışan her elektronik cihaz için 600 BTU/h eklenir. Sonuç, bu pratik yöntemin doğal belirsizliğini yansıtmak için tek bir sayı değil bir aralık olarak gösterilir.</p>
      </div>
    </CalculatorLayout>
  );
}
