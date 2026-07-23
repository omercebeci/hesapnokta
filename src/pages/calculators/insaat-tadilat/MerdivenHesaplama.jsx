import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateStaircase } from '../../../lib/insaatTadilatCalculators.js';
import { formatInteger, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function MerdivenHesaplama() {
  const [floorHeight, setFloorHeight] = useQueryParamState('katYuksekligi', '270');
  const [horizontalLength, setHorizontalLength] = useQueryParamState('uzunluk', '4,5');

  const { result, error } = useMemo(() => {
    const parsedHeight = parseLocaleNumber(floorHeight);
    const parsedLength = parseLocaleNumber(horizontalLength);

    if (!Number.isFinite(parsedHeight) || parsedHeight <= 0) {
      return { result: null, error: 'Lütfen geçerli bir kat yüksekliği girin.' };
    }
    if (!Number.isFinite(parsedLength) || parsedLength <= 0) {
      return { result: null, error: 'Lütfen geçerli bir merdiven (koşum) uzunluğu girin.' };
    }

    const staircase = calculateStaircase({ floorHeightCm: parsedHeight, horizontalLengthM: parsedLength });
    return { result: staircase, error: null };
  }, [floorHeight, horizontalLength]);

  return (
    <CalculatorLayout calculatorId="merdiven-hesaplama">
      <div className="calc-card">
        <h2>Kat yüksekliği ve merdiven uzunluğu</h2>
        <div className="form-grid">
          <FormField label="Kat yüksekliği (cm)" htmlFor="floorHeight" hint="Alt kat döşemesinden üst kat döşemesine kadar olan dikey mesafe">
            <input id="floorHeight" type="text" inputMode="decimal" value={floorHeight} onChange={(e) => setFloorHeight(e.target.value)} />
          </FormField>
          <FormField label="Merdiven yatay uzunluğu (m)" htmlFor="horizontalLength" hint="Merdivenin kapladığı yatay (koşum) mesafe">
            <input id="horizontalLength" type="text" inputMode="decimal" value={horizontalLength} onChange={(e) => setHorizontalLength(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Basamak sayısı"
            value={`${formatInteger(result.stepCount)} basamak`}
            note={`Rıht: ${formatNumber(result.riserCm)} cm, basamak genişliği: ${formatNumber(result.treadCm)} cm, eğim: ${formatNumber(result.slopeDegrees)}°`}
            tone={result.isErgonomic ? undefined : 'warning'}
          />
          <ResultMetrics
            items={[
              { label: 'Rıht yüksekliği', value: `${formatNumber(result.riserCm)} cm` },
              { label: 'Basamak genişliği', value: `${formatNumber(result.treadCm)} cm` },
              { label: 'Eğim açısı', value: `${formatNumber(result.slopeDegrees)}°` },
              { label: 'Blondel değeri (2×rıht + basamak genişliği)', value: `${formatNumber(result.blondelCm)} cm` },
            ]}
          />
          {!result.isErgonomic && (
            <div className="info-card">
              <p>⚠️ Ergonomi uyarısı: Blondel değeri (2×rıht + basamak genişliği = {formatNumber(result.blondelCm)} cm), konforlu kabul edilen 63-65 cm aralığının dışında. {result.blondelCm < 63 ? 'Basamaklar gereğinden dar/dik hissedilebilir; merdiven uzunluğunu artırmayı veya basamak sayısını azaltmayı değerlendirin.' : 'Basamaklar gereğinden geniş/düz hissedilebilir; merdiven uzunluğunu azaltmayı veya basamak sayısını artırmayı değerlendirin.'}</p>
            </div>
          )}
          {result.exceedsRiserRegulation && (
            <div className="info-card">
              <p>⚠️ Rıht yüksekliği ({formatNumber(result.riserCm)} cm), Planlı Alanlar İmar Yönetmeliği'nde konut merdivenleri için verilen 17,5 cm üst sınırını aşıyor.</p>
            </div>
          )}
          {result.belowTreadRegulation && (
            <div className="info-card">
              <p>⚠️ Basamak genişliği ({formatNumber(result.treadCm)} cm), Planlı Alanlar İmar Yönetmeliği'nde konut merdivenleri için verilen 26 cm alt sınırının altında.</p>
            </div>
          )}
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Basamak sayısı, kat yüksekliğinin ideal rıht yüksekliğine (17 cm) bölünüp en yakın tam sayıya yuvarlanmasıyla bulunur; gerçek rıht yüksekliği, kat yüksekliğinin bu basamak sayısına bölünmesiyle hesaplanır. Basamak genişliği, merdivenin yatay uzunluğunun (basamak sayısından bir eksik) basamak (tread) sayısına bölünmesiyle bulunur. Ergonomi kontrolü, Blondel formülüyle (2 × rıht yüksekliği + basamak genişliği) yapılır; sonuç 63-65 cm aralığındaysa merdiven konforlu kabul edilir. Ayrıca Planlı Alanlar İmar Yönetmeliği'nin konut merdivenleri için verdiği sınırlar (rıht ≤ 17,5 cm, basamak genişliği ≥ 26 cm) da ayrıca kontrol edilir.</p>
      </div>
    </CalculatorLayout>
  );
}
