import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateFlooringNeed, calculateOptionalCost } from '../../../lib/insaatTadilatCalculators.js';
import { formatCurrency, formatInteger, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function ParkeLaminatHesaplama() {
  const [area, setArea] = useQueryParamState('alan', '20');
  const [coverage, setCoverage] = useQueryParamState('paketAlani', '2,2');
  const [wasteRate, setWasteRate] = useQueryParamState('fire', '10');
  const [perimeter, setPerimeter] = useQueryParamState('cevre', '18');
  const [packagePrice, setPackagePrice] = useQueryParamState('fiyat', '');

  const { result, error } = useMemo(() => {
    const parsedArea = parseLocaleNumber(area);
    const parsedCoverage = parseLocaleNumber(coverage);
    const parsedWaste = parseLocaleNumber(wasteRate);
    const parsedPerimeter = parseLocaleNumber(perimeter);

    if (!Number.isFinite(parsedArea) || parsedArea <= 0) {
      return { result: null, error: 'Lütfen geçerli bir alan girin.' };
    }
    if (!Number.isFinite(parsedCoverage) || parsedCoverage <= 0) {
      return { result: null, error: 'Lütfen geçerli bir paket kapsamı (m²/paket) girin.' };
    }

    const flooring = calculateFlooringNeed({
      area: parsedArea,
      coveragePerPackage: parsedCoverage,
      wasteRate: Number.isFinite(parsedWaste) ? parsedWaste : 10,
      perimeter: Number.isFinite(parsedPerimeter) ? parsedPerimeter : 0,
    });

    const parsedPrice = parseLocaleNumber(packagePrice);
    const cost = Number.isFinite(parsedPrice) && parsedPrice > 0 ? calculateOptionalCost(flooring.packageCount, parsedPrice) : null;

    return { result: { ...flooring, cost }, error: null };
  }, [area, coverage, wasteRate, perimeter, packagePrice]);

  return (
    <CalculatorLayout calculatorId="parke-laminat-hesaplama">
      <div className="calc-card">
        <h2>Alan ve paket bilgileri</h2>
        <div className="form-grid">
          <FormField label="Döşenecek alan (m²)" htmlFor="area">
            <input id="area" type="text" inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} />
          </FormField>
          <FormField label="Paket kapsamı (m²/paket)" htmlFor="coverage" hint="Paket üzerinde yazan m² değeri">
            <input id="coverage" type="text" inputMode="decimal" value={coverage} onChange={(e) => setCoverage(e.target.value)} />
          </FormField>
          <FormField label="Fire payı (%)" htmlFor="wasteRate" hint="Düz döşemede %5-10, çapraz/balıksırtı döşemede daha yüksek seçin">
            <input id="wasteRate" type="text" inputMode="decimal" value={wasteRate} onChange={(e) => setWasteRate(e.target.value)} />
          </FormField>
          <FormField label="Oda çevresi (m, süpürgelik için)" htmlFor="perimeter" hint="2 × (uzunluk + genişlik); kapı boşluklarını isterseniz çıkarabilirsiniz">
            <input id="perimeter" type="text" inputMode="decimal" value={perimeter} onChange={(e) => setPerimeter(e.target.value)} />
          </FormField>
          <FormField label="Paket fiyatı (TL, opsiyonel)" htmlFor="packagePrice" full hint="Girerseniz toplam maliyeti hesaplarız. Güncel fiyatları satıcınızdan alın.">
            <input id="packagePrice" type="text" inputMode="decimal" value={packagePrice} onChange={(e) => setPackagePrice(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Gereken paket sayısı" value={`${formatInteger(result.packageCount)} paket`} note={`Fire payı dahil ${formatNumber(result.areaWithWaste)} m²`} />
          <ResultMetrics
            items={[
              { label: 'Süpürgelik metresi', value: `${formatNumber(result.skirtingMeters)} m` },
              ...(result.cost !== null ? [{ label: 'Tahmini parke/laminat maliyeti', value: formatCurrency(result.cost) }] : []),
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Alan, fire payıyla büyütülür ve paket kapsamına (m²/paket) bölünerek yukarı yuvarlanır; böylece açık paket kalmadan ihtiyacınızı karşılayacak paket sayısı bulunur. Süpürgelik metresi, girdiğiniz oda çevresinden doğrudan alınır.</p>
      </div>
    </CalculatorLayout>
  );
}
