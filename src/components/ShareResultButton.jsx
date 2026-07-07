import React, { useState } from 'react';
import { useCalculatorContext } from '../context/CalculatorContext.jsx';

export default function ShareResultButton() {
  const calculator = useCalculatorContext();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const title = calculator?.title ? `${calculator.title} | HesapNokta` : 'HesapNokta';

    if (navigator.share) {
      try {
        await navigator.share({ title, text: `${title} - sonucumu inceleyin:`, url });
      } catch (error) {
        // Kullanıcı paylaşım penceresini iptal etti; sessizce geç.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Panoya erişim engellenmişse sessizce geç.
    }
  };

  return (
    <button type="button" className="result-share-button" onClick={handleShare}>
      {copied ? '✓ Kopyalandı' : '🔗 Sonucu paylaş'}
    </button>
  );
}
