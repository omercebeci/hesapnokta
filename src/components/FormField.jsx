import React from 'react';

export default function FormField({ label, htmlFor, error, hint, full, children }) {
  return (
    <div className={`field ${full ? 'full' : ''} ${error ? 'has-error' : ''}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && !error && <span className="hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
