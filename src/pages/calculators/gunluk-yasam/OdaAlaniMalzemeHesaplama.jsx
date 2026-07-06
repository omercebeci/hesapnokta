import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateRoomMaterials } from '../../../lib/gunlukYasamCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';

export default function OdaAlaniMalzemeHesaplama() {
  const [length, setLength] = useState('4');
  const [width, setWidth] = useState('5');
  const [height, setHeight] = useState('2,5');
  const [coatCount, setCoatCount] = useState('2');
  const [wasteRate, setWasteRate] = useState('10');

  const { result, error } = useMemo(() => {
    const parsedLength = parseLocaleNumber(length);
    const parsedWidth = parseLocaleNumber(width);
    const parsedHeight = parseLocaleNumber(height);
    const parsedCoats = parseLocaleNumber(coatCount);
    const parsedWaste = parseLocaleNumber(wasteRate);

    if (!Number.isFinite(parsedLength) || parsedLength <= 0) {
      return { result: null, error: 'Lütfen geçerli bir oda uzunluğu girin.' };
    }
    if (!Number.isFinite(parsedWidth) || parsedWidth <= 0) {
      return { result: null, error: 'Lütfen geçerli bir oda genişliği girin.' };
    }
    if (!Number.isFinite(parsedHeight) || parsedHeight <= 0) {
      return { result: null, error: 'Lütfen geçerli bir tavan yüksekliği girin.' };
    }

    return {
      result: calculateRoomMaterials({
        length: parsedLength,
        width: parsedWidth,
        height: parsedHeight,
        coatCount: Number.isFinite(parsedCoats) ? parsedCoats : 2,
        wasteRate: Number.isFinite(parsedWaste) ? parsedWaste : 10,
      }),
      error: null,
    };
  }, [length, width, height, coatCount, wasteRate]);

  return (
    <CalculatorLayout calculatorId="oda-alani-malzeme-hesaplama">
      <div className="calc-card">
        <h2>Oda ölçüleri</h2>
        <div className="form-grid">
          <FormField label="Uzunluk (m)" htmlFor="length">
            <input id="length" type="text" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
          </FormField>
          <FormField label="Genişlik (m)" htmlFor="width">
            <input id="width" type="text" inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} />
          </FormField>
          <FormField label="Tavan yüksekliği (m)" htmlFor="height">
            <input id="height" type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} />
          </FormField>
          <FormField label="Kat sayısı (boya)" htmlFor="coatCount" hint="Genellikle 2 kat önerilir">
            <input id="coatCount" type="text" inputMode="numeric" value={coatCount} onChange={(e) => setCoatCount(e.target.value)} />
          </FormField>
          <FormField label="Fire payı (%)" htmlFor="wasteRate" full>
            <input id="wasteRate" type="text" inputMode="decimal" value={wasteRate} onChange={(e) => setWasteRate(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Gereken boya miktarı" value={`${formatNumber(result.totalPaintLiters)} L`} note="10 m²/litre kapasiteli boya varsayımıyla" />
          <ResultMetrics
            items={[
              { label: 'Zemin alanı (halı/döşeme)', value: `${formatNumber(result.floorArea)} m²` },
              { label: 'Duvar alanı', value: `${formatNumber(result.wallArea)} m²` },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Zemin alanı, uzunluk × genişlik ile bulunur ve halı/laminat/parke gibi döşeme ihtiyacınız için kullanılabilir. Duvar alanı, odanın çevresi (2×(uzunluk+genişlik)) ile tavan yüksekliğinin çarpılmasıyla hesaplanır; bu alan, kat sayısı ve fire payı eklenerek gereken boya litresine dönüştürülür. Kapı/pencere alanları düşülmediğinden gerçek ihtiyaç biraz daha az olabilir.</p>
      </div>
    </CalculatorLayout>
  );
}
