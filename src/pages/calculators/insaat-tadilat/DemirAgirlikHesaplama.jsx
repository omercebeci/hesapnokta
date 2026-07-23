import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import {
  calculateRebarWeight,
  calculateHollowProfileWeight,
  calculateOptionalCost,
  STANDARD_REBAR_DIAMETERS_MM,
} from '../../../lib/insaatTadilatCalculators.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function DemirAgirlikHesaplama() {
  const [mode, setMode] = useQueryParamState('mod', 'yuvarlak');
  const [diameter, setDiameter] = useQueryParamState('cap', '12');
  const [length, setLength] = useQueryParamState('metraj', '100');
  const [profileWidth, setProfileWidth] = useQueryParamState('genislik', '40');
  const [profileHeight, setProfileHeight] = useQueryParamState('yukseklik', '40');
  const [wallThickness, setWallThickness] = useQueryParamState('etkalinligi', '2');
  const [profileLength, setProfileLength] = useQueryParamState('profilmetraj', '6');
  const [kgPrice, setKgPrice] = useQueryParamState('fiyat', '');

  const { result, error } = useMemo(() => {
    const parsedPrice = parseLocaleNumber(kgPrice);

    if (mode === 'profil') {
      const parsedWidth = parseLocaleNumber(profileWidth);
      const parsedHeight = parseLocaleNumber(profileHeight);
      const parsedWall = parseLocaleNumber(wallThickness);
      const parsedLength = parseLocaleNumber(profileLength);

      if (!Number.isFinite(parsedWidth) || parsedWidth <= 0 || !Number.isFinite(parsedHeight) || parsedHeight <= 0) {
        return { result: null, error: 'Lütfen geçerli profil dış ölçüleri girin.' };
      }
      if (!Number.isFinite(parsedWall) || parsedWall <= 0 || parsedWall * 2 >= Math.min(parsedWidth, parsedHeight)) {
        return { result: null, error: 'Et kalınlığı, profil ölçülerinin yarısından küçük olmalıdır.' };
      }
      if (!Number.isFinite(parsedLength) || parsedLength <= 0) {
        return { result: null, error: 'Lütfen geçerli bir metraj girin.' };
      }

      const weight = calculateHollowProfileWeight({
        outerWidthMm: parsedWidth,
        outerHeightMm: parsedHeight,
        wallThicknessMm: parsedWall,
        lengthM: parsedLength,
      });
      const cost = Number.isFinite(parsedPrice) && parsedPrice > 0 ? calculateOptionalCost(weight.totalKg, parsedPrice) : null;
      return { result: { ...weight, cost }, error: null };
    }

    const parsedLength = parseLocaleNumber(length);
    if (!Number.isFinite(parsedLength) || parsedLength <= 0) {
      return { result: null, error: 'Lütfen geçerli bir metraj girin.' };
    }

    const weight = calculateRebarWeight({ diameterMm: Number(diameter), lengthM: parsedLength });
    const cost = Number.isFinite(parsedPrice) && parsedPrice > 0 ? calculateOptionalCost(weight.totalKg, parsedPrice) : null;
    return { result: { ...weight, cost }, error: null };
  }, [mode, diameter, length, profileWidth, profileHeight, wallThickness, profileLength, kgPrice]);

  return (
    <CalculatorLayout calculatorId="demir-agirlik-hesaplama">
      <div className="calc-card">
        <h2>Demir/profil bilgileri</h2>
        <div className="form-grid">
          <FormField label="Demir türü" htmlFor="mode" full>
            <div className="segmented" role="group" aria-label="Demir türü">
              <button type="button" className={mode === 'yuvarlak' ? 'active' : ''} onClick={() => setMode('yuvarlak')}>Yuvarlak inşaat demiri (nervürlü)</button>
              <button type="button" className={mode === 'profil' ? 'active' : ''} onClick={() => setMode('profil')}>Kutu/dikdörtgen profil (opsiyonel)</button>
            </div>
          </FormField>

          {mode === 'yuvarlak' ? (
            <>
              <FormField label="Çap (mm)" htmlFor="diameter" full hint="TS 708 standardındaki yaygın piyasa çapları">
                <div className="segmented" role="group" aria-label="Çap">
                  {STANDARD_REBAR_DIAMETERS_MM.map((value) => (
                    <button key={value} type="button" className={Number(diameter) === value ? 'active' : ''} onClick={() => setDiameter(String(value))}>Ø{value}</button>
                  ))}
                </div>
              </FormField>
              <FormField label="Toplam metraj (m)" htmlFor="length">
                <input id="length" type="text" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
              </FormField>
            </>
          ) : (
            <>
              <FormField label="Dış genişlik (mm)" htmlFor="profileWidth">
                <input id="profileWidth" type="text" inputMode="decimal" value={profileWidth} onChange={(e) => setProfileWidth(e.target.value)} />
              </FormField>
              <FormField label="Dış yükseklik (mm)" htmlFor="profileHeight">
                <input id="profileHeight" type="text" inputMode="decimal" value={profileHeight} onChange={(e) => setProfileHeight(e.target.value)} />
              </FormField>
              <FormField label="Et kalınlığı (mm)" htmlFor="wallThickness">
                <input id="wallThickness" type="text" inputMode="decimal" value={wallThickness} onChange={(e) => setWallThickness(e.target.value)} />
              </FormField>
              <FormField label="Toplam metraj (m)" htmlFor="profileLength">
                <input id="profileLength" type="text" inputMode="decimal" value={profileLength} onChange={(e) => setProfileLength(e.target.value)} />
              </FormField>
            </>
          )}

          <FormField label="Kg fiyatı (TL, opsiyonel)" htmlFor="kgPrice" full hint="Girerseniz toplam maliyeti hesaplarız. Güncel fiyatları demir bayinizden alın.">
            <AmountInput id="kgPrice" value={kgPrice} onChange={setKgPrice} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Toplam ağırlık"
            value={`${formatNumber(result.totalKg)} kg`}
            note={`${formatNumber(result.totalTon, { decimals: 4 })} ton — birim ağırlık: ${formatNumber(result.kgPerMeter, { decimals: 3 })} kg/m`}
          />
          <ResultMetrics
            items={[
              { label: 'Birim ağırlık', value: `${formatNumber(result.kgPerMeter, { decimals: 3 })} kg/m` },
              { label: 'Toplam ton', value: `${formatNumber(result.totalTon, { decimals: 4 })} ton` },
              ...(result.cost !== null ? [{ label: 'Tahmini maliyet', value: formatCurrency(result.cost) }] : []),
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Birim ağırlık (kg/m), çubuğun kesit alanı (π/4 × çap²) ile standart çelik yoğunluğunun (7850 kg/m³) çarpılmasıyla bulunur — bu, TS 708 standardındaki birim ağırlık tablosunun dayandığı fiziksel formüldür ve bu araçtaki Ø8-Ø16 arası hesaplanan değerler yayınlanmış TS 708 tablosuyla birebir örtüşmektedir. Toplam ağırlık, birim ağırlığın girdiğiniz metrajla çarpılmasıyla bulunur. Kutu/dikdörtgen profil seçeneğinde ise aynı yoğunluk, dış ölçüler ve et kalınlığından hesaplanan kesit alanıyla çarpılır.</p>
      </div>
    </CalculatorLayout>
  );
}
