import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCalculatorById, getCategoryById } from '../data/calculatorRegistry.js';
import { getCalculatorContent } from '../data/calculatorContent.js';
import { setSeoTags, setJsonLd, removeJsonLd } from '../utils/seo.js';
import Icon from './Icon.jsx';

const APPLICATION_CATEGORY_BY_CATEGORY = {
  finans: 'FinanceApplication',
  saglik: 'HealthApplication',
  matematik: 'EducationApplication',
  zaman: 'UtilitiesApplication',
};

export default function CalculatorLayout({ calculatorId, children }) {
  const calculator = getCalculatorById(calculatorId);
  const category = calculator ? getCategoryById(calculator.category) : null;
  const content = calculator ? getCalculatorContent(calculatorId) : null;

  useEffect(() => {
    if (!calculator) return undefined;

    const title = `${calculator.title} | HesapNokta`;
    const path = `/${calculatorId}`;
    setSeoTags({ title, description: calculator.description, path });

    setJsonLd('jsonld-calculator-app', {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: calculator.title,
      description: calculator.description,
      url: `https://hesapnokta.com${path}`,
      applicationCategory: APPLICATION_CATEGORY_BY_CATEGORY[calculator.category] || 'UtilitiesApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
    });

    if (content?.faq?.length) {
      setJsonLd('jsonld-calculator-faq', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: content.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      });
    }

    return () => {
      removeJsonLd('jsonld-calculator-app');
      removeJsonLd('jsonld-calculator-faq');
    };
  }, [calculator, calculatorId, content]);

  if (!calculator) return null;

  return (
    <div className="calculator-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Sayfa yolu">
          <Link to="/">Ana sayfa</Link>
          <span>/</span>
          <Link to={`/#${category.id}`}>{category.label}</Link>
          <span>/</span>
          <span>{calculator.title}</span>
        </nav>

        <div className="calculator-page-head">
          <span className="cat-badge"><Icon name={category.icon} size={14} /> {category.label}</span>
          <h1>{calculator.title}</h1>
          <p>{calculator.description}</p>
        </div>

        <div className="calculator-layout">{children}</div>

        {content && (
          <section className="seo-content" aria-label={`${calculator.title} hakkında bilgi`}>
            <div className="seo-content-block">
              <h2>{calculator.title} nedir?</h2>
              <p>{content.about}</p>
            </div>
            <div className="seo-content-block">
              <h2>Nasıl hesaplanır?</h2>
              <p>{content.method}</p>
            </div>
            <div className="seo-content-block">
              <h2>Sık sorulan sorular</h2>
              <div className="faq-list">
                {content.faq.map((item) => (
                  <details className="faq-item" key={item.q}>
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
