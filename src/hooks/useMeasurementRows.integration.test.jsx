// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useMeasurementRows, clearLocalRows } from './useMeasurementRows.js';
import { serializeRows } from './useQueryParamState.js';

let container;
let root;
let latest;

const STORAGE_KEY = 'hn-takip-test';
const FIELDS = ['date', 'a', 'b'];
const createRowFromValues = (v) => ({ date: v.date || '', a: v.a || '', b: v.b || '' });

function TestComponent() {
  const state = useMeasurementRows({
    storageKey: STORAGE_KEY,
    queryParam: 'olcumler',
    fields: FIELDS,
    createRowFromValues,
    defaultRows: [{ date: '2026-01-01', a: '1', b: '2' }],
  });
  latest = state;
  return null;
}

function renderWithUrl(url) {
  window.history.pushState(null, '', url);
  act(() => {
    root.render(<TestComponent />);
  });
}

beforeEach(() => {
  window.localStorage.clear();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  window.localStorage.clear();
  window.history.pushState(null, '', '/test-calc');
});

describe('useMeasurementRows', () => {
  it('taze ziyaretçide örnek (default) satırları gösterir ve localStorage\'a hiçbir şey yazmaz', () => {
    renderWithUrl('/test-calc');
    expect(latest.rows).toEqual([{ date: '2026-01-01', a: '1', b: '2' }]);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('kullanıcı ilk kez veri girince localStorage\'a kaydeder', () => {
    renderWithUrl('/test-calc');
    act(() => { latest.setRows([{ date: '2026-02-01', a: '5', b: '6' }]); });
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(saved).toEqual([{ date: '2026-02-01', a: '5', b: '6' }]);
  });

  it('sayfa yeniden açıldığında localStorage\'daki günlüğü otomatik yükler (URL parametresi yokken)', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([{ date: '2026-03-01', a: '10', b: '20' }]));
    renderWithUrl('/test-calc');
    expect(latest.rows).toEqual([{ date: '2026-03-01', a: '10', b: '20' }]);
    expect(latest.conflict).toBeNull();
  });

  it('URL\'de paylaşılan veri var ve localStorage boşsa: doğrudan benimser, çakışma çıkarmaz', () => {
    const shared = [{ date: '2026-04-01', a: '7', b: '8' }];
    const query = serializeRows(shared, FIELDS);
    renderWithUrl(`/test-calc?olcumler=${encodeURIComponent(query)}`);
    expect(latest.conflict).toBeNull();
    expect(latest.rows).toEqual(shared);
  });

  it('URL verisi ile kayıtlı localStorage verisi FARKLIYSA çakışma bildirir ve rows\'u değiştirmez', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([{ date: '2026-05-01', a: '1', b: '1' }]));
    const shared = [{ date: '2026-06-01', a: '9', b: '9' }];
    const query = serializeRows(shared, FIELDS);
    renderWithUrl(`/test-calc?olcumler=${encodeURIComponent(query)}`);
    expect(latest.conflict).not.toBeNull();
    expect(latest.conflict.localRows).toEqual([{ date: '2026-05-01', a: '1', b: '1' }]);
    expect(latest.conflict.incomingRows).toEqual(shared);
  });

  it('çakışmada "birleştir" seçilirse iki günlüğü tarihe göre birleştirir (aynı tarihte yerel kazanır)', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([
      { date: '2026-05-01', a: 'local', b: '1' },
      { date: '2026-05-03', a: 'local3', b: '3' },
    ]));
    const shared = [
      { date: '2026-05-01', a: 'incoming', b: '1' },
      { date: '2026-05-02', a: 'incoming2', b: '2' },
    ];
    const query = serializeRows(shared, FIELDS);
    renderWithUrl(`/test-calc?olcumler=${encodeURIComponent(query)}`);
    expect(latest.conflict).not.toBeNull();

    act(() => { latest.resolveConflict('merge'); });
    expect(latest.conflict).toBeNull();
    expect(latest.rows.map((r) => r.date)).toEqual(['2026-05-01', '2026-05-02', '2026-05-03']);
    expect(latest.rows.find((r) => r.date === '2026-05-01').a).toBe('local');
    expect(latest.rows.find((r) => r.date === '2026-05-02').a).toBe('incoming2');
  });

  it('çakışmada "değiştir" seçilirse gelen (URL) veriyi kullanır', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([{ date: '2026-05-01', a: 'local', b: '1' }]));
    const shared = [{ date: '2026-06-01', a: 'incoming', b: '9' }];
    const query = serializeRows(shared, FIELDS);
    renderWithUrl(`/test-calc?olcumler=${encodeURIComponent(query)}`);

    act(() => { latest.resolveConflict('replace'); });
    expect(latest.rows).toEqual(shared);
  });

  it('clearAll localStorage kaydını siler ve rows\'u tek boş satıra döndürür', () => {
    renderWithUrl('/test-calc');
    act(() => { latest.setRows([{ date: '2026-02-01', a: '5', b: '6' }]); });
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();

    act(() => { latest.clearAll({ date: '', a: '', b: '' }); });
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(latest.rows).toEqual([{ date: '', a: '', b: '' }]);
  });

  it('clearLocalRows bağımsız olarak da localStorage anahtarını siler', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([{ date: '2026-01-01', a: '1', b: '2' }]));
    clearLocalRows(STORAGE_KEY);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
