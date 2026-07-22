// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ScrollToTop from './ScrollToTop.jsx';

let container;
let root;

function PageA() {
  return (
    <div>
      Sayfa A
      <Link to="/b">B'ye git</Link>
    </div>
  );
}

function PageB() {
  const navigate = useNavigate();
  return (
    <div>
      Sayfa B
      <button type="button" onClick={() => navigate(-1)}>Geri</button>
    </div>
  );
}

function TestApp() {
  return (
    <MemoryRouter initialEntries={['/a']}>
      <ScrollToTop />
      <Routes>
        <Route path="/a" element={<PageA />} />
        <Route path="/b" element={<PageB />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});

async function clickFirst(selector) {
  const el = container.querySelector(selector);
  await act(async () => {
    el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
    await Promise.resolve();
  });
}

describe('ScrollToTop', () => {
  it('yeni bir route’a gidildiğinde (PUSH) pencereyi animasyonsuz en üste kaydırır', async () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;

    act(() => { root.render(<TestApp />); });
    expect(scrollTo).not.toHaveBeenCalled();

    await clickFirst('a');

    expect(container.textContent).toContain('Sayfa B');
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
  });

  it('geri (POP) gezinmesinde scrollTo çağırmaz — tarayıcının doğal scroll restorasyonuna karışmaz', async () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;

    act(() => { root.render(<TestApp />); });
    await clickFirst('a'); // PUSH: A -> B
    expect(scrollTo).toHaveBeenCalledTimes(1);

    await clickFirst('button'); // POP: B -> A (navigate(-1))

    expect(container.textContent).toContain('Sayfa A');
    expect(scrollTo).toHaveBeenCalledTimes(1); // POP sonrası ek çağrı yok
  });
});
