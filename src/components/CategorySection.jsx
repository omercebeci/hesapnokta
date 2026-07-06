import React from 'react';
import CalculatorCard from './CalculatorCard.jsx';
import Icon from './Icon.jsx';
import { useInView } from '../hooks/useInView.js';

const MAX_STAGGER_STEPS = 8;
const STAGGER_STEP_MS = 45;

export default function CategorySection({ category, items, eager = false }) {
  const [ref, inView] = useInView();
  const visible = eager || inView;

  if (items.length === 0) return null;

  return (
    <section
      ref={ref}
      className={`category-section ${eager ? '' : 'scroll-reveal'} ${visible ? 'is-visible' : ''}`}
      id={category.id}
      aria-labelledby={`${category.id}-title`}
    >
      <div className="category-section-head">
        <span className="cat-icon"><Icon name={category.icon} size={18} /></span>
        <h2 id={`${category.id}-title`}>{category.label}</h2>
        <span className="count">{items.length} araç</span>
      </div>
      <div className="calculator-grid">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`reveal-item ${visible ? 'is-visible' : ''}`}
            style={{ transitionDelay: visible ? `${Math.min(index, MAX_STAGGER_STEPS) * STAGGER_STEP_MS}ms` : '0ms' }}
          >
            <CalculatorCard calculator={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
