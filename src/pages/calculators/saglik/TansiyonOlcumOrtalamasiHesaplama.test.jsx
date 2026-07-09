// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TansiyonOlcumOrtalamasiHesaplama from './TansiyonOlcumOrtalamasiHesaplama.jsx';

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

function firstInput(prefix) {
  return container.querySelector(`input[id^="${prefix}-"]`);
}

function findButton(text) {
  return Array.from(container.querySelectorAll('button')).find((btn) => btn.textContent.includes(text));
}

function renderPage() {
  act(() => {
    root.render(
      <MemoryRouter initialEntries={['/tansiyon-olcum-ortalamasi']}>
        <TansiyonOlcumOrtalamasiHesaplama />
      </MemoryRouter>,
    );
  });
}

beforeEach(() => {
  window.history.pushState(null, '', '/tansiyon-olcum-ortalamasi');
  window.localStorage.clear();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  window.localStorage.clear();
  window.history.pushState(null, '', '/tansiyon-olcum-ortalamasi');
});

describe('Ev Tansiyon Ölçüm Ortalaması (kritik eşik davranışı)', () => {
  it('varsayılan örnek satırlarda uyarı stiline geçmez', () => {
    renderPage();
    expect(container.querySelector('.result-card').className).not.toContain('tone-danger');
  });

  it('KRİTİK EŞİK: tek satırlık 190/125 ortalaması acil eylem cümlesi gösterir', () => {
    renderPage();
    window.confirm = vi.fn(() => true);
    act(() => { clickButton(findButton('Tümünü temizle')); });

    act(() => {
      setInputValue(firstInput('msys'), '190');
      setInputValue(firstInput('mdia'), '125');
    });

    const card = container.querySelector('.result-card');
    expect(card.className).toContain('tone-danger');
    const action = container.querySelector('.result-action').textContent;
    expect(action).toContain('112');
  });

  it('sayfada teşhis koymadığına dair güçlü sağlık notu gösterir', () => {
    renderPage();
    expect(container.querySelector('.health-disclaimer-strong')).not.toBeNull();
  });
});

describe('Ev Tansiyon Ölçüm Ortalaması (cihaz-içi kalıcılık)', () => {
  it('gizlilik notu ilk açılışta gösterilir ve "Anladım" ile kapatılıp bir daha çıkmaz', () => {
    renderPage();
    expect(container.querySelector('.takip-privacy-notice')).not.toBeNull();

    act(() => { clickButton(findButton('Anladım')); });
    expect(container.querySelector('.takip-privacy-notice')).toBeNull();

    act(() => root.unmount());
    container.remove();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    renderPage();
    expect(container.querySelector('.takip-privacy-notice')).toBeNull();
  });

  it('kullanıcı bir ölçüm girdiğinde localStorage\'a (hn-takip-tansiyon) kaydeder', () => {
    renderPage();
    act(() => { setInputValue(firstInput('msys'), '140'); });

    const saved = JSON.parse(window.localStorage.getItem('hn-takip-tansiyon'));
    expect(saved.some((row) => row.morningSys === '140')).toBe(true);
  });

  it('sayfa yeniden açıldığında (yeni bir mount) kayıtlı günlüğü otomatik yükler', () => {
    window.localStorage.setItem('hn-takip-tansiyon', JSON.stringify([
      { date: '2026-07-05', morningSys: '150', morningDia: '95', eveningSys: '', eveningDia: '' },
    ]));
    renderPage();
    expect(firstInput('msys').value).toBe('150');
  });

  it('KRİTİK EŞİK: localStorage\'dan yüklenen 190/125 verisi de acil eylem cümlesini tetikler', () => {
    window.localStorage.setItem('hn-takip-tansiyon', JSON.stringify([
      { date: '2026-07-05', morningSys: '190', morningDia: '125', eveningSys: '', eveningDia: '' },
    ]));
    renderPage();

    const card = container.querySelector('.result-card');
    expect(card.className).toContain('tone-danger');
    expect(container.querySelector('.result-action').textContent).toContain('112');
  });

  it('"Tümünü temizle" onaylanınca localStorage\'ı siler ve tek boş satıra döner', () => {
    renderPage();
    act(() => { setInputValue(firstInput('msys'), '140'); });
    expect(window.localStorage.getItem('hn-takip-tansiyon')).not.toBeNull();

    window.confirm = vi.fn(() => true);
    act(() => { clickButton(findButton('Tümünü temizle')); });

    expect(window.localStorage.getItem('hn-takip-tansiyon')).toBeNull();
    expect(container.querySelectorAll('input[id^="msys-"]')).toHaveLength(1);
    expect(firstInput('msys').value).toBe('');
  });

  it('"Tümünü temizle" onaylanmazsa (confirm false) hiçbir şey silmez', () => {
    renderPage();
    act(() => { setInputValue(firstInput('msys'), '140'); });

    window.confirm = vi.fn(() => false);
    act(() => { clickButton(findButton('Tümünü temizle')); });

    expect(window.localStorage.getItem('hn-takip-tansiyon')).not.toBeNull();
    expect(firstInput('msys').value).toBe('140');
  });
});
