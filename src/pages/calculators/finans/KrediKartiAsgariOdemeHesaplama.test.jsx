// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import KrediKartiAsgariOdemeHesaplama from './KrediKartiAsgariOdemeHesaplama.jsx';

let container;
let root;

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

function setInputValue(input, value) {
  nativeInputValueSetter.call(input, value);
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
}

beforeEach(() => {
  window.history.pushState(null, '', '/kredi-karti-asgari-odeme-hesaplama');
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root.render(
      <MemoryRouter initialEntries={['/kredi-karti-asgari-odeme-hesaplama']}>
        <KrediKartiAsgariOdemeHesaplama />
      </MemoryRouter>,
    );
  });
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('Kredi Kartı Asgari Ödeme — borç eritme simülasyonu', () => {
  it('varsayılan girdilerle kapanma süresi, toplam ödeme, toplam faiz ve faiz/anapara oranını gösterir', () => {
    expect(container.textContent).toContain('Kapanma süresi');
    expect(container.textContent).toContain('Ödenen toplam');
    expect(container.textContent).toContain('Toplam faiz');
    expect(container.textContent).toContain('Faiz / anapara oranı');
    expect(container.querySelector('.tone-danger')).toBeNull();
  });

  it('borç erime grafiğini (en az bir çizgi) render eder', () => {
    expect(container.querySelectorAll('.trend-chart svg path').length).toBeGreaterThanOrEqual(1);
  });

  it('KRİTİK: asgari ödemenin aylık faizi karşılamadığı bir oran girildiğinde "borç asla kapanmıyor" uyarısı gösterir', () => {
    act(() => {
      setInputValue(container.querySelector('#monthlyInterestRate'), '30');
    });

    expect(container.textContent).toContain('borç asla kapanmıyor');
    expect(container.querySelector('.result-card.tone-danger')).not.toBeNull();
    expect(container.querySelector('.result-action')).not.toBeNull();
  });

  it('sabit ödeme tutarı girildiğinde karşılaştırma bloğunu gösterir', () => {
    act(() => {
      setInputValue(container.querySelector('#fixedPayment'), '2000');
    });

    expect(container.textContent).toContain('Karşılaştırma: asgari yerine ayda');
    expect(container.textContent).toContain('Sabit ödeme ile kapanma');
  });

  it('sabit ödeme de faizi karşılamıyorsa ayrı bir "kapanmıyor" uyarısı gösterir', () => {
    act(() => {
      setInputValue(container.querySelector('#fixedPayment'), '1');
    });

    expect(container.textContent).toContain('Sabit ödeme senaryosunda da borç kapanmıyor');
  });
});
