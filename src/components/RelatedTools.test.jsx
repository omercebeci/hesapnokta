// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import RelatedTools from './RelatedTools.jsx';

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

describe('RelatedTools', () => {
  it('verilen araçlara linkler render eder', () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <RelatedTools items={[
            { to: '/kredi-erken-kapatma-hesaplama', label: 'Kredi Erken Kapatma' },
            { to: '/kredi-karsilastirma', label: 'İki Kredi Karşılaştırma' },
          ]} />
        </MemoryRouter>,
      );
    });

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe('/kredi-erken-kapatma-hesaplama');
    expect(links[1].textContent).toContain('İki Kredi Karşılaştırma');
  });

  it('boş liste verildiğinde hiçbir şey render etmez', () => {
    act(() => { root.render(<MemoryRouter><RelatedTools items={[]} /></MemoryRouter>); });
    expect(container.textContent).toBe('');
  });
});
