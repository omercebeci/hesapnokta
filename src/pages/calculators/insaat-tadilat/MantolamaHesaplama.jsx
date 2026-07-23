import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import ShoppingListCard from '../../../components/ShoppingListCard.jsx';
import { calculateMantolamaNeed, calculateOptionalCost, MANTOLAMA_MATERIALS } from '../../../lib/insaatTadilatCalculators.js';
import { formatCurrency, formatInteger, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const MATERIAL_OPTIONS = Object.entries(MANTOLAMA_MATERIALS).map(([key, material]) => ({ key, label: material.label }));
const HEIGHT_TIER_OPTIONS = [
  { value: '8', label: '≤ 8 m (2 kat civarı)' },
  { value: '15', label: '8-20 m (orta yükseklik)' },
  { value: '30', label: '20 m üzeri (yüksek bina)' },
];

export default function MantolamaHesaplama() {
  const [area, setArea] = useQueryParamState('alan', '100');
  const [materialKey, setMaterialKey] = useQueryParamState('malzeme', 'eps');
  const [thickness, setThickness] = useQueryParamState('kalinlik', '50');
  const [wasteRate, setWasteRate] = useQueryParamState('fire', '5');
  const [buildingHeight, setBuildingHeight] = useQueryParamState('yukseklik', '8');
  const [boardPrice, setBoardPrice] = useQueryParamState('fiyat', '');

  const { result, error } = useMemo(() => {
    const parsedArea = parseLocaleNumber(area);
    const parsedThickness = parseLocaleNumber(thickness);
    const parsedWaste = parseLocaleNumber(wasteRate);

    if (!Number.isFinite(parsedArea) || parsedArea <= 0) {
      return { result: null, error: 'Lütfen geçerli bir cephe alanı girin.' };
    }
    if (!Number.isFinite(parsedThickness) || parsedThickness <= 0) {
      return { result: null, error: 'Lütfen geçerli bir levha kalınlığı girin.' };
    }

    const mantolama = calculateMantolamaNeed({
      area: parsedArea,
      materialKey,
      thicknessMm: parsedThickness,
      wasteRate: Number.isFinite(parsedWaste) ? parsedWaste : 5,
      buildingHeightM: Number(buildingHeight),
    });

    const parsedPrice = parseLocaleNumber(boardPrice);
    const cost = Number.isFinite(parsedPrice) && parsedPrice > 0 ? calculateOptionalCost(mantolama.boardCount, parsedPrice) : null;

    return { result: { ...mantolama, cost }, error: null };
  }, [area, materialKey, thickness, wasteRate, buildingHeight, boardPrice]);

  return (
    <CalculatorLayout calculatorId="mantolama-hesaplama">
      <div className="calc-card">
        <h2>Cephe ve malzeme bilgileri</h2>
        <div className="form-grid">
          <FormField label="Cephe alanı (m²)" htmlFor="area">
            <input id="area" type="text" inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} />
          </FormField>
          <FormField label="Levha kalınlığı (mm)" htmlFor="thickness" hint="Yaygın kalınlıklar: 30-50-60-80-100 mm">
            <input id="thickness" type="text" inputMode="decimal" value={thickness} onChange={(e) => setThickness(e.target.value)} />
          </FormField>
          <FormField label="Fire payı (%)" htmlFor="wasteRate">
            <input id="wasteRate" type="text" inputMode="decimal" value={wasteRate} onChange={(e) => setWasteRate(e.target.value)} />
          </FormField>
          <FormField label="Levha türü" htmlFor="materialKey" full>
            <div className="segmented" role="group" aria-label="Levha türü">
              {MATERIAL_OPTIONS.map((option) => (
                <button key={option.key} type="button" className={materialKey === option.key ? 'active' : ''} onClick={() => setMaterialKey(option.key)}>{option.label}</button>
              ))}
            </div>
          </FormField>
          <FormField label="Bina yüksekliği" htmlFor="buildingHeight" full hint="Dübel yoğunluğu bina yüksekliğine göre artar (rüzgar yükü nedeniyle).">
            <div className="segmented" role="group" aria-label="Bina yüksekliği">
              {HEIGHT_TIER_OPTIONS.map((option) => (
                <button key={option.value} type="button" className={buildingHeight === option.value ? 'active' : ''} onClick={() => setBuildingHeight(option.value)}>{option.label}</button>
              ))}
            </div>
          </FormField>
          <FormField label="Levha fiyatı (TL/adet, opsiyonel)" htmlFor="boardPrice" full hint="Girerseniz toplam levha maliyetini hesaplarız. Güncel fiyatları satıcınızdan alın.">
            <AmountInput id="boardPrice" value={boardPrice} onChange={setBoardPrice} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Gereken levha sayısı"
            value={`${formatInteger(result.boardCount)} adet`}
            note={`${result.materialLabel} — fire payı dahil ${formatNumber(result.areaWithWaste)} m²`}
          />
          <ResultMetrics
            items={[
              { label: 'Dübel sayısı', value: `${formatInteger(result.dubelCount)} adet (${result.dubelPerM2}/m²)` },
              { label: 'Önerilen dübel uzunluğu', value: `~${formatInteger(result.recommendedDubelLengthMm)} mm (en yakın üst standart uzunluğu seçin)` },
              { label: 'File (donatı filesi)', value: `${formatNumber(result.fileM2)} m²` },
              { label: 'Yapıştırıcı', value: `${formatNumber(result.adhesiveKg)} kg` },
              { label: 'Sıva (donatı gömme + üst kat)', value: `${formatNumber(result.plasterKg)} kg` },
              ...(result.cost !== null ? [{ label: 'Tahmini levha maliyeti', value: formatCurrency(result.cost) }] : []),
            ]}
          />
          <ShoppingListCard
            items={[
              `${formatInteger(result.boardCount)} adet ${result.materialLabel} levha`,
              `${formatInteger(result.dubelCount)} adet dübel (~${formatInteger(result.recommendedDubelLengthMm)} mm)`,
              `${formatNumber(result.fileM2)} m² donatı filesi`,
              `${formatNumber(result.adhesiveKg)} kg yapıştırıcı`,
              `${formatNumber(result.plasterKg)} kg sıva (donatı gömme + üst kat)`,
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Cephe alanı, fire payı kadar büyütülüp seçtiğiniz levha türünün standart ölçüsüne (EPS/XPS için 0,5 m², taşyünü için 0,72 m²) bölünerek gereken levha sayısı bulunur. Dübel sayısı, bina yüksekliğine göre değişen yoğunlukla (≤8 m için 6, 8-20 m için 8, 20 m üzeri için 10 adet/m²) çarpılan cephe alanından hesaplanır; önerilen dübel uzunluğu ise levha kalınlığı + yapıştırma payı (5 mm) + kaba sıva payı (10 mm) + ankraj derinliği (50 mm) formülüyle bulunur. File, %10 bindirme payıyla (1,10 m²/m²), yapıştırıcı 4,5 kg/m², donatı gömme + üst kat sıvası toplamda 5 kg/m² sarfiyat üzerinden hesaplanır.</p>
      </div>
    </CalculatorLayout>
  );
}
