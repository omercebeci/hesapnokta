import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateEvChargingCost } from '../../../lib/gunlukYasamCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function ElektrikliAracSarjMaliyetiHesaplama() {
  const [batteryCapacityKwh, setBatteryCapacityKwh] = useQueryParamState('kapasite', '60');
  const [consumptionPer100Km, setConsumptionPer100Km] = useQueryParamState('tuketim', '16');
  const [homePricePerKwh, setHomePricePerKwh] = useQueryParamState('evFiyat', '2,8');
  const [stationPricePerKwh, setStationPricePerKwh] = useQueryParamState('istasyonFiyat', '6,5');
  const [fuelConsumptionPer100Km, setFuelConsumptionPer100Km] = useQueryParamState('benzinTuketim', '7');
  const [fuelPrice, setFuelPrice] = useQueryParamState('benzinFiyat', '43');

  const { result, error } = useMemo(() => {
    const battery = parseLocaleNumber(batteryCapacityKwh);
    const consumption = parseLocaleNumber(consumptionPer100Km);
    const homePrice = parseLocaleNumber(homePricePerKwh);

    if (!Number.isFinite(battery) || battery <= 0) {
      return { result: null, error: 'Lütfen geçerli bir batarya kapasitesi girin.' };
    }
    if (!Number.isFinite(consumption) || consumption <= 0) {
      return { result: null, error: 'Lütfen geçerli bir 100 km tüketimi girin.' };
    }
    if (!Number.isFinite(homePrice) || homePrice <= 0) {
      return { result: null, error: 'Lütfen geçerli bir ev elektrik fiyatı girin.' };
    }

    return {
      result: calculateEvChargingCost({
        batteryCapacityKwh: battery,
        consumptionPer100Km: consumption,
        homePricePerKwh: homePrice,
        stationPricePerKwh: parseLocaleNumber(stationPricePerKwh),
        fuelConsumptionPer100Km: parseLocaleNumber(fuelConsumptionPer100Km),
        fuelPrice: parseLocaleNumber(fuelPrice),
      }),
      error: null,
    };
  }, [batteryCapacityKwh, consumptionPer100Km, homePricePerKwh, stationPricePerKwh, fuelConsumptionPer100Km, fuelPrice]);

  return (
    <CalculatorLayout calculatorId="elektrikli-arac-sarj-maliyeti-hesaplama">
      <div className="calc-card">
        <h2>Elektrikli araç bilgileri</h2>
        <div className="form-grid">
          <FormField label="Batarya kapasitesi (kWh)" htmlFor="batteryCapacityKwh">
            <input id="batteryCapacityKwh" type="text" inputMode="decimal" value={batteryCapacityKwh} onChange={(e) => setBatteryCapacityKwh(e.target.value)} />
          </FormField>
          <FormField label="100 km başına tüketim (kWh)" htmlFor="consumptionPer100Km">
            <input id="consumptionPer100Km" type="text" inputMode="decimal" value={consumptionPer100Km} onChange={(e) => setConsumptionPer100Km(e.target.value)} />
          </FormField>
          <FormField label="Ev elektrik fiyatı (TL/kWh)" htmlFor="homePricePerKwh">
            <input id="homePricePerKwh" type="text" inputMode="decimal" value={homePricePerKwh} onChange={(e) => setHomePricePerKwh(e.target.value)} />
          </FormField>
          <FormField label="Şarj istasyonu fiyatı (TL/kWh, opsiyonel)" htmlFor="stationPricePerKwh">
            <input id="stationPricePerKwh" type="text" inputMode="decimal" value={stationPricePerKwh} onChange={(e) => setStationPricePerKwh(e.target.value)} />
          </FormField>
        </div>
      </div>

      <div className="calc-card">
        <h2>Karşılaştırma için benzinli araç (opsiyonel)</h2>
        <div className="form-grid">
          <FormField label="100 km başına yakıt tüketimi (L)" htmlFor="fuelConsumptionPer100Km">
            <input id="fuelConsumptionPer100Km" type="text" inputMode="decimal" value={fuelConsumptionPer100Km} onChange={(e) => setFuelConsumptionPer100Km(e.target.value)} />
          </FormField>
          <FormField label="Yakıt fiyatı (TL/L)" htmlFor="fuelPrice">
            <input id="fuelPrice" type="text" inputMode="decimal" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Evde tam şarj maliyeti" value={formatCurrency(result.fullChargeCostHome)} />
          <ResultMetrics
            items={[
              { label: '100 km maliyeti (ev)', value: formatCurrency(result.cost100KmHome) },
              ...(result.cost100KmStation !== null ? [{ label: '100 km maliyeti (istasyon)', value: formatCurrency(result.cost100KmStation) }] : []),
              ...(result.gasolineCost100Km !== null ? [{ label: '100 km maliyeti (benzinli araç)', value: formatCurrency(result.gasolineCost100Km) }] : []),
              ...(result.savingsPer100KmVsGasoline !== null ? [{ label: '100 km başına tasarruf', value: formatCurrency(result.savingsPer100KmVsGasoline) }] : []),
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Elektrikli araç gerçekten ucuz mu?</h2>
        <p>
          Evde şarj genellikle en ucuz seçenektir; hızlı şarj istasyonları ise kWh başına belirgin şekilde daha
          pahalı olabilir. "100 km başına tasarruf" satırı, girdiğiniz benzinli araç tüketim ve fiyatına göre
          elektrikli aracın 100 km'de ne kadar avantajlı (veya dezavantajlı) olduğunu gösterir; uzun vadeli
          karşılaştırmada satın alma fiyatı, bakım ve pil ömrü gibi kalemler bu hesaba dahil değildir.
        </p>
      </div>
    </CalculatorLayout>
  );
}
