// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const setNeedRefresh = vi.fn();
const updateServiceWorker = vi.fn();
let needRefreshValue = false;

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    needRefresh: [needRefreshValue, setNeedRefresh],
    offlineReady: [false, vi.fn()],
    updateServiceWorker,
  }),
}));

const { default: UpdatePrompt } = await import('./UpdatePrompt.jsx');

let container;
let root;

function findButton(text) {
  return Array.from(container.querySelectorAll('button')).find((b) => b.textContent === text);
}

function click(button) {
  act(() => {
    button.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  });
}

beforeEach(() => {
  needRefreshValue = false;
  setNeedRefresh.mockClear();
  updateServiceWorker.mockClear();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('UpdatePrompt', () => {
  it('yeni sürüm yokken hiçbir şey render etmez', () => {
    act(() => { root.render(<UpdatePrompt />); });
    expect(container.textContent).toBe('');
  });

  it('yeni sürüm hazır olduğunda "Yenile" çubuğunu gösterir', () => {
    needRefreshValue = true;
    act(() => { root.render(<UpdatePrompt />); });
    expect(container.textContent).toContain('Yeni bir sürüm hazır');
    expect(findButton('Yenile')).toBeTruthy();
  });

  it('"Yenile" tıklanınca updateServiceWorker(true) çağırıp tam sayfa yenilemeyi tetikler', () => {
    needRefreshValue = true;
    act(() => { root.render(<UpdatePrompt />); });
    click(findButton('Yenile'));
    expect(updateServiceWorker).toHaveBeenCalledWith(true);
  });

  it('"Sonra" tıklanınca çubuğu kapatmak için needRefresh state\'ini false yapar', () => {
    needRefreshValue = true;
    act(() => { root.render(<UpdatePrompt />); });
    click(findButton('Sonra'));
    expect(setNeedRefresh).toHaveBeenCalledWith(false);
  });
});
