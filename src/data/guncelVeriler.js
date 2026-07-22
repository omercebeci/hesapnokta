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
// "tur" ALANI NE İŞE YARAR?
// -------------------------
// Her kayıt "tur: 'mevzuat'" ya da "tur: 'bilimsel-referans'" taşır.
// - 'mevzuat': Türk kanun/yönetmelik/kurum kararına dayanan, dönemsel
//   olarak (genelde yıllık) resmen güncellenen değerler (asgari ücret,
//   vergi dilimi, TÜİK oranı vb.). Haftalık sağlık kontrolündeki veri
//   tazeliği script'i SADECE bu türü yıl/güncellik açısından denetler.
// - 'bilimsel-referans': Bilimsel bir kılavuz, uzlaşı raporu veya
//   araştırmaya dayanan (ESH, ADA, WHO, CDC, ADAG çalışması gibi) değerler.
//   Kaynağın yayın yılı (ör. "2008 ADAG çalışması") verinin bayatladığı
//   anlamına gelmez — bu tür kayıtlar tazelik kontrolünden muaftır.
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
      tur: 'mevzuat',
    },
    netAylik: {
      value: 28075.50,
      period: '2026',
      source: 'Aile, Çalışma ve Sosyal Hizmetler Bakanlığı - Asgari Ücret Tespit Komisyonu Kararı',
      lastUpdated: '2026-07-07',
      tur: 'mevzuat',
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
    tur: 'mevzuat',
  },

  // ── SGK ve işsizlik sigortası çalışan payı oranları ──
  sgkIsciPayiOrani: {
    value: 0.14,
    period: '2026',
    source: '5510 sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu',
    lastUpdated: '2026-07-07',
    tur: 'mevzuat',
  },
  issizlikSigortasiIsciPayiOrani: {
    value: 0.01,
    period: '2026',
    source: '4447 sayılı İşsizlik Sigortası Kanunu',
    lastUpdated: '2026-07-07',
    tur: 'mevzuat',
  },

  // ── Damga vergisi oranı (ücret bordrosu) ──
  damgaVergisiOrani: {
    value: 0.00759,
    period: '2026',
    source: 'Damga Vergisi Kanunu Genel Tebliği (Seri No: 71)',
    lastUpdated: '2026-07-07',
    tur: 'mevzuat',
  },

  // ── Kira artışı yasal üst sınırı (TÜFE 12 aylık ortalama) ──
  // Bu oran HER AY değişir. Güncel oranı TÜİK'in aylık duyurusundan takip edin.
  kiraArtisTavanOrani: {
    value: 32.03,
    period: 'Temmuz 2026',
    source: 'TÜİK - TÜFE 12 Aylık Ortalamalara Göre Değişim Oranı',
    lastUpdated: '2026-07-07',
    tur: 'mevzuat',
  },

  // ── Kıdem tazminatı tavanı ──
  // Bu tavan yılda iki kez (Ocak ve Temmuz) memur maaş katsayısına göre güncellenir.
  kidemTazminatiTavani: {
    value: 73729.87,
    period: '2026 2. Dönem (Temmuz-Aralık)',
    source: 'Hazine ve Maliye Bakanlığı Genelgesi',
    lastUpdated: '2026-07-07',
    tur: 'mevzuat',
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
    tur: 'mevzuat',
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
    tur: 'mevzuat',
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
    tur: 'mevzuat',
  },

  // ── Trafik idari para cezası erken ödeme indirimi (KTK madde 115) ──
  // "gunSayisi": tebliğ tarihinden itibaren indirimli ödeme için tanınan süre.
  // ÖNEMLİ: Bu süre eskiden (2024 öncesi) 15 gündü; 31.01.2024 tarihli yönetmelik
  // değişikliğiyle 1 aya (30 gün) uzatıldı. Kaynağı ikinci kez teyit etmeden "15 gün"e geri almayın.
  trafikCezasiErkenOdeme: {
    indirimOrani: 0.25,
    gunSayisi: 30,
    period: '2026',
    source: '2918 sayılı Karayolları Trafik Kanunu madde 115 (%25 indirim ilkesi); "Trafik İdari Para Cezası Karar Tutanaklarının Düzenlenmesinde, Tahsilinde ve Takibinde Uygulanacak Usul ve Esaslar Hakkında Yönetmelik"te 31.01.2024 tarihli değişiklik (indirimli ödeme süresi 15 günden 1 aya uzatıldı) — İçişleri Bakanlığı duyurusu, icisleri.gov.tr',
    lastUpdated: '2026-07-09',
    tur: 'mevzuat',
  },

  // ── Askerlik hizmet süreleri ──
  // Bedelli askerlik yapanlar yedek subay/astsubay olamaz; süre gün olarak sabittir.
  askerlikHizmetSureleri: {
    value: {
      er: { ay: 6 },
      yedekSubay: { ay: 12 },
      bedelli: { gun: 32 },
    },
    period: '2026',
    source: '7179 sayılı Askeralma Kanunu, madde 5/2 (er/erbaş 6 ay, yedek subay/yedek astsubay 12 ay) — mevzuat.gov.tr; kesin celp/terhis tarihiniz için ASAL (asal.msb.gov.tr) veya e-Devlet üzerinden "Askerlik Durum Belgesi" sorgulamasını esas alın',
    lastUpdated: '2026-07-09',
    tur: 'mevzuat',
  },

  // ── Tansiyon (kan basıncı) sınıflandırma eşikleri ──
  // mmHg cinsinden sistolik/diastolik aralıklar. "max" alanı Infinity ise üst sınır yoktur.
  tansiyonSiniflandirma: {
    value: [
      { key: 'optimal', label: 'Optimal', sistolikMax: 119, diastolikMax: 79 },
      { key: 'normal', label: 'Normal', sistolikMin: 120, sistolikMax: 129, diastolikMin: 80, diastolikMax: 84 },
      { key: 'yuksekNormal', label: 'Yüksek normal', sistolikMin: 130, sistolikMax: 139, diastolikMin: 85, diastolikMax: 89 },
      { key: 'evre1', label: 'Evre 1 hipertansiyon', sistolikMin: 140, sistolikMax: 159, diastolikMin: 90, diastolikMax: 99 },
      { key: 'evre2', label: 'Evre 2 hipertansiyon', sistolikMin: 160, sistolikMax: 179, diastolikMin: 100, diastolikMax: 109 },
      { key: 'evre3', label: 'Evre 3 hipertansiyon', sistolikMin: 180, diastolikMin: 110 },
      { key: 'izoleSistolik', label: 'İzole sistolik hipertansiyon', sistolikMin: 140, diastolikMax: 89 },
    ],
    period: '2023 (ESH kılavuzu) / 2025 (Türk Hipertansiyon Uzlaşı Raporu)',
    source: '2023 ESH (European Society of Hypertension) Kan Basıncı Yüksekliğinin Yönetimi Kılavuzu (J Hypertens 2023;41:1874-2071) — Türk Hipertansiyon Uzlaşı Raporu 2025 (Türk Kardiyoloji Derneği / Türkiye Endokrinoloji ve Metabolizma Derneği) aynı sınıflandırma tablosunu esas alır',
    lastUpdated: '2026-07-09',
    tur: 'bilimsel-referans',
  },

  // ── Hipertansif acil durum / "vakit kaybetmeden başvurun" eşiği ──
  // ÖNEMLİ: Bu, yukarıdaki evre 3 (≥180/≥110) ile AYNI ŞEY DEĞİLDİR. Evre 3 bir tanı
  // kategorisidir; 180/120 ise hastaya yönelik "hemen sağlık kuruluşuna başvur" eylem
  // eşiğidir (AHA hasta bilgilendirme materyali). İkisini birbirine karıştırmayın.
  hipertansifAcilEsigi: {
    sistolik: 180,
    diastolik: 120,
    period: '2026 (güncel hasta yönlendirme kılavuzu)',
    source: 'American Heart Association - "When To Call 911 About High Blood Pressure" (heart.org); ACC/AHA 2025 Yüksek Kan Basıncının Önlenmesi, Tespiti, Değerlendirilmesi ve Yönetimi Kılavuzu ile uyumlu',
    lastUpdated: '2026-07-09',
    tur: 'bilimsel-referans',
  },

  // ── HbA1c ↔ tahmini ortalama glukoz (eAG) dönüşüm formülü ──
  // eAG (mg/dL) = katsayi * HbA1c(%) - sabit
  hba1cOrtalamaGlukozFormulu: {
    katsayi: 28.7,
    sabit: 46.7,
    period: '2008 (ADAG çalışması, halen ADA/NGSP tarafından referans alınır)',
    source: 'Nathan DM, Kuenen J, Borg R, ve ark.; A1c-Derived Average Glucose (ADAG) Study Group. "Translating the A1C Assay Into Estimated Average Glucose Values." Diabetes Care. 2008;31(8):1473-1478',
    lastUpdated: '2026-07-09',
    tur: 'bilimsel-referans',
  },

  // ── Diyabet / prediyabet tanı eşikleri (gebelik dışı yetişkinler) ──
  diyabetTaniEsikleri: {
    value: {
      diyabet: { a1cMin: 6.5, aclikGlukozMin: 126, tokGlukozMin: 200 },
      prediyabet: { a1cMin: 5.7, a1cMax: 6.4, aclikGlukozMin: 100, aclikGlukozMax: 125, tokGlukozMin: 140, tokGlukozMax: 199 },
      normal: { a1cMax: 5.6, aclikGlukozMax: 99, tokGlukozMax: 139 },
    },
    period: '2026',
    source: 'American Diabetes Association, "2. Diagnosis and Classification of Diabetes: Standards of Care in Diabetes—2026." Diabetes Care. 2026;49(Suppl.1):S27 (Tablo 2.1 ve 2.2)',
    lastUpdated: '2026-07-09',
    tur: 'bilimsel-referans',
  },

  // ── DSÖ günlük tuz/sodyum limiti ve sodyum→tuz katsayısı ──
  tuzSodyumLimiti: {
    gunlukTuzGramLimiti: 5,
    gunlukSodyumMgLimiti: 2000,
    sodyumdanTuzaKatsayi: 2.5,
    period: '2026 (güncelleme: 11 Mayıs 2026)',
    source: 'Dünya Sağlık Örgütü (WHO) "Sodium reduction" Fact Sheet (who.int, son güncelleme 11.05.2026); sodyum→tuz katsayısı NaCl bileşimine dayanır (~2,54, yaygın kullanımda 2,5 olarak yuvarlanır)',
    lastUpdated: '2026-07-09',
    tur: 'bilimsel-referans',
  },

  // ── Hipoglisemi eşikleri (ADA seviyelendirmesi) ──
  hipoglisemiEsikleri: {
    seviye1UyariEsigi: 70,
    seviye2CiddiEsik: 54,
    period: '2026',
    source: 'American Diabetes Association, "6. Glycemic Goals, Hypoglycemia, and Hyperglycemic Crises: Standards of Care in Diabetes—2026." Diabetes Care. 2026;49(Suppl.1)',
    lastUpdated: '2026-07-09',
    tur: 'bilimsel-referans',
  },

  // ── Hiperglisemi (çok yüksek şeker) acil durum eşiği ──
  // Not: ADA, tek bir glukoz sayısı yerine semptom + keton varlığını esas alır (bkz. DKA/HHS
  // kılavuzu); ancak CDC'nin hasta yönlendirme materyali somut bir eylem eşiği verir: kan
  // şekeri 300 mg/dL'de/üzerinde takılı kalırsa ve düşmüyorsa acil servise başvurulmalıdır.
  hiperglisemiAcilEsigi: {
    esikMgdl: 300,
    period: '2026',
    source: 'CDC (Centers for Disease Control and Prevention) - "Diabetic Ketoacidosis" ve "Manage Blood Sugar" hasta bilgilendirme sayfaları (cdc.gov): kan şekeri 300 mg/dL veya üzerinde takılı kalırsa acil servise başvurun ya da 911/112 arayın',
    lastUpdated: '2026-07-09',
    tur: 'bilimsel-referans',
  },

  // ── Ev tansiyon ölçümü (HBPM) tanı eşiği ──
  // ÖNEMLİ: Ofis ölçümü ≥140/90 mmHg eşiğine KARŞILIK GELEN ev ölçümü değeridir; yukarıdaki
  // tansiyonSiniflandirma tablosuyla karıştırılmamalı (o, ofis/poliklinik ölçümü esas alır).
  evTansiyonOlcumEsigi: {
    sistolik: 135,
    diastolik: 85,
    period: '2023 (ESH kılavuzu)',
    source: '2023 ESH (European Society of Hypertension) Kan Basıncı Yüksekliğinin Yönetimi Kılavuzu (J Hypertens 2023;41:1874-2071) — ofis ölçümünde ≥140/90 mmHg tanısına karşılık gelen ev ölçümü (HBPM) eşiği',
    lastUpdated: '2026-07-09',
    tur: 'bilimsel-referans',
  },

  // ── Glisemik hedef bandı (gebe olmayan çoğu yetişkin, ADA) ──
  glisemikHedefBandi: {
    value: { aclikMin: 80, aclikMax: 130, toklukMax: 180 },
    period: '2026',
    source: 'American Diabetes Association, "6. Glycemic Goals, Hypoglycemia, and Hyperglycemic Crises: Standards of Care in Diabetes—2026." Diabetes Care. 2026;49(Suppl.1) — çoğu gebe olmayan yetişkin için açlık/öğün öncesi 80-130 mg/dL, tokluk (öğün başlangıcından 1-2 saat sonra) <180 mg/dL hedefi',
    lastUpdated: '2026-07-09',
    tur: 'bilimsel-referans',
  },

  // ── Doğalgaz m³ → kWh dönüşümü ──
  // "ustIsilDegerKcalM3": faturalarda dönem ortalaması olarak yayınlanan değerdir, dağıtım
  // şirketine ve mevsime göre küçük farklar gösterebilir; burada tipik bir varsayılan tutulur.
  // "kcalToKwh": sabit fizik birimi çevrim katsayısıdır (1 kWh = 860,42 kcal).
  dogalgazDonusum: {
    ustIsilDegerKcalM3: 9155,
    duzeltmeKatsayisi: 1,
    kcalToKwh: 860.42,
    period: '2026 (dönem ortalaması, tipik değer)',
    source: 'EPDK / dağıtım şirketi fatura hesaplama kılavuzları (fiili üst ısıl değer dönem ve bölgeye göre değişir)',
    lastUpdated: '2026-07-07',
    tur: 'mevzuat',
  },
};

// Aşağıdaki yardımcı fonksiyonlara dokunmanız gerekmez; sayfalar veriyi
// okumak için bunları kullanır.

export function getGuncelDeger(yol) {
  return yol.split('.').reduce((current, key) => current?.[key], GUNCEL_VERILER);
}
