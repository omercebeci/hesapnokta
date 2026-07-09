// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import TansiyonDegerlendirmeHesaplama from './TansiyonDegerlendirmeHesaplama.jsx';

let container;
let root;

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

function setInputValue(input, value) {
  nativeInputValueSetter.call(input, value);
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
}

function clickButton(button) {
  button.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

beforeEach(() => {
  window.history.pushState(null, '', '/tansiyon-degerlendirme');
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root.render(
      <MemoryRouter initialEntries={['/tansiyon-degerlendirme']}>
        <TansiyonDegerlendirmeHesaplama />
      </MemoryRouter>,
    );
  });
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('Tansiyon Değerlendirme (kritik eşik davranışı)', () => {
  it('varsayılan 120/80 girdisinde uyarı stiline geçmez ve eylem cümlesi göstermez', () => {
    const card = container.querySelector('.result-card');
    expect(card.className).not.toContain('tone-danger');
    expect(container.querySelector('.result-action')).toBeNull();
  });

  it('KRİTİK EŞİK: 182/125 girildiğinde sonuç kartı kırmızı (tone-danger) tona döner ve eylem cümlesi gösterir', () => {
    act(() => {
      setInputValue(container.querySelector('#systolic'), '182');
      setInputValue(container.querySelector('#diastolic'), '125');
    });

    const card = container.querySelector('.result-card');
    expect(card.className).toContain('tone-danger');
    expect(container.querySelector('.result-action')).not.toBeNull();
  });

  it('KRİTİK EŞİK: belirti YOK iken eylem cümlesi 112 değil "sağlık kuruluşuna başvurun" der', () => {
    act(() => {
      setInputValue(container.querySelector('#systolic'), '182');
      setInputValue(container.querySelector('#diastolic'), '125');
    });

    const action = container.querySelector('.result-action').textContent;
    expect(action).toContain('sağlık kuruluşuna başvurun');
    expect(action).not.toContain('112');
  });

  it('KRİTİK EŞİK: belirti VAR işaretlendiğinde eylem cümlesi 112\'yi aramayı söyler', () => {
    act(() => {
      setInputValue(container.querySelector('#systolic'), '182');
      setInputValue(container.querySelector('#diastolic'), '125');
    });

    const symptomYesButton = Array.from(container.querySelectorAll('.segmented button')).find((btn) => btn.textContent === 'Evet');
    act(() => { clickButton(symptomYesButton); });

    const action = container.querySelector('.result-action').textContent;
    expect(action).toContain("112'yi arayın");
  });

  it('evre 1 aralığında (145/95) uyarı stiline geçmez, sadece hafif (warning) ton gösterir', () => {
    act(() => {
      setInputValue(container.querySelector('#systolic'), '145');
      setInputValue(container.querySelector('#diastolic'), '95');
    });

    const card = container.querySelector('.result-card');
    expect(card.className).toContain('tone-warning');
    expect(card.className).not.toContain('tone-danger');
    expect(container.querySelector('.result-action')).toBeNull();
  });

  it('evre 2/3 (kırmızı) kategori ile 180/120 eylem eşiği AYNI ŞEY DEĞİLDİR: 179/109 evre 2 olduğu için kırmızıdır ama eylem cümlesi göstermez', () => {
    act(() => {
      setInputValue(container.querySelector('#systolic'), '179');
      setInputValue(container.querySelector('#diastolic'), '109');
    });

    const card = container.querySelector('.result-card');
    expect(card.className).toContain('tone-danger');
    expect(container.querySelector('.result-action')).toBeNull();
  });

  it('sayfada teşhis koymadığına dair güçlü sağlık notu gösterir', () => {
    expect(container.querySelector('.health-disclaimer-strong')).not.toBeNull();
    expect(container.querySelector('.health-disclaimer-strong').textContent).toContain('teşhis koymaz');
  });
});
