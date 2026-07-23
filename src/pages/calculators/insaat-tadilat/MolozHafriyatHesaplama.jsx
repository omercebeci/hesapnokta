import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import {
  calculateDemolitionNetVolume,
  calculateMolozVolume,
  calculateTruckCount,
  calculateOptionalCost,
  MOLOZ_TIERS,
  TRUCK_CAPACITY_OPTIONS_M3,
} from '../../../lib/insaatTadilatCalculators.js';
import { formatCurrency, formatInteger, formatNumber, formatPercent, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const TIER_OPTIONS = Object.entries(MOLOZ_TIERS).map(([key, tier]) => ({ key, label: tier.label }));

export default function MolozHafriyatHesaplama() {
  const [mode, setMode] = useQueryParamState('mod', 'olculer');
  const [length, setLength] = useQueryParamState('uzunluk', '5');
  const [width, setWidth] = useQueryParamState('genislik', '3');
  const [thicknessCm, setThicknessCm] = useQueryParamState('kalinlik', '20');
  const [directVolume, setDirectVolume] = useQueryParamState('hacim', '3');
  const [tierKey, setTierKey] = useQueryParamState('tur', 'ic-mekan-kirim');
  const [truckCapacity, setTruckCapacity] = useQueryParamState('kapasite', '12');
  const [truckPrice, setTruckPrice] = useQueryParamState('fiyat', '');

  const { result, error } = useMemo(() => {
    let netVolumeM3;

    if (mode === 'hacim') {
      const parsedVolume = parseLocaleNumber(directVolume);
      if (!Number.isFinite(parsedVolume) || parsedVolume <= 0) {
        return { result: null, error: 'Lütfen geçerli bir moloz hacmi (m³) girin.' };
      }
      netVolumeM3 = parsedVolume;
    } else {
      const parsedLength = parseLocaleNumber(length);
      const parsedWidth = parseLocaleNumber(width);
      const parsedThickness = parseLocaleNumber(thicknessCm);
      if (!Number.isFinite(parsedLength) || parsedLength <= 0 || !Number.isFinite(parsedWidth) || parsedWidth <= 0) {
        return { result: null, error: 'Lütfen geçerli duvar/zemin ölçüleri girin.' };
      }
      if (!Number.isFinite(parsedThickness) || parsedThickness <= 0) {
        return { result: null, error: 'Lütfen geçerli bir kalınlık girin.' };
      }
      netVolumeM3 = calculateDemolitionNetVolume({ length: parsedLength, width: parsedWidth, thicknessCm: parsedThickness });
    }

    const moloz = calculateMolozVolume({ netVolumeM3, tierKey });
    const truckCount = calculateTruckCount(moloz.looseVolumeM3, Number(truckCapacity));

    const parsedPrice = parseLocaleNumber(truckPrice);
    const cost = Number.isFinite(parsedPrice) && parsedPrice > 0 ? calculateOptionalCost(truckCount, parsedPrice) : null;

    return { result: { ...moloz, truckCount, cost }, error: null };
  }, [mode, length, width, thicknessCm, directVolume, tierKey, truckCapacity, truckPrice]);

  return (
    <CalculatorLayout calculatorId="moloz-hafriyat-hesaplama">
      <div className="calc-card">
        <h2>Moloz/hafriyat bilgileri</h2>
        <div className="form-grid">
          <FormField label="Hacim girişi" htmlFor="mode" full>
            <div className="segmented" role="group" aria-label="Hacim girişi">
              <button type="button" className={mode === 'olculer' ? 'active' : ''} onClick={() => setMode('olculer')}>Duvar/zemin ölçülerinden</button>
              <button type="button" className={mode === 'hacim' ? 'active' : ''} onClick={() => setMode('hacim')}>Doğrudan m³</button>
            </div>
          </FormField>

          {mode === 'olculer' ? (
            <>
              <FormField label="Uzunluk (m)" htmlFor="length">
                <input id="length" type="text" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
              </FormField>
              <FormField label="Genişlik/yükseklik (m)" htmlFor="width">
                <input id="width" type="text" inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} />
              </FormField>
              <FormField label="Kalınlık (cm)" htmlFor="thicknessCm" hint="Duvar kalınlığı veya zemin kırım derinliği">
                <input id="thicknessCm" type="text" inputMode="decimal" value={thicknessCm} onChange={(e) => setThicknessCm(e.target.value)} />
              </FormField>
            </>
          ) : (
            <FormField label="Net moloz hacmi (m³)" htmlFor="directVolume">
              <input id="directVolume" type="text" inputMode="decimal" value={directVolume} onChange={(e) => setDirectVolume(e.target.value)} />
            </FormField>
          )}

          <FormField label="İş türü (kabarma oranı)" htmlFor="tierKey" full hint="Kırılan/kazılan malzeme, yerinde bulunduğu haline göre daha fazla hacim kaplar.">
            <div className="segmented" role="group" aria-label="İş türü">
              {TIER_OPTIONS.map((option) => (
                <button key={option.key} type="button" className={tierKey === option.key ? 'active' : ''} onClick={() => setTierKey(option.key)}>{option.label}</button>
              ))}
            </div>
          </FormField>

          <FormField label="Taşıma aracı kapasitesi (m³)" htmlFor="truckCapacity" full>
            <div className="segmented" role="group" aria-label="Taşıma aracı kapasitesi">
              {TRUCK_CAPACITY_OPTIONS_M3.map((value) => (
                <button key={value} type="button" className={Number(truckCapacity) === value ? 'active' : ''} onClick={() => setTruckCapacity(String(value))}>{value} m³</button>
              ))}
            </div>
          </FormField>

          <FormField label="Sefer/araç başına fiyat (TL, opsiyonel)" htmlFor="truckPrice" full hint="Girerseniz toplam nakliye maliyetini hesaplarız. Güncel fiyatları nakliyecinizden alın.">
            <AmountInput id="truckPrice" value={truckPrice} onChange={setTruckPrice} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Taşınacak moloz hacmi (kabarma dahil)"
            value={`${formatNumber(result.looseVolumeM3)} m³`}
            note={`Net hacim ${formatNumber(result.netVolumeM3)} m³ + ${formatPercent(result.kabarmaOrani)} kabarma (${result.tierLabel})`}
          />
          <ResultMetrics
            items={[
              { label: 'Gereken sefer/araç sayısı', value: `${formatInteger(result.truckCount)} sefer (${truckCapacity} m³ kapasiteli)` },
              ...(result.cost !== null ? [{ label: 'Tahmini nakliye maliyeti', value: formatCurrency(result.cost) }] : []),
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Duvar/zemin ölçülerinden hesaplıyorsanız net hacim, uzunluk × genişlik/yükseklik × kalınlık formülüyle bulunur. Kırılan/kazılan malzeme yerinde bulunduğu haline göre daha az sıkışık paketlendiğinden, gerçek taşınacak hacim (kabarma dahil) bu net hacmin, seçtiğiniz iş türüne göre %10-40 arası bir oranla büyütülmesiyle bulunur (iç mekân kırımda daha düşük, dolgu/karışık zeminde daha yüksek). Gereken sefer/araç sayısı, bu kabarmış hacmin seçtiğiniz taşıma aracı kapasitesine bölünüp yukarı yuvarlanmasıyla hesaplanır.</p>
      </div>
    </CalculatorLayout>
  );
}
