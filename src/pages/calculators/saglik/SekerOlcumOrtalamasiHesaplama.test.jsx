// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import SekerOlcumOrtalamasiHesaplama from './SekerOlcumOrtalamasiHesaplama.jsx';

let container;
let root;

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

function setInputValue(input, value) {
  nativeInputValueSetter.call(input, value);
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
}

beforeEach(() => {
  window.history.pushState(null, '', '/seker-olcum-ortalamasi');
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root.render(
      <MemoryRouter initialEntries={['/seker-olcum-ortalamasi']}>
        <SekerOlcumOrtalamasiHesaplama />
      </MemoryRouter>,
    );
  });
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
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
