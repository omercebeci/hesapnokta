import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRehberYazisiBySlug } from '../data/rehberYazilari.generated.js';
import { getCalculatorById } from '../data/calculatorRegistry.js';
import { formatDateTr } from '../utils/format.js';
import { setSeoTags, setJsonLd, removeJsonLd } from '../utils/seo.js';
import { useHeadContext } from '../context/HeadContext.jsx';
import Icon from '../components/Icon.jsx';
import NotFoundPage from './NotFoundPage.jsx';

const SITE_URL = 'https://hesapnokta.com';

function buildSeoData(post) {
  const path = `/rehber/${post.slug}`;
  const jsonLd = [
    {
      id: 'jsonld-rehber-article',
      data: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        url: `${SITE_URL}${path}`,
        author: { '@type': 'Organization', name: 'HesapNokta' },
        publisher: { '@type': 'Organization', name: 'HesapNokta' },
      },
    },
  ];
  return { title: `${post.title} | HesapNokta Rehber`, description: post.description, path, jsonLd };
}

export default function RehberPostPage() {
  const { slug } = useParams();
  const post = getRehberYazisiBySlug(slug);
  const headContext = useHeadContext();

  if (headContext && post) {
    headContext.push(buildSeoData(post));
  }

  useEffect(() => {
    if (!post) return undefined;
    const { title, description, path, jsonLd } = buildSeoData(post);
    setSeoTags({ title, description, path });
    jsonLd.forEach(({ id, data }) => setJsonLd(id, data));

    return () => {
      removeJsonLd('jsonld-rehber-article');
    };
  }, [post]);

  if (!post) return <NotFoundPage />;

  const relatedCalculators = post.relatedCalculators
    .map((id) => getCalculatorById(id))
    .filter(Boolean);

  return (
    <div className="calculator-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Sayfa yolu">
          <Link to="/">Ana sayfa</Link>
          <span>/</span>
          <Link to="/rehber">Rehber</Link>
          <span>/</span>
          <span>{post.title}</span>
        </nav>

        <article className="rehber-post">
          <div className="calculator-page-head">
            <span className="cat-badge"><Icon name="book-open" size={14} /> {post.category}</span>
            <h1>{post.title}</h1>
            <div className="rehber-post-meta">
              <span>{formatDateTr(post.date)}</span>
              <span>{post.readingMinutes} dk okuma</span>
            </div>
          </div>

          {/* eslint-disable-next-line react/no-danger */}
          <div className="rehber-post-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

          {relatedCalculators.length > 0 && (
            <div className="rehber-related-calculators">
              <h2>İlgili hesaplayıcılar</h2>
              <div className="rehber-related-grid">
                {relatedCalculators.map((calc) => (
                  <Link key={calc.id} to={`/${calc.id}`} className="rehber-related-card">
                    <Icon name={calc.icon} size={18} />
                    <span>{calc.title}</span>
                    <Icon name="arrow-right" size={14} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
