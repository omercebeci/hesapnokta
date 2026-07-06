import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateFuelSplitCost } from '../../../lib/gunlukYasamCalculators.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';

export default function YolculukYakitPayiHesaplama() {
  const [distanceKm, setDistanceKm] = useState('450');
  const [consumptionPer100Km, setConsumptionPer100Km] = useState('7,2');
  const [fuelPrice, setFuelPrice] = useState('43,15');
  const [peopleCount, setPeopleCount] = useState('3');

  const { result, error } = useMemo(() => {
    const parsedDistance = parseLocaleNumber(distanceKm);
    const parsedConsumption = parseLocaleNumber(consumptionPer100Km);
    const parsedPrice = parseLocaleNumber(fuelPrice);
    const parsedPeople = parseLocaleNumber(peopleCount);

    if (!Number.isFinite(parsedDistance) || parsedDistance <= 0) {
      return { result: null, error: 'Lütfen geçerli bir mesafe girin.' };
    }
    if (!Number.isFinite(parsedConsumption) || parsedConsumption <= 0) {
      return { result: null, error: 'Lütfen geçerli bir yakıt tüketimi girin.' };
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return { result: null, error: 'Lütfen geçerli bir yakıt fiyatı girin.' };
    }
    if (!Number.isFinite(parsedPeople) || parsedPeople < 1) {
      return { result: null, error: 'Kişi sayısı en az 1 olmalıdır.' };
    }

    return {
      result: calculateFuelSplitCost({
        distanceKm: parsedDistance,
        consumptionPer100Km: parsedConsumption,
        fuelPrice: parsedPrice,
        peopleCount: parsedPeople,
      }),
      error: null,
    };
  }, [distanceKm, consumptionPer100Km, fuelPrice, peopleCount]);

  return (
    <CalculatorLayout calculatorId="yolculuk-yakit-payi-hesaplama">
      <div className="calc-card">
        <h2>Yolculuk bilgileri</h2>
        <div className="form-grid">
          <FormField label="Mesafe (km)" htmlFor="distanceKm" full>
            <input id="distanceKm" type="text" inputMode="decimal" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} />
          </FormField>
          <FormField label="Tüketim (L / 100km)" htmlFor="consumptionPer100Km">
            <input id="consumptionPer100Km" type="text" inputMode="decimal" value={consumptionPer100Km} onChange={(e) => setConsumptionPer100Km(e.target.value)} />
          </FormField>
          <FormField label="Yakıt fiyatı (TL/L)" htmlFor="fuelPrice">
            <input id="fuelPrice" type="text" inputMode="decimal" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} />
          </FormField>
          <FormField label="Araçtaki kişi sayısı" htmlFor="peopleCount" full>
            <input id="peopleCount" type="text" inputMode="numeric" value={peopleCount} onChange={(e) => setPeopleCount(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Kişi başı yakıt payı" value={formatCurrency(result.perPerson)} />
          <ResultMetrics
            items={[
              { label: 'Toplam yakıt maliyeti', value: formatCurrency(result.totalCost) },
              { label: 'Gereken yakıt', value: `${formatNumber(result.fuelNeeded)} L` },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl kullanılır?</h2>
        <p>Ortak bir yolculukta (araç paylaşımı, grup gezisi) toplam yakıt maliyetini hesaplayıp araçtaki kişi sayısına eşit olarak bölerek herkesin ödemesi gereken payı gösterir. Köprü/otoyol geçiş ücreti gibi ek masraflar dahil değildir.</p>
      </div>
    </CalculatorLayout>
  );
}
