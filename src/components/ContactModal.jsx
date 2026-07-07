import React from 'react';
import Icon from './Icon.jsx';
import ContactForm from './ContactForm.jsx';

export default function ContactModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Kapat"><Icon name="close" size={18} /></button>
        <h2>Bize Ulaşın</h2>
        <ContactForm />
      </div>
    </div>
  );
}
