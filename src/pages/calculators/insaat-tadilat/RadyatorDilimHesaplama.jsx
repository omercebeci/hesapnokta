import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import {
  calculateRoomHeatLoss,
  calculateRadiatorSections,
  ROOM_HEAT_LOSS_TIERS,
  RADIATOR_DILIM_OUTPUT_KCAL,
} from '../../../lib/insaatTadilatCalculators.js';
import { formatInteger, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const TIER_OPTIONS = Object.entries(ROOM_HEAT_LOSS_TIERS).map(([key, tier]) => ({ key, label: tier.label }));
const HEIGHT_OPTIONS = Object.keys(RADIATOR_DILIM_OUTPUT_KCAL).map(Number);

export default function RadyatorDilimHesaplama() {
  const [area, setArea] = useQueryParamState('alan', '15');
  const [ceilingHeight, setCeilingHeight] = useQueryParamState('yukseklik', '2,7');
  const [tierKey, setTierKey] = useQueryParamState('durum', 'db-guney-tek-cam');
  const [panelHeight, setPanelHeight] = useQueryParamState('panel', '600');

  const { result, error } = useMemo(() => {
    const parsedArea = parseLocaleNumber(area);
    const parsedHeight = parseLocaleNumber(ceilingHeight);

    if (!Number.isFinite(parsedArea) || parsedArea <= 0) {
      return { result: null, error: 'Lütfen geçerli bir oda alanı girin.' };
    }
    if (!Number.isFinite(parsedHeight) || parsedHeight <= 0) {
      return { result: null, error: 'Lütfen geçerli bir tavan yüksekliği girin.' };
    }

    const volumeM3 = parsedArea * parsedHeight;
    const heatLoss = calculateRoomHeatLoss({ volumeM3, tierKey });
    const sectionCount = calculateRadiatorSections(heatLoss.estimatedKcal, Number(panelHeight));

    return { result: { ...heatLoss, volumeM3, sectionCount }, error: null };
  }, [area, ceilingHeight, tierKey, panelHeight]);

  return (
    <CalculatorLayout calculatorId="radyator-dilim-hesaplama">
      <div className="calc-card">
        <h2>Oda ve yalıtım bilgileri</h2>
        <div className="form-grid">
          <FormField label="Oda alanı (m²)" htmlFor="area">
            <input id="area" type="text" inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} />
          </FormField>
          <FormField label="Tavan yüksekliği (m)" htmlFor="ceilingHeight">
            <input id="ceilingHeight" type="text" inputMode="decimal" value={ceilingHeight} onChange={(e) => setCeilingHeight(e.target.value)} />
          </FormField>
          <FormField label="Yalıtım / cephe / kat durumu" htmlFor="tierKey" full hint="En yakın tarif eden seçeneği işaretleyin.">
            <div className="segmented" role="group" aria-label="Yalıtım/cephe/kat durumu">
              {TIER_OPTIONS.map((option) => (
                <button key={option.key} type="button" className={tierKey === option.key ? 'active' : ''} onClick={() => setTierKey(option.key)}>{option.label}</button>
              ))}
            </div>
          </FormField>
          <FormField label="Panel/radyatör yüksekliği (mm)" htmlFor="panelHeight" full hint="Dilim başına ısı verimi seçtiğiniz yüksekliğe göre değişir.">
            <div className="segmented" role="group" aria-label="Panel yüksekliği">
              {HEIGHT_OPTIONS.map((value) => (
                <button key={value} type="button" className={Number(panelHeight) === value ? 'active' : ''} onClick={() => setPanelHeight(String(value))}>{value} mm</button>
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
            label="Gereken ısı yükü"
            value={`${formatNumber(result.minKcal)} - ${formatNumber(result.maxKcal)} kcal/h`}
            note={`Yaklaşık ${formatNumber(result.minWatt)} - ${formatNumber(result.maxWatt)} W (${result.tierLabel})`}
          />
          <ResultMetrics
            items={[
              { label: 'Oda hacmi', value: `${formatNumber(result.volumeM3)} m³` },
              { label: 'Tahmini ısı yükü (orta değer)', value: `${formatNumber(result.estimatedKcal)} kcal/h` },
              { label: 'Gereken dilim sayısı', value: `${formatInteger(result.sectionCount)} dilim (${panelHeight} mm panel)` },
            ]}
          />
          <div className="info-card">
            <p>⚠️ Bu sonuç, tesisatçı pratiğinde yaygın kullanılan bir tahmin yöntemidir; dilim verimi de marka/modele göre ±%10-15 değişebilir. Kesin ısıtma ihtiyacı için yetkili bir tesisatçı veya makine mühendisinin ısı kaybı projesi hazırlamasını önerilir.</p>
          </div>
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Oda hacmi (alan × tavan yüksekliği), seçtiğiniz yalıtım/cephe/kat durumuna karşılık gelen kcal/h/m³ katsayısıyla çarpılarak gereken ısı yükü bulunur; bu değer 1 kcal/h = 1,163 W dönüşümüyle Watt cinsinden de gösterilir. Belirsizliği yansıtmak için sonuç ±%10 aralık olarak sunulur. Gereken dilim sayısı, ısı yükünün, seçtiğiniz panel yüksekliğine karşılık gelen dilim başına ısı verimine bölünüp yukarı yuvarlanmasıyla bulunur.</p>
      </div>
    </CalculatorLayout>
  );
}
