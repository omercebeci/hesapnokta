import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import ShoppingListCard from '../../../components/ShoppingListCard.jsx';
import { calculateRoomWallArea, calculatePaintNeed, calculateOptionalCost } from '../../../lib/insaatTadilatCalculators.js';
import { formatCurrency, formatInteger, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function BoyaHesaplama() {
  const [mode, setMode] = useQueryParamState('mod', 'olculer');
  const [length, setLength] = useQueryParamState('uzunluk', '4');
  const [width, setWidth] = useQueryParamState('genislik', '5');
  const [height, setHeight] = useQueryParamState('yukseklik', '2,5');
  const [directArea, setDirectArea] = useQueryParamState('alan', '90');
  const [deductionArea, setDeductionArea] = useQueryParamState('dusum', '8');
  const [coatCount, setCoatCount] = useQueryParamState('kat', '2');
  const [coverage, setCoverage] = useQueryParamState('verim', '10');
  const [literPrice, setLiterPrice] = useQueryParamState('fiyat', '');

  const { result, error } = useMemo(() => {
    const parsedDeduction = parseLocaleNumber(deductionArea);
    const parsedCoats = parseLocaleNumber(coatCount);
    const parsedCoverage = parseLocaleNumber(coverage);

    let wallArea;
    if (mode === 'alan') {
      const parsedArea = parseLocaleNumber(directArea);
      if (!Number.isFinite(parsedArea) || parsedArea <= 0) {
        return { result: null, error: 'Lütfen geçerli bir toplam duvar alanı girin.' };
      }
      wallArea = parsedArea;
    } else {
      const parsedLength = parseLocaleNumber(length);
      const parsedWidth = parseLocaleNumber(width);
      const parsedHeight = parseLocaleNumber(height);
      if (!Number.isFinite(parsedLength) || parsedLength <= 0 || !Number.isFinite(parsedWidth) || parsedWidth <= 0 || !Number.isFinite(parsedHeight) || parsedHeight <= 0) {
        return { result: null, error: 'Lütfen geçerli oda ölçüleri girin.' };
      }
      wallArea = calculateRoomWallArea({ length: parsedLength, width: parsedWidth, height: parsedHeight });
    }

    if (!Number.isFinite(parsedDeduction) || parsedDeduction < 0) {
      return { result: null, error: 'Kapı/pencere düşümü negatif olamaz.' };
    }

    const paint = calculatePaintNeed({
      wallArea,
      deductionArea: parsedDeduction,
      coatCount: Number.isFinite(parsedCoats) ? parsedCoats : 2,
      coveragePerLiter: Number.isFinite(parsedCoverage) ? parsedCoverage : 10,
    });

    const parsedPrice = parseLocaleNumber(literPrice);
    const cost = Number.isFinite(parsedPrice) && parsedPrice > 0 ? calculateOptionalCost(paint.totalLiters, parsedPrice) : null;

    const packageParts = [];
    if (paint.fifteen > 0) packageParts.push(`${paint.fifteen} × 15L`);
    if (paint.sevenHalf > 0) packageParts.push(`${paint.sevenHalf} × 7,5L`);
    if (paint.twoHalf > 0) packageParts.push(`${paint.twoHalf} × 2,5L`);
    const packageCombo = packageParts.length > 0 ? packageParts.join(' + ') : 'Boya gerekmiyor (net alan 0 m²)';

    return { result: { wallArea, ...paint, cost, packageCombo }, error: null };
  }, [mode, length, width, height, directArea, deductionArea, coatCount, coverage, literPrice]);

  return (
    <CalculatorLayout calculatorId="boya-hesaplama">
      <div className="calc-card">
        <h2>Duvar bilgileri</h2>
        <div className="form-grid">
          <FormField label="Ölçü girişi" htmlFor="mode" full>
            <div className="segmented" role="group" aria-label="Ölçü girişi">
              <button type="button" className={mode === 'olculer' ? 'active' : ''} onClick={() => setMode('olculer')}>Oda ölçülerinden</button>
              <button type="button" className={mode === 'alan' ? 'active' : ''} onClick={() => setMode('alan')}>Doğrudan m²</button>
            </div>
          </FormField>

          {mode === 'olculer' ? (
            <>
              <FormField label="Oda uzunluğu (m)" htmlFor="length">
                <input id="length" type="text" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
              </FormField>
              <FormField label="Oda genişliği (m)" htmlFor="width">
                <input id="width" type="text" inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} />
              </FormField>
              <FormField label="Tavan yüksekliği (m)" htmlFor="height">
                <input id="height" type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} />
              </FormField>
            </>
          ) : (
            <FormField label="Toplam duvar alanı (m²)" htmlFor="directArea">
              <input id="directArea" type="text" inputMode="decimal" value={directArea} onChange={(e) => setDirectArea(e.target.value)} />
            </FormField>
          )}

          <FormField label="Kapı/pencere düşümü (m²)" htmlFor="deductionArea" hint="Standart bir kapı ~1,6-2 m², pencere ~1,5 m² civarındadır.">
            <input id="deductionArea" type="text" inputMode="decimal" value={deductionArea} onChange={(e) => setDeductionArea(e.target.value)} />
          </FormField>
          <FormField label="Kat sayısı" htmlFor="coatCount" hint="Genellikle 2 kat önerilir">
            <input id="coatCount" type="text" inputMode="numeric" value={coatCount} onChange={(e) => setCoatCount(e.target.value)} />
          </FormField>
          <FormField label="Boya verimi (m²/L)" htmlFor="coverage" hint="Ambalaj üzerinde yazan tipik değer 10-14 m²/L arasıdır">
            <input id="coverage" type="text" inputMode="decimal" value={coverage} onChange={(e) => setCoverage(e.target.value)} />
          </FormField>
          <FormField label="Litre fiyatı (TL, opsiyonel)" htmlFor="literPrice" full hint="Girerseniz toplam maliyeti hesaplarız. Güncel fiyatları satıcınızdan alın.">
            <AmountInput id="literPrice" value={literPrice} onChange={setLiterPrice} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Gereken boya miktarı"
            value={`${formatNumber(result.literNeeded)} L`}
            note={`Ambalaj önerisi: ${result.packageCombo} (toplam ${formatNumber(result.totalLiters)} L)`}
          />
          <ResultMetrics
            items={[
              { label: 'Boyanacak net duvar alanı', value: `${formatNumber(result.netArea)} m²` },
              { label: 'Toplam boya', value: `${formatNumber(result.literNeeded)} L` },
              { label: 'Kat başına litre', value: `${formatNumber(result.literPerCoat)} L` },
              ...(result.cost !== null ? [{ label: 'Tahmini boya maliyeti', value: formatCurrency(result.cost) }] : []),
            ]}
          />
          <ShoppingListCard
            items={[
              `${result.packageCombo} boya (toplam ${formatNumber(result.totalLiters)} L)`,
              'Astar boyası bu listeye dahil değildir, ayrıca hesaplayın',
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Duvar alanından kapı/pencere düşümü çıkarılarak net boyanacak alan bulunur. Bu alan, kat sayısıyla çarpılıp boya verimine (m²/L) bölünerek gereken litre miktarı hesaplanır. Ardından bu miktarı eksiksiz karşılayacak 2,5L/7,5L/15L ambalaj kombinasyonu önerilir. Fiyat girilmezse yalnızca miktar (litre) hesaplanır; site hiçbir birim fiyat önermez.</p>
      </div>
    </CalculatorLayout>
  );
}
