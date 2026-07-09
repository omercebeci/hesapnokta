import React, { useMemo, useState } from 'react';
import { formatDateTr } from '../utils/format.js';

const WIDTH = 640;
const MARGIN = { top: 16, right: 16, bottom: 26, left: 40 };

function niceDomain(values) {
  if (values.length === 0) return [0, 1];
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const pad = Math.max((rawMax - rawMin) * 0.12, 2);
  let min = Math.floor((rawMin - pad) / 5) * 5;
  let max = Math.ceil((rawMax + pad) / 5) * 5;
  if (min === max) { min -= 5; max += 5; }
  return [min, max];
}

function buildSegments(data, key, xOf, yOf) {
  const segments = [];
  let current = [];
  data.forEach((point, index) => {
    const value = point[key];
    if (value === null || value === undefined || Number.isNaN(value)) {
      if (current.length) segments.push(current);
      current = [];
      return;
    }
    current.push({ x: xOf(index), y: yOf(value), value, index });
  });
  if (current.length) segments.push(current);
  return segments;
}

// Kütüphanesiz, iki serili SVG trend çizgisi (tansiyon sistolik/diastolik ya da şeker
// açlık/tokluk). Kılavuz eşik çizgileri ve/veya hedef bant gölgesi, kesişim/geçmiş
// noktasında ipucu (tooltip) + odaklanılabilir vuruş alanlarıyla birlikte gelir.
// Ayrıntılı sayısal değerler için sayfadaki ölçüm listesi/çizelgesi her zaman erişilebilir kalır.
export default function MeasurementTrendChart({ data, series, guides = [], band, unit, height = 220, ariaLabel }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
  const plotHeight = height - MARGIN.top - MARGIN.bottom;

  const [yMin, yMax] = useMemo(() => {
    const values = [];
    data.forEach((point) => series.forEach((s) => {
      if (point[s.key] !== null && point[s.key] !== undefined) values.push(point[s.key]);
    }));
    guides.forEach((g) => values.push(g.value));
    if (band) values.push(band.min, band.max);
    return niceDomain(values);
  }, [data, series, guides, band]);

  const xOf = (index) => (data.length <= 1
    ? MARGIN.left + plotWidth / 2
    : MARGIN.left + (index / (data.length - 1)) * plotWidth);
  const yOf = (value) => MARGIN.top + (1 - (value - yMin) / (yMax - yMin || 1)) * plotHeight;

  const yTicks = useMemo(() => {
    const count = 4;
    return Array.from({ length: count + 1 }, (_, i) => yMin + ((yMax - yMin) * i) / count);
  }, [yMin, yMax]);

  const seriesSegments = series.map((s) => ({ ...s, segments: buildSegments(data, s.key, xOf, yOf) }));

  const handlePointerMove = (event) => {
    if (data.length === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    data.forEach((_, index) => {
      const dist = Math.abs(xOf(index) - px);
      if (dist < nearestDist) { nearestDist = dist; nearest = index; }
    });
    setActiveIndex(nearest);
  };

  const activePoint = activeIndex !== null ? data[activeIndex] : null;

  if (data.length === 0) return null;

  return (
    <div className="trend-chart">
      {series.length > 1 && (
        <div className="trend-chart-legend">
          {series.map((s) => (
            <span className="trend-chart-legend-item" key={s.key}>
              <span className="trend-chart-legend-swatch" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
      <div className="trend-chart-svg-wrap">
        <svg
          viewBox={`0 0 ${WIDTH} ${height}`}
          role="img"
          aria-label={ariaLabel}
          className="trend-chart-svg"
          onMouseMove={handlePointerMove}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {band && (
            <rect
              x={MARGIN.left}
              y={yOf(band.max)}
              width={plotWidth}
              height={Math.max(yOf(band.min) - yOf(band.max), 0)}
              fill="var(--success-soft)"
              aria-hidden="true"
            />
          )}

          {yTicks.map((tick) => (
            <g key={tick}>
              <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={yOf(tick)} y2={yOf(tick)} stroke="var(--border)" strokeWidth="1" />
              <text x={MARGIN.left - 6} y={yOf(tick)} textAnchor="end" dominantBaseline="middle" className="trend-chart-tick">
                {Math.round(tick)}
              </text>
            </g>
          ))}

          {guides.map((guide) => (
            <g key={guide.label}>
              <line
                x1={MARGIN.left}
                x2={WIDTH - MARGIN.right}
                y1={yOf(guide.value)}
                y2={yOf(guide.value)}
                stroke={guide.color || 'var(--danger)'}
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text x={WIDTH - MARGIN.right} y={yOf(guide.value) - 4} textAnchor="end" className="trend-chart-guide-label" fill={guide.color || 'var(--danger)'}>
                {guide.label}
              </text>
            </g>
          ))}

          {seriesSegments.map((s) => (
            <g key={s.key}>
              {s.segments.map((segment, segIndex) => (
                <path
                  key={segIndex}
                  d={segment.length > 1
                    ? `M ${segment.map((p) => `${p.x},${p.y}`).join(' L ')}`
                    : undefined}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              {s.segments.flat().map((point) => (
                <circle
                  key={point.index}
                  cx={point.x}
                  cy={point.y}
                  r={activeIndex === point.index ? 6 : 4}
                  fill={s.color}
                  stroke="var(--surface)"
                  strokeWidth="2"
                />
              ))}
            </g>
          ))}

          {data.map((point, index) => (
            <rect
              key={point.date}
              x={xOf(index) - (plotWidth / Math.max(data.length, 1)) / 2}
              y={MARGIN.top}
              width={Math.max(plotWidth / Math.max(data.length, 1), 4)}
              height={plotHeight}
              fill="transparent"
              tabIndex={0}
              aria-label={`${formatDateTr(point.date)}: ${series.map((s) => `${s.label} ${point[s.key] ?? '—'}`).join(', ')}`}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
            />
          ))}

          {activePoint && (
            <line x1={xOf(activeIndex)} x2={xOf(activeIndex)} y1={MARGIN.top} y2={height - MARGIN.bottom} stroke="var(--text-dim)" strokeWidth="1" strokeDasharray="3 3" aria-hidden="true" />
          )}

          <text x={xOf(0)} y={height - 6} textAnchor="start" className="trend-chart-tick">{formatDateTr(data[0].date)}</text>
          {data.length > 1 && (
            <text x={xOf(data.length - 1)} y={height - 6} textAnchor="end" className="trend-chart-tick">{formatDateTr(data[data.length - 1].date)}</text>
          )}
        </svg>

        {activePoint && (
          <div className="trend-chart-tooltip" style={{ left: `${(xOf(activeIndex) / WIDTH) * 100}%` }}>
            <strong>{formatDateTr(activePoint.date)}</strong>
            {series.map((s) => (
              <div key={s.key} className="trend-chart-tooltip-row">
                <span className="trend-chart-tooltip-key" style={{ background: s.color }} />
                {s.label}: <b>{activePoint[s.key] !== null && activePoint[s.key] !== undefined ? `${activePoint[s.key]} ${unit}` : '—'}</b>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="hint">Ayrıntılı değerler için yukarıdaki ölçüm listesini kullanabilirsiniz.</p>
    </div>
  );
}
