import React, { useState } from 'react';
import { useCalculatorContext } from '../context/CalculatorContext.jsx';
import { formatDateTr } from '../utils/format.js';

function todayLocalDateStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// sections: [{ heading, items: [{ label, detail }] }] — detail opsiyoneldir (ör. ölçü/hesaplanan miktar).
export default function PrintableQuoteRequest({ sections }) {
  const calculator = useCalculatorContext();
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [copied, setCopied] = useState(false);

  const hasItems = (sections || []).some((section) => section.items.length > 0);
  if (!hasItems) return null;

  const buildPlainText = () => {
    const lines = [];
    lines.push(`TEKLİF TALEBİ — ${calculator?.title || ''}`);
    lines.push(`Tarih: ${formatDateTr(todayLocalDateStr())}`);
    if (contactName.trim() || contactPhone.trim()) {
      lines.push([contactName.trim(), contactPhone.trim()].filter(Boolean).join(' — '));
    }
    lines.push('');
    sections.forEach((section) => {
      if (section.items.length === 0) return;
      lines.push(`${section.heading}:`);
      section.items.forEach((item, index) => {
        const detail = item.detail ? ` — ${item.detail}` : '';
        lines.push(`${index + 1}. ${item.label}${detail}`);
        lines.push('   Birim fiyat: _____  Tutar: _____  Süre: _____ gün  Not: _____');
      });
      lines.push('');
    });
    lines.push('Bu belge teklif karşılaştırmak için hazırlanmıştır; fiyatlar ustaya/firmaya aittir, HesapNokta hiçbir fiyat önermez.');
    lines.push('Öneri: aynı formatta en az 2-3 ustadan/firmadan teklif alıp karşılaştırmanız, gerçekçi bir fiyat aralığı görmenizi sağlar.');
    return lines.join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildPlainText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Panoya erişim engellenmişse sessizce geç.
    }
  };

  return (
    <div className="info-card">
      <h2>Ustadan teklif iste</h2>
      <p>Aşağıdaki bilgileri (opsiyonel) doldurup bu belgeyi yazdırabilir veya WhatsApp'ta göndermek üzere metin olarak kopyalayabilirsiniz. Usta/firma, boş bırakılan sütunları (birim fiyat, tutar, süre, notlar) doldurur.</p>

      <div className="form-grid no-print">
        <div className="field">
          <label htmlFor="quote-contact-name">Adınız (opsiyonel)</label>
          <input id="quote-contact-name" type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="quote-contact-phone">Telefonunuz (opsiyonel)</label>
          <input id="quote-contact-phone" type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
        </div>
      </div>

      <div className="no-print" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
        <button type="button" className="btn-primary print-plan-button" onClick={() => window.print()}>🖨️ Teklif talebini yazdır / PDF kaydet</button>
        <button type="button" className="shopping-list-copy" onClick={handleCopy}>{copied ? '✓ Kopyalandı' : '📋 WhatsApp için metni kopyala'}</button>
      </div>

      <div className="print-summary" aria-hidden="true">
        <h1>Teklif Talebi</h1>
        <p className="print-summary-meta">{calculator?.title} — {formatDateTr(todayLocalDateStr())}</p>
        {(contactName.trim() || contactPhone.trim()) && (
          <p className="print-summary-meta">{[contactName.trim(), contactPhone.trim()].filter(Boolean).join(' — ')}</p>
        )}
        {sections.map((section) => section.items.length > 0 && (
          <React.Fragment key={section.heading}>
            <h3>{section.heading}</h3>
            <table className="print-summary-table">
              <thead>
                <tr><th>Kalem</th><th>Ölçü/Miktar</th><th>Birim Fiyat</th><th>Tutar</th><th>Süre (gün)</th><th>Notlar</th></tr>
              </thead>
              <tbody>
                {section.items.map((item) => (
                  <tr key={item.label}>
                    <td>{item.label}</td>
                    <td>{item.detail || ''}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </React.Fragment>
        ))}
        <p className="print-summary-note">Bu belge teklif karşılaştırmak için hazırlanmıştır; fiyatlar ustaya/firmaya aittir, HesapNokta hiçbir fiyat önermez. Aynı formatta en az 2-3 ustadan/firmadan teklif alıp karşılaştırmanız önerilir.</p>
      </div>
    </div>
  );
}
