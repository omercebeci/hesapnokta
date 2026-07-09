import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import RatioBar from '../../../components/RatioBar.jsx';
import Icon from '../../../components/Icon.jsx';
import { calculateVehicleOwnershipCost } from '../../../lib/gunlukYasamCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function AracSahipOlmaMaliyetiHesaplama() {
  const [mtv, setMtv] = useQueryParamState('mtv', '3500');
  const [sigorta, setSigorta] = useQueryParamState('sigorta', '8000');
  const [kasko, setKasko] = useQueryParamState('kasko', '12000');
  const [bakim, setBakim] = useQueryParamState('bakim', '4000');
  const [lastik, setLastik] = useQueryParamState('lastik', '3000');
  const [yakit, setYakit] = useQueryParamState('yakit', '25000');
  const [kmPerYear, setKmPerYear] = useQueryParamState('km', '15000');

  const { result, error } = useMemo(() => {
    const parsed = {
      mtv: parseLocaleNumber(mtv),
      sigorta: parseLocaleNumber(sigorta),
      kasko: parseLocaleNumber(kasko),
      bakim: parseLocaleNumber(bakim),
      lastik: parseLocaleNumber(lastik),
      yakit: parseLocaleNumber(yakit),
    };
    const parsedKm = parseLocaleNumber(kmPerYear);

    if (Object.values(parsed).every((v) => !Number.isFinite(v) || v <= 0)) {
      return { result: null, error: 'Lütfen en az bir gider kalemi için geçerli bir tutar girin.' };
    }
    if (!Number.isFinite(parsedKm) || parsedKm <= 0) {
      return { result: null, error: 'Lütfen geçerli bir yıllık kilometre girin.' };
    }

    return { result: calculateVehicleOwnershipCost({ ...parsed, kmPerYear: parsedKm }), error: null };
  }, [mtv, sigorta, kasko, bakim, lastik, yakit, kmPerYear]);

  return (
    <CalculatorLayout calculatorId="arac-sahip-olma-maliyeti-hesaplama">
      <div className="calc-card">
        <h2>Yıllık gider kalemleri</h2>
        <div className="form-grid">
          <FormField label="MTV (TL/yıl)" htmlFor="mtv">
            <input id="mtv" type="text" inputMode="decimal" value={mtv} onChange={(e) => setMtv(e.target.value)} />
          </FormField>
          <FormField label="Trafik sigortası (TL/yıl)" htmlFor="sigorta">
            <input id="sigorta" type="text" inputMode="decimal" value={sigorta} onChange={(e) => setSigorta(e.target.value)} />
          </FormField>
          <FormField label="Kasko (TL/yıl)" htmlFor="kasko">
            <input id="kasko" type="text" inputMode="decimal" value={kasko} onChange={(e) => setKasko(e.target.value)} />
          </FormField>
          <FormField label="Bakım/servis (TL/yıl)" htmlFor="bakim">
            <input id="bakim" type="text" inputMode="decimal" value={bakim} onChange={(e) => setBakim(e.target.value)} />
          </FormField>
          <FormField label="Lastik (TL/yıl)" htmlFor="lastik">
            <input id="lastik" type="text" inputMode="decimal" value={lastik} onChange={(e) => setLastik(e.target.value)} />
          </FormField>
          <FormField label="Yakıt (TL/yıl)" htmlFor="yakit" hint="Yakıt maliyetinizi bilmiyorsanız yakıt maliyeti aracını kullanabilirsiniz">
            <input id="yakit" type="text" inputMode="decimal" value={yakit} onChange={(e) => setYakit(e.target.value)} />
          </FormField>
          <FormField label="Yıllık kilometre" htmlFor="kmPerYear">
            <input id="kmPerYear" type="text" inputMode="decimal" value={kmPerYear} onChange={(e) => setKmPerYear(e.target.value)} />
          </FormField>
        </div>
        <Link to="/yakit-maliyeti-hesaplama" className="line-item-link">
          <Icon name="arrow-right" size={12} /> Yakıt maliyetini hesapla
        </Link>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Yıllık toplam araç sahiplik maliyeti" value={formatCurrency(result.yearlyTotal)} />
          <ResultMetrics
            items={[
              { label: 'Kilometre başı maliyet', value: formatCurrency(result.perKm) },
              { label: 'Aylık ortalama', value: formatCurrency(result.perMonth) },
            ]}
          />
          <div className="result-metric" style={{ display: 'grid', gap: 16 }}>
            {result.breakdown.filter((item) => item.amount > 0).map((item) => (
              <RatioBar key={item.label} label={item.label} value={item.ratio} tone="accent" />
            ))}
          </div>
        </div>
      )}

      <div className="info-card">
        <h2>Neden km başı maliyet önemli?</h2>
        <p>
          Bir aracın gerçek maliyeti sadece yakıt değildir; MTV, sigorta, kasko, bakım ve lastik gibi kalemler bir
          araya geldiğinde yıllık toplam çoğu zaman tahmin edilenden yüksek çıkar. Kilometre başı maliyet, farklı
          araçları veya "araç almalı mıyım, taksi/toplu taşıma mı kullanmalıyım" kararını karşılaştırmak için pratik bir ölçüttür.
        </p>
      </div>
    </CalculatorLayout>
  );
}
