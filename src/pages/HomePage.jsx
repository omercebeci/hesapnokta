import React, { useEffect } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import CategorySection from '../components/CategorySection.jsx';
import Icon from '../components/Icon.jsx';
import { categories, calculators } from '../data/calculatorRegistry.js';
import { setSeoTags, removeJsonLd } from '../utils/seo.js';
import { useHeadContext } from '../context/HeadContext.jsx';

const SITE_DESCRIPTION = 'HesapNokta; kredi, KDV, yüzde, BMI, kalori, yaş ve tarih farkı gibi finans, sağlık, matematik ve zaman hesaplamalarını anında ve ücretsiz yapmanızı sağlar.';
const SITE_TITLE = 'HesapNokta | Finans, Sağlık, Matematik ve Zaman Hesaplayıcıları';

const TRUST_ITEMS = [
  { icon: 'activity', label: 'Anlık sonuç' },
  { icon: 'landmark', label: 'Kayıt gerekmez' },
  { icon: 'sigma', label: `${calculators.length} hesaplayıcı` },
];

export default function HomePage() {
  const headContext = useHeadContext();

  // Prerender (SSR) sırasında: render anında head verisini doğrudan bağlama yazar.
  if (headContext) {
    headContext.push({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: '/', jsonLd: [] });
  }

  useEffect(() => {
    setSeoTags({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: '/' });
    // Bir hesaplayıcı sayfasından geri dönüldüğünde kalmış olabilecek şema script'lerini temizle.
    removeJsonLd('jsonld-calculator-app');
    removeJsonLd('jsonld-calculator-faq');
  }, []);

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-glow" aria-hidden="true" />
        <div className="container">
          <span className="eyebrow">{calculators.length} ücretsiz hesaplayıcı</span>
          <h1>Aradığın <span>hesaplayıcıyı</span> saniyeler içinde bul.</h1>
          <p>{SITE_DESCRIPTION}</p>
          <SearchBar />
          <div className="hero-trust">
            {TRUST_ITEMS.map((item) => (
              <span key={item.label}><Icon name={item.icon} size={15} />{item.label}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        {categories.map((category, index) => (
          <CategorySection
            key={category.id}
            category={category}
            items={calculators.filter((item) => item.category === category.id)}
            eager={index === 0}
          />
        ))}
      </div>
    </>
  );
}
