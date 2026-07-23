import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Bkz. scripts/prerender.mjs'teki not: "trailingSlash": false iken "cleanUrls" olmadan,
// sitedeki tüm iç linkler kullandığı eğik çizgisiz "/kredi-hesaplama" gibi temiz URL'ler
// hiçbir statik dosyaya TAM olarak eşleşmiyordu (gerçek dosya "kredi-hesaplama/index.html"),
// bu yüzden istek "rewrites" ile HER ZAMAN ana sayfanın statik HTML'ine düşüyordu — istemci
// ise gerçek URL'e göre hesaplayıcı sayfasını hydrate etmeye çalışınca React hydration
// hatası (#418) veriyordu. "cleanUrls": true, Vercel'in "/kredi-hesaplama" isteğini kendi
// "kredi-hesaplama/index.html" dosyasına eşlemesini sağlayarak bunu kökten çözer.
describe('vercel.json routing', () => {
  const config = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'vercel.json'), 'utf-8'));

  it('cleanUrls etkin olmalı, aksi halde eğik çizgisiz sayfa URL\'leri yanlış statik dosyaya (ana sayfa) düşer', () => {
    expect(config.cleanUrls).toBe(true);
  });

  it('trailingSlash false kalmalı (cleanUrls ile birlikte tutarlı temiz URL biçimi için)', () => {
    expect(config.trailingSlash).toBe(false);
  });
});
