import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import Icon from '../../../components/Icon.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import { calculateDischargeDate } from '../../../lib/gunlukYasamCalculators.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';
import { formatDateTr, formatInteger } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const ASKERLIK_DATA = GUNCEL_VERILER.askerlikHizmetSureleri;
const today = new Date().toISOString().slice(0, 10);

const TUR_OPTIONS = [
  { id: 'er', label: 'Er/erbaş (6 ay)' },
  { id: 'yedekSubay', label: 'Yedek subay/yedek astsubay (12 ay)' },
  { id: 'bedelli', label: 'Bedelli askerlik (32 gün)' },
];

export default function AskerlikTerhisTarihiHesaplama() {
  const [sevkTarihi, setSevkTarihi] = useQueryParamState('sevk', today);
  const [tur, setTur] = useQueryParamState('tur', 'er');

  const { result, error } = useMemo(() => {
    const computed = calculateDischargeDate({ sevkTarihi, tur });
    if (!computed) {
      return { result: null, error: 'Lütfen geçerli bir sevk tarihi girin.' };
    }
    return { result: computed, error: null };
  }, [sevkTarihi, tur]);

  return (
    <CalculatorLayout calculatorId="askerlik-terhis-tarihi-hesaplama">
      <div className="calc-card">
        <h2>Sevk bilgileri</h2>
        <div className="form-grid">
          <FormField label="Sevk tarihi" htmlFor="sevkTarihi">
            <input id="sevkTarihi" type="date" value={sevkTarihi} onChange={(e) => setSevkTarihi(e.target.value)} />
          </FormField>
          <FormField label="Hizmet türü" htmlFor="tur">
            <select id="tur" value={tur} onChange={(e) => setTur(e.target.value)}>
              {TUR_OPTIONS.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
            </select>
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Terhis tarihi" value={formatDateTr(result.dischargeDate)} />
          <ResultMetrics
            items={[
              { label: result.remainingDays >= 0 ? 'Kalan gün' : 'Geçen gün', value: `${formatInteger(Math.abs(result.remainingDays))} gün` },
            ]}
          />
          <DataPeriodNote period={ASKERLIK_DATA.period} lastUpdated={ASKERLIK_DATA.lastUpdated} source={ASKERLIK_DATA.source} />
          <p className="rate-disclaimer">
            ⚠️ Bu araç yalnızca yasal hizmet süresine göre yaklaşık bir tarih verir. Kesin celp/terhis tarihiniz ve
            güncel durumunuz için ASAL (asal.msb.gov.tr) veya e-Devlet üzerindeki "Askerlik Durum Belgesi"
            sorgulamasını esas alın.
          </p>
          <Link to="/gun-sayaci-hesaplama" className="line-item-link">
            <Icon name="arrow-right" size={12} /> Başka bir tarihe kaç gün kaldığını hesapla
          </Link>
        </div>
      )}

      <div className="info-card">
        <h2>Hizmet süreleri nasıl belirleniyor?</h2>
        <p>
          7179 sayılı Askeralma Kanunu'nun 5. maddesine göre zorunlu askerlik hizmet süresi erbaş ve erler için 6
          ay, yedek subay/yedek astsubay olacaklar için 12 aydır. Bedelli askerlikte ise süre 28 günü temel
          askerlik eğitimi, 2 günü yol izni ve 2 günü kanuni izin olmak üzere toplam 32 gündür; bedelli askerlik
          yapanlar yedek subay/astsubay olamaz. Terhis tarihi, sevk tarihine bu sürenin eklenmesiyle hesaplanır;
          birlik/celp döneminize özgü idari gecikmeler bu hesaba dahil değildir. Kesin ve güncel bilgi için
          ASAL (asal.msb.gov.tr) veya e-Devlet kapısındaki askerlik durum sorgulamasını kullanmanız önerilir.
        </p>
      </div>
    </CalculatorLayout>
  );
}
