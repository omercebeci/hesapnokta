import React, { useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect.js';
import { formatAmountDisplay, mapCaretPosition, normalizeAmountText } from '../utils/amountInput.js';

// Para/tutar alanları için tek ortak giriş bileşeni: kullanıcı yazarken Türkçe
// binlik ayıracını (1000000 → 1.000.000) canlı ekler, ondalık için virgülü korur,
// imleci zıplatmadan konumlar. `value`/`onChange` HAM sayı stringi üzerinden
// çalışır (ör. "1234567,89") — hesap motoruna ve URL parametrelerine giden değer
// bu bileşenden önce/sonra hiç değişmez, yalnızca ekranda gösterilen metin
// biçimlendirilir. Yüzde/yıl/adet gibi küçük sayılı alanlar için KULLANILMAZ;
// yalnızca tutar/para tipi alanlarda kullanılır.
export default function AmountInput({ id, value, onChange, onBlur, ...rest }) {
  const inputRef = useRef(null);
  const pendingCaret = useRef(null);
  const displayValue = formatAmountDisplay(value);

  useIsomorphicLayoutEffect(() => {
    if (pendingCaret.current != null && inputRef.current) {
      const pos = pendingCaret.current;
      pendingCaret.current = null;
      inputRef.current.setSelectionRange(pos, pos);
    }
  }, [displayValue]);

  const handleChange = (event) => {
    const input = event.target;
    const typedDisplay = input.value;
    const caret = input.selectionStart ?? typedDisplay.length;

    const raw = normalizeAmountText(typedDisplay);
    const nextDisplay = formatAmountDisplay(raw);
    pendingCaret.current = mapCaretPosition(typedDisplay, caret, nextDisplay);

    onChange(raw);
  };

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={displayValue}
      onChange={handleChange}
      onBlur={onBlur}
      {...rest}
    />
  );
}
