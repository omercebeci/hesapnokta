import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCalculatorById, getCategoryById } from '../data/calculatorRegistry.js';
import { getCalculatorContent } from '../data/calculatorContent.js';
import { getRehberYazilariByCalculatorId } from '../data/rehberYazilari.generated.js';
import { setSeoTags, setJsonLd, removeJsonLd } from '../utils/seo.js';
import { useHeadContext } from '../context/HeadContext.jsx';
import { CalculatorContextProvider } from '../context/CalculatorContext.jsx';
import Icon from './Icon.jsx';
import FeedbackWidget from './FeedbackWidget.jsx';

const APPLICATION_CATEGORY_BY_CATEGORY = {
  finans: 'FinanceApplication',
  saglik: 'HealthApplication',
  matematik: 'EducationApplication',
  zaman: 'UtilitiesApplication',
};

function buildSeoData(calculator, calculatorId, content) {
  const title = `${calculator.title} | HesapNokta`;
  const path = `/${calculatorId}`;
  const jsonLd = [
    {
      id: 'jsonld-calculator-app',
      data: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: calculator.title,
        description: calculator.description,
        url: `https://hesapnokta.com${path}`,
        applicationCategory: APPLICATION_CATEGORY_BY_CATEGORY[calculator.category] || 'UtilitiesApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
      },
    },
  ];

  if (content?.faq?.length) {
    jsonLd.push({
      id: 'jsonld-calculator-faq',
      data: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: content.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    });
  }

  return { title, description: calculator.description, path, jsonLd };
}

export default function CalculatorLayout({ calculatorId, children }) {
  const calculator = getCalculatorById(calculatorId);
  const category = calculator ? getCategoryById(calculator.category) : null;
  const content = calculator ? getCalculatorContent(calculatorId) : null;
  const relatedGuides = calculator ? getRehberYazilariByCalculatorId(calculatorId) : [];
  const headContext = useHeadContext();

  // Prerender (SSR) sırasında: render anında head verisini doğrudan bağlama yazar.
  if (headContext && calculator) {
    headContext.push(buildSeoData(calculator, calculatorId, content));
  }

  // Tarayıcıda (client-side navigasyon dahil): aynı veriyi useEffect ile document'a uygular.
  useEffect(() => {
    if (!calculator) return undefined;
    const { title, description, path, jsonLd } = buildSeoData(calculator, calculatorId, content);

    setSeoTags({ title, description, path });
    jsonLd.forEach(({ id, data }) => setJsonLd(id, data));

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

        <CalculatorContextProvider value={{ title: calculator.title }}>
          <div className="calculator-layout">{children}</div>
        </CalculatorContextProvider>

        <FeedbackWidget calculatorId={calculatorId} pageTitle={calculator.title} />

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
            {content.examples?.length > 0 && (
              <div className="seo-content-block">
                <h2>Örnek hesaplamalar</h2>
                <div className="example-grid">
                  {content.examples.map((example) => (
                    <div className="example-box" key={example.title}>
                      <h3>{example.title}</h3>
                      {example.intro && <p className="example-box-intro">{example.intro}</p>}
                      <dl className="example-box-rows">
                        {example.rows.map((row) => (
                          <div className="example-box-row" key={row.label}>
                            <dt>{row.label}</dt>
                            <dd>{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            {calculator.category === 'saglik' && (
              <p className="health-disclaimer">
                ⚕️ Bu sonuçlar genel formüllere dayanan yaklaşık tahminlerdir, tıbbi tavsiye yerine geçmez. Kişisel sağlık durumunuzla ilgili kararlar için bir hekime danışın.
              </p>
            )}
          </section>
        )}

        {relatedGuides.length > 0 && (
          <section className="rehber-related-calculators" aria-label="İlgili rehberler">
            <h2>İlgili rehberler</h2>
            <div className="rehber-related-grid">
              {relatedGuides.map((post) => (
                <Link key={post.slug} to={`/rehber/${post.slug}`} className="rehber-related-card">
                  <Icon name="book-open" size={18} />
                  <span>{post.title}</span>
                  <Icon name="arrow-right" size={14} />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
