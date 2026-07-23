import React from 'react';
import { useCalculatorContext } from '../context/CalculatorContext.jsx';
import { formatDateTr } from '../utils/format.js';

function todayLocalDateStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export default function PrintableMaterialList({ items }) {
  const calculator = useCalculatorContext();
  if (!items || items.length === 0) return null;

  return (
    <>
      <button type="button" className="btn-primary print-plan-button no-print" onClick={() => window.print()}>
        🖨️ Malzeme listesini yazdır / PDF kaydet
      </button>
      <p className="hint no-print" style={{ marginTop: -8 }}>Açılan pencerede Hedef olarak "PDF olarak kaydet" seçerseniz dosya olarak indirilir.</p>

      <div className="print-summary" aria-hidden="true">
        <h1>HesapNokta</h1>
        <p className="print-summary-meta">{calculator?.title} — {formatDateTr(todayLocalDateStr())}</p>
        <table className="print-summary-table">
          <thead>
            <tr><th>Malzeme</th><th>Miktar</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.label}><td>{item.label}</td><td>{item.value}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="print-summary-note">Bu liste, girdiğiniz oda ölçüleri ve seçtiğiniz işlere göre otomatik hesaplanmıştır; fiyat içermez. Kesin/özel ölçüm gerektiren kalemler için ilgili tekil hesaplayıcıyı (Boya, Fayans/Seramik, Parke/Laminat, Alçı/Sıva) ayrıca kullanabilirsiniz.</p>
      </div>
    </>
  );
}
