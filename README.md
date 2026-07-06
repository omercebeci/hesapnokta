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
