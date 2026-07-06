// Rota bazlı SEO etiketlerini (title, description, canonical, Open Graph) ve JSON-LD script'lerini
// tek yerden yönetmek için yardımcı fonksiyonlar. Vite ile derlenen bu SPA sunucu taraflı render
// yapmadığı için, arama motorlarının/tarayıcıların JS çalıştıktan sonra gördüğü <head> içeriği burada güncellenir.

const SITE_URL = 'https://hesapnokta.com';

function upsertMeta(attr, attrValue, content) {
  let tag = document.querySelector(`meta[${attr}="${attrValue}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export function setSeoTags({ title, description, path = '/' }) {
  if (title) document.title = title;
  if (description) upsertMeta('name', 'description', description);

  const canonicalUrl = `${SITE_URL}${path === '/' ? '/' : path}`;
  let canonicalTag = document.querySelector('link[rel="canonical"]');
  if (!canonicalTag) {
    canonicalTag = document.createElement('link');
    canonicalTag.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalTag);
  }
  canonicalTag.setAttribute('href', canonicalUrl);

  if (title) upsertMeta('property', 'og:title', title);
  if (description) upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', canonicalUrl);
}

export function setJsonLd(id, data) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function removeJsonLd(id) {
  document.getElementById(id)?.remove();
}
