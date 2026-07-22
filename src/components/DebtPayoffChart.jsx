import React, { useMemo } from 'react';

const WIDTH = 640;
const MARGIN = { top: 16, right: 16, bottom: 26, left: 52 };

function niceMax(value) {
  if (!Number.isFinite(value) || value <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / (magnitude / 2)) * (magnitude / 2);
}

// Kütüphanesiz, tek veya iki serili SVG borç erime çizgi grafiği (ay bazlı kalan
// bakiye). MeasurementTrendChart (src/components/MeasurementTrendChart.jsx) ile aynı
// görsel dili ve CSS sınıflarını (.trend-chart*, styles.css) paylaşır, ama o bileşen
// tarihe (point.date + formatDateTr) bağımlı olduğundan AY İNDEKSİ eksenine göre
// çalışan bu ayrı, daha basit bileşen tercih edildi.
// `series`: [{ label, color, data: [{ month, remaining }, ...] }] — data[0] ay 0'daki
// (henüz ödeme yapılmamış) başlangıç bakiyesi olmalı ki çizgi anaparadan başlasın.
export default function DebtPayoffChart({ series, height = 220, ariaLabel }) {
  const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
  const plotHeight = height - MARGIN.top - MARGIN.bottom;

  const maxMonthIndex = Math.max(1, ...series.map((s) => (s.data.length ? s.data[s.data.length - 1].month : 0)));
  const yMax = useMemo(() => {
    const values = series.flatMap((s) => s.data.map((p) => p.remaining));
    return niceMax(Math.max(...values, 0));
  }, [series]);

  const xOf = (month) => MARGIN.left + (maxMonthIndex <= 0 ? 0 : (month / maxMonthIndex) * plotWidth);
  const yOf = (value) => MARGIN.top + (1 - value / (yMax || 1)) * plotHeight;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => yMax * f);

  return (
    <div className="trend-chart">
      <div className="trend-chart-legend">
        {series.map((s) => (
          <span className="trend-chart-legend-item" key={s.label}>
            <span className="trend-chart-legend-swatch" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
      <div className="trend-chart-svg-wrap">
        <svg className="trend-chart-svg" viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={ariaLabel}>
          {yTicks.map((tick) => (
            <g key={tick}>
              <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={yOf(tick)} y2={yOf(tick)} stroke="var(--border)" strokeWidth="1" />
              <text x={MARGIN.left - 8} y={yOf(tick) + 3} textAnchor="end" className="trend-chart-tick">
                {Math.round(tick).toLocaleString('tr-TR')}
              </text>
            </g>
          ))}
          {series.map((s) => {
            if (s.data.length === 0) return null;
            const path = s.data.map((point, idx) => `${idx === 0 ? 'M' : 'L'} ${xOf(point.month)} ${yOf(point.remaining)}`).join(' ');
            return <path key={s.label} d={path} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />;
          })}
          <text x={xOf(0)} y={height - 6} textAnchor="start" className="trend-chart-tick">Ay 0</text>
          <text x={xOf(maxMonthIndex)} y={height - 6} textAnchor="end" className="trend-chart-tick">{`Ay ${maxMonthIndex}`}</text>
        </svg>
      </div>
    </div>
  );
}
