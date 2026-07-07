import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateElectricityCost } from '../../../lib/gunlukYasamCalculators.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function ElektrikTuketimiHesaplama() {
  const [watt, setWatt] = useQueryParamState('watt', '1500');
  const [hoursPerDay, setHoursPerDay] = useQueryParamState('saat', '3');
  const [daysPerMonth, setDaysPerMonth] = useQueryParamState('gun', '30');
  const [pricePerKwh, setPricePerKwh] = useQueryParamState('fiyat', '2,5');

  const { result, error } = useMemo(() => {
    const parsedWatt = parseLocaleNumber(watt);
    const parsedHours = parseLocaleNumber(hoursPerDay);
    const parsedDays = parseLocaleNumber(daysPerMonth);
    const parsedPrice = parseLocaleNumber(pricePerKwh);

    if (!Number.isFinite(parsedWatt) || parsedWatt <= 0) {
      return { result: null, error: 'Lütfen geçerli bir cihaz gücü (watt) girin.' };
    }
    if (!Number.isFinite(parsedHours) || parsedHours < 0 || parsedHours > 24) {
      return { result: null, error: 'Günlük kullanım süresi 0-24 saat arasında olmalıdır.' };
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return { result: null, error: 'Lütfen geçerli bir kWh birim fiyatı girin.' };
    }

    return {
      result: calculateElectricityCost({
        watt: parsedWatt,
        hoursPerDay: parsedHours,
        daysPerMonth: Number.isFinite(parsedDays) ? parsedDays : 30,
        pricePerKwh: parsedPrice,
      }),
      error: null,
    };
  }, [watt, hoursPerDay, daysPerMonth, pricePerKwh]);

  return (
    <CalculatorLayout calculatorId="elektrik-tuketimi-hesaplama">
      <div className="calc-card">
        <h2>Cihaz bilgileri</h2>
        <div className="form-grid">
          <FormField label="Cihaz gücü (watt)" htmlFor="watt">
            <input id="watt" type="text" inputMode="decimal" value={watt} onChange={(e) => setWatt(e.target.value)} />
          </FormField>
          <FormField label="Günlük kullanım (saat)" htmlFor="hoursPerDay">
            <input id="hoursPerDay" type="text" inputMode="decimal" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} />
          </FormField>
          <FormField label="Aylık kullanım günü" htmlFor="daysPerMonth">
            <input id="daysPerMonth" type="text" inputMode="numeric" value={daysPerMonth} onChange={(e) => setDaysPerMonth(e.target.value)} />
          </FormField>
          <FormField label="Elektrik birim fiyatı (TL/kWh)" htmlFor="pricePerKwh">
            <input id="pricePerKwh" type="text" inputMode="decimal" value={pricePerKwh} onChange={(e) => setPricePerKwh(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Aylık elektrik maliyeti" value={formatCurrency(result.monthlyCost)} />
          <ResultMetrics
            items={[
              { label: 'Günlük tüketim', value: `${formatNumber(result.dailyKwh)} kWh` },
              { label: 'Aylık tüketim', value: `${formatNumber(result.monthlyKwh)} kWh` },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Günlük tüketim, cihazın watt gücü ile günlük kullanım saatinin çarpılıp 1000'e bölünmesiyle kWh cinsinden bulunur. Bu değer aylık kullanım günü ile çarpılıp elektrik birim fiyatınızla çarpılarak aylık maliyet hesaplanır. Dağıtım bedeli, vergi (BTV, KDV) gibi fatura kalemleri dahil değildir.</p>
      </div>
    </CalculatorLayout>
  );
}
