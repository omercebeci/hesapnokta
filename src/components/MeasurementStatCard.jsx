import React from 'react';

// Ölçüm günlüğü sayfalarında (tansiyon/şeker takibi) ortak istatistik kartı: son 7 gün
// ortalaması, genel ortalama, kılavuz kategorisi, en yüksek/en düşük gibi kalemler.
export default function MeasurementStatCard({ title = 'İstatistikler', items }) {
  return (
    <div className="calc-card measurement-stat-card">
      <h2>{title}</h2>
      <div className="result-metrics">
        {items.map((item) => (
          <div className="result-metric" key={item.label}>
            <span>{item.label}</span>
            <b>{item.value}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
