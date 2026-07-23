import React from 'react';
import { useCalculatorContext } from '../context/CalculatorContext.jsx';
import { formatCurrency, formatDateTr, formatNumber } from '../utils/format.js';

function todayLocalDateStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export default function PrintableHakedisPlan({ items, totalContractAmount, totalEarnedAmount, totalPaidAmount, balance }) {
  const calculator = useCalculatorContext();

  return (
    <>
      <button type="button" className="btn-primary print-plan-button no-print" onClick={() => window.print()}>
        🖨️ Hakediş özetini yazdır / PDF kaydet
      </button>
      <p className="hint no-print" style={{ marginTop: -8 }}>Açılan pencerede Hedef olarak "PDF olarak kaydet" seçerseniz dosya olarak indirilir; ustanızla masaya koyabileceğiniz bir özet çıkar.</p>

      <div className="print-summary" aria-hidden="true">
        <h1>HesapNokta</h1>
        <p className="print-summary-meta">{calculator?.title} — {formatDateTr(todayLocalDateStr())}</p>
        <table className="print-summary-table">
          <thead>
            <tr><th>Kalem</th><th>Sözleşme Bedeli</th><th>Tamamlanma</th><th>Hak Edilen Tutar</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.label}>
                <td>{item.label}</td>
                <td>{formatCurrency(item.amount)}</td>
                <td>%{formatNumber(item.percentComplete, { decimals: 0 })}</td>
                <td>{formatCurrency(item.earnedAmount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td>Toplam</td><td>{formatCurrency(totalContractAmount)}</td><td></td><td>{formatCurrency(totalEarnedAmount)}</td></tr>
          </tfoot>
        </table>
        <table className="print-summary-table">
          <tbody>
            <tr><td>Bugüne kadar ödenen toplam</td><td>{formatCurrency(totalPaidAmount)}</td></tr>
            <tr><td>{balance >= 0 ? 'Hak edilenden fazla ödenen' : 'Ödenmesi kalan (hak edilen - ödenen)'}</td><td>{formatCurrency(Math.abs(balance))}</td></tr>
          </tbody>
        </table>
        <p className="print-summary-note">Bu tutarlar kullanıcının girdiği sözleşme bedelleri/tamamlanma yüzdelerine dayalıdır; HesapNokta hiçbir fiyat önermez ve bu belge hukuki bir hakediş formu yerine geçmez. Ödeme/hakediş süreciniz için sözleşmenizdeki hükümleri esas alın.</p>
      </div>
    </>
  );
}
