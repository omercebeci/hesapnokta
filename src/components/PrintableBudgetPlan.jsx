import React from 'react';
import { useCalculatorContext } from '../context/CalculatorContext.jsx';
import { formatCurrency, formatDateTr } from '../utils/format.js';

function todayLocalDateStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export default function PrintableBudgetPlan({ items, total }) {
  const calculator = useCalculatorContext();

  return (
    <>
      <button type="button" className="btn-primary print-plan-button no-print" onClick={() => window.print()}>
        🖨️ Planı yazdır/PDF
      </button>

      <div className="print-summary" aria-hidden="true">
        <h1>HesapNokta</h1>
        <p className="print-summary-meta">{calculator?.title} — {formatDateTr(todayLocalDateStr())}</p>
        <table className="print-summary-table">
          <thead>
            <tr><th>Kalem</th><th>Tutar</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.label}><td>{item.label}</td><td>{formatCurrency(item.amount)}</td></tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td>Toplam</td><td>{formatCurrency(total)}</td></tr>
          </tfoot>
        </table>
        <p className="print-summary-note">Bu tutarlar kullanıcının girdiği tekliflere/tahminlere dayalıdır; HesapNokta hiçbir fiyat önermez. Güncel fiyatları/teklifleri satıcınızdan veya ustanızdan alın.</p>
      </div>
    </>
  );
}
