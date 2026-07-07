import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateRoofNeed, calculateOptionalCost } from '../../../lib/insaatTadilatCalculators.js';
import { formatCurrency, formatInteger, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function CatiHesaplama() {
  const [length, setLength] = useQueryParamState('uzunluk', '10');
  const [width, setWidth] = useQueryParamState('genislik', '8');
  const [pitch, setPitch] = useQueryParamState('egim', '30');
  const [tilesPerM2, setTilesPerM2] = useQueryParamState('kiremitYogunluk', '10');
  const [wasteRate, setWasteRate] = useQueryParamState('fire', '10');
  const [m2Price, setM2Price] = useQueryParamState('fiyat', '');

  const { result, error } = useMemo(() => {
    const parsedLength = parseLocaleNumber(length);
    const parsedWidth = parseLocaleNumber(width);
    const parsedPitch = parseLocaleNumber(pitch);
    const parsedTiles = parseLocaleNumber(tilesPerM2);
    const parsedWaste = parseLocaleNumber(wasteRate);

    if (!Number.isFinite(parsedLength) || parsedLength <= 0 || !Number.isFinite(parsedWidth) || parsedWidth <= 0) {
      return { result: null, error: 'Lütfen geçerli çatı taban ölçüleri girin.' };
    }
    if (!Number.isFinite(parsedPitch) || parsedPitch < 0 || parsedPitch >= 85) {
      return { result: null, error: 'Lütfen 0-85 derece arasında geçerli bir çatı eğimi girin.' };
    }

    const roof = calculateRoofNeed({
      length: parsedLength,
      width: parsedWidth,
      pitchDegrees: parsedPitch,
      tilesPerM2: Number.isFinite(parsedTiles) ? parsedTiles : 10,
      wasteRate: Number.isFinite(parsedWaste) ? parsedWaste : 10,
    });

    const parsedPrice = parseLocaleNumber(m2Price);
    const cost = Number.isFinite(parsedPrice) && parsedPrice > 0 ? calculateOptionalCost(roof.areaWithWaste, parsedPrice) : null;

    return { result: { ...roof, cost }, error: null };
  }, [length, width, pitch, tilesPerM2, wasteRate, m2Price]);

  return (
    <CalculatorLayout calculatorId="cati-hesaplama">
      <div className="calc-card">
        <h2>Çatı taban ölçüleri ve eğim</h2>
        <div className="form-grid">
          <FormField label="Çatı taban uzunluğu (m)" htmlFor="length" hint="Bina dış duvarlarının plan üzerindeki uzunluğu">
            <input id="length" type="text" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
          </FormField>
          <FormField label="Çatı taban genişliği (m)" htmlFor="width">
            <input id="width" type="text" inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} />
          </FormField>
          <FormField label="Çatı eğimi (derece)" htmlFor="pitch" hint="Kırma/eğimli çatılarda tipik değer 25-35 derecedir">
            <input id="pitch" type="text" inputMode="decimal" value={pitch} onChange={(e) => setPitch(e.target.value)} />
          </FormField>
          <FormField label="Kiremit yoğunluğu (adet/m²)" htmlFor="tilesPerM2" hint="Standart kiremitler için tipik değer 9-13 adet/m² arasıdır">
            <input id="tilesPerM2" type="text" inputMode="decimal" value={tilesPerM2} onChange={(e) => setTilesPerM2(e.target.value)} />
          </FormField>
          <FormField label="Fire payı (%)" htmlFor="wasteRate">
            <input id="wasteRate" type="text" inputMode="decimal" value={wasteRate} onChange={(e) => setWasteRate(e.target.value)} />
          </FormField>
          <FormField label="m² fiyatı (TL, opsiyonel)" htmlFor="m2Price" full hint="Girerseniz toplam maliyeti hesaplarız. Güncel fiyatları ustanızdan/satıcınızdan alın.">
            <input id="m2Price" type="text" inputMode="decimal" value={m2Price} onChange={(e) => setM2Price(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Gerçek çatı alanı (eğim düzeltmeli)" value={`${formatNumber(result.actualRoofArea)} m²`} note={`Fire payı dahil ${formatNumber(result.areaWithWaste)} m²`} />
          <ResultMetrics
            items={[
              { label: 'Taban (plan) alanı', value: `${formatNumber(result.footprintArea)} m²` },
              { label: 'Tahmini kiremit/panel adedi', value: `${formatInteger(result.tileCount)} adet` },
              { label: 'Tahmini membran/OSB levha sayısı', value: `${formatInteger(result.osbSheetsCount)} levha` },
              ...(result.cost !== null ? [{ label: 'Tahmini malzeme maliyeti', value: formatCurrency(result.cost) }] : []),
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Taban (plan) alanı, uzunluk × genişlik ile bulunur. Eğimli çatılarda gerçek yüzey alanı, taban alanının eğim açısının kosinüsüne bölünmesiyle (alan ÷ cos(açı)) hesaplanır — açı arttıkça gerçek alan taban alanından belirgin şekilde büyür. Bu alana fire payı eklenip kiremit yoğunluğuyla çarpılarak yaklaşık kiremit adedi, standart 122×244 cm OSB levha alanına bölünerek de levha sayısı tahmin edilir. Saçak/mahya gibi ek ölçüler bu hesaba dahil değildir.</p>
      </div>
    </CalculatorLayout>
  );
}
