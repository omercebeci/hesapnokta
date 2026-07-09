// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SekerOlcumOrtalamasiHesaplama from './SekerOlcumOrtalamasiHesaplama.jsx';

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

function findButton(text) {
  return Array.from(container.querySelectorAll('button')).find((btn) => btn.textContent.includes(text));
}

function renderPage() {
  act(() => {
    root.render(
      <MemoryRouter initialEntries={['/seker-olcum-ortalamasi']}>
        <SekerOlcumOrtalamasiHesaplama />
      </MemoryRouter>,
    );
  });
}

// Gerçek bir sayfa yeniden açılışını simüle eder (ör. localStorage'ı elle değiştirdikten
// sonra): mevcut kökü kaldırıp taze bir kökte yeniden monte eder, böylece hook'un
// "ilk yükleme" mantığı (hasReconciled ref) tekrar sıfırdan çalışır.
function remount() {
  act(() => root.unmount());
  container.remove();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  renderPage();
}

beforeEach(() => {
  window.history.pushState(null, '', '/seker-olcum-ortalamasi');
  window.localStorage.clear();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  renderPage();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  window.localStorage.clear();
  window.history.pushState(null, '', '/seker-olcum-ortalamasi');
});

function firstFastingInput() {
  return container.querySelector('input[id^="fasting-"]');
}

describe('Ev Şeker Ölçüm Günlüğü (kritik eşik davranışı)', () => {
  it('normal ölçümlerde uyarı stiline geçmez', () => {
    act(() => { setInputValue(firstFastingInput(), '95'); });
    expect(container.querySelector('.result-card').className).not.toContain('tone-danger');
    expect(container.querySelector('.result-action')).toBeNull();
  });

  it('KRİTİK EŞİK: 54 mg/dL altındaki ölçüm satırı uyarı stiliyle işaretlenir ve sonuç kartı kırmızıya döner', () => {
    const input = firstFastingInput();
    act(() => { setInputValue(input, '45'); });

    expect(input.closest('.measurement-row-danger')).not.toBeNull();
    const card = container.querySelector('.result-card');
    expect(card.className).toContain('tone-danger');
    const action = container.querySelector('.result-action').textContent;
    expect(action).toContain('ciddi hipoglisemi');
    expect(action).toContain("112");
  });

  it('KRİTİK EŞİK: 300 mg/dL ve üzeri ölçüm de sonuç kartını kırmızıya döndürür', () => {
    const input = firstFastingInput();
    act(() => { setInputValue(input, '320'); });

    expect(input.closest('.measurement-row-danger')).not.toBeNull();
    expect(container.querySelector('.result-card').className).toContain('tone-danger');
    expect(container.querySelector('.result-action').textContent).toContain('300 mg/dL');
  });

  it('70 mg/dL altı ama 54 üzeri değerde yalnızca uyarı (turuncu) stiline geçer, kritik kırmızıya geçmez', () => {
    const input = firstFastingInput();
    act(() => { setInputValue(input, '65'); });

    expect(input.closest('.measurement-row-warning')).not.toBeNull();
    expect(container.querySelector('.result-card').className).toContain('tone-warning');
    expect(container.querySelector('.result-action')).toBeNull();
  });

  it('sayfada teşhis koymadığına dair güçlü sağlık notu gösterir', () => {
    act(() => { setInputValue(firstFastingInput(), '95'); });
    expect(container.querySelector('.health-disclaimer-strong')).not.toBeNull();
  });
});

describe('Ev Şeker Ölçüm Günlüğü (cihaz-içi kalıcılık)', () => {
  it('gizlilik notu ilk açılışta gösterilir ve "Anladım" ile kapatılabilir', () => {
    expect(container.querySelector('.takip-privacy-notice')).not.toBeNull();
    act(() => { clickButton(findButton('Anladım')); });
    expect(container.querySelector('.takip-privacy-notice')).toBeNull();
  });

  it('kullanıcı bir ölçüm girdiğinde localStorage\'a (hn-takip-seker) kaydeder', () => {
    act(() => { setInputValue(firstFastingInput(), '88'); });
    const saved = JSON.parse(window.localStorage.getItem('hn-takip-seker'));
    expect(saved.some((row) => row.fasting === '88')).toBe(true);
  });

  it('sayfa yeniden açıldığında kayıtlı günlüğü otomatik yükler', () => {
    window.localStorage.setItem('hn-takip-seker', JSON.stringify([
      { date: '2026-07-05', fasting: '111', postprandial: '150' },
    ]));
    remount();
    expect(firstFastingInput().value).toBe('111');
  });

  it('KRİTİK EŞİK: localStorage\'dan yüklenen 45 mg/dL verisi de ciddi hipoglisemi uyarısını tetikler', () => {
    window.localStorage.setItem('hn-takip-seker', JSON.stringify([
      { date: '2026-07-05', fasting: '45', postprandial: '' },
    ]));
    remount();
    expect(container.querySelector('.result-card').className).toContain('tone-danger');
    expect(container.querySelector('.result-action').textContent).toContain('ciddi hipoglisemi');
  });

  it('"Tümünü temizle" onaylanınca localStorage\'ı siler ve tek boş satıra döner', () => {
    act(() => { setInputValue(firstFastingInput(), '88'); });
    expect(window.localStorage.getItem('hn-takip-seker')).not.toBeNull();

    window.confirm = vi.fn(() => true);
    act(() => { clickButton(findButton('Tümünü temizle')); });

    expect(window.localStorage.getItem('hn-takip-seker')).toBeNull();
    expect(container.querySelectorAll('input[id^="fasting-"]')).toHaveLength(1);
    expect(firstFastingInput().value).toBe('');
  });
});
