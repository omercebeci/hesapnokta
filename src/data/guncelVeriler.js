// ═══════════════════════════════════════════════════════════════════════
// GÜNCEL VERİLER — Mevzuata / döneme bağlı tüm oran ve tutarlar
// ═══════════════════════════════════════════════════════════════════════
//
// BU DOSYA NE İŞE YARAR?
// -----------------------
// Türkiye'de asgari ücret, vergi dilimleri, SGK oranları, kira artış
// sınırı gibi değerler her yıl (bazen yıl içinde birkaç kez) resmi olarak
// güncellenir. Sitedeki TÜM hesaplayıcılar bu tür "güncel" değerleri
// kendi içlerinde saklamak yerine, hepsini BURADAN, tek bir yerden okur.
// Bir oran değiştiğinde tek yapmanız gereken bu dosyayı güncellemektir;
// hesaplayıcı sayfalarının kodlarına dokunmanıza gerek yoktur.
//
// KOD BİLMEYEN BİRİ İÇİN: NASIL GÜNCELLENİR? (adım adım)
// --------------------------------------------------------
// 1. Aşağıda güncellemek istediğiniz değeri bulun (ör. "asgariUcret").
// 2. SADECE `value` (veya iç içe alanlardaki sayısal) kısmı değiştirin.
//    Örnek:  value: 33030   →   value: 35000
// 3. `period` alanını yeni döneme göre güncelleyin (ör. "2027" ya da
//    "2027 1. Dönem").
// 4. `source` alanına verinin resmi kaynağını kısaca yazın
//    (ör. "Resmi Gazete, 31.12.2026 tarihli tebliğ").
// 5. `lastUpdated` alanını bugünün tarihiyle güncelleyin
//    (YYYY-AA-GG formatında, ör. "2027-01-01").
// 6. Dosyayı kaydedin. Ardından normal şekilde git commit + push yapın
//    (ayrıntılar için proje ana dizinindeki README.md dosyasındaki
//    "Güncel verileri güncelleme" bölümüne bakın) — kod yazmanıza veya
//    başka hiçbir dosyaya dokunmanıza gerek yoktur, site birkaç dakika
//    içinde otomatik olarak yeni değerlerle güncellenir.
//
// ⚠️ ÖNEMLİ: Sadece sayısal değerleri (value, upTo, rate, ustSinir gibi
// alanların içindeki sayıları) değiştirin. Alan isimlerini (value,
// period, source, lastUpdated, upTo, rate...) SİLMEYİN veya yeniden
// ADLANDIRMAYIN — aksi halde hesaplayıcılar çalışmaz ve sitede hata
// oluşur. Bir şeyden emin değilseniz değiştirmeden bırakın.
//
// ═══════════════════════════════════════════════════════════════════════

export const GUNCEL_VERILER = {
  // ── Asgari ücret ──
  // Brüt-net maaş hesaplayıcısındaki "asgari ücret istisnası" bu değerleri kullanır.
  asgariUcret: {
    brutAylik: {
      value: 33030,
      period: '2026',
      source: 'Aile, Çalışma ve Sosyal Hizmetler Bakanlığı - Asgari Ücret Tespit Komisyonu Kararı',
      lastUpdated: '2026-07-07',
    },
    netAylik: {
      value: 28075.50,
      period: '2026',
      source: 'Aile, Çalışma ve Sosyal Hizmetler Bakanlığı - Asgari Ücret Tespit Komisyonu Kararı',
      lastUpdated: '2026-07-07',
    },
  },

  // ── Gelir vergisi dilimleri ──
  // "upTo": bu dilimin üst sınırı (TL). "rate": bu dilimdeki vergi oranı.
  // Brüt-net maaş hesaplayıcısı kullanır.
  gelirVergisiDilimleri: {
    value: [
      { upTo: 190000, rate: 0.15 },
      { upTo: 400000, rate: 0.20 },
      { upTo: 1500000, rate: 0.27 },
      { upTo: 5300000, rate: 0.35 },
      { upTo: Infinity, rate: 0.40 },
    ],
    period: '2026',
    source: 'Gelir İdaresi Başkanlığı - 2026 Yılı Gelir Vergisi Tarifesi',
    lastUpdated: '2026-07-07',
  },

  // ── SGK ve işsizlik sigortası çalışan payı oranları ──
  sgkIsciPayiOrani: {
    value: 0.14,
    period: '2026',
    source: '5510 sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu',
    lastUpdated: '2026-07-07',
  },
  issizlikSigortasiIsciPayiOrani: {
    value: 0.01,
    period: '2026',
    source: '4447 sayılı İşsizlik Sigortası Kanunu',
    lastUpdated: '2026-07-07',
  },

  // ── Damga vergisi oranı (ücret bordrosu) ──
  damgaVergisiOrani: {
    value: 0.00759,
    period: '2026',
    source: 'Damga Vergisi Kanunu Genel Tebliği (Seri No: 71)',
    lastUpdated: '2026-07-07',
  },

  // ── Kira artışı yasal üst sınırı (TÜFE 12 aylık ortalama) ──
  // Bu oran HER AY değişir. Güncel oranı TÜİK'in aylık duyurusundan takip edin.
  kiraArtisTavanOrani: {
    value: 32.03,
    period: 'Temmuz 2026',
    source: 'TÜİK - TÜFE 12 Aylık Ortalamalara Göre Değişim Oranı',
    lastUpdated: '2026-07-07',
  },

  // ── Kıdem tazminatı tavanı ──
  // Bu tavan yılda iki kez (Ocak ve Temmuz) memur maaş katsayısına göre güncellenir.
  kidemTazminatiTavani: {
    value: 73729.87,
    period: '2026 2. Dönem (Temmuz-Aralık)',
    source: 'Hazine ve Maliye Bakanlığı Genelgesi',
    lastUpdated: '2026-07-07',
  },

  // ── İhbar süreleri (İş Kanunu m.17) ──
  // Bu tablo kanunla sabittir, dönemsel olarak değişmez; referans amaçlı burada tutulur.
  // "kidemUstSiniriYil": bu süre için kıdemin ÜST sınırı (yıl). "hafta": uygulanan ihbar süresi.
  ihbarSureleri: {
    value: [
      { kidemUstSiniriYil: 0.5, hafta: 2 },
      { kidemUstSiniriYil: 1.5, hafta: 4 },
      { kidemUstSiniriYil: 3, hafta: 6 },
      { kidemUstSiniriYil: Infinity, hafta: 8 },
    ],
    period: 'Sabit (kanunla belirlenir, dönemsel değişmez)',
    source: '4857 sayılı İş Kanunu, madde 17',
    lastUpdated: 'N/A',
  },

  // ── Kredi kartı asgari ödeme oranı ──
  // "esikTutar" altında/üstünde farklı oran uygulanır.
  krediKartiAsgariOdeme: {
    esikTutar: 50000,
    esikAltiOran: 0.20,
    esikUstuOran: 0.40,
    period: '2026',
    source: 'BDDK Kararı (26.09.2024 tarih, 10970 sayılı)',
    lastUpdated: '2026-07-07',
  },

  // ── Kredi kartı azami (yasal üst sınır) faiz oranları ──
  // Dönem borcu tutarına göre 3 kademeli tavan uygulanır. Bankalar bu oranları
  // aşamaz ama daha düşük uygulayabilir. Varsayılan olarak en düşük kademe kullanılır.
  krediKartiFaizOranlari: {
    value: [
      { ustSinir: 30000, akdiFaiz: 0.0325, gecikmeFaizi: 0.0355 },
      { ustSinir: 180000, akdiFaiz: 0.0375, gecikmeFaizi: 0.0405 },
      { ustSinir: Infinity, akdiFaiz: 0.0425, gecikmeFaizi: 0.0455 },
    ],
    period: '2026',
    source: 'TCMB - Kredi Kartı İşlemlerinde Uygulanacak Azami Faiz Oranları',
    lastUpdated: '2026-07-07',
  },
};

// Aşağıdaki yardımcı fonksiyonlara dokunmanız gerekmez; sayfalar veriyi
// okumak için bunları kullanır.

export function getGuncelDeger(yol) {
  return yol.split('.').reduce((current, key) => current?.[key], GUNCEL_VERILER);
}
