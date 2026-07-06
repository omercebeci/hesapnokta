import React, { useState } from 'react';
import Icon from './Icon.jsx';

export default function ContactModal({ onClose }) {
  const [form, setForm] = useState({ name: '', contact: '', question: '' });
  const [status, setStatus] = useState(null); // { ok: boolean, message: string } | null
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.question.trim().length < 5) {
      setStatus({ ok: false, message: 'Lütfen en az birkaç kelimelik bir soru yazın.' });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);
    try {
      const response = await fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, topic: 'Genel soru' }),
      });
      const data = await response.json();
      setStatus({ ok: Boolean(data.ok), message: data.message || 'Bir şeyler ters gitti.' });
      if (data.ok) setForm({ name: '', contact: '', question: '' });
    } catch (error) {
      setStatus({ ok: false, message: 'Soru gönderilirken bağlantı hatası oluştu.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Kapat"><Icon name="close" size={18} /></button>
        <h2>Bize Ulaşın</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field full">
            <label htmlFor="contact-name">Adınız (opsiyonel)</label>
            <input id="contact-name" type="text" value={form.name} onChange={updateField('name')} />
          </div>
          <div className="field full">
            <label htmlFor="contact-info">E-posta / iletişim (opsiyonel)</label>
            <input id="contact-info" type="text" value={form.contact} onChange={updateField('contact')} />
          </div>
          <div className="field full">
            <label htmlFor="contact-question">Sorunuz</label>
            <input id="contact-question" type="text" value={form.question} onChange={updateField('question')} placeholder="Kısaca yazın..." />
          </div>
          <div className="field full">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Gönderiliyor…' : 'Gönder'}
            </button>
          </div>
          {status && (
            <p className={`modal-status field full ${status.ok ? 'ok' : 'error'}`}>{status.message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
