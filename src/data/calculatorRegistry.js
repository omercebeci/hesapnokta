// Tüm hesaplayıcıların tek merkezi kaydı: ana sayfa kartları, arama ve routing bu veriden beslenir.
// icon değerleri src/components/Icon.jsx içindeki lucide-react eşlemesine karşılık gelir.

export const categories = [
  { id: 'finans', label: 'Finans', icon: 'landmark', description: 'Kredi, vergi, kâr ve bütçe hesaplamaları' },
  { id: 'alisveris', label: 'Alışveriş', icon: 'tag', description: 'İndirim, zam ve hesap bölüşme hesaplamaları' },
  { id: 'gunluk-yasam', label: 'Günlük Yaşam', icon: 'home', description: 'Yakıt, kira, elektrik ve ev işleri hesaplamaları' },
  { id: 'saglik', label: 'Sağlık', icon: 'heart-pulse', description: 'Vücut ölçüleri ve günlük ihtiyaç hesaplamaları' },
  { id: 'matematik', label: 'Matematik', icon: 'sigma', description: 'Yüzde, oran ve geometri hesaplamaları' },
  { id: 'egitim', label: 'Eğitim', icon: 'graduation-cap', description: 'Not ortalaması ve sınav puanı hesaplamaları' },
  { id: 'zaman', label: 'Zaman', icon: 'calendar-clock', description: 'Yaş ve tarih hesaplamaları' },
];

export const calculators = [
  // ── Finans ──
  {
    id: 'kredi-hesaplama',
    title: 'Kredi Taksiti Hesaplama',
    description: 'Kredi tutarı, faiz oranı ve vadeye göre aylık taksit ve toplam maliyeti hesaplayın.',
    category: 'finans',
    icon: 'landmark',
    keywords: ['kredi', 'taksit', 'faiz', 'bsmv', 'kkdf'],
  },
  {
    id: 'kdv-hesaplama',
    title: 'KDV Hesaplama',
    description: 'Tutara KDV ekleyin veya KDV dahil tutardan matrahı ayrıştırın.',
    category: 'finans',
    icon: 'receipt',
    keywords: ['kdv', 'vergi', 'katma değer'],
  },
  {
    id: 'indirim-hesaplama',
    title: 'İndirim Hesaplama',
    description: 'İndirim oranına göre ürünün son fiyatını ve tasarruf tutarını hesaplayın.',
    category: 'alisveris',
    icon: 'tag',
    keywords: ['indirim', 'kampanya', 'yüzde'],
  },
  {
    id: 'kar-marji-hesaplama',
    title: 'Kâr Marjı Hesaplama',
    description: 'Maliyet ve satış fiyatına göre kâr, kâr marjı ve kâr yüzdesini bulun.',
    category: 'finans',
    icon: 'trending-up',
    keywords: ['kar', 'marj', 'ticaret'],
  },
  {
    id: 'kar-zarar-hesaplama',
    title: 'Kâr/Zarar Hesaplama',
    description: 'Alış ve güncel fiyata göre yatırımınızın kâr veya zararını hesaplayın.',
    category: 'finans',
    icon: 'line-chart',
    keywords: ['kar', 'zarar', 'yatırım', 'borsa'],
  },
  {
    id: 'maas-zam-hesaplama',
    title: 'Maaş Zammı Hesaplama',
    description: 'Zam oranına göre yeni maaşınızı ve aylık/yıllık farkı hesaplayın.',
    category: 'finans',
    icon: 'briefcase',
    keywords: ['maaş', 'zam', 'ücret'],
  },
  {
    id: 'kira-artis-hesaplama',
    title: 'Kira Artışı Hesaplama',
    description: 'Yasal üst sınırı da dikkate alarak yeni kira tutarını hesaplayın.',
    category: 'gunluk-yasam',
    icon: 'home',
    keywords: ['kira', 'artış', 'ev sahibi', 'kiracı'],
  },
  {
    id: 'mevduat-faizi-hesaplama',
    title: 'Mevduat Faizi Hesaplama',
    description: 'Anapara, faiz oranı ve vadeye göre net faiz getirinizi hesaplayın.',
    category: 'finans',
    icon: 'building',
    keywords: ['mevduat', 'faiz', 'stopaj', 'vade'],
  },
  {
    id: 'doviz-cevirici',
    title: 'Döviz Çevirici',
    description: 'Girdiğiniz kur üzerinden TL ve döviz arasında hızlı çevirim yapın.',
    category: 'finans',
    icon: 'arrow-left-right',
    keywords: ['döviz', 'kur', 'dolar', 'euro', 'çeviri'],
  },
  {
    id: 'butce-nabzi-hesaplama',
    title: 'Bütçe Nabzı',
    description: 'Gelir, gider ve borçlarınıza göre bütçe sağlığınızı ve risk seviyenizi görün.',
    category: 'finans',
    icon: 'activity',
    keywords: ['bütçe', 'gider', 'gelir', 'risk'],
  },
  {
    id: 'ortalama-maliyet-hesaplama',
    title: 'Ortalama Maliyet Hesaplama',
    description: 'Farklı fiyatlardan yapılan alımların ağırlıklı ortalama maliyetini bulun.',
    category: 'finans',
    icon: 'scale',
    keywords: ['ortalama', 'maliyet', 'alım'],
  },
  {
    id: 'yakit-maliyeti-hesaplama',
    title: 'Yakıt Maliyeti Hesaplama',
    description: 'Mesafe ve tüketime göre yolculuğunuzun yakıt maliyetini hesaplayın.',
    category: 'gunluk-yasam',
    icon: 'fuel',
    keywords: ['yakıt', 'benzin', 'motorin', 'yolculuk'],
  },
  {
    id: 'birikim-hedefi-hesaplama',
    title: 'Birikim Hedefi Hesaplama',
    description: 'Hedef tutara ulaşmak için gereken aylık birikim miktarını hesaplayın.',
    category: 'finans',
    icon: 'piggy-bank',
    keywords: ['birikim', 'tasarruf', 'hedef'],
  },

  // ── Sağlık ──
  {
    id: 'vucut-kitle-indeksi-hesaplama',
    title: 'Vücut Kitle İndeksi (BMI)',
    description: 'Boy ve kilonuza göre vücut kitle indeksinizi ve ideal kilo aralığınızı hesaplayın.',
    category: 'saglik',
    icon: 'weight',
    keywords: ['bmi', 'vücut kitle indeksi', 'kilo', 'boy'],
  },
  {
    id: 'kalori-ihtiyaci-hesaplama',
    title: 'Günlük Kalori İhtiyacı',
    description: 'Yaş, cinsiyet, boy, kilo ve aktivite seviyenize göre günlük kalori ihtiyacınızı hesaplayın.',
    category: 'saglik',
    icon: 'flame',
    keywords: ['kalori', 'metabolizma', 'bmr', 'diyet'],
  },

  // ── Matematik ──
  {
    id: 'yuzde-hesaplama',
    title: 'Yüzde Hesaplama',
    description: 'Bir sayının yüzdesini, yüzde oranını veya iki değer arası yüzde değişimi bulun.',
    category: 'matematik',
    icon: 'percent',
    keywords: ['yüzde', 'percent', 'oran'],
  },
  {
    id: 'oran-oranti-hesaplama',
    title: 'Oran-Orantı Hesaplama',
    description: 'Doğru veya ters orantı kurarak bilinmeyen değeri hesaplayın.',
    category: 'matematik',
    icon: 'divide',
    keywords: ['oran', 'orantı', 'doğru orantı', 'ters orantı'],
  },
  {
    id: 'alan-hacim-hesaplama',
    title: 'Alan ve Hacim Hesaplama',
    description: 'Kare, dikdörtgen, daire, üçgen alanı ile küp, silindir, küre gibi şekillerin hacmini hesaplayın.',
    category: 'matematik',
    icon: 'box',
    keywords: ['alan', 'hacim', 'geometri', 'çevre'],
  },

  // ── Zaman ──
  {
    id: 'yas-hesaplama',
    title: 'Yaş Hesaplama',
    description: 'Doğum tarihinize göre tam yaşınızı yıl, ay ve gün olarak hesaplayın.',
    category: 'zaman',
    icon: 'cake',
    keywords: ['yaş', 'doğum tarihi', 'kaç yaşında'],
  },
  {
    id: 'tarih-farki-hesaplama',
    title: 'İki Tarih Arası Fark',
    description: 'İki tarih arasındaki farkı yıl, ay, gün ve toplam gün olarak hesaplayın.',
    category: 'zaman',
    icon: 'calendar-range',
    keywords: ['tarih farkı', 'gün sayısı', 'süre'],
  },
  {
    id: 'saat-farki-hesaplama',
    title: 'İki Saat Arası Süre Hesaplama',
    description: 'Başlangıç ve bitiş saatine göre çalışma/mesai süresini hesaplayın.',
    category: 'zaman',
    icon: 'clock',
    keywords: ['mesai', 'çalışma saati', 'saat farkı', 'vardiya'],
  },
  {
    id: 'gun-sayaci-hesaplama',
    title: 'Gün Sayacı',
    description: 'Hedef bir tarihe kaç gün kaldığını (veya kaç gün geçtiğini) hesaplayın.',
    category: 'zaman',
    icon: 'hourglass',
    keywords: ['gün sayacı', 'geri sayım', 'kalan gün'],
  },

  // ── Finans (yeni) ──
  {
    id: 'brut-net-maas-hesaplama',
    title: 'Brüt-Net Maaş Hesaplama',
    description: '2026 gelir vergisi dilimleri, SGK ve damga vergisi kesintileriyle brüt maaştan net maaşa (veya tersine) ulaşın.',
    category: 'finans',
    icon: 'wallet',
    keywords: ['brüt', 'net', 'maaş', 'bordro', 'sgk', 'vergi'],
  },
  {
    id: 'kidem-ihbar-tazminati-hesaplama',
    title: 'Kıdem ve İhbar Tazminatı Hesaplama',
    description: 'Çalışma süreniz ve brüt maaşınıza göre kıdem ve ihbar tazminatı tutarınızı hesaplayın.',
    category: 'finans',
    icon: 'shield-check',
    keywords: ['kıdem', 'ihbar', 'tazminat', 'işten çıkış'],
  },
  {
    id: 'bilesik-faiz-hesaplama',
    title: 'Bileşik Faiz Hesaplama',
    description: 'Anapara, faiz oranı ve aylık katkıyla yatırımınızın gelecekteki değerini hesaplayın.',
    category: 'finans',
    icon: 'bar-chart-3',
    keywords: ['bileşik faiz', 'yatırım', 'getiri', 'büyüme'],
  },
  {
    id: 'emlak-kredisi-uygunluk-hesaplama',
    title: 'Emlak Kredisi Uygunluk Hesaplama',
    description: 'Aylık gelirinize göre alabileceğiniz maksimum konut kredisi tutarını tahmin edin.',
    category: 'finans',
    icon: 'key',
    keywords: ['emlak', 'konut kredisi', 'mortgage', 'uygunluk'],
  },

  // ── Sağlık (yeni) ──
  {
    id: 'ideal-kilo-hesaplama',
    title: 'İdeal Kilo Hesaplama',
    description: 'Boy ve cinsiyetinize göre (düzeltilmiş Broca formülü) ideal kilonuzu hesaplayın.',
    category: 'saglik',
    icon: 'target',
    keywords: ['ideal kilo', 'broca'],
  },
  {
    id: 'vucut-yag-orani-hesaplama',
    title: 'Vücut Yağ Oranı Hesaplama',
    description: 'US Navy yöntemiyle bel, boyun ve (kadınlarda) kalça ölçünüzden vücut yağ oranınızı tahmin edin.',
    category: 'saglik',
    icon: 'ruler',
    keywords: ['vücut yağ oranı', 'us navy', 'bel çevresi'],
  },
  {
    id: 'gunluk-su-ihtiyaci-hesaplama',
    title: 'Günlük Su İhtiyacı Hesaplama',
    description: 'Kilonuz ve aktivite düzeyinize göre günlük su ihtiyacınızı hesaplayın.',
    category: 'saglik',
    icon: 'droplet',
    keywords: ['su ihtiyacı', 'hidrasyon', 'su tüketimi'],
  },
  {
    id: 'gebelik-haftasi-hesaplama',
    title: 'Gebelik Haftası Hesaplama',
    description: 'Son adet tarihinize göre gebelik haftanızı ve tahmini doğum tarihinizi hesaplayın.',
    category: 'saglik',
    icon: 'baby',
    keywords: ['gebelik', 'hamilelik', 'doğum tarihi'],
  },

  // ── Matematik (yeni) ──
  {
    id: 'ortalama-hesaplama',
    title: 'Ortalama Hesaplama',
    description: 'Bir grup sayının basit ya da ağırlıklı (not ortalaması gibi) ortalamasını hesaplayın.',
    category: 'matematik',
    icon: 'calculator',
    keywords: ['ortalama', 'not ortalaması', 'ağırlıklı ortalama'],
  },
  {
    id: 'kombinasyon-permutasyon-hesaplama',
    title: 'Kombinasyon ve Permütasyon Hesaplama',
    description: 'n elemanlı bir kümeden r elemanlı kombinasyon veya permütasyon sayısını hesaplayın.',
    category: 'matematik',
    icon: 'shuffle',
    keywords: ['kombinasyon', 'permütasyon', 'olasılık'],
  },
  {
    id: 'birim-cevirici',
    title: 'Birim Çevirici',
    description: 'Uzunluk, ağırlık, sıcaklık ve hız birimleri arasında hızlı çevirim yapın.',
    category: 'matematik',
    icon: 'refresh-cw',
    keywords: ['birim çevirici', 'metre', 'kilogram', 'fahrenheit', 'santigrat'],
  },

  // ── Finans / Alışveriş (yeni) ──
  {
    id: 'kredi-karti-asgari-odeme-hesaplama',
    title: 'Kredi Kartı Asgari Ödeme ve Gecikme Faizi Hesaplama',
    description: 'Kart limitinize göre asgari ödeme tutarını ve gecikme durumunda işleyecek faizi hesaplayın.',
    category: 'finans',
    icon: 'credit-card',
    keywords: ['kredi kartı', 'asgari ödeme', 'gecikme faizi', 'temerrüt faizi'],
  },
  {
    id: 'enflasyon-etkisi-hesaplama',
    title: 'Enflasyon Etkisi Hesaplama',
    description: 'Bugünkü bir tutarın belirli bir enflasyon oranıyla yıllar sonraki alım gücünü hesaplayın.',
    category: 'finans',
    icon: 'trending-down',
    keywords: ['enflasyon', 'alım gücü', 'satın alma gücü'],
  },
  {
    id: 'taksit-karsilastirma-hesaplama',
    title: 'Taksit Karşılaştırma Hesaplama',
    description: 'Peşin fiyat ile taksitli toplam fiyatı karşılaştırıp taksitlendirmenin gerçek maliyetini görün.',
    category: 'finans',
    icon: 'git-compare',
    keywords: ['taksit', 'peşin', 'karşılaştırma', 'vade farkı'],
  },
  {
    id: 'zam-orani-hesaplama',
    title: 'Zam Oranı Hesaplama',
    description: 'Eski ve yeni fiyata göre zam ya da indirim oranını ve tutarını hesaplayın.',
    category: 'alisveris',
    icon: 'arrow-up-right',
    keywords: ['zam oranı', 'fiyat artışı', 'fiyat değişimi'],
  },
  {
    id: 'bahsis-hesap-bolusme-hesaplama',
    title: 'Bahşiş ve Hesap Bölüşme Hesaplama',
    description: 'Restoran hesabına bahşiş ekleyip kişi sayısına göre kişi başı ödemeyi hesaplayın.',
    category: 'alisveris',
    icon: 'users',
    keywords: ['bahşiş', 'hesap bölüşme', 'restoran'],
  },
  {
    id: 'indirim-ustune-indirim-hesaplama',
    title: 'İndirim Üstüne İndirim Hesaplama',
    description: 'Art arda uygulanan iki indirimin (ör. %20 + %10) gerçekte kaç ettiğini hesaplayın.',
    category: 'alisveris',
    icon: 'tags',
    keywords: ['indirim üstüne indirim', 'kademeli indirim', 'kampanya'],
  },

  // ── Günlük Yaşam (yeni) ──
  {
    id: 'elektrik-tuketimi-hesaplama',
    title: 'Elektrik Tüketimi Hesaplama',
    description: 'Cihazın watt gücü ve günlük kullanım saatine göre aylık elektrik maliyetini hesaplayın.',
    category: 'gunluk-yasam',
    icon: 'zap',
    keywords: ['elektrik tüketimi', 'watt', 'kwh', 'fatura'],
  },
  {
    id: 'yolculuk-yakit-payi-hesaplama',
    title: 'Yolculuk Yakıt Payı Hesaplama',
    description: 'Ortak bir yolculuğun toplam yakıt maliyetini araçtaki kişi sayısına bölerek kişi başı payı hesaplayın.',
    category: 'gunluk-yasam',
    icon: 'car',
    keywords: ['yakıt payı', 'yol arkadaşı', 'araç paylaşımı'],
  },
  {
    id: 'oda-alani-malzeme-hesaplama',
    title: 'Oda Alanı ve Malzeme İhtiyacı Hesaplama',
    description: 'Oda ölçülerinize göre zemin alanını (halı/döşeme) ve duvar boyası ihtiyacını hesaplayın.',
    category: 'gunluk-yasam',
    icon: 'paintbrush',
    keywords: ['oda alanı', 'boya hesaplama', 'halı', 'döşeme'],
  },

  // ── Sağlık (yeni) ──
  {
    id: 'uyku-saati-hesaplama',
    title: 'Uyku Saati Hesaplama',
    description: '90 dakikalık uyku döngülerine göre ideal yatma ya da kalkış saatinizi hesaplayın.',
    category: 'saglik',
    icon: 'bed',
    keywords: ['uyku döngüsü', 'yatma saati', 'kalkış saati'],
  },
  {
    id: 'kafein-takibi-hesaplama',
    title: 'Kafein Takibi Hesaplama',
    description: 'İçtiğiniz kahve, çay ve enerji içeceklerine göre günlük toplam kafein alımınızı ve güvenli sınıra göre durumunuzu hesaplayın.',
    category: 'saglik',
    icon: 'coffee',
    keywords: ['kafein', 'kahve', 'enerji içeceği', 'günlük kafein sınırı'],
  },
  {
    id: 'adim-kalori-donusumu-hesaplama',
    title: 'Adım-Kalori Dönüşümü Hesaplama',
    description: 'Attığınız adım sayısına göre yaklaşık yürüme mesafenizi ve yaktığınız kaloriyi hesaplayın.',
    category: 'saglik',
    icon: 'footprints',
    keywords: ['adım sayısı', 'kalori', 'yürüyüş', 'mesafe'],
  },

  // ── Eğitim (yeni) ──
  {
    id: 'ders-notu-ortalamasi-hesaplama',
    title: 'Ders Notu Ortalaması Hesaplama',
    description: 'Vize ve final ağırlıklarına göre ders ortalamanızı ya da geçmek için finalden gereken minimum notu hesaplayın.',
    category: 'egitim',
    icon: 'graduation-cap',
    keywords: ['not ortalaması', 'vize final', 'geçme notu'],
  },
  {
    id: 'sinav-puani-hesaplama',
    title: 'Sınav Puanı Hesaplama',
    description: 'Doğru, yanlış ve boş sayınıza göre net puanınızı ve 100 üzerinden skorunuzu hesaplayın.',
    category: 'egitim',
    icon: 'clipboard-check',
    keywords: ['sınav neti', 'doğru yanlış', 'test puanı'],
  },
];

export function getCalculatorById(id) {
  return calculators.find((item) => item.id === id);
}

export function getCategoryById(id) {
  return categories.find((item) => item.id === id);
}
