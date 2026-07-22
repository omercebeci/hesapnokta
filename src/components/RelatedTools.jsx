import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

// Hesaplayıcılar arası çapraz link bölümü — bir aracın info-card'ının altında,
// ilgili diğer araçlara tek satırlık bağlantılar gösterir.
export default function RelatedTools({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="related-tools">
      <strong>İlgili araçlar</strong>
      <div className="related-tools-links">
        {items.map((item) => (
          <Link key={item.to} to={item.to} className="related-tools-link">
            <Icon name="arrow-right" size={12} /> {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
