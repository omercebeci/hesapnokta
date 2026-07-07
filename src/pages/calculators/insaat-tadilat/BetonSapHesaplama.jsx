import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateConcreteNeed, calculateManualMixMaterials, calculateOptionalCost } from '../../../lib/insaatTadilatCalculators.js';
import { formatCurrency, formatInteger, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function BetonSapHesaplama() {
  const [area, setArea] = useQueryParamState('alan', '50');
  const [thickness, setThickness] = useQueryParamState('kalinlik', '10');
  const [wasteRate, setWasteRate] = useQueryParamState('fire', '5');
  const [mixerCapacity, setMixerCapacity] = useQueryParamState('mikser', '6');
  const [m3Price, setM3Price] = useQueryParamState('fiyat', '');

  const { result, error } = useMemo(() => {
    const parsedArea = parseLocaleNumber(area);
    const parsedThickness = parseLocaleNumber(thickness);
    const parsedWaste = parseLocaleNumber(wasteRate);
    const parsedMixer = parseLocaleNumber(mixerCapacity);

    if (!Number.isFinite(parsedArea) || parsedArea <= 0) {
      return { result: null, error: 'Lütfen geçerli bir alan girin.' };
    }
    if (!Number.isFinite(parsedThickness) || parsedThickness <= 0) {
      return { result: null, error: 'Lütfen geçerli bir kalınlık girin.' };
    }

    const concrete = calculateConcreteNeed({
      area: parsedArea,
      thicknessCm: parsedThickness,
      wasteRate: Number.isFinite(parsedWaste) ? parsedWaste : 5,
      mixerCapacityM3: Number.isFinite(parsedMixer) ? parsedMixer : 6,
    });

    const manualMix = calculateManualMixMaterials({ volumeM3: concrete.volumeM3 });

    const parsedPrice = parseLocaleNumber(m3Price);
    const cost = Number.isFinite(parsedPrice) && parsedPrice > 0 ? calculateOptionalCost(concrete.volumeM3, parsedPrice) : null;

    return { result: { ...concrete, manualMix, cost }, error: null };
  }, [area, thickness, wasteRate, mixerCapacity, m3Price]);

  return (
    <CalculatorLayout calculatorId="beton-sap-hesaplama">
      <div className="calc-card">
        <h2>Alan ve kalınlık bilgileri</h2>
        <div className="form-grid">
          <FormField label="Alan (m²)" htmlFor="area">
            <input id="area" type="text" inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} />
          </FormField>
          <FormField label="Kalınlık (cm)" htmlFor="thickness">
            <input id="thickness" type="text" inputMode="decimal" value={thickness} onChange={(e) => setThickness(e.target.value)} />
          </FormField>
          <FormField label="Fire payı (%)" htmlFor="wasteRate">
            <input id="wasteRate" type="text" inputMode="decimal" value={wasteRate} onChange={(e) => setWasteRate(e.target.value)} />
          </FormField>
          <FormField label="Mikser kapasitesi (m³)" htmlFor="mixerCapacity" hint="Hazır beton mikserleri genelde 6 m³ taşır">
            <input id="mixerCapacity" type="text" inputMode="decimal" value={mixerCapacity} onChange={(e) => setMixerCapacity(e.target.value)} />
          </FormField>
          <FormField label="Beton/şap m³ fiyatı (TL, opsiyonel)" htmlFor="m3Price" full hint="Girerseniz toplam maliyeti hesaplarız. Güncel fiyatları satıcınızdan/hazır beton firmasından alın.">
            <input id="m3Price" type="text" inputMode="decimal" value={m3Price} onChange={(e) => setM3Price(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Gereken beton/şap hacmi" value={`${formatNumber(result.volumeM3)} m³`} note={`${formatInteger(result.mixerTrucksToOrder)} mikser sipariş edin (yaklaşık ${formatNumber(result.mixerTrucksExact)} mikser karşılığı)`} />
          <ResultMetrics
            items={[
              ...(result.cost !== null ? [{ label: 'Tahmini beton/şap maliyeti', value: formatCurrency(result.cost) }] : []),
            ]}
          />
          <div className="info-card">
            <h2>Elle karım için tipik malzeme oranları</h2>
            <p>Aşağıdaki değerler, genel amaçlı C25/30 sınıfı beton için yaygın kullanılan referans oranlardır; zemin sınıfı ve agrega türüne göre değişebilir. Hazır beton kullanıyorsanız bu tabloya ihtiyacınız yoktur.</p>
            <ResultMetrics
              items={[
                { label: 'Çimento', value: `${formatNumber(result.manualMix.cementKg)} kg (${formatInteger(result.manualMix.cementBags)} torba × 50 kg)` },
                { label: 'Kum', value: `${formatNumber(result.manualMix.sandM3)} m³` },
                { label: 'Çakıl (agrega)', value: `${formatNumber(result.manualMix.gravelM3)} m³` },
                { label: 'Su', value: `${formatNumber(result.manualMix.waterL)} L` },
              ]}
            />
          </div>
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Hacim, alan × kalınlık formülüyle bulunur ve fire payı eklenir. Bu hacim, girdiğiniz mikser kapasitesine bölünerek kaç mikser sipariş etmeniz gerektiği hesaplanır. Elle karım yapacaksanız aynı hacim, tipik çimento/kum/çakıl/su oranlarıyla çarpılarak yaklaşık malzeme miktarları tahmin edilir.</p>
      </div>
    </CalculatorLayout>
  );
}
