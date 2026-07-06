import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateLoan, generateLoanSchedule } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';

export default function KrediHesaplama() {
  const [amount, setAmount] = useState('100000');
  const [monthlyRate, setMonthlyRate] = useState('3,5');
  const [months, setMonths] = useState('12');
  const [bsmvRate, setBsmvRate] = useState('15');
  const [kkdfRate, setKkdfRate] = useState('15');

  const { result, schedule, error } = useMemo(() => {
    const parsedAmount = parseLocaleNumber(amount);
    const parsedRate = parseLocaleNumber(monthlyRate);
    const parsedMonths = parseLocaleNumber(months);
    const parsedBsmv = parseLocaleNumber(bsmvRate);
    const parsedKkdf = parseLocaleNumber(kkdfRate);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return { result: null, schedule: null, error: 'Lütfen geçerli bir kredi tutarı girin.' };
    }
    if (!Number.isFinite(parsedRate) || parsedRate < 0) {
      return { result: null, schedule: null, error: 'Lütfen geçerli bir aylık faiz oranı girin.' };
    }
    if (!Number.isFinite(parsedMonths) || parsedMonths < 1) {
      return { result: null, schedule: null, error: 'Vade en az 1 ay olmalıdır.' };
    }

    const params = {
      amount: parsedAmount,
      monthlyRate: parsedRate,
      months: parsedMonths,
      bsmvRate: Number.isFinite(parsedBsmv) ? parsedBsmv : 15,
      kkdfRate: Number.isFinite(parsedKkdf) ? parsedKkdf : 15,
    };

    return {
      result: calculateLoan(params),
      schedule: generateLoanSchedule(params),
      error: null,
    };
  }, [amount, monthlyRate, months, bsmvRate, kkdfRate]);

  return (
    <CalculatorLayout calculatorId="kredi-hesaplama">
      <div className="calc-card">
        <h2>Kredi bilgileri</h2>
        <div className="form-grid">
          <FormField label="Kredi tutarı (TL)" htmlFor="amount">
            <input id="amount" type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </FormField>
          <FormField label="Aylık faiz oranı (%)" htmlFor="monthlyRate">
            <input id="monthlyRate" type="text" inputMode="decimal" value={monthlyRate} onChange={(e) => setMonthlyRate(e.target.value)} />
          </FormField>
          <FormField label="Vade (ay)" htmlFor="months">
            <input id="months" type="text" inputMode="numeric" value={months} onChange={(e) => setMonths(e.target.value)} />
          </FormField>
          <FormField label="BSMV oranı (%)" htmlFor="bsmvRate" hint="Faiz üzerinden alınan vergi">
            <input id="bsmvRate" type="text" inputMode="decimal" value={bsmvRate} onChange={(e) => setBsmvRate(e.target.value)} />
          </FormField>
          <FormField label="KKDF oranı (%)" htmlFor="kkdfRate" hint="Faiz üzerinden alınan fon kesintisi">
            <input id="kkdfRate" type="text" inputMode="decimal" value={kkdfRate} onChange={(e) => setKkdfRate(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            key={`${result.monthlyPayment}-${result.totalPayment}`}
            label="Aylık taksit"
            value={formatCurrency(result.monthlyPayment)}
            note={`${formatNumber(months, { decimals: 0 })} ay boyunca ödenir`}
          />
          <ResultMetrics
            items={[
              { label: 'Toplam geri ödeme', value: formatCurrency(result.totalPayment) },
              { label: 'Toplam faiz', value: formatCurrency(result.totalInterest) },
              { label: 'BSMV + KKDF', value: formatCurrency(result.totalTaxes) },
              { label: 'Toplam maliyet', value: formatCurrency(result.totalCost) },
            ]}
          />
        </div>
      )}

      {!error && schedule && (
        <div className="calc-card" style={{ gridColumn: '1 / -1' }}>
          <details open={schedule.length <= 12}>
            <summary style={{ cursor: 'pointer', listStyle: 'none' }}>
              <h2 style={{ display: 'inline' }}>Ödeme planı ({schedule.length} ay)</h2>
            </summary>
            <div className="schedule-wrap" style={{ marginTop: 16 }}>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Ay</th>
                    <th>Taksit</th>
                    <th>Anapara</th>
                    <th>Faiz + kesinti</th>
                    <th>Kalan borç</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={row.month}>
                      <td>{row.month}</td>
                      <td>{formatCurrency(row.payment)}</td>
                      <td>{formatCurrency(row.principalPayment)}</td>
                      <td>{formatCurrency(row.interest)}</td>
                      <td>{formatCurrency(row.remaining)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}

      <div className="info-card" style={{ gridColumn: '1 / -1' }}>
        <h2>Nasıl yorumlanır?</h2>
        <ul>
          <li>Hesaplama, sabit taksitli anüite yöntemini kullanır.</li>
          <li>BSMV ve KKDF, bankaların faiz üzerinden yansıttığı yasal kesintilerdir.</li>
          <li>Gerçek teklif; banka masrafı, sigorta ve kampanyaya göre değişebilir.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
