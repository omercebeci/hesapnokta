import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import ShoppingListCard from '../../../components/ShoppingListCard.jsx';
import {
  calculatePlasterNeed,
  calculateBagCount,
  calculatePlasterCoverage,
  calculateOptionalCost,
  PLASTER_MATERIALS,
} from '../../../lib/insaatTadilatCalculators.js';
import { formatCurrency, formatInteger, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const MATERIAL_OPTIONS = Object.entries(PLASTER_MATERIALS).map(([key, material]) => ({ key, label: material.label }));
const BAG_WEIGHT_OPTIONS = [25, 35, 40];

export default function AlciSivaHesaplama() {
  const [mode, setMode] = useQueryParamState('mod', 'miktar');
  const [materialKey, setMaterialKey] = useQueryParamState('malzeme', 'saten-alcisi');
  const [area, setArea] = useQueryParamState('alan', '20');
  const [thickness, setThickness] = useQueryParamState('kalinlik', '1');
  const [wasteRate, setWasteRate] = useQueryParamState('fire', '5');
  const [bagWeight, setBagWeight] = useQueryParamState('torba', '35');
  const [bagCountInput, setBagCountInput] = useQueryParamState('torbaSayisi', '1');
  const [bagPrice, setBagPrice] = useQueryParamState('fiyat', '');

  const { result, error } = useMemo(() => {
    const parsedThickness = parseLocaleNumber(thickness);
    const parsedWaste = parseLocaleNumber(wasteRate);
    const parsedBagWeight = parseLocaleNumber(bagWeight);
    const resolvedBagWeight = Number.isFinite(parsedBagWeight) && parsedBagWeight > 0 ? parsedBagWeight : 35;

    if (!Number.isFinite(parsedThickness) || parsedThickness <= 0) {
      return { result: null, error: 'Lütfen geçerli bir uygulama kalınlığı girin.' };
    }

    if (mode === 'ters') {
      const parsedBagCount = parseLocaleNumber(bagCountInput);
      if (!Number.isFinite(parsedBagCount) || parsedBagCount <= 0) {
        return { result: null, error: 'Lütfen geçerli bir torba sayısı girin.' };
      }

      const coverage = calculatePlasterCoverage({
        bagCount: parsedBagCount,
        bagWeightKg: resolvedBagWeight,
        thicknessMm: parsedThickness,
        materialKey,
      });

      const parsedPrice = parseLocaleNumber(bagPrice);
      const cost = Number.isFinite(parsedPrice) && parsedPrice > 0 ? calculateOptionalCost(parsedBagCount, parsedPrice) : null;

      return { result: { ...coverage, bagCount: parsedBagCount, cost }, error: null };
    }

    const parsedArea = parseLocaleNumber(area);
    if (!Number.isFinite(parsedArea) || parsedArea <= 0) {
      return { result: null, error: 'Lütfen geçerli bir alan girin.' };
    }

    const plaster = calculatePlasterNeed({
      area: parsedArea,
      thicknessMm: parsedThickness,
      materialKey,
      wasteRate: Number.isFinite(parsedWaste) ? parsedWaste : 5,
    });

    const bagCount = calculateBagCount(plaster.requiredKg, resolvedBagWeight);
    const parsedPrice = parseLocaleNumber(bagPrice);
    const cost = Number.isFinite(parsedPrice) && parsedPrice > 0 ? calculateOptionalCost(bagCount, parsedPrice) : null;

    return { result: { ...plaster, bagCount, cost }, error: null };
  }, [mode, materialKey, area, thickness, wasteRate, bagWeight, bagCountInput, bagPrice]);

  return (
    <CalculatorLayout calculatorId="alci-siva-hesaplama">
      <div className="calc-card">
        <h2>Hesap türü ve malzeme</h2>
        <div className="form-grid">
          <FormField label="Hesap türü" htmlFor="mode" full>
            <div className="segmented" role="group" aria-label="Hesap türü">
              <button type="button" className={mode === 'miktar' ? 'active' : ''} onClick={() => setMode('miktar')}>Miktar hesapla</button>
              <button type="button" className={mode === 'ters' ? 'active' : ''} onClick={() => setMode('ters')}>Ters hesap (torbadan alan)</button>
            </div>
          </FormField>

          <FormField label="Malzeme türü" htmlFor="materialKey" full hint="Her malzemenin sarfiyatı üretici teknik föylerine göre farklıdır.">
            <div className="segmented" role="group" aria-label="Malzeme türü">
              {MATERIAL_OPTIONS.map((option) => (
                <button key={option.key} type="button" className={materialKey === option.key ? 'active' : ''} onClick={() => setMaterialKey(option.key)}>{option.label}</button>
              ))}
            </div>
          </FormField>

          {mode === 'miktar' ? (
            <FormField label="Duvar/tavan alanı (m²)" htmlFor="area">
              <input id="area" type="text" inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} />
            </FormField>
          ) : (
            <FormField label="Torba sayısı" htmlFor="bagCountInput">
              <input id="bagCountInput" type="text" inputMode="decimal" value={bagCountInput} onChange={(e) => setBagCountInput(e.target.value)} />
            </FormField>
          )}

          <FormField label="Uygulama kalınlığı (mm)" htmlFor="thickness" hint="Örn: saten alçı ~1 mm, perlitli sıva/makine sıvası tek katta ~8-20 mm, kaba sıva ~10-20 mm.">
            <input id="thickness" type="text" inputMode="decimal" value={thickness} onChange={(e) => setThickness(e.target.value)} />
          </FormField>

          <FormField label="Torba ağırlığı (kg)" htmlFor="bagWeight" full>
            <div className="segmented" role="group" aria-label="Torba ağırlığı">
              {BAG_WEIGHT_OPTIONS.map((value) => (
                <button key={value} type="button" className={Number(bagWeight) === value ? 'active' : ''} onClick={() => setBagWeight(String(value))}>{value} kg</button>
              ))}
            </div>
          </FormField>

          {mode === 'miktar' && (
            <FormField label="Fire payı (%)" htmlFor="wasteRate" hint="Duvar bozuklukları ve karışım/taşıma kaybı için %5 tipik bir başlangıç değeridir.">
              <input id="wasteRate" type="text" inputMode="decimal" value={wasteRate} onChange={(e) => setWasteRate(e.target.value)} />
            </FormField>
          )}

          <FormField label="Torba fiyatı (TL, opsiyonel)" htmlFor="bagPrice" full hint="Girerseniz toplam maliyeti hesaplarız. Güncel fiyatları satıcınızdan alın.">
            <AmountInput id="bagPrice" value={bagPrice} onChange={setBagPrice} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : mode === 'miktar' ? (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Gereken malzeme miktarı"
            value={`${formatNumber(result.requiredKg)} kg`}
            note={`${formatInteger(result.bagCount)} torba × ${bagWeight} kg (${result.materialLabel})`}
          />
          <ResultMetrics
            items={[
              { label: 'Torba sayısı', value: `${formatInteger(result.bagCount)} torba` },
              { label: 'Sarfiyat kaynağı', value: result.materialSource },
              ...(result.cost !== null ? [{ label: 'Tahmini malzeme maliyeti', value: formatCurrency(result.cost) }] : []),
            ]}
          />
          <ShoppingListCard
            items={[`${formatInteger(result.bagCount)} torba ${result.materialLabel} (${bagWeight} kg)`]}
          />
        </div>
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Kaplanabilir alan"
            value={`${formatNumber(result.coverageM2)} m²`}
            note={`${formatInteger(result.bagCount)} torba × ${bagWeight} kg = ${formatNumber(result.totalKg)} kg ${result.materialLabel} (${thickness} mm kalınlıkta)`}
          />
          <ResultMetrics
            items={[
              { label: 'Toplam malzeme', value: `${formatNumber(result.totalKg)} kg` },
              { label: 'Sarfiyat kaynağı', value: result.materialSource },
              ...(result.cost !== null ? [{ label: 'Tahmini malzeme maliyeti', value: formatCurrency(result.cost) }] : []),
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Gereken miktar (kg), alan × kalınlık (mm) × malzemenin kg/m²/mm sarfiyat oranı formülüyle bulunur ve fire payı eklenir; bu miktar seçtiğiniz torba ağırlığına bölünüp yukarı yuvarlanarak torba sayısına çevrilir. Ters hesapta aynı formül tersine çevrilir: elinizdeki torba sayısı × torba ağırlığı, kalınlık × sarfiyat oranına bölünerek kaplanabilir alan bulunur. Sarfiyat oranları üretici teknik föylerinden alınmıştır; gerçek sonuç yüzey pürüzlülüğü ve uygulama tekniğine göre değişebilir.</p>
      </div>
    </CalculatorLayout>
  );
}
