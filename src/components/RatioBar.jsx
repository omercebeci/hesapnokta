import React from 'react';

const TONE_COLORS = {
  accent: 'var(--accent)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  info: 'var(--info)',
};

export default function RatioBar({ label, value, tone = 'accent' }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.84rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
        <span className="tabular-nums" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>%{value.toFixed(1).replace('.', ',')}</span>
      </div>
      <div className="ratio-bar">
        <div className="ratio-bar-fill" style={{ width: `${clamped}%`, background: TONE_COLORS[tone] || TONE_COLORS.accent }} />
      </div>
    </div>
  );
}
