import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import { calculateTrafficFineDiscount } from '../../../lib/gunlukYasamCalculators.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const TRAFFIC_FINE_DATA = GUNCEL_VERILER.trafikCezasiErkenOdeme;

export default function TrafikCezasiErkenOdemeHesaplama() {
  const [amount, setAmount] = useQueryParamState('ceza', '2560');

  const { result, error } = useMemo(() => {
    const parsedAmount = parseLocaleNumber(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return { result: null, error: 'Lütfen geçerli bir ceza tutarı girin.' };
    }
    return { result: calculateTrafficFineDiscount({ amount: parsedAmount }), error: null };
  }, [amount]);

  return (
    <CalculatorLayout calculatorId="trafik-cezasi-erken-odeme-hesaplama">
      <div className="calc-card">
        <h2>Ceza bilgisi</h2>
        <div className="form-grid">
          <FormField label="Ceza tutarı (TL)" htmlFor="amount" full>
            <AmountInput id="amount" value={amount} onChange={setAmount} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="İndirimli ödeme tutarı" value={formatCurrency(result.discountedAmount)} note={`%${result.discountRate} indirimli`} />
          <ResultMetrics
            items={[
              { label: 'İndirim tutarı', value: formatCurrency(result.discountAmount) },
              { label: 'İndirim için son gün', value: `Tebliğden itibaren ${result.dayLimit} gün` },
            ]}
          />
          <DataPeriodNote period={TRAFFIC_FINE_DATA.period} lastUpdated={TRAFFIC_FINE_DATA.lastUpdated} source={TRAFFIC_FINE_DATA.source} />
        </div>
      )}

      <div className="info-card">
        <h2>Erken ödeme indirimi nasıl işler?</h2>
        <p>
          2918 sayılı Karayolları Trafik Kanunu'nun 115. maddesi, trafik idari para cezalarının tebliğ tarihinden
          itibaren belirli bir süre içinde ödenmesi halinde %{TRAFFIC_FINE_DATA.indirimOrani * 100} indirim
          uygulanacağı ilkesini belirler. Bu sürenin gün sayısı 31.01.2024 tarihli bir yönetmelik değişikliğiyle
          15 günden {TRAFFIC_FINE_DATA.gunSayisi} güne (1 ay) uzatılmıştır. Süre geçtikten sonra indirim hakkı
          kaybolur ve gecikme zammı işlemeye başlar. İndirim yalnızca ana ceza tutarına uygulanır; varsa ayrı
          gecikme faizi bu tutara dahil değildir. Ödemenizi yaparken güncel süre ve tutarı e-Devlet üzerinden de
          teyit etmenizi öneririz.
        </p>
      </div>
    </CalculatorLayout>
  );
}
