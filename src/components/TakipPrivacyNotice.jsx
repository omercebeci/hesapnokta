import React, { useState } from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect.js';

const STORAGE_KEY = 'hn-takip-bilgi-onay-v1';

// Tansiyon/şeker gibi cihaz-içi takip araçlarının ortak, tek seferlik gizlilik bilgilendirmesi.
// Bir araçta kapatıldığında diğerinde de tekrar gösterilmez (aynı localStorage bayrağı).
export default function TakipPrivacyNotice() {
  const [visible, setVisible] = useState(true);

  useIsomorphicLayoutEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === '1') setVisible(false);
    } catch (error) {
      // Depolamaya erişilemiyorsa (gizli sekme vb.) notu göstermeye devam et.
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch (error) {
      // yok say
    }
  };

  return (
    <div className="takip-privacy-notice">
      <p>
        🔒 Ölçümleriniz yalnızca bu cihazın tarayıcısında saklanır; bize gönderilmez.
        Tarayıcı verilerini silerseniz kayıtlar da silinir.
      </p>
      <button type="button" className="takip-privacy-notice-dismiss" onClick={dismiss}>Anladım</button>
    </div>
  );
}
