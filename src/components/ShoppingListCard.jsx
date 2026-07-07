import React, { useState } from 'react';

export default function ShoppingListCard({ items }) {
  const [copied, setCopied] = useState(false);
  if (!items || items.length === 0) return null;

  const handleCopy = async () => {
    const text = items.map((item) => `☐ ${item}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Panoya erişim engellenmişse sessizce geç.
    }
  };

  return (
    <div className="shopping-list-card">
      <div className="shopping-list-head">
        <h2>Alışveriş listesi</h2>
        <button type="button" className="shopping-list-copy" onClick={handleCopy}>
          {copied ? '✓ Kopyalandı' : '📋 Kopyala'}
        </button>
      </div>
      <ul className="shopping-list-items">
        {items.map((item) => (
          <li key={item}>☐ {item}</li>
        ))}
      </ul>
    </div>
  );
}
