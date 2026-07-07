import React from 'react';
import { formatDateTr } from '../utils/format.js';

// Mevzuata/döneme bağlı bir değer kullanan hesaplayıcıların sonuç alanının altında gösterilir.
// Veri src/data/guncelVeriler.js dosyasından gelir; oranlar güncellendiğinde bu not otomatik güncellenir.
export default function DataPeriodNote({ period, lastUpdated }) {
  return (
    <p className="data-period-note">
      📅 Bu hesaplama <strong>{period}</strong> verilerine göre yapılmıştır. Son güncelleme: {formatDateTr(lastUpdated)}
    </p>
  );
}
