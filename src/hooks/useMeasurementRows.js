import { useEffect, useRef, useState } from 'react';
import { useQueryParamState, serializeRows, deserializeRows } from './useQueryParamState.js';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect.js';
import { sortRowsByDate } from '../lib/saglikCalculators.js';

function readLocalRows(storageKey, createRowFromValues) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.map((values) => createRowFromValues(values));
  } catch (error) {
    return null;
  }
}

// "date" hariç tutulur: yalnızca bugünün tarihi önceden doldurulmuş, hiçbir ölçüm değeri
// girilmemiş bir satır (ör. "tümünü temizle" sonrası) hâlâ "boş" sayılmalı.
function isRowsEmpty(rows, fields) {
  return rows.every((row) => fields.every((field) => field === 'date' || !row[field]));
}

function writeLocalRows(storageKey, rows, fields) {
  if (typeof window === 'undefined') return;
  // Tamamen boş satır(lar) "kayıt" sayılmaz (ör. tümünü temizle sonrası tek boş satır);
  // bunu saklamak yerine anahtarı tamamen kaldırıyoruz.
  if (isRowsEmpty(rows, fields)) {
    clearLocalRows(storageKey);
    return;
  }
  try {
    const plain = rows.map((row) => {
      const values = {};
      fields.forEach((field) => { values[field] = row[field] ?? ''; });
      return values;
    });
    window.localStorage.setItem(storageKey, JSON.stringify(plain));
  } catch (error) {
    // Kota dolu veya erişilemez depolama (gizli sekme vb.) olabilir; sessizce yok say.
  }
}

export function clearLocalRows(storageKey) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(storageKey);
  } catch (error) {
    // yok say
  }
}

function rowsEqual(a, b, fields) {
  if (a.length !== b.length) return false;
  return a.every((row, index) => fields.every((field) => (row[field] ?? '') === (b[index][field] ?? '')));
}

// Cihazdaki kayıtlı günlükle URL'den gelen (paylaşılmış) günlüğü tarihe göre birleştirir.
// Aynı tarih ikisinde de varsa cihazdaki kayıt esas alınır: cihazın günlüğü "kaynak" kabul
// edilir, paylaşılan bağlantı yalnızca cihazda eksik olan günleri tamamlar.
export function mergeRowsByDate(localRows, incomingRows, createRowFromValues) {
  const byDate = new Map();
  localRows.forEach((row) => { if (row.date) byDate.set(row.date, row); });
  incomingRows.forEach((row) => { if (row.date && !byDate.has(row.date)) byDate.set(row.date, row); });
  const merged = Array.from(byDate.values()).map((row) => createRowFromValues(row));
  return merged.length > 0 ? merged : localRows;
}

// Ölçüm günlüğü satırlarını hem localStorage'da (kalıcı, cihaza özel) hem de URL query
// parametresinde (paylaşım için) tutar. İlk yüklemede:
//   - URL'de paylaşım verisi yoksa: localStorage'daki günlük sessizce yüklenir.
//   - URL'de veri var ama localStorage boşsa: gelen veri yeni yerel günlük olarak benimsenir.
//   - İkisi de var ve FARKLIYSA: kullanıcıya sorulur (bkz. `conflict` / `resolveConflict`).
// Örnek (demo) satırlarla açılan taze bir ziyarette hiçbir yazma yapılmaz — kullanıcı ilk
// gerçek değeri girene kadar localStorage'a dokunulmaz.
export function useMeasurementRows({ storageKey, queryParam, fields, createRowFromValues, defaultRows }) {
  const [rows, setRawRows] = useQueryParamState(queryParam, defaultRows, {
    serialize: (value) => serializeRows(value, fields),
    deserialize: (text) => {
      const parsed = deserializeRows(text, fields, createRowFromValues);
      return parsed && parsed.length > 0 ? parsed : defaultRows;
    },
  });

  const [conflict, setConflict] = useState(null);
  const hasReconciled = useRef(false);
  const shouldPersist = useRef(false);

  // Layout effect: tarayıcıda ilk boyamadan önce çalışır, böylece "örnek veri" bir an için
  // bile ekrana çizilmeden gerçek/yerel veriyle değiştirilir (bkz. useIsomorphicLayoutEffect).
  useIsomorphicLayoutEffect(() => {
    if (hasReconciled.current) return;
    hasReconciled.current = true;

    const hadUrlParam = new URLSearchParams(window.location.search).has(queryParam);
    const localRows = readLocalRows(storageKey, createRowFromValues);

    if (hadUrlParam && localRows && !rowsEqual(rows, localRows, fields)) {
      setConflict({ localRows, incomingRows: rows });
      return;
    }
    if (!hadUrlParam && localRows) {
      shouldPersist.current = true;
      setRawRows(sortRowsByDate(localRows));
    } else if (hadUrlParam) {
      shouldPersist.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!shouldPersist.current || conflict) return;
    writeLocalRows(storageKey, rows, fields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, conflict]);

  const setRows = (updater) => {
    shouldPersist.current = true;
    setRawRows(updater);
  };

  const resolveConflict = (choice) => {
    if (!conflict) return;
    const finalRows = choice === 'merge'
      ? sortRowsByDate(mergeRowsByDate(conflict.localRows, conflict.incomingRows, createRowFromValues))
      : sortRowsByDate(conflict.incomingRows);
    shouldPersist.current = true;
    setRawRows(finalRows);
    setConflict(null);
  };

  const clearAll = (emptyRow) => {
    shouldPersist.current = true;
    clearLocalRows(storageKey);
    setRawRows([emptyRow]);
  };

  return { rows, setRows, conflict, resolveConflict, clearAll };
}
