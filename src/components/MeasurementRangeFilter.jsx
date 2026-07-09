import React from 'react';

const OPTIONS = [
  { key: 7, label: 'Son 7 gün' },
  { key: 30, label: 'Son 30 gün' },
  { key: 'all', label: 'Tümü' },
];

export default function MeasurementRangeFilter({ value, onChange }) {
  return (
    <div className="segmented" role="group" aria-label="Trend grafiği zaman aralığı">
      {OPTIONS.map((option) => (
        <button
          key={option.key}
          type="button"
          className={value === option.key ? 'active' : ''}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
