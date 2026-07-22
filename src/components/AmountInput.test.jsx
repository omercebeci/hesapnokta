// @vitest-environment jsdom
import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import AmountInput from './AmountInput.jsx';

let container;
let root;

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

function setInputValueAndCaret(input, value, caret) {
  nativeInputValueSetter.call(input, value);
  input.setSelectionRange(caret ?? value.length, caret ?? value.length);
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
}

function Harness({ initialValue }) {
  const [value, setValue] = useState(initialValue);
  return <AmountInput id="tutar" value={value} onChange={setValue} />;
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('AmountInput', () => {
  it('ham değeri Türkçe binlik ayıracıyla gösterir', () => {
    act(() => { root.render(<Harness initialValue="1000000" />); });
    const input = container.querySelector('input');
    expect(input.value).toBe('1.000.000');
  });

  it('ondalık virgülü korur, ondalık kısmı gruplamaz', () => {
    act(() => { root.render(<Harness initialValue="1234567,89" />); });
    const input = container.querySelector('input');
    expect(input.value).toBe('1.234.567,89');
  });

  it('sona yazılan rakamı ham değere ekleyip yeniden biçimlendirir', () => {
    act(() => { root.render(<Harness initialValue="100000" />); });
    const input = container.querySelector('input');
    expect(input.value).toBe('100.000');

    act(() => {
      // Tarayıcı, "100.000" sonuna "5" yazıldığında geçici olarak "100.0005" üretir.
      setInputValueAndCaret(input, '100.0005', 8);
    });

    expect(input.value).toBe('1.000.005');
  });

  it('yazarken virgülden sonra ondalık girişine izin verir', () => {
    act(() => { root.render(<Harness initialValue="100000" />); });
    const input = container.querySelector('input');

    act(() => { setInputValueAndCaret(input, '100.000,', 8); });
    expect(input.value).toBe('100.000,');

    act(() => { setInputValueAndCaret(input, '100.000,5', 9); });
    expect(input.value).toBe('100.000,5');
  });

  it('nokta ile virgülü karıştırmaz: nokta yazmaya çalışmak binlik olarak yorumlanır', () => {
    act(() => { root.render(<Harness initialValue="" />); });
    const input = container.querySelector('input');

    // Kullanıcı "1234.56" yapıştırır/yazar — bileşen kuralına göre nokta binlik sayılır.
    act(() => { setInputValueAndCaret(input, '1234.56', 7); });
    expect(input.value).toBe('123.456');
  });

  it('yapıştırılan tam biçimli bir tutarı doğru şekilde işler', () => {
    act(() => { root.render(<Harness initialValue="" />); });
    const input = container.querySelector('input');

    act(() => { setInputValueAndCaret(input, '1.500.000,75', 12); });
    expect(input.value).toBe('1.500.000,75');
  });

  it('imleci mantıklı bir konumda tutar (sona eklemede sona gider)', () => {
    act(() => { root.render(<Harness initialValue="1000000" />); });
    const input = container.querySelector('input');

    act(() => { setInputValueAndCaret(input, '1.000.0002', 10); });
    expect(input.value).toBe('10.000.002');
    expect(input.selectionStart).toBe(input.value.length);
  });

  it('boş değeri destekler', () => {
    act(() => { root.render(<Harness initialValue="" />); });
    const input = container.querySelector('input');
    expect(input.value).toBe('');
  });
});
