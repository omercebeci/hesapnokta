import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import ShoppingListCard from '../../../components/ShoppingListCard.jsx';
import { calculateTileNeed, calculateGroutNeed, calculateOptionalCost } from '../../../lib/insaatTadilatCalculators.js';
import { formatCurrency, formatInteger, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const WASTE_OPTIONS = [5, 10, 15];

export default function FayansSeramikHesaplama() {
  const [area, setArea] = useQueryParamState('alan', '20');
  const [tileLength, setTileLength] = useQueryParamState('boy', '60');
  const [tileWidth, setTileWidth] = useQueryParamState('en', '30');
  const [wasteRate, setWasteRate] = useQueryParamState('fire', '10');
  const [patterned, setPatterned] = useQueryParamState('desenli', '0');
  const [piecesPerBox, setPiecesPerBox] = useQueryParamState('kutuAdet', '6');
  const [tilePrice, setTilePrice] = useQueryParamState('fiyat', '');

  const { result, error } = useMemo(() => {
    const parsedArea = parseLocaleNumber(area);
    const parsedLength = parseLocaleNumber(tileLength);
    const parsedWidth = parseLocaleNumber(tileWidth);
    const parsedWaste = parseLocaleNumber(wasteRate);
    const parsedPieces = parseLocaleNumber(piecesPerBox);

    if (!Number.isFinite(parsedArea) || parsedArea <= 0) {
      return { result: null, error: 'Lütfen geçerli bir alan girin.' };
    }
    if (!Number.isFinite(parsedLength) || parsedLength <= 0 || !Number.isFinite(parsedWidth) || parsedWidth <= 0) {
      return { result: null, error: 'Lütfen geçerli fayans ölçüleri girin.' };
    }

    const tile = calculateTileNeed({
      area: parsedArea,
      tileLengthCm: parsedLength,
      tileWidthCm: parsedWidth,
      wasteRate: Number.isFinite(parsedWaste) ? parsedWaste : 10,
      piecesPerBox: Number.isFinite(parsedPieces) ? parsedPieces : 6,
    });

    const groutKg = calculateGroutNeed({ area: parsedArea, tileLengthCm: parsedLength, tileWidthCm: parsedWidth });

    const parsedPrice = parseLocaleNumber(tilePrice);
    const cost = Number.isFinite(parsedPrice) && parsedPrice > 0 ? calculateOptionalCost(tile.tileCount, parsedPrice) : null;

    return { result: { ...tile, groutKg, cost }, error: null };
  }, [area, tileLength, tileWidth, wasteRate, piecesPerBox, tilePrice]);

  return (
    <CalculatorLayout calculatorId="fayans-seramik-hesaplama">
      <div className="calc-card">
        <h2>Alan ve fayans bilgileri</h2>
        <div className="form-grid">
          <FormField label="Döşenecek alan (m²)" htmlFor="area">
            <input id="area" type="text" inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} />
          </FormField>
          <FormField label="Fayans boyu (cm)" htmlFor="tileLength">
            <input id="tileLength" type="text" inputMode="decimal" value={tileLength} onChange={(e) => setTileLength(e.target.value)} />
          </FormField>
          <FormField label="Fayans eni (cm)" htmlFor="tileWidth">
            <input id="tileWidth" type="text" inputMode="decimal" value={tileWidth} onChange={(e) => setTileWidth(e.target.value)} />
          </FormField>
          <FormField label="Kutu başına adet" htmlFor="piecesPerBox">
            <input id="piecesPerBox" type="text" inputMode="numeric" value={piecesPerBox} onChange={(e) => setPiecesPerBox(e.target.value)} />
          </FormField>
          <FormField label="Fire payı (%)" htmlFor="wasteRate" full hint={patterned === '1' ? 'Desenli/çapraz döşemede fire payını %15 seçmeniz önerilir.' : 'Düz döşemede %5-10 yeterlidir; karo/desenli döşemede daha yüksek seçin.'}>
            <div className="segmented" role="group" aria-label="Fire payı">
              {WASTE_OPTIONS.map((value) => (
                <button key={value} type="button" className={Number(wasteRate) === value ? 'active' : ''} onClick={() => setWasteRate(String(value))}>%{value}</button>
              ))}
            </div>
          </FormField>
          <FormField label="Desenli/çapraz döşeme mi?" htmlFor="patterned" full>
            <div className="segmented" role="group" aria-label="Desenli döşeme">
              <button type="button" className={patterned === '0' ? 'active' : ''} onClick={() => setPatterned('0')}>Hayır, düz döşeme</button>
              <button type="button" className={patterned === '1' ? 'active' : ''} onClick={() => { setPatterned('1'); setWasteRate('15'); }}>Evet, desenli/çapraz</button>
            </div>
          </FormField>
          <FormField label="Fayans adet fiyatı (TL, opsiyonel)" htmlFor="tilePrice" full hint="Girerseniz toplam maliyeti hesaplarız. Güncel fiyatları satıcınızdan alın.">
            <input id="tilePrice" type="text" inputMode="decimal" value={tilePrice} onChange={(e) => setTilePrice(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Gereken fayans adedi" value={`${formatInteger(result.tileCount)} adet`} note={`${formatInteger(result.boxCount)} kutu (fire payı dahil ${formatNumber(result.areaWithWaste)} m²)`} />
          <ResultMetrics
            items={[
              { label: 'Bir fayansın alanı', value: `${formatNumber(result.tileAreaM2, { decimals: 3 })} m²` },
              { label: 'Tahmini derz dolgusu', value: `${formatNumber(result.groutKg)} kg` },
              ...(result.leftoverTileCount > 0 ? [{ label: 'Kutulardan artan fayans', value: `${formatInteger(result.leftoverTileCount)} adet` }] : []),
              ...(result.cost !== null ? [{ label: 'Tahmini fayans maliyeti', value: formatCurrency(result.cost) }] : []),
            ]}
          />
          <ShoppingListCard
            items={[
              `${formatInteger(result.boxCount)} kutu fayans (${formatInteger(result.tileCount)} adet)`,
              `~${formatNumber(result.groutKg)} kg derz dolgusu`,
              'Yapıştırıcı (ambalaj sarfiyatına bakın)',
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Alan, fire payı eklenerek büyütülür ve bir fayansın alanına bölünerek gereken adet bulunur; bu adet, kutu başına adet sayısına bölünüp yukarı yuvarlanarak kutu sayısı elde edilir. Derz dolgusu, sektörde yaygın kullanılan bir formülle (fayans ölçüsü, derz genişliği/derinliği ve dolgu yoğunluğuna göre) tahmini olarak hesaplanır; kesin ihtiyaç için ürün ambalajındaki sarfiyat tablosuna bakın.</p>
      </div>
    </CalculatorLayout>
  );
}
