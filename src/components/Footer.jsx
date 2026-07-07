import React from 'react';
import { Link } from 'react-router-dom';
import { categories, calculators } from '../data/calculatorRegistry.js';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="footer-brand">
          <strong>HesapNokta</strong>
          <p>Finans, sağlık, matematik ve zaman hesaplamaları için ücretsiz, hızlı ve mobil uyumlu araçlar.</p>
        </div>
        <div className="footer-links">
          {categories.map((category) => (
            <div className="footer-links-col" key={category.id}>
              <strong>{category.label}</strong>
              {calculators
                .filter((item) => item.category === category.id)
                .slice(0, 5)
                .map((item) => (
                  <Link key={item.id} to={`/${item.id}`}>{item.title}</Link>
                ))}
            </div>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {currentYear} HesapNokta — Sonuçlar bilgilendirme amaçlıdır, resmi/hukuki tavsiye yerine geçmez.</p>
        <nav className="footer-legal-links" aria-label="Kurumsal bağlantılar">
          <Link to="/hakkinda">Hakkında</Link>
          <Link to="/iletisim">İletişim</Link>
          <Link to="/gizlilik-politikasi">Gizlilik Politikası</Link>
        </nav>
      </div>
    </footer>
  );
}
