import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateWallBlockNeed, calculateOptionalCost } from '../../../lib/insaatTadilatCalculators.js';
import { formatCurrency, formatInteger, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function DuvarTuglaGazbetonHesaplama() {
  const [wallArea, setWallArea] = useQueryParamState('alan', '30');
  const [blockWidth, setBlockWidth] = useQueryParamState('genislik', '60');
  const [blockHeight, setBlockHeight] = useQueryParamState('yukseklik', '20');
  const [wasteRate, setWasteRate] = useQueryParamState('fire', '5');
  const [mortarPerM2, setMortarPerM2] = useQueryParamState('harc', '5');
  const [blockPrice, setBlockPrice] = useQueryParamState('fiyat', '');

  const { result, error } = useMemo(() => {
    const parsedArea = parseLocaleNumber(wallArea);
    const parsedWidth = parseLocaleNumber(blockWidth);
    const parsedHeight = parseLocaleNumber(blockHeight);
    const parsedWaste = parseLocaleNumber(wasteRate);
    const parsedMortar = parseLocaleNumber(mortarPerM2);

    if (!Number.isFinite(parsedArea) || parsedArea <= 0) {
      return { result: null, error: 'Lütfen geçerli bir duvar alanı girin.' };
    }
    if (!Number.isFinite(parsedWidth) || parsedWidth <= 0 || !Number.isFinite(parsedHeight) || parsedHeight <= 0) {
      return { result: null, error: 'Lütfen geçerli blok ölçüleri girin.' };
    }

    const block = calculateWallBlockNeed({
      wallArea: parsedArea,
      blockWidthCm: parsedWidth,
      blockHeightCm: parsedHeight,
      wasteRate: Number.isFinite(parsedWaste) ? parsedWaste : 5,
      mortarPerM2: Number.isFinite(parsedMortar) ? parsedMortar : 5,
    });

    const parsedPrice = parseLocaleNumber(blockPrice);
    const cost = Number.isFinite(parsedPrice) && parsedPrice > 0 ? calculateOptionalCost(block.blockCount, parsedPrice) : null;

    return { result: { ...block, cost }, error: null };
  }, [wallArea, blockWidth, blockHeight, wasteRate, mortarPerM2, blockPrice]);

  return (
    <CalculatorLayout calculatorId="duvar-tugla-gazbeton-hesaplama">
      <div className="calc-card">
        <h2>Duvar ve blok bilgileri</h2>
        <div className="form-grid">
          <FormField label="Duvar alanı (m²)" htmlFor="wallArea">
            <input id="wallArea" type="text" inputMode="decimal" value={wallArea} onChange={(e) => setWallArea(e.target.value)} />
          </FormField>
          <FormField label="Blok genişliği (cm)" htmlFor="blockWidth" hint="Duvarda görünen yatay yüz ölçüsü">
            <input id="blockWidth" type="text" inputMode="decimal" value={blockWidth} onChange={(e) => setBlockWidth(e.target.value)} />
          </FormField>
          <FormField label="Blok yüksekliği (cm)" htmlFor="blockHeight">
            <input id="blockHeight" type="text" inputMode="decimal" value={blockHeight} onChange={(e) => setBlockHeight(e.target.value)} />
          </FormField>
          <FormField label="Fire payı (%)" htmlFor="wasteRate">
            <input id="wasteRate" type="text" inputMode="decimal" value={wasteRate} onChange={(e) => setWasteRate(e.target.value)} />
          </FormField>
          <FormField label="Harç/yapıştırıcı sarfiyatı (kg/m²)" htmlFor="mortarPerM2" full hint="Gazbeton yapıştırıcısı için tipik 4-6 kg/m², geleneksel tuğla harcı için 20-30 kg/m² arasında değişir.">
            <input id="mortarPerM2" type="text" inputMode="decimal" value={mortarPerM2} onChange={(e) => setMortarPerM2(e.target.value)} />
          </FormField>
          <FormField label="Blok adet fiyatı (TL, opsiyonel)" htmlFor="blockPrice" full hint="Girerseniz toplam maliyeti hesaplarız. Güncel fiyatları satıcınızdan alın.">
            <input id="blockPrice" type="text" inputMode="decimal" value={blockPrice} onChange={(e) => setBlockPrice(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Gereken blok adedi" value={`${formatInteger(result.blockCount)} adet`} note={`Fire payı dahil ${formatNumber(result.areaWithWaste)} m²`} />
          <ResultMetrics
            items={[
              { label: 'Bir bloğun yüz alanı', value: `${formatNumber(result.blockFaceArea, { decimals: 3 })} m²` },
              { label: 'Tahmini harç/yapıştırıcı', value: `${formatNumber(result.mortarKg)} kg` },
              ...(result.cost !== null ? [{ label: 'Tahmini blok maliyeti', value: formatCurrency(result.cost) }] : []),
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Duvar alanı fire payıyla büyütülür ve bir bloğun görünen yüz alanına (genişlik × yükseklik) bölünerek gereken adet bulunur. Harç/yapıştırıcı miktarı, girdiğiniz kg/m² sarfiyat değeriyle duvar alanının çarpılmasıyla tahmin edilir; kesin sarfiyat, ürün ambalajındaki teknik bilgiye göre değişir.</p>
      </div>
    </CalculatorLayout>
  );
}
