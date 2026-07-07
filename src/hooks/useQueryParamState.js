import { useEffect, useRef, useState } from 'react';

const identity = (value) => value;

function getUrlParams() {
  return new URLSearchParams(window.location.search);
}

function applyUrlUpdate(mutate) {
  const params = getUrlParams();
  mutate(params);
  const query = params.toString();
  const newUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
  window.history.replaceState(window.history.state, '', newUrl);
}

// Bir hesaplayıcı girdisini hem React state'inde hem de URL query
// parametresinde tutar: sayfa parametreli açıldığında o değerle başlar,
// kullanıcı değer girdikçe URL'i history.replaceState ile günceller
// (geri tuşunu bozmadan). Değer varsayılana dönerse parametre URL'den
// silinir, böylece URL'ler kısa/okunur kalır.
//
// serialize/deserialize verilirse string olmayan state'ler (boolean,
// nesne, dizi...) de aynı hook ile senkronlanabilir.
export function useQueryParamState(param, defaultValue, options = {}) {
  const { serialize = identity, deserialize = identity } = options;

  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    const raw = getUrlParams().get(param);
    if (raw === null) return defaultValue;
    try {
      return deserialize(raw);
    } catch (error) {
      return defaultValue;
    }
  });

  const skipNextSync = useRef(true);

  useEffect(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }
    const serialized = serialize(value);
    const defaultSerialized = serialize(defaultValue);
    applyUrlUpdate((params) => {
      if (serialized === '' || serialized === null || serialized === undefined || serialized === defaultSerialized) {
        params.delete(param);
      } else {
        params.set(param, serialized);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [value, setValue];
}

// Tek bir state nesnesinin birden çok alanını, her biri kendi kısa query
// parametresi adıyla senkronlar (ör. alan/hacim hesaplayıcısındaki dims nesnesi).
export function useQueryParamObjectState(paramMap, defaultObject) {
  const [values, setValues] = useState(() => {
    if (typeof window === 'undefined') return defaultObject;
    const params = getUrlParams();
    const initial = { ...defaultObject };
    Object.entries(paramMap).forEach(([key, param]) => {
      const raw = params.get(param);
      if (raw !== null) initial[key] = raw;
    });
    return initial;
  });

  const skipNextSync = useRef(true);

  useEffect(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }
    applyUrlUpdate((params) => {
      Object.entries(paramMap).forEach(([key, param]) => {
        const value = values[key];
        if (value === '' || value === undefined || value === null || value === defaultObject[key]) {
          params.delete(param);
        } else {
          params.set(param, value);
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return [values, setValues];
}

// Satır bazlı (dinamik liste) state'leri tek ve okunur bir query parametresine
// serileştirmek için: ör. "70:40,85:60". fields, her satırdaki alan adlarının
// sırasını belirler; createRow bir düz nesneden { id, ...fields } üretir.
export function serializeRows(rows, fields) {
  return rows.map((row) => fields.map((field) => row[field] ?? '').join(':')).join(',');
}

export function deserializeRows(text, fields, createRow) {
  if (!text) return null;
  return text.split(',').filter(Boolean).map((chunk) => {
    const parts = chunk.split(':');
    const rowValues = {};
    fields.forEach((field, index) => { rowValues[field] = parts[index] ?? ''; });
    return createRow(rowValues);
  });
}
