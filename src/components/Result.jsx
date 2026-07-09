import React from 'react';
import ShareResultButton from './ShareResultButton.jsx';

export function ResultCard({ label, value, note, tone, action }) {
  return (
    <div className={`result-card${tone ? ` tone-${tone}` : ''}`}>
      <span className="result-label">{label}</span>
      <span className="result-value">{value}</span>
      {note && <span className="result-note">{note}</span>}
      {action && <span className="result-action">{action}</span>}
      <ShareResultButton />
    </div>
  );
}

export function ResultMetrics({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="result-metrics">
      {items.map((item) => (
        <div className="result-metric" key={item.label}>
          <span>{item.label}</span>
          <b>{item.value}</b>
        </div>
      ))}
    </div>
  );
}

export function ResultError({ message }) {
  return <div className="result-error">{message}</div>;
}
