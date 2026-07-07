import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setSeoTags, removeJsonLd } from '../utils/seo.js';
import { useHeadContext } from '../context/HeadContext.jsx';
import Icon from '../components/Icon.jsx';
import ContactForm from '../components/ContactForm.jsx';

const PAGE_TITLE = 'İletişim | HesapNokta';
const PAGE_DESCRIPTION = 'HesapNokta ile ilgili soru, öneri veya hata bildirimi için bize aşağıdaki formdan ulaşabilirsiniz.';

export default function ContactPage() {
  const headContext = useHeadContext();

  if (headContext) {
    headContext.push({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, path: '/iletisim', jsonLd: [] });
  }

  useEffect(() => {
    setSeoTags({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, path: '/iletisim' });
    removeJsonLd('jsonld-calculator-app');
    removeJsonLd('jsonld-calculator-faq');
  }, []);

  return (
    <div className="calculator-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Sayfa yolu">
          <Link to="/">Ana sayfa</Link>
          <span>/</span>
          <span>İletişim</span>
        </nav>

        <div className="calculator-page-head">
          <span className="cat-badge"><Icon name="mail" size={14} /> İletişim</span>
          <h1>İletişim</h1>
          <p>Bir hesaplayıcıda hata mı gördünüz, eklenmesini istediğiniz bir araç mı var, ya da başka bir sorunuz mu var? Aşağıdaki formu doldurarak bize ulaşabilirsiniz.</p>
        </div>

        <div className="contact-page-form">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
