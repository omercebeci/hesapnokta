# HesaplaNet

Finans ve günlük hesaplama araçları sitesi.

## Yerelde çalıştırma

```bash
npm install
npm run dev
```

## Test ve build

```bash
npm test
npm run build
```

## Vercel deploy

1. https://vercel.com adresinden hesap aç / giriş yap.
2. Terminalde proje klasöründe:

```bash
npx vercel login
npx vercel --prod
```

Build ayarları:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

## Domain bağlama

Vercel paneli > Project > Settings > Domains bölümünden domain eklenir.
Alan adı aldığın firmada DNS kayıtları Vercel'in verdiği değerlere göre ayarlanır.

## Güncel verileri güncelleme

Sitedeki asgari ücret, vergi dilimleri, SGK oranları, kira artış sınırı,
kredi kartı faiz oranları gibi **her yıl (bazen yıl içinde birkaç kez)
değişen** değerlerin tamamı tek bir dosyada toplanmıştır:

```
src/data/guncelVeriler.js
```

**Hangi dosya, hangi değerler?**

Bu dosyada şu değerler bulunur — her birinin yanında değerin kendisi
(`value`), hangi döneme ait olduğu (`period`), nereden alındığı
(`source`) ve en son ne zaman güncellendiği (`lastUpdated`) yazar:

- Asgari ücret (brüt/net)
- Gelir vergisi dilimleri
- SGK ve işsizlik sigortası çalışan payı oranları
- Damga vergisi oranı
- Kira artışı yasal üst sınırı (TÜFE 12 aylık ortalama)
- Kıdem tazminatı tavanı
- İhbar süreleri tablosu
- Kredi kartı asgari ödeme eşiği/oranları
- Kredi kartı azami (akdi/gecikme) faiz oranları

**Nasıl güncellenir? (kod bilmenize gerek yok)**

1. `src/data/guncelVeriler.js` dosyasını bir metin editörüyle açın (GitHub
   üzerinden dosyaya tıklayıp sağ üstteki kalem/düzenle ikonuyla da
   yapılabilir).
2. Güncellemek istediğiniz değeri bulun, sadece `value` kısmındaki sayıyı
   değiştirin.
3. `period` alanını yeni döneme, `source` alanını verinin kaynağına,
   `lastUpdated` alanını da bugünün tarihine (YYYY-AA-GG biçiminde)
   güncelleyin.
4. Dosyanın en başındaki Türkçe yorum satırlarında da aynı adımlar,
   örneklerle birlikte anlatılmaktadır.

**Güncelleme sonrası ne olur?**

Değişikliği kaydettikten sonra normal şekilde commit'leyip GitHub'a push
edin:

```bash
git add src/data/guncelVeriler.js
git commit -m "Güncel veriler: 2027 oranları güncellendi"
git push
```

Proje Vercel'e bağlıysa, `main` branch'e yapılan her push'tan sonra site
**otomatik olarak** yeniden derlenip birkaç dakika içinde canlıya alınır;
başka hiçbir işlem yapmanıza gerek yoktur. Değişikliğin canlıya yansıdığını
Vercel panelindeki "Deployments" sekmesinden takip edebilirsiniz.

## Yeni rehber yazısı ekleme

`/rehber` altındaki blog yazıları, `content/rehber/` klasöründeki `.md`
(Markdown) dosyalarından otomatik üretilir. Yeni bir yazı eklemek için
kod yazmanıza gerek yoktur:

1. `content/rehber/` klasörüne, dosya adı yazının adresi (slug) olacak
   şekilde yeni bir `.md` dosyası ekleyin (örn. `emeklilik-hesabi-nasil-yapilir.md`).
2. Dosyanın en başına şu bilgileri (frontmatter) yazın:

```markdown
---
title: "Yazının Başlığı"
description: "Arama sonuçlarında görünecek kısa açıklama (1-2 cümle)."
date: "2026-07-07"
category: "Finans"
relatedCalculators: ["kredi-hesaplama"]
---

Yazının içeriği buradan başlar, normal Markdown ile yazılır
(## alt başlık, **kalın**, - madde işareti, [link metni](/kredi-hesaplama) vb.)
```

- `relatedCalculators` alanına, yazının ilgili olduğu hesaplayıcı(lar)ın
  adresini (örn. `kredi-hesaplama`) yazın — bu sayede yazının sonunda
  otomatik olarak ilgili hesaplayıcı kartı, ilgili hesaplayıcı sayfasında
  da "İlgili rehberler" bölümünde bu yazı otomatik olarak görünür.
- `category` alanı `/rehber` sayfasındaki kategori filtresinde kullanılır.

3. Dosyayı kaydedip commit + push yapın:

```bash
git add content/rehber/emeklilik-hesabi-nasil-yapilir.md
git commit -m "Rehber: emeklilik hesabı yazısı eklendi"
git push
```

Build sırasında yazı otomatik olarak işlenir, `/rehber` listesine,
sitemap.xml'e ve ilgili hesaplayıcı sayfalarına eklenir — başka hiçbir
şey yapmanıza gerek yoktur.

## Otomatik kontroller (GitHub Actions)

Proje, `.github/workflows/` altında iki otomatik kontrol içerir. **Bu
kontrollerin hiçbiri siteyi kendiliğinden değiştirmez** — yalnızca
denetleyip sorun bulurlarsa bir GitHub issue açarlar.

### Haftalık sağlık kontrolü

Her **Pazartesi saat 06:00 UTC**'de (Türkiye saatiyle 09:00) otomatik
çalışır; Actions sekmesinden "Haftalık Sağlık Kontrolü" workflow'unu
seçip "Run workflow" ile elle de tetiklenebilir. Şunları kontrol eder:

- **Build sağlığı**: testler ve production build başarıyla tamamlanıyor mu?
- **Kırık iç link taraması**: build çıktısındaki sayfalarda hedefi
  bulunamayan bir iç link var mı?
- **Güncel veri tazeliği**: `src/data/guncelVeriler.js` içindeki
  değerlerden 90 günden uzun süredir güncellenmemiş ya da `period`
  alanı geçmiş bir yılı gösteren var mı?
- **Sitemap tutarlılığı**: `sitemap.xml`'deki URL sayısı, build'de
  üretilen statik sayfa sayısıyla uyuşuyor mu?

Sorun bulunursa **"🔎 Haftalık sağlık kontrolü: N sorun bulundu"**
başlıklı bir issue açılır (`saglik-kontrolu` etiketiyle); aynı hafta
içinde zaten açık bir issue varsa yeni issue açılmaz, onun yerine
üzerine yorum eklenir. Sorun yoksa hiçbir şey yapılmaz.

**Issue geldiğinde ne yapmalı?** Issue'nun içeriği hangi kontrolün
başarısız olduğunu ve (varsa) hangi linklerin/verilerin sorunlu
olduğunu listeler. Genellikle şunlardan biridir: `guncelVeriler.js`
içinde güncellenmesi gereken bir oran (bkz. yukarıdaki "Güncel
verileri güncelleme" bölümü), bir hesaplayıcı/rehber sayfasında
düzeltilmesi gereken bozuk bir link, ya da testler/build'i kıran bir
kod değişikliği. Sorunu giderip commit + push yaptıktan sonra issue'yu
elle kapatabilirsiniz.

### Deploy sonrası kontrol

`main` branch'ine yapılan **her push'tan sonra** otomatik çalışır;
Vercel'in deploy'u tamamlaması için 3 dakika bekleyip canlı sitede
(`hesapnokta.com`) birkaç kritik URL'nin (ana sayfa, örnek bir
hesaplayıcı, `/rehber`, `sitemap.xml`, `ads.txt` ve eski bir URL'nin
301/308 yönlendirmesi) beklenen durum kodunu döndürüp döndürmediğini
kontrol eder.

Başarısızlık durumunda **"🚨 Deploy sonrası kontrol başarısız"**
başlıklı bir issue açılır (`deploy-kontrolu` etiketiyle, aynı mantıkla
tekrarları önler). Bu issue geldiğinde, canlı sitenin (muhtemelen
deploy henüz tamamlanmadığı ya da bir hata nedeniyle) beklendiği gibi
çalışmadığı anlamına gelir; Vercel panelindeki son deploy'un loglarını
kontrol etmeniz önerilir.
