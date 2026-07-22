// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import DebtPayoffChart from './DebtPayoffChart.jsx';

let container;
let root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('DebtPayoffChart', () => {
  it('tek seri için bir çizgi (path) ve iki eksen etiketi (Ay 0 / Ay N) render eder', () => {
    const series = [
      { label: 'Asgari ödeme', color: '#4f46e5', data: [{ month: 0, remaining: 10000 }, { month: 1, remaining: 8000 }, { month: 2, remaining: 6000 }] },
    ];
    act(() => { root.render(<DebtPayoffChart series={series} ariaLabel="Borç erime grafiği" />); });

    expect(container.querySelectorAll('path')).toHaveLength(1);
    expect(container.textContent).toContain('Ay 0');
    expect(container.textContent).toContain('Ay 2');
    expect(container.textContent).toContain('Asgari ödeme');
  });

  it('iki seriyi karşılaştırma için iki ayrı çizgi render eder', () => {
    const series = [
      { label: 'Asgari ödeme', color: '#4f46e5', data: [{ month: 0, remaining: 10000 }, { month: 1, remaining: 9000 }] },
      { label: 'Sabit ödeme', color: '#c2760a', data: [{ month: 0, remaining: 10000 }, { month: 1, remaining: 7000 }] },
    ];
    act(() => { root.render(<DebtPayoffChart series={series} ariaLabel="Karşılaştırma" />); });

    expect(container.querySelectorAll('path')).toHaveLength(2);
    expect(container.textContent).toContain('Sabit ödeme');
  });

  it('boş veri dizisiyle hata vermeden render eder', () => {
    act(() => { root.render(<DebtPayoffChart series={[{ label: 'Boş', color: '#000', data: [] }]} ariaLabel="Boş" />); });
    expect(container.querySelectorAll('path')).toHaveLength(0);
  });
});
