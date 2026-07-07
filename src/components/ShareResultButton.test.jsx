// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ShareResultButton from './ShareResultButton.jsx';
import { CalculatorContextProvider } from '../context/CalculatorContext.jsx';

let container;
let root;

async function clickShareButton() {
  const button = container.querySelector('button');
  await act(async () => {
    button.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await Promise.resolve();
  });
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  window.history.pushState(null, '', '/kredi-hesaplama?tutar=100000');
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  delete navigator.share;
  vi.restoreAllMocks();
});

describe('ShareResultButton', () => {
  it('uses the Web Share API with the calculator title and current URL when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    navigator.share = share;

    act(() => {
      root.render(
        <CalculatorContextProvider value={{ title: 'Kredi Taksiti Hesaplama' }}>
          <ShareResultButton />
        </CalculatorContextProvider>,
      );
    });

    await clickShareButton();

    expect(share).toHaveBeenCalledTimes(1);
    const payload = share.mock.calls[0][0];
    expect(payload.title).toContain('Kredi Taksiti Hesaplama');
    expect(payload.url).toBe(window.location.href);
  });

  it('falls back to clipboard copy and shows a confirmation when Web Share is unavailable', async () => {
    delete navigator.share;
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    act(() => {
      root.render(
        <CalculatorContextProvider value={{ title: 'Kredi Taksiti Hesaplama' }}>
          <ShareResultButton />
        </CalculatorContextProvider>,
      );
    });

    await clickShareButton();

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(container.querySelector('button').textContent).toContain('Kopyalandı');
  });
});
