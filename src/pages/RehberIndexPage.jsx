import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { rehberYazilari } from '../data/rehberYazilari.generated.js';
import { formatDateTr } from '../utils/format.js';
import { setSeoTags, removeJsonLd } from '../utils/seo.js';
import { useHeadContext } from '../context/HeadContext.jsx';
import Icon from '../components/Icon.jsx';

const PAGE_TITLE = 'Rehber | HesapNokta';
const PAGE_DESCRIPTION = 'Maaş, kıdem tazminatı, uyku düzeni ve daha fazlası hakkında sade, pratik rehber yazıları.';

export default function RehberIndexPage() {
  const headContext = useHeadContext();
  const [activeCategory, setActiveCategory] = useState('Tümü');

  if (headContext) {
    headContext.push({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, path: '/rehber', jsonLd: [] });
  }

  useEffect(() => {
    setSeoTags({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, path: '/rehber' });
    removeJsonLd('jsonld-calculator-app');
    removeJsonLd('jsonld-calculator-faq');
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(rehberYazilari.map((post) => post.category))];
    return ['Tümü', ...unique];
  }, []);

  const visiblePosts = activeCategory === 'Tümü'
    ? rehberYazilari
    : rehberYazilari.filter((post) => post.category === activeCategory);

  return (
    <div className="calculator-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Sayfa yolu">
          <Link to="/">Ana sayfa</Link>
          <span>/</span>
          <span>Rehber</span>
        </nav>

        <div className="calculator-page-head">
          <span className="cat-badge"><Icon name="book-open" size={14} /> Rehber</span>
          <h1>Rehber</h1>
          <p>{PAGE_DESCRIPTION}</p>
        </div>

        <div className="rehber-filters" role="tablist" aria-label="Kategoriye göre filtrele">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`rehber-filter-btn ${activeCategory === category ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        {visiblePosts.length === 0 ? (
          <p className="empty-state">Bu kategoride henüz yazı yok.</p>
        ) : (
          <div className="rehber-grid">
            {visiblePosts.map((post) => (
              <Link key={post.slug} to={`/rehber/${post.slug}`} className="rehber-card">
                <span className="rehber-card-cat">{post.category}</span>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <div className="rehber-card-meta">
                  <span>{formatDateTr(post.date)}</span>
                  <span>{post.readingMinutes} dk okuma</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
