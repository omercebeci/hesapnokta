import React from 'react';

export default function StepStrip({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="step-strip">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="step-strip-item">
            <span className="step-strip-number">{index + 1}</span>
            <span className="step-strip-label">{step}</span>
          </div>
          {index < steps.length - 1 && <span className="step-strip-arrow" aria-hidden="true">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
