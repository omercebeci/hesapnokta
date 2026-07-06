import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import ContactModal from './ContactModal.jsx';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link className="brand" to="/" aria-label="HesapNokta ana sayfa">
          <span className="brand-mark">H</span>
          <span>HesapNokta</span>
        </Link>
        <div className="header-actions">
          <button type="button" className="header-home-link" onClick={() => setIsContactOpen(true)}>
            <span className="label">Bize Ulaşın</span>
          </button>
          {!isHome && (
            <Link className="header-home-link" to="/">
              <span className="label">Tüm hesaplayıcılar</span>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
      {isContactOpen && <ContactModal onClose={() => setIsContactOpen(false)} />}
    </header>
  );
}
