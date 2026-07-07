// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useQueryParamState } from './useQueryParamState.js';

let container;
let root;
let latest;

function TestComponent({ param, defaultValue, options }) {
  const [value, setValue] = useQueryParamState(param, defaultValue, options);
  latest = { value, setValue };
  return null;
}

function renderWithUrl(url, props) {
  window.history.pushState(null, '', url);
  act(() => {
    root.render(<TestComponent {...props} />);
  });
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  window.history.pushState(null, '', '/test-calc');
});

describe('useQueryParamState (mounted in jsdom)', () => {
  it('falls back to the default value when the URL has no param', () => {
    renderWithUrl('/test-calc', { param: 'tutar', defaultValue: '100000' });
    expect(latest.value).toBe('100000');
  });

  it('initializes from the URL when the param is present', () => {
    renderWithUrl('/test-calc?tutar=250000', { param: 'tutar', defaultValue: '100000' });
    expect(latest.value).toBe('250000');
  });

  it('writes the new value to the URL via history.replaceState on change', () => {
    renderWithUrl('/test-calc', { param: 'tutar', defaultValue: '100000' });
    act(() => { latest.setValue('300000'); });
    expect(window.location.search).toBe('?tutar=300000');
  });

  it('removes the param from the URL when the value returns to the default', () => {
    renderWithUrl('/test-calc?tutar=300000', { param: 'tutar', defaultValue: '100000' });
    act(() => { latest.setValue('100000'); });
    expect(window.location.search).toBe('');
  });

  it('preserves other query params already on the URL', () => {
    renderWithUrl('/test-calc?vade=12', { param: 'tutar', defaultValue: '100000' });
    act(() => { latest.setValue('300000'); });
    const params = new URLSearchParams(window.location.search);
    expect(params.get('vade')).toBe('12');
    expect(params.get('tutar')).toBe('300000');
  });

  it('does not touch the URL on initial mount even if the value equals the default', () => {
    renderWithUrl('/test-calc?tutar=100000', { param: 'tutar', defaultValue: '100000' });
    expect(window.location.search).toBe('?tutar=100000');
  });

  it('supports custom serialize/deserialize for non-string state (booleans)', () => {
    const options = { serialize: (v) => (v ? '1' : '0'), deserialize: (v) => v === '1' };
    renderWithUrl('/test-calc?sicak=1', { param: 'sicak', defaultValue: false, options });
    expect(latest.value).toBe(true);

    act(() => { latest.setValue(false); });
    expect(window.location.search).toBe('');
  });
});
