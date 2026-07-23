// Her hesaplayıcı için SEO/landing page içeriği: tanıtım metni, hesaplama yöntemi açıklaması ve SSS.
// CalculatorLayout bu veriyi merkezi olarak okuyup her sayfanın altına render eder.

export const calculatorContent = {
  // ── Finans ──
  'kredi-hesaplama': {
    about: 'Kredi hesaplama aracı, banka veya finans kuruluşundan çekmeyi düşündüğünüz bir kredinin aylık taksitini ve toplam maliyetini önceden görmenizi sağlar. Farklı vade ve faiz senaryolarını deneyerek bütçenize en uygun seçeneği bulabilirsiniz.',
    method: 'Hesaplama, sabit taksitli anüite yöntemini kullanır: her ay aynı tutarda ödeme yapılır, ancak ödemenin faiz ve anapara payı zamanla değişir. Faiz üzerinden alınan BSMV ve KKDF gibi yasal kesintiler de aylık taksite dahil edilir.',
    examples: [
      {
        title: '100.000 TL, 12 ay vade, %2,5 aylık faiz',
        rows: [
          { label: 'Aylık taksit', value: '10.196,72 TL' },
          { label: 'Toplam ödeme', value: '122.360,63 TL' },
          { label: 'Toplam faiz + BSMV/KKDF', value: '22.360,63 TL' },
        ],
      },
      {
        title: '500.000 TL, 60 ay vade, %2 aylık faiz',
        rows: [
          { label: 'Aylık taksit', value: '16.547,17 TL' },
          { label: 'Toplam ödeme', value: '992.830,25 TL' },
          { label: 'Toplam faiz + BSMV/KKDF', value: '492.830,25 TL' },
        ],
      },
    ],
    faq: [
      { q: 'Taksit tutarı neden banka teklifinden farklı çıkabilir?', a: 'Bankalar dosya masrafı, hayat sigortası gibi ek kalemler uygulayabilir; bu araç yalnızca anapara, faiz ve yasal kesintileri (BSMV/KKDF) esas alır.' },
      { q: 'BSMV ve KKDF nedir?', a: 'İkisi de kredinin faiz tutarı üzerinden hesaplanan ve bankaların tahsil edip devlete aktardığı yasal kesintilerdir.' },
      { q: 'Erken kapatma bu hesaba dahil mi?', a: 'Hayır, bu araç kredinin tüm vade boyunca düzenli ödenmesini varsayar; erken kapatmada kalan faiz farklı hesaplanır.' },
      { q: 'Vade uzadıkça toplam faiz neden bu kadar artıyor?', a: 'Vade uzadıkça anapara daha yavaş kapandığı için her ay faiz işleyen bakiye daha uzun süre yüksek kalır; aylık taksit düşse de toplamda ödenen faiz belirgin şekilde artar.' },
      { q: 'Faiz oranını yıllık olarak biliyorsam ne yapmalıyım?', a: 'Yıllık oranı 12\'ye bölerek yaklaşık aylık oranı bulabilirsiniz; ancak bankalar genellikle aylık oranı doğrudan ilan eder, kampanya sayfasındaki "aylık" ibaresini kontrol edin.' },
      { q: 'Değişken faizli krediler için bu araç uygun mu?', a: 'Hayır, bu araç sabit faizli krediler için tasarlanmıştır; değişken faizde taksitler dönem dönem güncellenir ve bu hesaplamadan sapabilir.' },
      { q: 'Taksit sayısını değiştirince taksit tutarı neden orantısız değişiyor?', a: 'Anüite formülü doğrusal değildir; vade uzadıkça taksit azalır ama toplam faiz artar, bu yüzden ilişki basit bir bölme gibi çalışmaz.' },
      { q: 'Kredi notu (findeks) bu hesaba dahil mi?', a: 'Hayır, bu araç yalnızca girdiğiniz tutar, vade ve faiz oranına göre hesaplama yapar; bankanın size sunacağı gerçek oran kredi notunuza göre değişebilir.' },
    ],
  },
  'kdv-hesaplama': {
    about: 'KDV hesaplama aracı, bir tutara katma değer vergisi eklemek ya da KDV dahil bir tutarın içinden vergiyi ayrıştırmak için kullanılır. Fatura kontrolü, fiyatlandırma veya alışveriş öncesi hızlı hesap yapmak isteyenler için pratik bir çözümdür.',
    method: '"KDV hariç" modunda girilen tutara, seçtiğiniz oranda vergi eklenir (tutar × oran). "KDV dahil" modunda ise toplam tutarın içinden matrah, tutar ÷ (1 + oran) formülüyle geri hesaplanır ve aradaki fark KDV tutarını verir.',
    examples: [
      {
        title: 'KDV hariç 1.000 TL, genel oran %20',
        rows: [
          { label: 'KDV tutarı', value: '200 TL' },
          { label: 'KDV dahil toplam', value: '1.200 TL' },
        ],
      },
      {
        title: 'KDV dahil 1.200 TL, genel oran %20',
        rows: [
          { label: 'KDV hariç tutar (matrah)', value: '1.000 TL' },
          { label: 'KDV tutarı', value: '200 TL' },
        ],
      },
      {
        title: 'Temel gıda ürünü, KDV hariç 500 TL, indirimli oran %1',
        rows: [
          { label: 'KDV tutarı', value: '5 TL' },
          { label: 'KDV dahil toplam', value: '505 TL' },
        ],
      },
    ],
    faq: [
      { q: 'Türkiye\'de yaygın KDV oranları nelerdir?', a: 'Genel oran %20\'dir; bazı temel gıda ve hizmetlerde indirimli oranlar (%1, %10) uygulanabilir. Aracın varsayılan oranını ürününüze göre değiştirebilirsiniz.' },
      { q: 'KDV dahil ve KDV hariç fiyat arasındaki fark nedir?', a: 'KDV hariç fiyat, verginin eklenmediği net tutardır; KDV dahil fiyat ise vergiyle birlikte müşteriden tahsil edilen toplam tutardır.' },
      { q: 'Bu araç resmi fatura kesmek için kullanılabilir mi?', a: 'Hayır, yalnızca hızlı bir ön hesaplama sunar; resmi belgeler için muhasebe/e-fatura sisteminizin hesaplamaları esas alınmalıdır.' },
      { q: '1000 TL\'ye KDV eklersem ne kadar tutar?', a: '%20 genel oranla 1.000 TL\'ye 200 TL KDV eklenir, KDV dahil toplam 1.200 TL olur; farklı bir oran uyguluyorsanız aracın oran alanını değiştirmeniz yeterlidir.' },
      { q: 'KDV dahil fiyattan matrahı bulmak için tutarı neden 1,20\'ye bölüyoruz?', a: '%20 oranında, KDV dahil tutar matrahın 1,20 katıdır (matrah + matrahın %20\'si); bu yüzden matrahı bulmak için KDV dahil tutar 1,20\'ye bölünür, %20 ile çarpılmaz.' },
      { q: 'e-Fatura ve e-Arşiv fatura kesimlerinde bu araç kullanılabilir mi?', a: 'Bu araç yalnızca hızlı bir ön hesaplama sunar; resmi fatura kesiminde kullandığınız muhasebe/e-fatura yazılımının hesapladığı tutarlar esas alınmalıdır.' },
      { q: 'Farklı KDV oranlarına tabi ürünleri aynı fişte nasıl hesaplarım?', a: 'Her ürün grubunu (ör. %1, %10, %20) ayrı ayrı bu araca girip sonuçları toplamanız gerekir; tek bir işlemde karışık oranlar hesaplanamaz.' },
      { q: 'Hizmet faturalarında (kira, danışmanlık vb.) KDV oranı farklı mı?', a: 'Çoğu hizmette genel oran %20 uygulanır, ancak konut kirası gibi bazı işlemler KDV\'den istisna olabilir; işleminize özgü oranı vergi dairesi veya mali müşavirinizden teyit etmeniz önerilir.' },
    ],
  },
  'indirim-hesaplama': {
    about: 'İndirim hesaplama aracı, kampanyalı bir üründe yüzde kaç indirim uygulandığında son fiyatın ne olacağını ve ne kadar tasarruf edeceğinizi gösterir. Alışveriş öncesi kampanyaları karşılaştırmak için kullanışlıdır.',
    method: 'İndirim tutarı, ürün fiyatının girilen indirim oranıyla çarpılmasıyla bulunur (fiyat × oran ÷ 100). İndirimli fiyat ise bu tutarın orijinal fiyattan çıkarılmasıyla elde edilir.',
    faq: [
      { q: 'Art arda iki indirim (ör. %20 + %10) nasıl hesaplanır?', a: 'İndirimler ayrı ayrı uygulanır: önce ilk oranla yeni fiyat bulunur, ardından ikinci oran bu yeni fiyat üzerinden hesaplanır; iki oran toplanmaz.' },
      { q: 'Kupon kodu indirimleri bu hesaba dahil mi?', a: 'Hayır, bu araç yalnızca girdiğiniz tek bir indirim oranını hesaplar; kupon veya ek kampanya şartlarını ayrıca değerlendirmeniz gerekir.' },
      { q: 'İndirim oranı yerine indirim tutarını biliyorsam ne yapmalıyım?', a: 'Tutarı fiyata bölüp 100 ile çarparak oranı bulabilir, ardından bu oranı araca girebilirsiniz.' },
    ],
  },
  'kar-marji-hesaplama': {
    about: 'Kâr marjı hesaplama aracı, bir ürünü satarken maliyetinize göre ne kadar kâr elde ettiğinizi ve bu kârın hem satış fiyatına hem de maliyete oranını görmenizi sağlar. Küçük işletme sahipleri ve satıcılar için fiyatlandırma kararlarında yol gösterir.',
    method: 'Kâr, satış fiyatı ile maliyet arasındaki farktır. Kâr marjı, kârın satış fiyatına oranı (kâr ÷ satış fiyatı × 100); kâr yüzdesi (markup) ise kârın maliyete oranıdır (kâr ÷ maliyet × 100). Bu iki oran genellikle karıştırılır ama farklı sonuç verir.',
    faq: [
      { q: 'Kâr marjı ile kâr yüzdesi (markup) neden farklı çıkıyor?', a: 'Kâr marjı satış fiyatını, markup ise maliyeti referans alır; aynı kâr tutarı için payda farklı olduğundan iki oran birbirinden farklıdır.' },
      { q: 'Hangi oranı kullanmalıyım?', a: 'Perakendede genellikle kâr marjı (satışa göre), toptan/üretimde ise markup (maliyete göre) tercih edilir; sektör alışkanlığınıza göre karar verebilirsiniz.' },
      { q: 'Adet girmek zorunlu mu?', a: 'Hayır, adet varsayılan olarak 1\'dir; toplu satışlarda toplam kâr ve ciroyu görmek için adedi güncelleyebilirsiniz.' },
    ],
  },
  'kar-zarar-hesaplama': {
    about: 'Kâr/zarar hesaplama aracı, hisse senedi, döviz veya başka bir yatırım aracını aldığınız fiyat ile güncel fiyat arasındaki farka göre ne kadar kazandığınızı ya da kaybettiğinizi gösterir.',
    method: 'Toplam yatırılan tutar (alış fiyatı × miktar) ile güncel değer (güncel fiyat × miktar) karşılaştırılır; aradaki fark kâr veya zararı, bu farkın yatırılan tutara oranı ise getiri yüzdesini verir.',
    faq: [
      { q: 'Komisyon ve işlem ücretleri hesaba dahil mi?', a: 'Hayır, bu araç yalnızca alış-satış fiyat farkını hesaplar; aracı kurum komisyonu, vergi gibi maliyetler dahil değildir.' },
      { q: 'Negatif sonuç ne anlama gelir?', a: 'Güncel fiyat alış fiyatının altındaysa sonuç zarar olarak gösterilir; bu durumda getiri yüzdesi de negatif çıkar.' },
      { q: 'Farklı zamanlarda yapılan alımlar için de kullanılabilir mi?', a: 'Bu araç tek bir alış fiyatı varsayar; birden fazla alımın ortalama maliyetini bulmak için Ortalama Maliyet Hesaplama aracını kullanabilirsiniz.' },
    ],
  },
  'maas-zam-hesaplama': {
    about: 'Maaş zammı hesaplama aracı, belirli bir zam oranının maaşınıza aylık ve yıllık olarak ne kadar yansıyacağını gösterir. Zam görüşmeleri öncesi veya sonrası bütçe planlaması için kullanışlıdır.',
    method: 'Zam tutarı, mevcut maaşın girilen zam oranıyla çarpılmasıyla bulunur (maaş × oran ÷ 100). Yeni maaş bu tutarın eklenmesiyle, yıllık fark ise aylık zam tutarının 12 ile çarpılmasıyla hesaplanır.',
    faq: [
      { q: 'Vergi dilimi değişikliği bu hesaba dahil mi?', a: 'Hayır, bu araç brüt/net ayrımı yapmadan basit bir zam hesabı sunar; net maaşınızdaki gerçek değişim için Brüt-Net Maaş Hesaplama aracını kullanabilirsiniz.' },
      { q: 'Enflasyon oranıyla karşılaştırma yapabilir miyim?', a: 'Zam oranını enflasyon oranıyla aynı girerek reel (enflasyondan arındırılmış) zam olup olmadığını yaklaşık olarak değerlendirebilirsiniz.' },
      { q: 'Yıllık fark neden aylık farkın tam 12 katı?', a: 'Hesap, zam oranının yıl boyunca sabit kaldığını varsayar; yıl içinde ek bir zam olursa yıllık fark ayrıca hesaplanmalıdır.' },
    ],
  },
  'kira-artis-hesaplama': {
    about: 'Kira artışı hesaplama aracı, ev sahibi veya kiracıların yasal üst sınırı da göz önünde bulundurarak yeni kira tutarını hesaplamasına yardımcı olur.',
    method: 'İstenen artış oranı ile yasal üst sınır karşılaştırılır ve ikisinin küçük olanı uygulanır. Yeni kira, mevcut kiranın bu oranla çarpılıp eklenmesiyle bulunur; aylık ve yıllık fark ayrıca gösterilir.',
    examples: [
      {
        title: 'Mevcut kira 10.000 TL, istenen artış %40, yasal tavan %32,03 (Temmuz 2026)',
        intro: 'İstenen oran tavanın üzerinde olduğu için tavan uygulanır.',
        rows: [
          { label: 'Uygulanan oran', value: '%32,03' },
          { label: 'Yeni kira', value: '13.203 TL' },
          { label: 'Aylık fark', value: '+3.203 TL' },
          { label: 'Yıllık fark', value: '+38.436 TL' },
        ],
      },
      {
        title: 'Mevcut kira 20.000 TL, istenen artış %25 (tavanın altında)',
        rows: [
          { label: 'Uygulanan oran', value: '%25' },
          { label: 'Yeni kira', value: '25.000 TL' },
          { label: 'Aylık fark', value: '+5.000 TL' },
          { label: 'Yıllık fark', value: '+60.000 TL' },
        ],
      },
      {
        title: 'Mevcut kira 15.000 TL, istenen artış %50, yasal tavan girilmedi',
        intro: 'Tavan alanı boş bırakıldığında sınır uygulanmaz.',
        rows: [
          { label: 'Uygulanan oran', value: '%50' },
          { label: 'Yeni kira', value: '22.500 TL' },
          { label: 'Aylık fark', value: '+7.500 TL' },
          { label: 'Yıllık fark', value: '+90.000 TL' },
        ],
      },
    ],
    faq: [
      { q: 'Yasal üst sınırı boş bırakırsam ne olur?', a: 'Bu durumda sınır uygulanmaz ve istediğiniz artış oranı doğrudan hesaplanır.' },
      { q: 'Güncel yasal kira artış sınırı nedir?', a: 'Bu oran mevzuat değişikliklerine göre güncellenir; hesaplama öncesi güncel oranı kendiniz teyit edip "yasal üst sınır" alanına girmeniz gerekir.' },
      { q: 'Kira sözleşmesi süresi hesaba dahil mi?', a: 'Hayır, bu araç yalnızca oran karşılaştırması yapar; sözleşmenizin yenileme tarihi ve şartlarını ayrıca kontrol etmelisiniz.' },
      { q: 'Kira artış sınırı tüm kiracılara mı uygulanır?', a: 'Sınır, konut kiraları için yasayla belirlenen bir üst sınırdır; iş yeri kiraları ve bazı özel durumlar farklı kurallara tabi olabilir, sözleşmenizin türünü kontrol etmeniz önerilir.' },
      { q: 'Ev sahibi tavanın üzerinde artış isterse ne yapmalıyım?', a: 'Yasal tavanın üzerindeki bir talep kiracıyı bağlamaz; anlaşmazlık durumunda sulh hukuk mahkemesine başvurulabilir, ancak önce tarafların uzlaşması genellikle daha hızlı bir çözümdür.' },
      { q: '5 yılını dolduran kiralarda farklı bir kural var mı?', a: 'Evet, 5 yılını dolduran kira sözleşmelerinde taraflardan biri mahkemeden veya bilirkişiden rayiç bedele göre yeni bir kira tespiti isteyebilir; bu durumda TÜFE tavanı değil, emsal kira bedeli esas alınabilir.' },
      { q: 'Kira artışı hangi tarihte uygulanır?', a: 'Artış, kira sözleşmenizin yıllık yenileme tarihinde (genellikle sözleşmenin başlangıç tarihinin yıl dönümünde) geçerli olur; ay ortasında keyfi bir tarihte uygulanamaz.' },
      { q: 'Zam oranını enflasyonla mı yoksa TÜFE ile mi karşılaştırmalıyım?', a: 'Yasal tavan TÜFE\'nin (tüketici fiyat endeksi) 12 aylık ortalamasına göre belirlenir; günlük dilde kullanılan "enflasyon" haber başlıklarındaki yıllık TÜFE değişimiyle karıştırılmamalıdır.' },
    ],
  },
  'mevduat-faizi-hesaplama': {
    about: 'Mevduat faizi hesaplama aracı, bankaya yatırdığınız bir anaparanın belirli bir vade ve faiz oranında ne kadar net getiri sağlayacağını, stopaj kesintisi düşüldükten sonra gösterir.',
    method: 'Basit faiz yöntemi kullanılır: brüt faiz, anapara × yıllık oran × (vade günü ÷ 365) formülüyle hesaplanır (faiz üzerinden tekrar faiz işlemez). Bu tutardan stopaj oranına göre vergi kesilir; kalan net faiz, vade sonunda anaparaya eklenerek toplam tutarı oluşturur.',
    faq: [
      { q: 'Stopaj oranı neden %5 varsayılan?', a: 'TL mevduatlarda yaygın uygulanan stopaj oranı budur, ancak vade ve mevzuata göre değişebilir; güncel oranı bankanızdan teyit edip alanı güncelleyebilirsiniz.' },
      { q: 'Vadeden önce bozdurursam bu hesap geçerli mi?', a: 'Hayır, vade bozumunda bankalar genellikle daha düşük bir faiz oranı uygular; bu araç tam vade sonu senaryosunu esas alır.' },
      { q: 'Bileşik faizli (vadesi uzatılan) mevduatlar için uygun mu?', a: 'Bu araç tek dönemlik basit faiz hesaplar; birden fazla vade döngüsü için her dönemi ayrı ayrı hesaplamanız gerekir.' },
    ],
  },
  'doviz-cevirici': {
    about: 'Döviz çevirici, elinizdeki güncel kur bilgisiyle TL ve yabancı para birimi arasında hızlı çevirim yapmanızı sağlar. Seyahat, alışveriş veya yurt dışı ödeme öncesi hızlı hesap için kullanışlıdır.',
    method: 'Girdiğiniz kur (1 birim dövizin TL karşılığı) ile tutar çarpılır veya bölünür: TL → Döviz yönünde tutar kura bölünür, Döviz → TL yönünde ise kurla çarpılır.',
    faq: [
      { q: 'Bu araç güncel döviz kurunu otomatik çeker mi?', a: 'Hayır, canlı kur servisi kullanılmaz; güncel kuru bankanızdan veya döviz bürosundan öğrenip elle girmeniz gerekir.' },
      { q: 'Banka kuru ile piyasa kuru neden farklı?', a: 'Bankalar ve döviz büroları alış-satış kuru arasına bir marj (kâr payı) koyar; bu yüzden işlem yaptığınız kuruma göre sonuç değişebilir.' },
      { q: 'Birden fazla döviz cinsi için kullanılabilir mi?', a: 'Evet, "döviz kodu" alanına istediğiniz kısaltmayı (USD, EUR, GBP vb.) yazıp ilgili kuru girerek herhangi bir para birimiyle çevirim yapabilirsiniz.' },
    ],
  },
  'butce-nabzi-hesaplama': {
    about: 'Bütçe Nabzı, aylık gelir, gider, borç ve birikiminizi bir arada değerlendirerek genel bütçe sağlığınızı ve risk seviyenizi gösteren bir özet aracıdır.',
    method: 'Serbest nakit, gelirden gider/borç/birikimin çıkarılmasıyla bulunur. Gider, borç ve birikimin gelire oranları ayrı ayrı hesaplanır; borç oranı %35\'i geçtiğinde veya serbest nakit negatif olduğunda risk seviyesi "yüksek" olarak işaretlenir.',
    faq: [
      { q: 'Risk seviyesi nasıl belirleniyor?', a: 'Borç oranı %35 üzerindeyse veya serbest nakit eksideyse risk "yüksek"; borç oranı %20 üzerinde ya da birikim oranı %15 altındaysa "orta", aksi halde "düşük" olarak gösterilir.' },
      { q: 'Düzensiz gelirlerde bu araç nasıl kullanılır?', a: 'Ortalama aylık gelirinizi (son birkaç ayın ortalaması) girerek daha gerçekçi bir sonuç elde edebilirsiniz.' },
      { q: 'Birikim oranını nasıl artırabilirim?', a: 'Aracın önerisi genellikle giderleri gözden geçirmek ve birikim oranını kademeli olarak %15 üzerine taşımaktır; bu, acil durum fonu oluşturmaya yardımcı olur.' },
    ],
  },
  'ortalama-maliyet-hesaplama': {
    about: 'Ortalama maliyet hesaplama aracı, aynı ürünü (hisse senedi, döviz, emtia vb.) farklı zamanlarda farklı fiyattan aldığınızda ağırlıklı ortalama maliyetinizi bulmanızı sağlar.',
    method: 'Her alım için miktar ve birim fiyat girilir; toplam maliyet (miktar × fiyat toplamı) toplam miktara bölünerek ağırlıklı ortalama maliyet bulunur. Bu, basit ortalamadan farklı olarak büyük miktarlı alımlara daha fazla ağırlık verir.',
    faq: [
      { q: 'Kaç alım kalemi ekleyebilirim?', a: 'Sınır yoktur; "Alım ekle" butonuyla istediğiniz kadar satır ekleyip her birinin miktar ve fiyatını girebilirsiniz.' },
      { q: 'Satış işlemlerini de bu araca ekleyebilir miyim?', a: 'Hayır, bu araç yalnızca alımların ortalama maliyetini hesaplar; satışları ayrı takip etmeniz gerekir.' },
      { q: 'Ortalama maliyet neden yatırımcılar için önemli?', a: 'Ortalama maliyeti bilmek, mevcut piyasa fiyatına göre kârda mı zararda mı olduğunuzu anlamanızı ve maliyet düşürme (ör. "averaj yapma") kararlarını değerlendirmenizi sağlar.' },
    ],
  },
  'yakit-maliyeti-hesaplama': {
    about: 'Yakıt maliyeti hesaplama aracı, planladığınız bir yolculuğun aracınızın ortalama tüketimine göre ne kadar yakıt masrafı çıkaracağını önceden tahmin etmenizi sağlar.',
    method: 'Gereken yakıt miktarı, mesafenin tüketimle çarpılıp 100\'e bölünmesiyle bulunur (100 km\'de tüketilen litre esas alınır). Bu miktar yakıt fiyatıyla çarpılarak toplam maliyet, mesafeye bölünerek de km başı maliyet hesaplanır.',
    faq: [
      { q: 'Şehir içi ve şehir dışı tüketim farklıysa ne yapmalıyım?', a: 'Yolculuğunuzun büyük kısmını temsil eden ortalama tüketim değerini (araç kullanım kılavuzu veya geçmiş verileriniz) girmeniz yeterlidir.' },
      { q: 'Elektrikli araçlar için kullanılabilir mi?', a: 'Evet, "tüketim" alanına aracınızın 100 km\'de harcadığı kWh değerini, "yakıt fiyatı" alanına ise kWh birim fiyatını girerek yaklaşık bir şarj maliyeti hesaplayabilirsiniz.' },
      { q: 'Trafik ve yol tipi sonucu etkiler mi?', a: 'Bu araç sabit bir ortalama tüketim varsayar; yoğun trafik veya dağlık arazi gerçek tüketimi artırabileceğinden sonuç yaklaşık kalır.' },
    ],
  },
  'birikim-hedefi-hesaplama': {
    about: 'Birikim hedefi hesaplama aracı, belirli bir tutara ulaşmak için ne kadar süre gerektiğini ya da belirli bir sürede hedefe ulaşmak için ne kadar aylık birikim yapmanız gerektiğini gösterir.',
    method: '"Aylık gereken tutar" modunda, kalan tutar hedeflenen ay sayısına bölünür. "Hedefe ulaşma süresi" modunda ise mevcut birikiminiz her ay sabit katkı ve (varsa) getiri oranıyla büyütülerek hedefe ulaşana kadar simüle edilir.',
    faq: [
      { q: 'Getiri oranını 0 bırakırsam ne olur?', a: 'Birikiminiz faizsiz/getirisiz olarak sadece aylık katkılarla büyür; bu, yastık altı veya vadesiz hesap gibi senaryoları temsil eder.' },
      { q: 'Hedefe hiç ulaşamıyorsam ne gösterilir?', a: 'Aylık katkı ve getiri hedefe ulaşmak için yetersizse araç "100 yıldan uzun" gibi bir uyarı gösterir; katkı tutarını veya getiri varsayımını artırmanız gerekebilir.' },
      { q: 'Enflasyon hesaba katılıyor mu?', a: 'Hayır, tüm tutarlar bugünün parasal değeriyle hesaplanır; enflasyonu yansıtmak isterseniz getiri oranına reel (enflasyon üstü) bir oran girebilirsiniz.' },
    ],
  },
  'brut-net-maas-hesaplama': {
    about: 'Brüt-net maaş hesaplama aracı, 2026 yılı gelir vergisi dilimleri, SGK primi ve damga vergisi kesintilerini uygulayarak brüt maaştan net maaşa, ya da net maaştan brüt maaşa ulaşmanızı sağlar. İş görüşmelerinde teklif değerlendirmek veya bordronuzu kontrol etmek için kullanışlıdır.',
    method: 'Brüt maaştan önce %14 SGK ve %1 işsizlik sigortası kesintisi düşülür; kalan tutar üzerinden 2026 dilimlerine göre kümülatif gelir vergisi ve binde 7,59 damga vergisi hesaplanır. 2026 asgari ücrete isabet eden gelir ve damga vergisi tutarı istisna olarak düşülür. Net→brüt yönünde ise bu formülü tersine çeviren bir arama algoritması kullanılır.',
    examples: [
      {
        title: '2026 asgari ücret: brüt 33.030 TL',
        intro: 'Asgari ücrete isabet eden gelir ve damga vergisi tamamen istisna olduğundan hiç vergi kesilmez.',
        rows: [
          { label: 'SGK kesintisi (%14)', value: '4.624,20 TL' },
          { label: 'İşsizlik sigortası (%1)', value: '330,30 TL' },
          { label: 'Gelir + damga vergisi', value: '0 TL (istisna)' },
          { label: 'Net maaş', value: '28.075,50 TL' },
        ],
      },
      {
        title: 'Brüt 50.000 TL',
        rows: [
          { label: 'SGK kesintisi', value: '7.000 TL' },
          { label: 'İşsizlik sigortası', value: '500 TL' },
          { label: 'Gelir vergisi', value: '2.163,68 TL' },
          { label: 'Damga vergisi', value: '128,80 TL' },
          { label: 'Net maaş', value: '40.207,52 TL' },
        ],
      },
      {
        title: 'Brüt 100.000 TL',
        rows: [
          { label: 'SGK kesintisi', value: '14.000 TL' },
          { label: 'İşsizlik sigortası', value: '1.000 TL' },
          { label: 'Gelir vergisi', value: '8.538,67 TL' },
          { label: 'Damga vergisi', value: '508,30 TL' },
          { label: 'Net maaş', value: '75.953,02 TL' },
        ],
      },
    ],
    faq: [
      { q: 'Bu hesaplama neden yaklaşık kabul edilmeli?', a: 'Hesap, ilgili ayı yılın ilk ayı kabul eder; gerçek bordroda yıl içindeki önceki ayların kümülatif vergi matrahı da dikkate alınır ve dilim geçişleri farklı olabilir.' },
      { q: 'AGİ (asgari geçim indirimi) hâlâ uygulanıyor mu?', a: 'Hayır, 2022\'den itibaren AGİ kaldırılmış, yerine asgari ücrete isabet eden gelir/damga vergisinin doğrudan istisna edilmesi uygulaması getirilmiştir; bu araç güncel istisna yöntemini kullanır.' },
      { q: 'İkramiye ve prim bu hesaba dahil mi?', a: 'Hayır, yalnızca temel brüt/net maaş hesaplanır; ikramiye, prim veya yan haklar ayrıca ve genellikle farklı vergilendirme kurallarıyla hesaplanmalıdır.' },
      { q: '30.000 TL net maaş almak için brüt kaç TL olmalı?', a: 'Bu araçta "Net → Brüt" modunu seçip 30.000 TL\'yi girerek kesin karşılığı görebilirsiniz; kesintiler doğrusal olmadığından basit bir çarpan ile tahmin sağlıklı sonuç vermez.' },
      { q: 'Yılın ilerleyen aylarında net maaşım neden azalabilir?', a: 'Yıl içinde kümülatif gelir vergisi matrahınız arttıkça bir üst vergi dilimine geçebilirsiniz; bu durumda aynı brüt maaşla dahi net maaşınız bir önceki aya göre bir miktar düşebilir.' },
      { q: 'Asgari ücretli bir çalışan hiç vergi ödemez mi?', a: 'Evet, 2026\'da asgari ücrete isabet eden gelir ve damga vergisi tamamen istisna edildiğinden, yalnızca asgari ücret alan bir çalışanın brüt-net farkı sadece SGK ve işsizlik sigortası kesintisinden oluşur.' },
      { q: 'Stajyer veya çırak maaşları için bu araç uygun mu?', a: 'Hayır, stajyer ve çıraklarda SGK primi işveren tarafından farklı oranlarla ve genellikle daha düşük bir taban üzerinden yatırılır; bu araç normal işçi statüsündeki bordro hesabını esas alır.' },
      { q: 'Özel sağlık sigortası veya BES kesintisi bu hesaba dahil mi?', a: 'Hayır, bu araç yalnızca yasal zorunlu kesintileri (SGK, işsizlik, gelir ve damga vergisi) hesaplar; işvereninizin uyguladığı isteğe bağlı kesintiler bordronuzda ayrıca düşülür.' },
    ],
  },
  'kidem-ihbar-tazminati-hesaplama': {
    about: 'Kıdem ve ihbar tazminatı hesaplama aracı, işten ayrılma durumunda çalışma sürenize ve brüt maaşınıza göre alabileceğiniz tazminat tutarlarını tahmin etmenizi sağlar.',
    method: 'Kıdem tazminatı, her tam çalışma yılı için 30 günlük brüt ücret üzerinden hesaplanır ve yasal tavanla sınırlandırılır. İhbar tazminatı ise İş Kanunu\'ndaki kıdem sürelerine bağlı sabit hafta tablosuna göre (2-8 hafta) hesaplanır ve tavana tabi değildir.',
    examples: [
      {
        title: 'Brüt 50.000 TL, 6,5 yıl kıdem (tavanın altında)',
        rows: [
          { label: 'Kıdem tazminatı', value: '325.530,46 TL' },
          { label: 'İhbar süresi', value: '8 hafta' },
          { label: 'İhbar tazminatı', value: '93.333,33 TL' },
          { label: 'Toplam', value: '418.863,79 TL' },
        ],
      },
      {
        title: 'Brüt 150.000 TL, 11,5 yıl kıdem (tavan üzerinde)',
        intro: '2026 2. dönem kıdem tazminatı tavanı 73.729,87 TL olduğundan, tazminat gerçek maaş yerine tavan üzerinden hesaplanır.',
        rows: [
          { label: 'Kıdem tazminatı (tavana takılı)', value: '848.625,25 TL' },
          { label: 'İhbar süresi', value: '8 hafta' },
          { label: 'İhbar tazminatı', value: '280.000 TL' },
          { label: 'Toplam', value: '1.128.625,25 TL' },
        ],
      },
    ],
    faq: [
      { q: 'Kıdem tazminatı tavanı ne sıklıkla güncelleniyor?', a: 'Tavan, memur maaş katsayısındaki değişime bağlı olarak yılda iki kez (Ocak ve Temmuz) güncellenir.' },
      { q: 'Her işten ayrılışta kıdem tazminatı hak edilir mi?', a: 'Hayır, kıdem tazminatı genellikle en az 1 yıl çalışma şartına ve işveren tarafından haksız fesih ya da yasada sayılan haklı nedenlerle ayrılma durumuna bağlıdır; istifa gibi durumlarda hak edilmeyebilir.' },
      { q: 'İhbar süresi neden önemli?', a: 'İşveren bu süre kadar önceden bildirim yapmazsa, karşılığında ihbar tazminatı ödemek zorunda kalır; süre kıdeminize göre 2 ile 8 hafta arasında değişir.' },
      { q: '5 yıl çalıştım, kıdem tazminatım ne kadar olur?', a: 'Bu araca brüt maaşınızı, işe giriş ve çıkış tarihlerinizi girerek 30 günlük brüt ücretin 5 (tam yıl) ile çarpılmasına dayalı kesin tutarınızı görebilirsiniz; kıst (küsürat) süreler de otomatik hesaba katılır.' },
      { q: 'Maaşım tavanın üzerindeyse tazminatım neden maaşımla orantılı çıkmıyor?', a: 'Kıdem tazminatı tavanı üzerinde bir brüt ücretiniz varsa, hesaplama gerçek maaşınız yerine güncel tavan tutarı üzerinden yapılır; bu yüzden çok yüksek maaşlı çalışanlarda tazminat, maaşla orantılı büyümez.' },
      { q: 'İstifa edersem ihbar tazminatı öder miyim, alır mıyım?', a: 'Siz istifa ederseniz genellikle kıdem tazminatı hakkı doğmaz; ayrıca kanuni ihbar süresine uymadan aniden işi bırakırsanız işverene karşı siz ihbar tazminatı ödemekle yükümlü olabilirsiniz.' },
      { q: 'Kıdem tazminatı ile ihbar tazminatı ayrı ayrı mı vergilendirilir?', a: 'Kıdem tazminatı belirli bir tavana kadar gelir vergisinden istisnadır; ihbar tazminatı ise ücret sayıldığından normal gelir vergisi ve damga vergisi kesintisine tabidir.' },
      { q: 'Deneme süresindeyken işten çıkarılırsam tazminat alır mıyım?', a: 'Hayır, deneme süresi içinde taraflardan biri sözleşmeyi bildirimsiz ve tazminatsız feshedebilir; kıdem tazminatı hakkı en az 1 yıllık kesintisiz çalışmayı gerektirir.' },
    ],
  },
  'bilesik-faiz-hesaplama': {
    about: 'Bileşik faiz hesaplama aracı, bir anaparanın zaman içinde faizin faiz kazandırdığı bileşik büyüme ile ne kadar değer kazanacağını, isterseniz düzenli aylık katkılarla birlikte gösterir.',
    method: 'Anapara, seçilen bileşiklenme sıklığında (aylık/yıllık/günlük) her dönem faiziyle birlikte büyütülür: A = P × (1 + r/n)^(n×t). Aylık düzenli katkı eklenirse, bu katkıların gelecekteki toplam değeri anüite formülüyle ayrıca hesaplanıp anaparanın büyümesine eklenir.',
    faq: [
      { q: 'Bileşiklenme sıklığı sonucu neden etkiliyor?', a: 'Faiz ne kadar sık işlerse (günlük > aylık > yıllık), "faizin faizi" o kadar erken devreye girer ve aynı nominal orana rağmen sonuç bir miktar daha yüksek çıkar.' },
      { q: 'Bu araç risk içeren yatırımlar için tavsiye midir?', a: 'Hayır, sabit ve garantili bir getiri oranı varsayar; hisse senedi veya kripto gibi dalgalı araçlarda gerçek getiri bu hesaplamadan sapabilir.' },
      { q: 'Aylık katkıyı yıl ortasında durdurursam ne olur?', a: 'Bu araç katkının vade boyunca kesintisiz sürdüğünü varsayar; katkıyı durdurduğunuz senaryo için hesaplamayı o tarihe kadar olan süreyle yeniden yapmanız gerekir.' },
    ],
  },
  'emlak-kredisi-uygunluk-hesaplama': {
    about: 'Emlak kredisi uygunluk hesaplama aracı, aylık gelirinize göre bankaların kabul edebileceği yaklaşık maksimum konut kredisi tutarını ve aylık taksiti önceden tahmin etmenizi sağlar.',
    method: 'Önce gelirinizin belirlediğiniz orana (varsayılan %40) göre karşılayabileceği maksimum taksit, mevcut borç ödemeleriniz düşülerek bulunur. Bu taksitin, girilen faiz oranı ve vadede karşılayabileceği toplam kredi tutarı anüite formülüyle hesaplanır.',
    faq: [
      { q: 'Bankalar taksit/gelir oranını nasıl belirler?', a: 'Banka politikasına, kredi notunuza ve diğer yükümlülüklerinize göre değişir; %40 yaygın bir referans olsa da kesin oran başvuru sırasında bankanızca belirlenir.' },
      { q: 'Bu tutar bankadan alacağım kesin teklif midir?', a: 'Hayır, bu yalnızca yaklaşık bir ön değerlendirmedir; gerçek teklif teminat (ekspertiz değeri), kredi notu, BSMV/KKDF ve bankanın özel kampanyalarına göre değişir.' },
      { q: 'Peşinat tutarı bu hesaba dahil mi?', a: 'Hayır, bu araç yalnızca aylık gelire göre kredi tutarını hesaplar; toplam konut bütçeniz kredi tutarına peşinatınızın eklenmesiyle bulunur.' },
    ],
  },

  // ── Sağlık ──
  'vucut-kitle-indeksi-hesaplama': {
    about: 'Vücut Kitle İndeksi (VKİ/BMI), boy ve kilonuza göre kabaca bir sağlıklı kilo aralığında olup olmadığınızı gösteren, dünya genelinde yaygın kullanılan bir tarama ölçütüdür.',
    method: 'VKİ, kilonun (kg) boyun metre cinsinden karesine bölünmesiyle hesaplanır: VKİ = kilo ÷ boy². Sonuç, Dünya Sağlık Örgütü\'nün belirlediği zayıf, normal, fazla kilolu ve obez kategorilerinden birine yerleştirilir.',
    examples: [
      {
        title: '70 kg, 1,75 m',
        rows: [
          { label: 'VKİ', value: '22,86' },
          { label: 'Kategori', value: 'Normal' },
        ],
      },
      {
        title: '90 kg, 1,70 m',
        rows: [
          { label: 'VKİ', value: '31,14' },
          { label: 'Kategori', value: 'Obez' },
        ],
      },
      {
        title: '45 kg, 1,65 m',
        rows: [
          { label: 'VKİ', value: '16,53' },
          { label: 'Kategori', value: 'Zayıf' },
        ],
      },
    ],
    faq: [
      { q: 'VKİ neden bazı sporcularda yanıltıcı olabilir?', a: 'VKİ kas ve yağ kütlesini ayırt etmez; kas kütlesi yüksek biri, yağ oranı düşük olsa bile VKİ\'ye göre "fazla kilolu" görünebilir.' },
      { q: 'İdeal kilo aralığı nasıl hesaplanıyor?', a: 'Normal VKİ aralığının alt sınırı (18,5) ve üst sınırı (24,9) boyunuzun karesiyle çarpılarak size özel kilogram aralığı bulunur.' },
      { q: 'Çocuklar için de geçerli mi?', a: 'Hayır, bu hesaplama yetişkinler içindir; çocuk ve ergenlerde yaşa göre değişen persentil eğrileri kullanılır.' },
      { q: 'VKİ 25 ile 30 arası ne anlama gelir?', a: 'Bu aralık "fazla kilolu" olarak sınıflandırılır; obezite eşiği olan 30\'un altında olsa da sağlıklı aralığın (18,5-24,9) üzerindedir ve kademeli bir kilo yönetimi düşünülmesi önerilir.' },
      { q: 'Aynı VKİ değerine sahip iki kişi neden farklı görünebilir?', a: 'VKİ yalnızca toplam kütleyi ölçer; yağ dağılımı (bel/kalça oranı), kas kütlesi ve vücut yapısı kişiden kişiye farklılık gösterdiğinden aynı VKİ görünüm ve sağlık riski açısından farklı anlam taşıyabilir.' },
      { q: 'VKİ\'m normal ama karın bölgemde yağlanma var, bu normal mi?', a: 'Evet mümkündür; VKİ genel bir tarama ölçütüdür ve bölgesel yağ dağılımını yansıtmaz. Bel çevresi veya vücut yağ oranı gibi tamamlayıcı ölçümlere bakmak daha isabetli olabilir.' },
      { q: 'Hamilelikte VKİ hesaplaması geçerli mi?', a: 'Hayır, gebelikte kilo artışı normal ve beklenen bir süreçtir; VKİ kategorileri gebe olmayan yetişkinler için tasarlanmıştır, gebelikte kilo takibini doktorunuzla yapmanız gerekir.' },
      { q: 'VKİ sonucuma göre ne yapmalıyım?', a: 'Bu araç yalnızca bir tarama göstergesidir; kategori sonucu ne olursa olsun kesin bir sağlık değerlendirmesi ve kişisel hedef için doktor veya diyetisyene danışmanız önerilir.' },
    ],
  },
  'kalori-ihtiyaci-hesaplama': {
    about: 'Günlük kalori ihtiyacı hesaplama aracı, mevcut kilonuzu korumak, vermek ya da almak için günde yaklaşık kaç kalori almanız gerektiğini yaş, cinsiyet, boy, kilo ve aktivite düzeyinize göre tahmin eder.',
    method: 'Önce Mifflin-St Jeor formülüyle bazal metabolizma hızı (BMR) hesaplanır: dinlenme halinde vücudunuzun harcadığı enerji. Bu değer, seçtiğiniz aktivite seviyesine karşılık gelen bir katsayıyla çarpılarak günlük toplam kalori ihtiyacınız (TDEE) bulunur.',
    faq: [
      { q: 'Kilo vermek için kaç kalori eksik almalıyım?', a: 'Genel bir kural olarak günlük 500 kalori açık, haftada yaklaşık 0,5 kg yağ kaybına denk gelir; bu araç bu değeri otomatik olarak gösterir.' },
      { q: 'Aktivite seviyemi nasıl seçmeliyim?', a: 'Haftalık egzersiz sıklığınızı dürüstçe değerlendirin; masa başı bir iş ve egzersiz yoksa "hareketsiz", haftada birkaç kez antrenman yapıyorsanız "orta hareketli" seçilebilir.' },
      { q: 'Bu sonuçlar tıbbi bir diyet planı yerine geçer mi?', a: 'Hayır, sonuçlar genel bir tahmindir; özel sağlık durumları (tiroid, diyabet vb.) için diyetisyen veya doktor kontrolü önerilir.' },
    ],
  },
  'ideal-kilo-hesaplama': {
    about: 'İdeal kilo hesaplama aracı, boyunuz ve cinsiyetinize göre klasik bir referans kilo değeri sunar. VKİ\'den farklı olarak tek bir sayı verir ve hızlı bir referans noktası olarak kullanılabilir.',
    method: 'Düzeltilmiş Broca formülü kullanılır: boy (cm) değerinden 100 çıkarılır, kalan tutardan erkeklerde %10, kadınlarda %15 daha düşülerek ideal kilo bulunur.',
    faq: [
      { q: 'Broca formülü ile VKİ aralığı neden farklı sonuç verebilir?', a: 'İkisi farklı varsayımlara dayanır; Broca tek bir referans nokta verirken VKİ bir aralık sunar. İkisini birlikte değerlendirmek daha dengeli bir fikir verir.' },
      { q: 'Bu formül vücut yapısını (geniş/dar kemik) dikkate alıyor mu?', a: 'Hayır, yalnızca boy ve cinsiyete dayanır; kemik yapısı, kas kütlesi gibi bireysel farklar hesaba katılmaz.' },
      { q: 'Sonuç bana uygun değilse ne yapmalıyım?', a: 'Bu araç genel bir tahmindir; kişiselleştirilmiş bir hedef için doktor veya diyetisyenle görüşmeniz daha sağlıklı olur.' },
    ],
  },
  'vucut-yag-orani-hesaplama': {
    about: 'Vücut yağ oranı hesaplama aracı, mezura ile alacağınız birkaç basit ölçümle (US Navy yöntemi) vücudunuzdaki yağ oranını tahmin etmenizi sağlar; VKİ\'ye göre kas-yağ ayrımı konusunda daha isabetli bir fikir verir.',
    method: 'US Navy yöntemi kullanılır: erkeklerde bel ve boyun çevresi, kadınlarda ayrıca kalça çevresi ölçümü, boy ile birlikte logaritmik bir formülde değerlendirilerek yağ oranı hesaplanır. Sonuç, cinsiyete özgü referans aralıklarıyla (atletik, fit, ortalama, yüksek) karşılaştırılır.',
    faq: [
      { q: 'Ölçümleri nasıl doğru almalıyım?', a: 'Mezurayı cilde hafifçe temas edecek şekilde, karın kaslarını sıkmadan ve nefes verirken bel/boyun/kalça çevrenizin en geniş noktasından ölçmeniz önerilir.' },
      { q: 'US Navy yöntemi ne kadar isabetlidir?', a: 'DEXA tarama gibi klinik yöntemlere göre daha az hassastır, ama ölçüm hatası düşükse günlük takip için makul bir tahmin sunar.' },
      { q: 'Kadınlar için neden kalça ölçüsü de gerekiyor?', a: 'Kadın vücudunda yağ dağılımı farklı olduğundan formül, daha isabetli bir tahmin için kalça çevresini de hesaba katar.' },
    ],
  },
  'gunluk-su-ihtiyaci-hesaplama': {
    about: 'Günlük su ihtiyacı hesaplama aracı, kilonuza ve gün içindeki fiziksel aktivite düzeyinize göre ne kadar su tüketmeniz gerektiğine dair pratik bir tahmin sunar.',
    method: 'Temel ihtiyaç, vücut ağırlığınızın kilogramı başına yaklaşık 33 ml olarak hesaplanır. Buna, egzersiz yaptığınız her dakika için ek bir su payı ve sıcak/nemli ortamda ekstra bir pay eklenir.',
    faq: [
      { q: 'Çay, kahve gibi içecekler bu miktara dahil mi?', a: 'Bu hesap saf su tüketimini baz alır; kafeinli içecekler hafif idrar söktürücü etki gösterebileceğinden su yerine tam olarak sayılmamalıdır.' },
      { q: 'Yemeklerden alınan su bu miktara dahil mi?', a: 'Hayır, bu tahmin yalnızca içilecek su miktarına odaklanır; sebze/meyve gibi besinlerden alınan su ek bir katkı sağlar.' },
      { q: 'Böbrek veya kalp rahatsızlığım varsa bu miktarı uygulayabilir miyim?', a: 'Hayır, bu durumlarda sıvı kısıtlaması gerekebilir; su tüketiminizi mutlaka doktorunuzun önerisine göre ayarlamalısınız.' },
    ],
  },
  'gebelik-haftasi-hesaplama': {
    about: 'Gebelik haftası hesaplama aracı, son adet tarihinizi temel alarak kaçıncı gebelik haftasında olduğunuzu ve tahmini doğum tarihinizi hesaplar.',
    method: 'Naegele kuralı kullanılır: son adet tarihinize 280 gün (40 hafta) eklenerek tahmini doğum tarihi bulunur. Bugünün tarihi ile son adet tarihi arasındaki gün sayısı 7\'ye bölünerek gebelik haftası ve trimester belirlenir.',
    faq: [
      { q: 'Tahmini doğum tarihi neden kesin değil?', a: 'Naegele kuralı ortalama 28 günlük bir adet döngüsü varsayar; gerçek döngü uzunluğu ve ovulasyon zamanı kişiden kişiye değiştiği için gerçek doğum tarihi birkaç hafta sapabilir.' },
      { q: 'Ultrason tarihi ile bu hesap farklıysa hangisine güvenmeliyim?', a: 'İlk trimester ultrasonu genellikle daha isabetli kabul edilir; doktorunuzun ultrason bulgularına göre yaptığı değerlendirmeyi esas almanız önerilir.' },
      { q: 'Adet döngüm düzensizse bu araç yine de kullanılabilir mi?', a: 'Düzensiz döngülerde tahmin daha az güvenilir olur; bu durumda doktor kontrolü ve ultrason ölçümü daha sağlıklı bir tarih verir.' },
    ],
  },

  // ── Matematik ──
  'yuzde-hesaplama': {
    about: 'Yüzde hesaplama aracı, günlük hayatta sık karşılaşılan üç farklı yüzde sorusunu tek bir yerde çözer: bir sayının yüzdesini bulma, bir değerin diğerinin yüzde kaçı olduğunu bulma ve iki değer arasındaki yüzde değişimi hesaplama.',
    method: 'Her mod farklı bir formül kullanır: "X\'in %Y\'si" için (X × Y) ÷ 100; "A, B\'nin yüzde kaçı" için (A ÷ B) × 100; "A\'dan B\'ye değişim" için ((B − A) ÷ A) × 100 hesaplanır.',
    faq: [
      { q: 'Yüzde artışı ile yüzde azalışı aynı formülle mi hesaplanıyor?', a: 'Evet, "değişim" modunda sonuç pozitifse artış, negatifse azalış anlamına gelir; formül aynı kalır.' },
      { q: 'Yüzde puan ile yüzde arasındaki fark nedir?', a: 'Örneğin oran %10\'dan %15\'e çıktıysa bu "5 yüzde puan" artıştır, ama yüzdesel değişim %50\'dir ((15-10)/10); bu araç ikinci anlamdaki yüzdesel değişimi hesaplar.' },
      { q: 'Negatif sayılarla çalışır mı?', a: 'Evet, ancak "değişim" modunda başlangıç değeri sıfır olamaz; sıfırdan başlayan bir değişimin yüzdesi matematiksel olarak tanımsızdır.' },
    ],
  },
  'oran-oranti-hesaplama': {
    about: 'Oran-orantı hesaplama aracı, günlük hayattaki "3 işçi 6 günde bitiriyorsa, 6 işçi kaç günde bitirir" tarzı sorularda bilinmeyen değeri doğru veya ters orantı mantığıyla bulmanızı sağlar.',
    method: 'Doğru orantıda iki büyüklük aynı yönde değişir: A/B = C/X ilişkisinden X = (C × B) ÷ A bulunur. Ters orantıda ise biri artarken diğeri azalır: A × B = C × X ilişkisinden X = (A × B) ÷ C hesaplanır.',
    faq: [
      { q: 'Doğru orantı mı ters orantı mı kullanacağımı nasıl anlarım?', a: 'Bir büyüklük artınca diğeri de artıyorsa (ör. malzeme arttıkça maliyet artar) doğru orantı; biri artınca diğeri azalıyorsa (ör. işçi sayısı artınca bitirme süresi azalır) ters orantı kullanılır.' },
      { q: 'Üç değerden fazla bilinmeyenli problemlerde kullanılabilir mi?', a: 'Hayır, bu araç klasik üç bilinen bir bilinmeyenli (A, B, C → X) orantı problemlerini çözer; daha karmaşık problemler birden fazla adıma bölünmelidir.' },
      { q: 'A değeri sıfır olabilir mi?', a: 'Doğru orantıda A sıfır olamaz (sıfıra bölme hatası); ters orantıda ise C sıfır olamaz.' },
    ],
  },
  'alan-hacim-hesaplama': {
    about: 'Alan ve hacim hesaplama aracı, temel geometrik şekillerin (dikdörtgen, kare, daire, üçgen, küp, prizma, silindir, küre, koni) alan veya hacmini hızlıca bulmanızı sağlar. Okul ödevlerinden tadilat/dekorasyon hesaplarına kadar geniş bir kullanım alanı vardır.',
    method: 'Her şekil için ayrı standart geometri formülü uygulanır: örneğin dikdörtgen alanı kenarların çarpımı, daire alanı π×r², küp hacmi kenarın küpü, silindir hacmi π×r²×yükseklik olarak hesaplanır.',
    faq: [
      { q: 'Tüm ölçüleri aynı birimde girmem gerekiyor mu?', a: 'Evet, örneğin bir kenarı cm diğerini m girerseniz sonuç yanlış çıkar; tüm girdileri aynı birimde (hepsi cm ya da hepsi m) girmelisiniz.' },
      { q: 'Sonucun birimi nedir?', a: 'Sonuç, girdiğiniz birimin karesi (alan için, ör. cm²) ya da küpü (hacim için, ör. cm³) cinsindendir.' },
      { q: 'Düzensiz (girintili/çıkıntılı) şekiller için kullanılabilir mi?', a: 'Hayır, bu araç yalnızca standart geometrik şekilleri destekler; düzensiz alanlar genellikle birkaç standart şekle bölünüp ayrı ayrı hesaplanmalıdır.' },
    ],
  },
  'ortalama-hesaplama': {
    about: 'Ortalama hesaplama aracı, bir grup sayının basit ortalamasını ya da her değere farklı bir ağırlık (kredi, yüzde, puan) vererek ağırlıklı ortalamasını bulmanızı sağlar — özellikle vize/final gibi farklı katkı oranına sahip not ortalaması hesaplarında kullanışlıdır.',
    method: 'Basit ortalama, tüm değerlerin toplanıp adede bölünmesiyle bulunur. Ağırlıklı ortalamada ise her değer kendi ağırlığıyla çarpılır, bu çarpımlar toplanır ve toplam ağırlığa bölünür.',
    faq: [
      { q: 'Ağırlık alanına ne girmeliyim?', a: 'Not ortalaması için genellikle sınavın yüzdesel katkısını (ör. vize %40, final %60) ya da dersin kredisini girebilirsiniz.' },
      { q: 'Tüm ağırlıkları 1 girersem ne olur?', a: 'Bu durumda ağırlıklı ortalama, basit ortalamayla aynı sonucu verir; çünkü her değer eşit ağırlıklandırılmış olur.' },
      { q: 'Ağırlığı sıfır ya da negatif girebilir miyim?', a: 'Hayır, ağırlık değeri sıfırdan büyük olmalıdır; sıfır veya negatif ağırlık girilen satırlar hesaba dahil edilmez.' },
    ],
  },
  'kombinasyon-permutasyon-hesaplama': {
    about: 'Kombinasyon ve permütasyon hesaplama aracı, olasılık ve istatistik derslerinde sık karşılaşılan "n elemanlı bir kümeden r eleman kaç farklı şekilde seçilebilir/dizilebilir" sorularını hızlıca çözer.',
    method: 'Kombinasyon (nCr), sıralamanın önemli olmadığı seçimlerde n! ÷ (r! × (n−r)!) formülüyle hesaplanır. Permütasyon (nPr) ise sıralamanın önemli olduğu durumlarda n! ÷ (n−r)! formülünü kullanır.',
    faq: [
      { q: 'Kombinasyon mu permütasyon mu kullanmalıyım?', a: 'Seçilen elemanların sırası sonucu değiştirmiyorsa (ör. 5 kişiden 3 kişilik komite seçimi) kombinasyon; sıra önemliyse (ör. 1., 2., 3. sıradaki yarışmacılar) permütasyon kullanılır.' },
      { q: 'n neden 170 ile sınırlı?', a: 'Faktöriyel değerleri çok hızlı büyüdüğünden, 170\'in üzerindeki sayılarda tarayıcının kullandığı sayı hassasiyeti (JavaScript double) taşmaya başlar ve sonuç güvenilir olmaktan çıkar.' },
      { q: 'r, n\'den büyük olabilir mi?', a: 'Hayır, n elemanlı bir kümeden n\'den fazla eleman seçilemeyeceği için r her zaman n\'ye eşit veya küçük olmalıdır.' },
    ],
  },
  'birim-cevirici': {
    about: 'Birim çevirici, uzunluk, ağırlık, hız ve sıcaklık birimleri arasında hızlıca dönüşüm yapmanızı sağlayan genel amaçlı bir araçtır. Seyahat, mutfak tarifleri, spor veya teknik hesaplarda farklı ölçü sistemlerini karşılaştırmak için kullanışlıdır.',
    method: 'Uzunluk, ağırlık ve hız birimleri, her birimin ortak bir taban birime (metre, kilogram, m/s) çevrilme katsayısı üzerinden hesaplanır. Sıcaklık ise doğrusal olmadığından Celsius, Fahrenheit ve Kelvin arasında kendine özgü dönüşüm formülleriyle çevrilir.',
    faq: [
      { q: 'Hangi birim kategorileri destekleniyor?', a: 'Uzunluk (mm, cm, m, km, inç, feet, yarda, mil), ağırlık (mg, g, kg, ton, ons, pound), hız (m/s, km/h, mph, knot) ve sıcaklık (°C, °F, K) desteklenir.' },
      { q: '"Birimleri yer değiştir" butonu ne işe yarar?', a: 'Kaynak ve hedef birimi tek tıkla birbiriyle değiştirerek ters yönde çevirim yapmanızı kolaylaştırır.' },
      { q: 'Hacim veya alan birimleri de bu araca eklenecek mi?', a: 'Şu an desteklenmiyor; alan ve hacim hesapları için ayrı "Alan ve Hacim Hesaplama" aracını kullanabilirsiniz.' },
    ],
  },

  // ── Zaman ──
  'yas-hesaplama': {
    about: 'Yaş hesaplama aracı, doğum tarihinize göre bugün (veya seçtiğiniz herhangi bir tarihte) tam olarak kaç yıl, ay ve gün yaşında olduğunuzu; ayrıca bir sonraki doğum gününüze kaç gün kaldığını hesaplar.',
    method: 'Doğum tarihi ile referans tarihi arasındaki fark, takvim ay/gün uzunluklarını dikkate alarak yıl, ay ve gün birimlerine ayrıştırılır (ödünç alma dahil). Toplam gün ve hafta sayısı da ayrıca hesaplanır.',
    examples: [
      {
        title: 'Doğum tarihi 15.03.1995, bugün 07.07.2026',
        rows: [
          { label: 'Yaş', value: '31 yıl 3 ay 22 gün' },
          { label: 'Toplam gün', value: '11.437 gün' },
          { label: 'Sonraki doğum gününe kalan', value: '251 gün' },
        ],
      },
      {
        title: 'Doğum tarihi 01.01.2000, bugün 07.07.2026',
        rows: [
          { label: 'Yaş', value: '26 yıl 6 ay 6 gün' },
          { label: 'Toplam gün', value: '9.684 gün' },
          { label: 'Sonraki doğum gününe kalan', value: '178 gün' },
        ],
      },
      {
        title: 'Doğum tarihi 20.11.1988, referans tarih 01.01.2030 (gelecek bir tarih)',
        rows: [
          { label: 'O tarihteki yaş', value: '41 yıl 1 ay 12 gün' },
          { label: 'Toplam gün', value: '15.017 gün' },
        ],
      },
    ],
    faq: [
      { q: 'Artık yıllar (29 Şubat) hesaba dahil mi?', a: 'Evet, hesaplama gerçek takvim ay uzunluklarını kullandığından artık yıllar otomatik olarak doğru şekilde hesaba katılır.' },
      { q: 'Gelecekteki bir tarihe göre yaşımı hesaplayabilir miyim?', a: 'Evet, "hangi tarihe göre" alanına ileri bir tarih girerek o tarihte kaç yaşında olacağınızı görebilirsiniz.' },
      { q: 'Saat dilimi farkı sonucu etkiler mi?', a: 'Hayır, hesaplama yalnızca takvim günlerini (saat bilgisi olmadan) karşılaştırdığından saat dilimi farkı sonucu etkilemez.' },
      { q: '29 Şubat\'ta doğdum, doğum günüm normal yıllarda ne zaman sayılır?', a: 'Bu araç bir sonraki 29 Şubat\'ı bulamadığı yıllarda otomatik olarak 28 Şubat\'ı referans alır; resmi belgelerde de genellikle bu yaklaşım kullanılır.' },
      { q: 'Doğduğum gün "0 yaşında" mı sayılır yoksa "1 yaşında" mı?', a: 'Bu araç Batı/uluslararası yaş sistemini kullanır: doğduğunuz gün 0 yaşındasınızdır ve bir sonraki doğum gününüzde tam 1 yaşına girersiniz; Kore yaşı gibi alternatif sistemler farklı sayabilir.' },
      { q: 'Yaşımı yıl-ay-gün yerine sadece toplam gün olarak görebilir miyim?', a: 'Evet, sonuç kartında yıl/ay/gün kırılımının yanında toplam gün ve toplam hafta sayısı da ayrıca gösterilir.' },
      { q: 'İki farklı doğum tarihini (ör. ikizlerin) karşılaştırabilir miyim?', a: 'Bu araç tek bir doğum tarihini referans tarihe göre hesaplar; iki tarihi karşılaştırmak için her ikisini ayrı ayrı hesaplayıp sonuçları kıyaslayabilir ya da İki Tarih Arası Fark aracını kullanabilirsiniz.' },
      { q: 'Yaş hesaplaması resmi işlemlerde (ör. emeklilik) kullanılabilir mi?', a: 'Bu araç genel bilgi amaçlıdır; emeklilik yaşı, askerlik gibi resmi süreçlerde kurumların kendi mevzuatına göre yaptığı hesaplama esas alınmalıdır.' },
    ],
  },
  'tarih-farki-hesaplama': {
    about: 'İki tarih arası fark hesaplama aracı, herhangi iki tarih arasındaki süreyi yıl, ay, gün ve toplam gün olarak bulmanızı sağlar; proje takibi, geriye sayım veya süre hesaplarında kullanışlıdır.',
    method: 'Erken ve geç tarih otomatik olarak belirlenir; aradaki fark takvim ay/gün uzunlukları dikkate alınarak yıl, ay, gün birimlerine ayrıştırılır. Toplam gün, hafta ve ay sayısı da ayrıca hesaplanır.',
    faq: [
      { q: 'Bitiş tarihini başlangıçtan önce girersem ne olur?', a: 'Araç bunu otomatik algılar ve iki tarihi ters çevirip mutlak farkı hesaplar; sonucun yanında bu durum belirtilir.' },
      { q: 'Bugünün tarihine göre geçmiş bir olayın süresini hesaplayabilir miyim?', a: 'Evet, bitiş tarihi alanına bugünün tarihini bırakarak geçmişteki bir başlangıç tarihinden bu yana geçen süreyi bulabilirsiniz.' },
      { q: 'Sonuç neden "toplam ay" ile "yıl+ay" farklı görünüyor?', a: '"Toplam ay" tüm süreyi tek birimde ifade eder (yıl × 12 + ay); "yıl+ay+gün" ise aynı süreyi daha okunaklı, parçalı biçimde gösterir.' },
    ],
  },
  'saat-farki-hesaplama': {
    about: 'İki saat arası süre hesaplama aracı, bir mesai, vardiya veya toplantının başlangıç ve bitiş saatine göre toplam süresini, mola süresini düşerek net olarak hesaplamanızı sağlar.',
    method: 'Başlangıç ve bitiş saatleri dakikaya çevrilir; bitiş saati başlangıçtan küçük veya eşitse hesap otomatik olarak ertesi güne sarkacak şekilde 24 saat eklenir. Aradaki fark dakika cinsinden bulunur ve girilen mola süresi düşülür.',
    faq: [
      { q: 'Gece yarısını geçen vardiyalar doğru hesaplanıyor mu?', a: 'Evet, bitiş saati başlangıçtan küçükse araç bunu "ertesi güne sarkan" bir vardiya olarak algılar ve süreyi buna göre doğru hesaplar.' },
      { q: 'Birden fazla mola varsa ne yapmalıyım?', a: 'Tüm molalarınızın toplam dakikasını tek bir "mola süresi" alanına toplu olarak girebilirsiniz.' },
      { q: 'Ondalık saat ne işe yarar?', a: 'Bordro veya puantaj sistemlerinde süre genellikle "8,5 saat" gibi ondalık biçimde girildiğinden, bu değer doğrudan kullanılabilir.' },
    ],
  },
  'gun-sayaci-hesaplama': {
    about: 'Gün sayacı, doğum günü, yıl dönümü, tatil, sınav veya proje teslim tarihi gibi hedeflediğiniz bir tarihe kaç gün kaldığını (ya da geçmişte kaldıysa kaç gün geçtiğini) hızlıca gösterir.',
    method: 'Hedef tarih ile referans tarihi arasındaki gün farkı, her iki tarih de gün başlangıcına (gece yarısına) sabitlenerek hesaplanır; sonuç ayrıca tam hafta ve kalan gün olarak da ifade edilir.',
    faq: [
      { q: 'Hedef tarih bugünse ne gösterilir?', a: 'Araç bu durumu özel olarak algılar ve "Hedef tarih bugün" mesajıyla belirtir.' },
      { q: 'Geçmiş bir tarih girersem hata mı verir?', a: 'Hayır, geçmiş bir tarih girildiğinde araç hata vermez; bunun yerine o tarihten bu yana kaç gün geçtiğini gösterir.' },
      { q: 'Saat dilimi veya saat bilgisi sonucu etkiler mi?', a: 'Hayır, hesaplama yalnızca takvim gününü esas aldığından saat bilgisi girilmez ve sonucu etkilemez.' },
    ],
  },

  // ── Finans / Alışveriş (yeni) ──
  'kredi-karti-asgari-odeme-hesaplama': {
    about: 'Bu araç, kredi kartı ekstrenizde sadece asgari tutarı ödemeyi düşündüğünüzde kalan bakiyeye ne kadar faiz işleyeceğini ve gecikme durumunda ek maliyetin ne olacağını önceden görmenizi sağlar.',
    method: 'Asgari ödeme tutarı, 2026 BDDK düzenlemesine göre kart limitinize bağlı bir oranla (50.000 TL ve altı için %20, üzeri için %40) dönem borcunuzdan hesaplanır. Ödenmeyen kalan bakiyeye aylık akdi faiz, gecikme durumunda ise ayrıca dönem borcunun tamamı üzerinden günlük kırılımla gecikme faizi eklenir.',
    examples: [
      {
        title: 'Kart limiti 40.000 TL (eşik altı), ekstre borcu 20.000 TL, akdi faiz %3,25',
        rows: [
          { label: 'Asgari ödeme oranı', value: '%20' },
          { label: 'Asgari ödeme tutarı', value: '4.000 TL' },
          { label: 'Ödenmezse kalan bakiye', value: '16.000 TL' },
          { label: 'Gelecek döneme işleyecek faiz', value: '520 TL' },
        ],
      },
      {
        title: 'Kart limiti 100.000 TL (eşik üstü), ekstre borcu 60.000 TL, akdi faiz %3,75, 10 gün gecikme',
        rows: [
          { label: 'Asgari ödeme oranı', value: '%40' },
          { label: 'Asgari ödeme tutarı', value: '24.000 TL' },
          { label: 'Ödenmezse kalan bakiye', value: '36.000 TL' },
          { label: 'Gecikme faizi (10 gün)', value: '810 TL' },
          { label: 'Sonraki dönem toplam borç', value: '38.160 TL' },
        ],
      },
    ],
    faq: [
      { q: 'Sadece asgari ödeme yapmak neden risklidir?', a: 'Kalan bakiyeye yüksek oranlı akdi faiz işlemeye devam eder; uzun vadede borcunuz hızla büyüyebilir ve kredi notunuzu olumsuz etkileyebilir.' },
      { q: 'Asgari ödeme oranı her kartta aynı mı?', a: 'Hayır, oran kartınızın limitine göre değişir: 50.000 TL ve altı limitli kartlarda %20, üzerinde %40 olarak uygulanır.' },
      { q: 'Gecikme faizi ile akdi faiz arasındaki fark nedir?', a: 'Akdi faiz, ödenmeyen bakiyeye normal şartlarda işleyen faizdir; gecikme (temerrüt) faizi ise ödemeyi zamanında yapmadığınızda dönem borcunun tamamına ek olarak işleyen, genellikle biraz daha yüksek bir orandır.' },
      { q: 'Asgari ödemeyi bile yapmazsam ne olur?', a: 'Asgari tutarı da ödemezseniz kartınız kanunen "temerrüde düşmüş" sayılır, tüm ekstre borcunuza gecikme faizi işler ve durum kredi kayıt bürosuna (Findeks) bildirilerek kredi notunuzu olumsuz etkiler.' },
      { q: 'Asgari ödeme yaparsam kartımı kullanmaya devam edebilir miyim?', a: 'Bankalar, asgari ödemenin art arda yapılıp yapılmadığına göre kartın harcamaya kapatılması gibi önlemler alabilir; 3 dönem üst üste sadece asgari ödeme yapılması durumunda genellikle kart harcamaya kapatılır.' },
      { q: 'Kalan bakiyeyi taksitlendirebilir miyim?', a: 'Bazı bankalar "yapılandırma" veya "taksitli borç ödeme" gibi seçenekler sunabilir; bu, bankanızla görüşerek değerlendirebileceğiniz ayrı bir üründür ve bu araca dahil değildir.' },
      { q: 'Asgari ödeme tutarını değil, tamamını öderim daha iyi olmaz mı?', a: 'Evet, mümkünse ekstrenin tamamını ödemek en avantajlı seçenektir; bu şekilde hiç akdi faiz işlemez ve borç bir sonraki döneme taşınmaz.' },
      { q: 'Farklı bankaların akdi/gecikme faiz oranları neden farklı?', a: 'TCMB her çeyrekte kredi kartlarında uygulanabilecek azami akdi ve gecikme faiz oranlarını ilan eder; bankalar bu tavanın altında serbestçe farklı oranlar belirleyebilir, bu yüzden kartınızın ekstresindeki oranı kontrol etmelisiniz.' },
      { q: '"Borç eritme simülasyonu" ne gösterir?', a: 'Her ay yalnızca o ayın asgari tutarını ödediğinizi varsayarak borcunuzun kaç ayda kapanacağını, toplam ne kadar ödeyeceğinizi ve toplam faizi ay ay simüle eder; asgari tutar her ay kalan bakiyeye göre yeniden hesaplanır.' },
      { q: 'Simülasyon "borç asla kapanmıyor" derse ne anlama gelir?', a: 'Bu, girdiğiniz faiz oranında asgari ödemenin o ayki faizi bile karşılamadığı, dolayısıyla sadece asgari öderseniz bakiyenizin küçülmeyip büyümeye devam edeceği anlamına gelir — mutlaka asgarinin üzerinde ödeme yapmanız gerekir.' },
      { q: '"Sabit ödeme" karşılaştırması ne işe yarar?', a: 'Asgari ödeme yerine her ay kendi belirlediğiniz sabit bir tutar ödeseydiniz borcun kaç ayda kapanacağını ve ne kadar daha az faiz ödeyeceğinizi asgari-ödeme senaryosuyla yan yana gösterir.' },
    ],
  },
  'enflasyon-etkisi-hesaplama': {
    about: 'Enflasyon etkisi hesaplama aracı, bugün elinizdeki bir paranın enflasyon nedeniyle zamanla nasıl değer kaybettiğini somut rakamlarla görmenizi sağlar; birikim ve yatırım kararlarında "paranın zamanla değeri" kavramını anlamak için kullanışlıdır.',
    method: 'Girilen tutar, varsayılan yıllık enflasyon oranıyla bileşik olarak büyütülür (tutar × (1+oran)^yıl); bu, aynı alım gücünü korumak için gelecekte gereken nominal tutarı verir. Bugünkü tutarın gelecekteki karşılığı ise bu işlemin tersine çevrilmesiyle (bugünün parası cinsinden) hesaplanır.',
    faq: [
      { q: 'Bu araç gerçek/resmi bir enflasyon tahmini mi kullanır?', a: 'Hayır, girdiğiniz oran sizin varsayımınızdır; araç yalnızca bu varsayımı matematiksel olarak uygular, gerçek gelecekteki enflasyonu tahmin etmez.' },
      { q: 'Farklı senaryoları karşılaştırabilir miyim?', a: 'Evet, enflasyon oranını değiştirerek iyimser ve kötümser senaryoları ayrı ayrı deneyip sonuçları karşılaştırabilirsiniz.' },
      { q: 'Bu hesap yatırım getirisini de hesaba katar mı?', a: 'Hayır, bu araç yalnızca enflasyonun aşındırma etkisini gösterir; parayı bir yatırım aracında değerlendirdiğinizde getiriyi görmek için Bileşik Faiz Hesaplama aracını kullanabilirsiniz.' },
    ],
  },
  'taksit-karsilastirma-hesaplama': {
    about: 'Taksit karşılaştırma aracı, bir ürünü peşin mi yoksa taksitle mi almanın daha avantajlı olduğunu görmenizi sağlar; taksitli alışverişlerde çoğu zaman gizli kalan vade farkını açıkça gösterir.',
    method: 'Taksitli toplam fiyat, aylık taksit tutarının taksit sayısıyla çarpılmasıyla bulunur. Bu tutarın peşin fiyattan farkı ek maliyeti, bu farkın peşin fiyata oranı ise yüzdesel ek maliyeti (gizli vade farkı oranı) verir.',
    faq: [
      { q: 'Taksitli fiyat neden peşin fiyattan yüksek olabilir?', a: 'Satıcı veya banka, taksitlendirme için genellikle bir vade farkı/komisyon uygular; bu fark toplam taksit tutarına yansır.' },
      { q: 'Bu aracı kredi kartı taksitleri için de kullanabilir miyim?', a: 'Evet, kartınızın taksit seçeneklerinde gösterilen toplam tutarı ve peşin fiyatı girerek gerçek ek maliyeti görebilirsiniz.' },
      { q: 'Ek maliyet negatif çıkabilir mi?', a: 'Evet, bazı kampanyalarda taksitli fiyat peşin fiyattan düşük olabilir; bu durumda taksit sizin lehinize bir avantaj sağlıyor demektir.' },
    ],
  },
  'zam-orani-hesaplama': {
    about: 'Zam oranı hesaplama aracı, bir ürün veya hizmetin eski fiyatıyla yeni fiyatı arasındaki değişimin yüzde kaç olduğunu hızlıca göstermenizi sağlar; market alışverişinden abonelik zamlarına kadar birçok durumda kullanışlıdır.',
    method: 'Değişim tutarı, yeni fiyattan eski fiyatın çıkarılmasıyla bulunur. Değişim oranı ise bu farkın eski fiyata bölünüp 100 ile çarpılmasıyla hesaplanır: ((yeni − eski) ÷ eski) × 100.',
    examples: [
      {
        title: 'Eski fiyat 30.000 TL, yeni fiyat 40.500 TL',
        rows: [
          { label: 'Fark', value: '10.500 TL' },
          { label: 'Zam oranı', value: '%35' },
        ],
      },
      {
        title: 'Eski fiyat 1.500 TL, yeni fiyat 1.350 TL',
        intro: 'Yeni fiyat eski fiyattan düşük olduğunda sonuç negatif çıkar; bu bir indirime karşılık gelir.',
        rows: [
          { label: 'Fark', value: '-150 TL' },
          { label: 'Zam oranı', value: '%-10' },
        ],
      },
    ],
    faq: [
      { q: 'Sonuç negatif çıkarsa ne anlama gelir?', a: 'Negatif sonuç, yeni fiyatın eski fiyattan düşük olduğunu, yani aslında bir indirim yapıldığını gösterir.' },
      { q: 'Zam oranı ile enflasyon oranı aynı şey mi?', a: 'Hayır, zam oranı tek bir ürüne özgü fiyat değişimidir; enflasyon ise bir sepet ürün ve hizmetin genel ortalama fiyat değişimini ifade eder.' },
      { q: 'Yüzde kaç zam yapıldığını biliyorsam yeni fiyatı bulabilir miyim?', a: 'Bu araç eski/yeni fiyattan oranı hesaplar; tam tersi için Yüzde Hesaplama aracındaki "X sayının %Y\'si" modunu kullanabilirsiniz.' },
      { q: '30.000 TL\'den 40.500 TL\'ye çıkan bir ürüne kaç zam yapılmış?', a: 'Bu örnekte %35 zam yapılmıştır: (40.500 − 30.000) ÷ 30.000 × 100 = %35.' },
      { q: 'Abonelik ücretim aynı oranda birkaç yıl zamlanırsa toplam artış nasıl hesaplanır?', a: 'Zamlar art arda uygulandığında oranlar toplanmaz, her yılki zam bir önceki yılın zamlı fiyatı üzerinden hesaplanır; toplam etkiyi görmek için her yılın sonucunu sırayla bu araca girebilirsiniz.' },
      { q: 'Zam oranı ile "kaç kat arttı" ifadesi aynı şey mi?', a: 'Hayır, "%100 zam" fiyatın 2 katına çıktığı anlamına gelir; "3 kat arttı" ifadesi ise %200 zam yapıldığı anlamına gelir. Bu iki ifadeyi karıştırmamak önemlidir.' },
      { q: 'Maaşıma yapılan zammın oranını bu araçla hesaplayabilir miyim?', a: 'Evet, eski ve yeni brüt maaşınızı girerek zam oranını bulabilirsiniz; net maaşınıza gerçek yansımayı görmek isterseniz Brüt-Net Maaş Hesaplama aracını da kullanmanız önerilir.' },
      { q: 'Ondalıklı fiyatlarla (ör. 19,90 TL) çalışır mı?', a: 'Evet, hem eski hem yeni fiyat alanına kuruş dahil ondalıklı değerler girebilirsiniz; sonuç yine yüzdesel oran olarak hesaplanır.' },
    ],
  },
  'bahsis-hesap-bolusme-hesaplama': {
    about: 'Bahşiş ve hesap bölüşme aracı, restoran veya kafede gelen hesabı arkadaş grubu arasında bahşiş dahil adil şekilde paylaştırmanızı sağlar; kafa yormadan kişi başı ne ödeneceğini anında gösterir.',
    method: 'Bahşiş tutarı, hesap tutarının girilen bahşiş oranıyla çarpılmasıyla bulunur. Bahşiş dahil toplam tutar, kişi sayısına eşit olarak bölünerek kişi başı ödenecek miktar hesaplanır.',
    faq: [
      { q: 'Herkes eşit mi ödemeli?', a: 'Bu araç eşit bölüşüm varsayar; farklı miktarda sipariş verildiyse hesabı kişi bazında ayrı ayrı hesaplamanız gerekebilir.' },
      { q: 'Türkiye\'de yaygın bahşiş oranı nedir?', a: 'Zorunlu olmamakla birlikte restoranlarda %5-10 arası bir bahşiş yaygın bir teamüldür; bazı işletmeler hesaba servis ücretini zaten dahil edebilir.' },
      { q: 'Servis ücreti hesaba zaten eklenmişse ne yapmalıyım?', a: 'Bu durumda bahşiş oranını 0 girerek yalnızca hesabı kişi sayısına bölebilirsiniz.' },
    ],
  },
  'indirim-ustune-indirim-hesaplama': {
    about: 'İndirim üstüne indirim aracı, "%20 indirim üstüne bir de %10 indirim" gibi kademeli kampanyalarda gerçek toplam indirim oranının ne olduğunu net şekilde gösterir; bu oran çoğu zaman sanılandan düşük çıkar.',
    method: 'İlk indirim, orijinal fiyata uygulanarak ara bir fiyat bulunur. İkinci indirim ise bu ara fiyat üzerinden hesaplanır, iki oran toplanmaz. Sonuçta ortaya çıkan son fiyatın orijinal fiyata göre toplam düşüş yüzdesi "gerçek toplam indirim oranı" olarak gösterilir.',
    faq: [
      { q: '%20 + %10 neden %30 etmiyor?', a: 'İkinci %10\'luk indirim, orijinal fiyat üzerinden değil, ilk indirimden sonra kalan (daha düşük) fiyat üzerinden hesaplanır; bu yüzden toplam etki iki oranın basit toplamından azdır.' },
      { q: 'Üçten fazla indirimi art arda hesaplayabilir miyim?', a: 'Bu araç iki indirim için tasarlanmıştır; daha fazla kademeli indirim için sonucu tekrar bu araca ara fiyat olarak girip üçüncü indirimi ayrıca hesaplayabilirsiniz.' },
      { q: 'Sıralama sonucu değiştirir mi?', a: 'Hayır, matematiksel olarak %20 önce ya da %10 önce uygulansın sonuç aynı çıkar; çarpma işleminin sırası sonucu etkilemez.' },
    ],
  },

  // ── Günlük Yaşam (yeni) ──
  'elektrik-tuketimi-hesaplama': {
    about: 'Elektrik tüketimi hesaplama aracı, evinizdeki bir cihazın (klima, ısıtıcı, çamaşır makinesi vb.) ne kadar elektrik tükettiğini ve aylık faturanıza yaklaşık ne kadar yansıyacağını görmenizi sağlar.',
    method: 'Günlük tüketim, cihazın watt cinsinden gücü ile günlük çalışma saatinin çarpılıp 1000\'e bölünmesiyle kilovatsaat (kWh) cinsinden bulunur. Bu değer aylık kullanım gün sayısıyla çarpılarak toplam kWh, ardından kWh birim fiyatınızla çarpılarak yaklaşık maliyet hesaplanır.',
    faq: [
      { q: 'Cihazımın watt değerini nereden öğrenebilirim?', a: 'Çoğu cihazın arkasındaki veya altındaki etikette, kullanım kılavuzunda ya da üretici web sitesinde watt (W) değeri belirtilir.' },
      { q: 'Bu hesaba dağıtım bedeli ve vergiler dahil mi?', a: 'Hayır, yalnızca ham tüketim maliyeti hesaplanır; faturanızdaki dağıtım bedeli, BTV ve KDV gibi kalemler bu tutara ek olarak yansır.' },
      { q: 'Kademeli tarife (çok tüketimde daha yüksek birim fiyat) hesaba katılıyor mu?', a: 'Hayır, tek bir sabit kWh fiyatı varsayılır; kademeli tarifeniz varsa faturanızdaki ortalama birim fiyatı kullanmanız daha isabetli sonuç verir.' },
    ],
  },
  'yolculuk-yakit-payi-hesaplama': {
    about: 'Yolculuk yakıt payı hesaplama aracı, arkadaşlarınızla veya iş arkadaşlarınızla ortak bir araçla yaptığınız yolculukta toplam yakıt maliyetini adil şekilde paylaştırmanızı sağlar.',
    method: 'Toplam yakıt maliyeti, mesafe ve aracın 100 km\'deki tüketimine göre hesaplanan yakıt miktarının, yakıt birim fiyatıyla çarpılmasıyla bulunur. Bu tutar, araçtaki kişi sayısına eşit olarak bölünerek kişi başı ödenecek pay hesaplanır.',
    faq: [
      { q: 'Sadece yolcular mı yoksa sürücü de dahil mi ödemeli?', a: 'Bu araç eşit bölüşüm varsayar ve kişi sayısına sürücüyü de dahil etmenizi önerir; sürücünün araç yıpranması için pay ödememesi gibi kararlar grubunuzun kendi tercihine kalmıştır.' },
      { q: 'Gidiş-dönüş için ayrı mı hesaplamalıyım?', a: 'Mesafe alanına gidiş-dönüş toplam kilometreyi girerek tek seferde tüm yolculuğun maliyetini hesaplayabilirsiniz.' },
      { q: 'Otoyol/köprü geçiş ücretleri dahil mi?', a: 'Hayır, bu araç yalnızca yakıt maliyetini hesaplar; geçiş ücretlerini toplam tutara elle eklemeniz gerekir.' },
    ],
  },
  'oda-alani-malzeme-hesaplama': {
    about: 'Oda alanı ve malzeme ihtiyacı hesaplama aracı, bir odanın zemin alanını (halı, laminat veya parke almadan önce) ve duvarları boyamak için yaklaşık kaç litre boya gerektiğini hesaplamanızı sağlar.',
    method: 'Zemin alanı, odanın uzunluğu ile genişliğinin çarpılmasıyla bulunur. Duvar alanı, odanın çevresi (2×(uzunluk+genişlik)) ile tavan yüksekliğinin çarpılmasıyla hesaplanır; bu alan seçtiğiniz kat sayısı ile çarpılıp boyanın kapladığı alana (varsayılan 10 m²/L) bölünerek net boya miktarı, ardından fire payı eklenerek toplam gereken litre bulunur.',
    faq: [
      { q: 'Kapı ve pencere alanlarını çıkarmalı mıyım?', a: 'Bu araç kapı/pencere alanlarını düşmez; daha hassas bir sonuç için toplam duvar alanından yaklaşık kapı/pencere alanını manuel olarak çıkarabilirsiniz.' },
      { q: 'Neden 2 kat boya öneriliyor?', a: 'Tek kat boya genellikle alttaki rengi tam kapatmaz; iki kat uygulama daha homojen ve kalıcı bir sonuç verir.' },
      { q: 'Farklı marka boyaların kapasitesi neden farklı?', a: 'Boyanın yoğunluğu ve pigment oranına göre 1 litrenin kapladığı alan değişir; kullanacağınız boyanın ambalajındaki "m²/litre" değerini "kat sayısı" alanının yanındaki varsayılan değer yerine girebilirsiniz.' },
    ],
  },

  // ── Sağlık (yeni) ──
  'uyku-saati-hesaplama': {
    about: 'Uyku saati hesaplama aracı, uyku döngülerini esas alarak kalkmak istediğiniz saate göre ne zaman yatmanız gerektiğini ya da yatacağınız saate göre en uygun kalkış saatlerini önerir.',
    method: 'Uyku, yaklaşık 90 dakikalık tekrarlayan döngülerden oluşur. Hesaplama, uykuya dalmak için ortalama 15 dakika ekleyerek 3 ila 6 tam döngüyü kapsayan zaman noktalarını (kalkış veya yatış saatinden geriye/ileriye doğru) hesaplar.',
    faq: [
      { q: 'Neden birden fazla saat öneriliyor?', a: 'Bir uyku döngüsünün ortasında uyanmak yerine döngü tamamlandığında uyanmak daha dinç hissettirdiği için, farklı döngü sayılarına karşılık gelen birkaç seçenek sunulur.' },
      { q: 'Herkes için 15 dakikada uykuya dalmak geçerli mi?', a: 'Hayır, bu ortalama bir varsayımdır; bazı kişiler daha hızlı bazıları daha yavaş uykuya dalabilir, sonucu buna göre birkaç dakika esnetebilirsiniz.' },
      { q: 'Gündüz şekerlemesi (kısa uyku) için de kullanılabilir mi?', a: 'Bu araç gece uykusu için tam döngüleri hesaplar; kısa gündüz şekerlemeleri için genellikle 20-30 dakikalık "power nap" süresi tercih edilir, bu araç o senaryoyu kapsamaz.' },
    ],
  },
  'kafein-takibi-hesaplama': {
    about: 'Kafein takibi aracı, gün içinde içtiğiniz kahve, çay ve enerji içeceklerinin toplamda ne kadar kafein aldığınızı gösterir; kalp çarpıntısı, uykusuzluk veya kaygı gibi aşırı kafein belirtilerini önlemek isteyenler için pratik bir kontrol sağlar.',
    method: 'Her içecek türünün ortalama kafein miktarı (mg), o içecekten günde kaç adet tükettiğinizle çarpılır ve tüm içecekler için toplanır. Bu toplam, EFSA\'nın belirlediği güvenli günlük üst sınırla (yetişkinlerde ~400 mg, gebelik/emzirmede ~200 mg) karşılaştırılır.',
    faq: [
      { q: 'Kafein miktarları neden "ortalama" olarak belirtiliyor?', a: 'Aynı içecek türünde bile marka, demleme süresi ve porsiyon büyüklüğüne göre kafein miktarı değişebilir; bu araç yaygın kabul gören ortalama değerleri kullanır.' },
      { q: 'Çikolata veya ilaçlardaki kafein bu hesaba dahil mi?', a: 'Hayır, bu araç yalnızca listelenen içecek türlerini hesaplar; çikolata, bazı ağrı kesiciler veya takviyelerdeki kafein ayrıca eklenmelidir.' },
      { q: 'Sınırı aşarsam ne olur?', a: 'Güvenli sınırın aşılması kişiye göre çarpıntı, uyku sorunları veya huzursuzluk gibi belirtilere yol açabilir; düzenli olarak sınırı aşıyorsanız tüketiminizi azaltmayı ya da bir sağlık uzmanına danışmayı düşünebilirsiniz.' },
    ],
  },
  'adim-kalori-donusumu-hesaplama': {
    about: 'Adım-kalori dönüşümü aracı, telefon veya akıllı saatinizin gösterdiği günlük adım sayısını yaklaşık yürüme mesafesine ve harcadığınız kaloriye çevirmenizi sağlar.',
    method: 'Mesafe, adım sayısının ortalama adım uzunluğuyla (varsayılan 0,75 m) çarpılmasıyla kilometreye çevrilir. Yakılan kalori ise adım sayısı, vücut ağırlığınız ve ortalama yürüme temposunu yansıtan bir katsayı kullanılarak tahmin edilir.',
    faq: [
      { q: 'Bu hesap koşu için de geçerli mi?', a: 'Bu araç yürüyüş temposunu esas alır; koşarken adım uzunluğu ve enerji harcaması değiştiğinden koşu için sonuç daha az isabetli olabilir.' },
      { q: 'Adım uzunluğumu nasıl bulabilirim?', a: 'Boyunuzun santimetre cinsinden değerinin yaklaşık %41-45\'i ortalama adım uzunluğunuza karşılık gelir; daha kesin ölçüm için birkaç adımlık bilinen bir mesafeyi adım sayınıza bölebilirsiniz.' },
      { q: 'Günde kaç adım önerilir?', a: 'Genel bir hedef olarak günde 8.000-10.000 adım sıkça önerilir, ancak kişisel hedefler yaş, sağlık durumu ve aktivite seviyesine göre değişebilir.' },
    ],
  },

  // ── Eğitim (yeni) ──
  'ders-notu-ortalamasi-hesaplama': {
    about: 'Ders notu ortalaması hesaplama aracı, vize ve final notlarınızı ağırlıklarına göre birleştirerek genel ortalamanızı, ya da henüz final girmediyseniz dersten geçmek için finalden en az kaç almanız gerektiğini gösterir.',
    method: 'Ağırlıklı ortalama, vize notunun vize ağırlığıyla, final notunun final ağırlığıyla çarpılıp toplanması ve toplam ağırlığa bölünmesiyle hesaplanır. Final notu henüz belli değilse, geçme notuna ulaşmak için gereken minimum final notu aynı formül tersine çözülerek bulunur.',
    examples: [
      {
        title: 'Vize 45 (ağırlık %40), final ağırlığı %60, geçme notu 50',
        intro: 'Final notu henüz belli değil; aşağıda gereken minimum final notu gösterilmiştir.',
        rows: [
          { label: 'Geçmek için gereken final notu', value: '53,33' },
        ],
      },
      {
        title: 'Vize 80 (ağırlık %70), final ağırlığı %30, geçme notu 50',
        rows: [
          { label: 'Durum', value: 'Geçme garantilendi' },
          { label: 'Gereken final notu', value: '0 (finalden 0 alsanız bile geçersiniz)' },
        ],
      },
      {
        title: 'Vize 10 (ağırlık %50), final ağırlığı %50, geçme notu 70',
        rows: [
          { label: 'Durum', value: 'Bu vizeyle geçmek mümkün değil' },
          { label: 'Gereken final notu', value: '100\'ün üzerinde (imkansız)' },
        ],
      },
    ],
    faq: [
      { q: 'Vize ve final ağırlıkları toplamı 100 olmak zorunda mı?', a: 'Genellikle öyle olması beklenir (ör. %40 + %60), ancak araç girdiğiniz ağırlıkları kendi toplamlarına göre orantılı olarak değerlendirir.' },
      { q: '"Geçme garantilendi" mesajını ne zaman görürüm?', a: 'Vize notunuz tek başına, finalden 0 alsanız bile ağırlıklı ortalamanızı geçme notunun üzerinde tutuyorsa bu mesaj gösterilir.' },
      { q: '"Bu vizeyle geçmek mümkün değil" ne anlama gelir?', a: 'Finalden 100 alsanız bile ağırlıklı ortalamanızın geçme notuna ulaşamayacağı durumlarda bu uyarı gösterilir; bu durumda bütünleme veya dersi tekrar alma seçeneklerini değerlendirmeniz gerekebilir.' },
      { q: 'Vizeden 45 aldım, finalden kaç almalıyım?', a: 'Vize ağırlığı %40, final ağırlığı %60 ve geçme notu 50 ise finalden en az 53,33 (pratikte 54) almanız gerekir; ağırlıklar farklıysa bu araca kendi rakamlarınızı girerek kesin sonucu görebilirsiniz.' },
      { q: 'Bütünleme sınavı için de bu araç kullanılabilir mi?', a: 'Evet, bütünleme notunu "final notu" alanına, bütünlemenin ders ortalamasındaki ağırlığını da "final ağırlığı" alanına girerek aynı mantıkla hesaplayabilirsiniz.' },
      { q: 'Vize notum yoksa (sadece final ile geçilen bir ders) nasıl kullanmalıyım?', a: 'Vize ağırlığını 0, final ağırlığını 100 olarak girerek yalnızca final notunuza göre bir hesaplama yapabilirsiniz.' },
      { q: 'Üç sınavlı (vize1 + vize2 + final) bir sistemde kullanılabilir mi?', a: 'Bu araç iki bileşenli (vize + final) sistemler için tasarlanmıştır; üç veya daha fazla bileşenli sistemlerde Ortalama Hesaplama aracındaki ağırlıklı ortalama modunu kullanabilirsiniz.' },
      { q: 'Gereken final notu küsuratlı çıkıyor, yukarı mı aşağı mı yuvarlamalıyım?', a: 'Güvenli tarafta kalmak için sonucu her zaman yukarı yuvarlamanız önerilir; örneğin gereken notu 53,33 ise hedefinizi en az 54 olarak belirlemeniz daha güvenlidir.' },
    ],
  },
  'sinav-puani-hesaplama': {
    about: 'Sınav puanı hesaplama aracı, çoktan seçmeli bir sınavda doğru, yanlış ve boş sayınıza göre net puanınızı ve 100 üzerinden karşılığını hesaplamanızı sağlar; ÖSYM tarzı sınavlarda yaygın olan yanlışın doğruyu götürmesi kuralını da uygular.',
    method: 'Net puan, doğru sayısından, yanlış sayısının belirlediğiniz katsayıya (genellikle 4) bölünmesiyle elde edilen değerin çıkarılmasıyla bulunur: net = doğru − (yanlış ÷ katsayı). 100 üzerinden puan ise net değerin toplam soru sayısına oranının 100 ile çarpılmasıyla hesaplanır.',
    faq: [
      { q: 'Her sınavda yanlış, doğruyu 4\'te 1 oranında mı götürür?', a: 'Hayır, bu oran sınava göre değişir; bazı sınavlarda (ör. bazı üniversite sınavları) yanlış-doğru oranı 3\'te 1 veya farklı olabilir, "kaç yanlış 1 doğruyu götürür" alanına sınavınıza uygun değeri girmelisiniz.' },
      { q: 'Boş bıraktığım sorular puanımı etkiler mi?', a: 'Hayır, boş sorular net hesabına dahil edilmez; yalnızca doğru ve yanlış sayısı neti belirler.' },
      { q: 'Doğru ve yanlış toplamı soru sayısını aşarsa ne olur?', a: 'Bu durumda araç geçersiz bir girdi olduğunu belirten bir uyarı gösterir; doğru + yanlış + boş toplamının toplam soru sayısına eşit olması gerekir.' },
    ],
  },
  // ── İnşaat & Tadilat ──
  'boya-hesaplama': {
    about: 'Boya hesaplama aracı, oda ölçülerinize (veya doğrudan girdiğiniz duvar alanına) göre kaç litre boyaya ihtiyacınız olduğunu ve bu ihtiyacı karşılayacak 2,5L/7,5L/15L ambalaj kombinasyonunu hesaplar. Bu araç yalnızca miktar hesaplar; hiçbir boya markası veya fiyatı önermez.',
    method: 'Önce duvar alanı bulunur: oda ölçülerinden hesaplıyorsanız çevre (2×(uzunluk+genişlik)) tavan yüksekliğiyle çarpılır; doğrudan m² giriyorsanız bu adım atlanır. Bu alandan kapı/pencere düşümü çıkarılarak net boyanacak alan bulunur. Net alan, kat sayısıyla çarpılıp boya verimine (m²/L) bölünerek gereken litre miktarı elde edilir. Son olarak bu litre miktarını asla eksik bırakmayacak şekilde 15L, 7,5L ve 2,5L ambalajlardan oluşan bir kombinasyon önerilir.',
    examples: [
      {
        title: 'Oda ölçülerinden: 4m × 5m oda, 2,5m tavan, 2 kat',
        intro: 'Kapı/pencere düşümü 5 m², boya verimi 10 m²/L kabul edilmiştir.',
        rows: [
          { label: 'Duvar alanı', value: '45 m²' },
          { label: 'Net boyanacak alan', value: '40 m²' },
          { label: 'Gereken boya', value: '8 L' },
          { label: 'Ambalaj önerisi', value: '1 × 7,5L + 1 × 2,5L (toplam 10 L)' },
        ],
      },
      {
        title: 'Doğrudan alan girişi: 90 m² duvar, 2 kat',
        intro: 'Kapı/pencere düşümü 8 m², boya verimi 10 m²/L kabul edilmiştir.',
        rows: [
          { label: 'Net boyanacak alan', value: '82 m²' },
          { label: 'Gereken boya', value: '16,4 L' },
          { label: 'Ambalaj önerisi', value: '1 × 15L + 1 × 2,5L (toplam 17,5 L)' },
        ],
      },
    ],
    faq: [
      { q: 'Boya verimi neden ambalajın üzerinde yazandan farklı çıkabilir?', a: 'Ambalajdaki değer düz, emiciliği az bir yüzey için verilmiş idealize bir rakamdır. Sıva emiciliği yüksek yeni duvarlarda, koyu renkten açık renge geçişte veya pürüzlü yüzeylerde gerçek verim düşebilir; bu araçtaki verim alanını kendi durumunuza göre azaltarak daha gerçekçi bir sonuç alabilirsiniz.' },
      { q: 'Kapı ve pencere alanını nasıl hesaplarım?', a: 'Standart bir iç kapı yaklaşık 1,6-2 m², standart bir pencere yaklaşık 1,5 m² alan kaplar; odanızdaki kapı ve pencere sayısını bu tipik değerlerle çarpıp toplayarak düşüm alanını bulabilirsiniz.' },
      { q: 'Astar boyası bu hesaba dahil mi?', a: 'Hayır, bu araç yalnızca son kat (kaplama) boyasını hesaplar. Astar genellikle daha yüksek verimle tek kat uygulanır ve ayrı bir ürün olduğu için ayrıca hesaplanmalıdır.' },
      { q: 'Neden genellikle 2 kat öneriliyor?', a: 'Tek kat uygulamada alttaki eski renk veya leke izleri çoğu zaman tam kapanmaz; iki kat, homojen ve kalıcı bir görünüm için sektörde yaygın kabul gören uygulamadır. Koyu renkten çok açık bir renge geçiyorsanız 3 kat gerekebilir.' },
      { q: 'Tavan boyası bu hesaba dahil mi?', a: 'Hayır, bu araç yalnızca duvar alanını hesaplar. Tavanı da boyayacaksanız zemin alanınızı (uzunluk × genişlik) ayrıca bu araca "duvar alanı" gibi girip hesaplayabilir, iki sonucu toplayabilirsiniz.' },
      { q: 'Ambalaj önerisi neden ihtiyaçtan biraz fazla litre öneriyor?', a: 'Boya, kutu boyutlarının (2,5L/7,5L/15L) izin verdiği en yakın kombinasyonla satılır; ihtiyacı asla eksik bırakmamak için kombinasyon her zaman gereken litreye eşit ya da fazlasını karşılayacak şekilde yukarı yuvarlanır.' },
      { q: 'Dış cephe boyası için bu araç kullanılabilir mi?', a: 'Evet, alan ve kat mantığı aynıdır; ancak dış cephe boyalarının verimi genellikle iç cephe boyalarından farklıdır, bu yüzden verim alanına ürününüzün ambalajındaki değeri girmeniz önemlidir.' },
      { q: 'Fire payı neden bu araçta yok?', a: 'Boyada malzeme, tenekeden doğrudan uygulandığı için fayans/parke gibi kesim/kırılma kaynaklı bir fireye uğramaz; bunun yerine gerçek tüketimi etkileyen kapı/pencere düşümü ve kat sayısı ayrı alanlar olarak modellenmiştir.' },
    ],
  },
  'fayans-seramik-hesaplama': {
    about: 'Fayans/seramik hesaplama aracı, döşeyeceğiniz alana ve seçtiğiniz fayans ebadına göre gereken fayans adedini, kutu sayısını ve derz dolgusu miktarını hesaplar. Fire payını döşeme şekline (düz veya desenli/çapraz) göre ayarlayabilirsiniz.',
    method: 'Bir fayansın alanı, boy × en (cm cinsinden girilip m²\'ye çevrilerek) ile bulunur. Döşenecek alan, seçtiğiniz fire payı kadar büyütülür ve bir fayansın alanına bölünüp yukarı yuvarlanarak gereken adet bulunur; bu adet, kutu başına adet sayısına bölünüp yukarı yuvarlanarak kutu sayısı elde edilir. Derz dolgusu, sektörde yaygın kullanılan ((boy+en) ÷ (boy×en)) × derz genişliği × derz derinliği × yoğunluk formülüyle tahmini olarak hesaplanır.',
    examples: [
      {
        title: '20 m² alan, 60×30 cm fayans, %10 fire',
        rows: [
          { label: 'Bir fayansın alanı', value: '0,18 m²' },
          { label: 'Fire payı dahil alan', value: '22 m²' },
          { label: 'Gereken fayans adedi', value: '123 adet' },
          { label: 'Kutu sayısı (6 adet/kutu)', value: '21 kutu' },
        ],
      },
      {
        title: 'Aynı alan, desenli/çapraz döşeme (%15 fire)',
        intro: 'Desenli veya çapraz döşemede kesim kaybı arttığından fire payı yükseltilmelidir.',
        rows: [
          { label: 'Fire payı dahil alan', value: '23 m²' },
          { label: 'Gereken fayans adedi', value: '128 adet' },
        ],
      },
    ],
    faq: [
      { q: 'Fire payını nasıl seçmeliyim?', a: 'Düz (paralel) döşemede %5-10 genellikle yeterlidir. Desenli, çapraz (baklava dilimi) veya balıksırtı gibi döşemelerde kesim kaybı arttığından %15 seçmeniz önerilir.' },
      { q: 'Kutu başına adet sayısını bilmiyorum, nereden bulabilirim?', a: 'Bu bilgi genellikle fayans kutusunun üzerinde veya satıcının ürün sayfasında "adet/kutu" ya da "m²/kutu" olarak belirtilir; m²/kutu veriliyorsa bunu bir fayansın alanına bölerek adet/kutu değerine ulaşabilirsiniz.' },
      { q: 'Derz dolgusu tahmini ne kadar kesin?', a: 'Bu, sektörde yaygın kullanılan bir referans formülüdür ve derz genişliği/derinliğine göre değişir; kesin ihtiyaç için ürün ambalajındaki sarfiyat tablosuna bakmanız veya ustanıza danışmanız önerilir.' },
      { q: 'Duvar ve zemin fayansı için aynı formül mü geçerli?', a: 'Evet, adet ve kutu hesabı için formül aynıdır; yalnızca alanı (duvar m² veya zemin m²) doğru girmeniz yeterlidir.' },
      { q: 'Kırık/hasarlı fayans için ekstra pay eklemeli miyim?', a: 'Girdiğiniz fire payı zaten kesim kayıplarını kapsar; nakliye veya montaj sırasında kırılma riskine karşı ek olarak birkaç fayans daha sipariş etmek isteyebilirsiniz.' },
      { q: 'Farklı ebatlarda fayans karıştırıyorsam bu araç nasıl kullanılır?', a: 'Bu araç tek bir ebat için hesaplama yapar; farklı ebatlardaki alanları ayrı ayrı hesaplayıp sonuçları toplamanız gerekir.' },
      { q: 'Derz rengi/genişliği sonucu nasıl etkiler?', a: 'Derz genişliği arttıkça (örneğin 3mm yerine 5mm) derz dolgusu tüketimi de artar; bu araçtaki varsayılan değerler tipik ince derzler içindir.' },
    ],
  },
  'duvar-tugla-gazbeton-hesaplama': {
    about: 'Duvar (tuğla/gazbeton) hesaplama aracı, örülecek duvar alanına ve kullanacağınız blok ebadına göre gereken blok adedini ve harç/yapıştırıcı sarfiyatını hesaplar. Hem gazbeton hem geleneksel tuğla duvarlar için kullanılabilir.',
    method: 'Bir bloğun duvarda görünen yüz alanı, genişlik × yükseklik (cm cinsinden girilip m²\'ye çevrilerek) ile bulunur. Duvar alanı, girdiğiniz fire payı kadar büyütülür ve bir bloğun yüz alanına bölünüp yukarı yuvarlanarak gereken blok adedi elde edilir. Harç/yapıştırıcı miktarı ise duvar alanının, girdiğiniz kg/m² sarfiyat değeriyle çarpılmasıyla tahmin edilir.',
    examples: [
      {
        title: '30 m² duvar, 60×20 cm gazbeton blok, %5 fire',
        intro: 'Yapıştırıcı sarfiyatı 5 kg/m² kabul edilmiştir.',
        rows: [
          { label: 'Bloğun yüz alanı', value: '0,12 m²' },
          { label: 'Fire payı dahil alan', value: '31,5 m²' },
          { label: 'Gereken blok adedi', value: '263 adet' },
          { label: 'Tahmini yapıştırıcı', value: '150 kg' },
        ],
      },
    ],
    faq: [
      { q: 'Gazbeton ile geleneksel tuğla arasındaki hesap farkı nedir?', a: 'Adet hesabı için formül aynıdır (alan ÷ blok yüz alanı); asıl fark harç/yapıştırıcı sarfiyatındadır. Gazbeton ince yatak yapıştırıcısı genellikle 4-6 kg/m² kullanırken, geleneksel harçla örülen tuğla duvarlarda bu değer 20-30 kg/m²\'ye kadar çıkabilir.' },
      { q: 'Blok ebadını nereden öğrenirim?', a: 'Blok ambalajı veya ürün etiketi üzerinde genellikle "genişlik × yükseklik × derinlik" (ör. 60×20×10 cm) olarak belirtilir; derinlik duvar kalınlığını gösterir, adet hesabında kullanılmaz.' },
      { q: 'Fire payı olarak %5 yeterli mi?', a: 'Düz duvarlarda %5 genellikle yeterlidir; çok sayıda kapı/pencere boşluğu, köşe veya kesim gerektiren düzensiz bir duvar planında %8-10 seçmeniz daha güvenli olur.' },
      { q: 'Kapı ve pencere boşluklarını duvar alanından düşmeli miyim?', a: 'Evet, gerçek ihtiyacı bulmak için duvar alanına yalnızca örülecek net alanı (boşluklar düşülmüş) girmeniz gerekir.' },
      { q: 'Derz/yatay harç miktarı bu hesaba dahil mi?', a: 'Girdiğiniz kg/m² sarfiyat değeri, yatay ve düşey derzler dahil toplam harç/yapıştırıcı tüketimini temsil eder; bu değeri ürün ambalajındaki teknik veriye göre ayarlayabilirsiniz.' },
      { q: 'Taşıyıcı duvar hesaplarında bu araç yeterli mi?', a: 'Hayır, bu araç yalnızca malzeme miktarı tahmini yapar; taşıyıcı sistem, statik hesap ve donatı gibi mühendislik kararları için mutlaka bir inşaat mühendisine danışmalısınız.' },
    ],
  },
  'beton-sap-hesaplama': {
    about: 'Beton/şap hesaplama aracı, döşenecek alan ve kalınlığa göre gereken beton/şap hacmini (m³) ve bunun hazır beton mikser karşılığını hesaplar. Aynı alan × kalınlık formülü temel betonu (grobeton), zemin/saha betonu ve ince şap için de geçerlidir — sadece kendi projenize uygun kalınlığı girmeniz yeterlidir. Hazır beton yerine elle karım yapacaklar için tipik çimento/kum/çakıl/su oranlarını da gösterir.',
    method: 'Hacim, alan × kalınlık formülüyle bulunur ve girdiğiniz fire payı kadar büyütülür. Bu hacim, mikser kapasitesine bölünerek kaç mikser sipariş etmeniz gerektiği (yukarı yuvarlanarak) hesaplanır. Elle karım seçeneğinde aynı hacim, genel amaçlı C25/30 sınıfı beton için yaygın kabul gören çimento (kg/m³), kum (m³/m³), çakıl (m³/m³) ve su (L/m³) oranlarıyla çarpılarak yaklaşık malzeme miktarları tahmin edilir.',
    examples: [
      {
        title: '50 m² alan, 10 cm kalınlık, %5 fire',
        rows: [
          { label: 'Gereken hacim', value: '5,25 m³' },
          { label: 'Mikser sayısı (6 m³ kapasite)', value: '1 mikser sipariş edin (yaklaşık 0,88 mikser karşılığı)' },
        ],
      },
      {
        title: 'Elle karım için malzeme (5 m³ üzerinden)',
        rows: [
          { label: 'Çimento', value: '1.750 kg (35 torba × 50 kg)' },
          { label: 'Kum', value: '2,5 m³' },
          { label: 'Çakıl', value: '4 m³' },
          { label: 'Su', value: '900 L' },
        ],
      },
    ],
    faq: [
      { q: 'Bu araç hem beton hem şap için mi kullanılır?', a: 'Evet, ikisi de aynı formülle (alan × kalınlık) hacim olarak hesaplanır; kalınlık alanına şap için genellikle 3-8 cm, döşeme betonu için 10-20 cm gibi kendi projenize uygun değeri girmeniz yeterlidir.' },
      { q: 'Neden fire payı ekleniyor?', a: 'Zemindeki kot farkları, taşıma/dökme sırasındaki kayıplar ve kalıp sızıntıları nedeniyle gerçek tüketim hesaplanan net hacimden bir miktar fazla olur; %5 tipik bir başlangıç değeridir.' },
      { q: 'Mikser kapasitesini neden değiştirebiliyorum?', a: 'Hazır beton mikserleri genellikle 6 m³ taşır, ancak bazı bölgelerde veya dar sokaklarda daha küçük (ör. 4 m³) mikserler kullanılabilir; firmanızın kullandığı kapasiteyi girerek doğru sipariş adedini görebilirsiniz.' },
      { q: 'Elle karım oranları her beton için geçerli mi?', a: 'Hayır, bu oranlar genel amaçlı C25/30 sınıfı beton için yaygın kullanılan referans değerlerdir; taşıyıcı elemanlar veya farklı dayanım sınıfları için oranlar değişir ve bir mühendisin belirlediği karışım tasarımına uyulmalıdır.' },
      { q: 'Donatı (demir) miktarı bu hesaba dahil mi?', a: 'Hayır, bu araç yalnızca beton/şap hacmini ve karışım malzemelerini hesaplar; donatı, taşıyıcı sistem gerektiren dökümlerde ayrı bir statik hesapla belirlenmelidir.' },
      { q: 'Zemin ısıtmalı (yerden ısıtma) şap için farklı bir hesap mı gerekir?', a: 'Hacim hesabı aynıdır; ancak yerden ısıtmalı sistemlerde şap kalınlığı genellikle biraz daha fazla tutulur (boru üstü payı dahil), bu değeri kalınlık alanına siz girmelisiniz.' },
      { q: 'Kaç torba çimento gerektiği nasıl bulunuyor?', a: 'Toplam çimento miktarı (kg), standart 50 kg\'lık torba ağırlığına bölünüp yukarı yuvarlanarak torba sayısına çevrilir.' },
      { q: 'Bu araçla temel betonu (grobeton) hesaplanabilir mi?', a: 'Evet. Grobeton (tesviye betonu), zemin ile temel arasına dökülen, donatısız, düşük dozlu (C8-C16) bir dolgu/temel altı betonudur; kalınlığı genellikle 10 cm civarındadır (minimum 5 cm, maksimum ~20 cm). Alan kısmına temel izdüşüm alanınızı, kalınlık kısmına da bu değeri girerek hacmi ve mikser sayısını bulabilirsiniz.' },
      { q: 'Zemin betonu (saha betonu) kalınlığı ne kadar olmalı?', a: 'Zemin/saha betonu tipik olarak yaklaşık 10 cm kalınlığında dökülür; garaj veya depo gibi ağır yük taşıyan zeminlerde bu değer daha da artırılabilir. Bu değeri kalınlık alanına girmeniz, aracın geri kalanını aynı şekilde hesaplaması için yeterlidir.' },
      { q: 'Grobeton ile temel betonu (temel betonarmesi) aynı şey mi?', a: 'Hayır. Grobeton, donatısız ve düşük dayanımlı bir hazırlık/tesviye katmanıdır; asıl taşıyıcı temel betonu (temel betonarmesi) bunun üzerine, donatılı ve daha yüksek dayanım sınıfıyla ayrıca dökülür. Bu araç her iki katmanın hacmini de (ayrı ayrı, kendi kalınlıklarını girerek) hesaplayabilir, ancak donatı miktarını hesaplamaz.' },
    ],
  },
  'parke-laminat-hesaplama': {
    about: 'Parke/laminat hesaplama aracı, döşeyeceğiniz alana, seçtiğiniz ürünün paket kapsamına (m²/paket) ve fire payına göre gereken paket sayısını hesaplar; ayrıca oda çevrenizden süpürgelik metrenizi hesaplamanıza yardımcı olur.',
    method: 'Alan, girdiğiniz fire payı kadar büyütülür ve paket kapsamına (m²/paket) bölünüp yukarı yuvarlanarak gereken paket sayısı bulunur; böylece açık paket almadan alanınızın tamamı kaplanabilir. Süpürgelik metresi, girdiğiniz oda çevresinden doğrudan alınır.',
    examples: [
      {
        title: '20 m² alan, 2,2 m²/paket kapsam, %10 fire',
        rows: [
          { label: 'Fire payı dahil alan', value: '22 m²' },
          { label: 'Gereken paket sayısı', value: '10 paket' },
        ],
      },
      {
        title: 'Balıksırtı döşeme, aynı alan (%15 fire)',
        intro: 'Balıksırtı veya çapraz döşemede kesim kaybı arttığından fire payı yükseltilmelidir.',
        rows: [
          { label: 'Fire payı dahil alan', value: '23 m²' },
          { label: 'Gereken paket sayısı', value: '11 paket' },
        ],
      },
    ],
    faq: [
      { q: 'Paket kapsamını (m²/paket) nereden bulurum?', a: 'Bu değer genellikle paket üzerinde veya ürünün satış sayfasında belirtilir; parke/laminat tahtalarının tek tek m² ölçüsü ile paketteki tahta sayısının çarpımıdır.' },
      { q: 'Fire payı olarak %10 her zaman yeterli mi?', a: 'Düz (paralel) döşemede genellikle yeterlidir; balıksırtı, çapraz veya dar/düzensiz odalarda kesim kaybı arttığından %15 veya üzeri seçmeniz önerilir.' },
      { q: 'Süpürgelik metresini nasıl hesaplarım?', a: 'Oda çevresi, 2 × (uzunluk + genişlik) formülüyle bulunur. Kapı boşluklarında süpürgelik kullanılmayacaksa bu boşlukların genişliğini toplam çevreden çıkarabilirsiniz.' },
      { q: 'Zıvana/klik sistem farkı hesaplamayı etkiler mi?', a: 'Hayır, bu araç yalnızca alan bazlı paket sayısını hesaplar; döşeme sistemi (klik, yapıştırma vb.) paket sayısını değiştirmez.' },
      { q: 'Ara altlık (şilte) malzemesi bu hesaba dahil mi?', a: 'Hayır, ara altlık ayrı bir üründür ve genellikle rulo halinde m² üzerinden satılır; toplam alanınızı (fire payı eklemeden) altlık hesabında da kullanabilirsiniz.' },
      { q: 'Kapalı balkon veya nem oranı yüksek alanlarda bu araç kullanılabilir mi?', a: 'Hesap mantığı aynıdır, ancak bu tür alanlarda laminat yerine nem dayanımlı ürünler tercih edilmesi önerilir; bu tercih paket kapsamını değil yalnızca ürün seçiminizi etkiler.' },
    ],
  },
  'banyo-tadilat-butcesi-hesaplama': {
    about: 'Banyo tadilat bütçesi hesaplama aracı, yıkım, tesisat, elektrik, seramik, vitrifiye, duşakabin, mobilya ve boya gibi tipik banyo tadilat kalemlerini tek tek açıp kapatmanıza ve her kalem için kendi teklif tutarınızı girmenize olanak tanır; toplam bütçenizi ve kalemlerin bütçe içindeki payını gösterir.',
    method: 'İhtiyacınız olmayan kalemleri kapatabilirsiniz; kapalı kalemler toplama dahil edilmez. Açık kalemlerin girdiğiniz tutarları toplanarak genel bütçe bulunur; her kalemin toplam içindeki oranı da (kalem tutarı ÷ toplam × 100) ayrı ayrı gösterilir. Bu araçta hiçbir kalem için önerilen bir fiyat yoktur; tüm tutarları siz, aldığınız tekliflere göre girersiniz.',
    faq: [
      { q: 'Varsayılan tutarlar bir fiyat önerisi mi?', a: 'Hayır, alanlarda görünen değerler yalnızca örnek/başlangıç değerleridir; bölgeye, malzeme kalitesine ve ustaya göre gerçek fiyatlar çok değişir. Bu tutarları mutlaka aldığınız gerçek tekliflerle değiştirin.' },
      { q: 'Bir kalemi kapatırsam ne olur?', a: 'Kapalı kalemin tutarı toplam bütçeye ve oran grafiğine dahil edilmez; örneğin mevcut mobilyanızı kullanmaya devam edecekseniz "Banyo mobilyası" kalemini kapatabilirsiniz.' },
      { q: 'Malzeme ve işçiliği ayrı kalemler olarak girebilir miyim?', a: 'Bu araçtaki kalemler malzeme+işçiliği birlikte temsil eder; isterseniz bir kalemin tutarına yalnızca malzeme, ayrı bir hesaplamada yalnızca işçilik tutarını girip iki sonucu kendiniz toplayabilirsiniz.' },
      { q: 'Hangi sırayla tadilat yaptırmalıyım?', a: 'Genel olarak yıkım/moloz atımı → su/elektrik tesisatı → seramik → vitrifiye/duşakabin → mobilya → boya sırası izlenir; tesisat işleri seramik döşenmeden önce tamamlanmalıdır.' },
      { q: 'Birden fazla firmadan teklif almalı mıyım?', a: 'Evet, özellikle seramik+işçilik ve vitrifiye gibi büyük kalemlerde en az 2-3 farklı teklif karşılaştırmanız, gerçekçi bir bütçe oluşturmanıza yardımcı olur.' },
      { q: 'Sonuçları paylaşabilir miyim?', a: 'Evet, sayfanın adres çubuğundaki bağlantı girdiğiniz tüm kalem ve tutarları içerir; bu bağlantıyı kopyalayıp ustanızla veya aile üyelerinizle paylaşabilirsiniz.' },
      { q: 'Küçük bir banyo yenilemesi (yalnızca boya+armatür) için de kullanılabilir mi?', a: 'Evet, kapsamınız dışındaki tüm kalemleri kapatıp yalnızca ilgili kalemleri (ör. boya, vitrifiye) açık bırakarak daha dar kapsamlı bir bütçe de oluşturabilirsiniz.' },
    ],
  },
  'mutfak-tadilat-butcesi-hesaplama': {
    about: 'Mutfak tadilat bütçesi hesaplama aracı, dolap/tezgah, ankastre setler, tesisat, fayans, elektrik, boya ve işçilik gibi tipik mutfak tadilat kalemlerini tek tek açıp kapatmanıza ve her kalem için kendi teklif tutarınızı girmenize olanak tanır; toplam bütçenizi ve kalemlerin bütçe içindeki payını gösterir.',
    method: 'İhtiyacınız olmayan kalemleri kapatabilirsiniz; kapalı kalemler toplama dahil edilmez. Açık kalemlerin girdiğiniz tutarları toplanarak genel bütçe bulunur; her kalemin toplam içindeki oranı da (kalem tutarı ÷ toplam × 100) ayrı ayrı gösterilir. Bu araçta hiçbir kalem için önerilen bir fiyat yoktur; tüm tutarları siz, aldığınız tekliflere göre girersiniz.',
    faq: [
      { q: 'Varsayılan tutarlar bir fiyat önerisi mi?', a: 'Hayır, alanlarda görünen değerler yalnızca örnek/başlangıç değerleridir; mutfak dolabı özellikle malzeme (MDF, lake, masif vb.) ve metraja göre çok değişir. Bu tutarları mutlaka aldığınız gerçek tekliflerle değiştirin.' },
      { q: 'Ankastre cihazları neden ayrı bir kalem?', a: 'Fırın, ocak ve davlumbaz gibi ankastre setler genellikle dolap üreticisinden bağımsız, ayrı marka ve fiyat aralıklarından satın alınır; bu yüzden ayrı bir bütçe kalemi olarak modellenmiştir.' },
      { q: 'Mevcut dolaplarımı yeniletmek (kapak değişimi) için bu araç uygun mu?', a: 'Evet, "Mutfak dolabı ve tezgah" kalemine yalnızca kapak/tezgah yenileme teklifini girip diğer kalemleri ihtiyacınıza göre kapatarak kullanabilirsiniz.' },
      { q: 'Hangi sırayla tadilat yaptırmalıyım?', a: 'Genel olarak su/elektrik altyapısı → fayans → dolap/tezgah montajı → ankastre cihazların yerleştirilmesi → boya sırası izlenir.' },
      { q: 'Beyaz eşya (buzdolabı, bulaşık makinesi) bu bütçeye dahil mi?', a: 'Hayır, ankastre olmayan bağımsız beyaz eşyalar bu listede yer almaz; isterseniz benzer mantıkla kendi ek kalemlerinizi zihninizde toplayıp genel bütçenize ekleyebilirsiniz.' },
      { q: 'Birden fazla firmadan teklif almalı mıyım?', a: 'Evet, özellikle dolap/tezgah ve ankastre setler gibi büyük kalemlerde birden fazla teklif karşılaştırmanız önemli bir tasarruf sağlayabilir.' },
    ],
  },
  'cati-hesaplama': {
    about: 'Çatı hesaplama aracı, çatı taban (plan) ölçülerinize ve çatı eğiminize göre gerçek çatı yüzey alanını hesaplar; bu alandan yola çıkarak yaklaşık kiremit/panel adedini ve membran/OSB levha ihtiyacınızı tahmin eder.',
    method: 'Taban (plan) alanı, uzunluk × genişlik ile bulunur. Eğimli bir çatının gerçek yüzey alanı, taban alanının eğim açısının kosinüsüne bölünmesiyle hesaplanır (alan ÷ cos(açı)); açı arttıkça gerçek alan taban alanından belirgin şekilde büyür. Bu alana fire payı eklenip kiremit yoğunluğuyla (adet/m²) çarpılarak yaklaşık kiremit adedi, standart 122×244 cm OSB levha alanına bölünerek de levha sayısı tahmin edilir.',
    examples: [
      {
        title: '10m × 8m taban, 30° eğim, %10 fire',
        rows: [
          { label: 'Taban alanı', value: '80 m²' },
          { label: 'Gerçek çatı alanı', value: '92,38 m²' },
          { label: 'Fire payı dahil alan', value: '101,61 m²' },
          { label: 'Tahmini kiremit adedi (10 adet/m²)', value: '1.017 adet' },
        ],
      },
    ],
    faq: [
      { q: 'Çatı eğimini nereden öğrenirim?', a: 'Eğim, mimari projenizde derece veya yüzde olarak belirtilir; yüzde cinsinden biliyorsanız yaklaşık derece karşılığı, açı = arctan(eğim%/100) formülüyle bulunabilir (ör. %50 eğim ≈ 27 derece).' },
      { q: 'Gerçek çatı alanı neden taban alanından büyük çıkıyor?', a: 'Eğimli bir yüzeyin gerçek alanı, aynı ölçüdeki düz (yatay) tabandan her zaman büyüktür; eğim arttıkça bu fark da büyür. Bu araç, taban alanınızı eğim açısına göre düzelterek gerçek yüzey alanını hesaplar.' },
      { q: 'Kiremit yoğunluğu (adet/m²) neden değişir?', a: 'Bu değer kiremit tipine (Marsilya, alaturka, düz vb.) ve ebadına göre değişir; ürününüzün ambalajında veya teknik föyünde belirtilen "adet/m²" değerini girerek daha doğru bir sonuç alabilirsiniz.' },
      { q: 'Saçak ve mahya bu hesaba dahil mi?', a: 'Hayır, bu araç yalnızca ana çatı yüzeyini hesaplar; saçak çıkıntıları, mahya kiremidi ve dere (valley) gibi ek malzemeler ayrıca hesaplanmalıdır.' },
      { q: 'Kırma (dört yüzeyli) çatılarda bu araç nasıl kullanılır?', a: 'Bu araç tek bir eğim ve tek bir taban alanı üzerinden basitleştirilmiş bir hesap yapar; karmaşık kırma çatılarda her yüzeyi ayrı ayrı hesaplayıp toplamanız daha doğru sonuç verir.' },
      { q: 'Membran/su yalıtım örtüsü miktarı OSB ile aynı mı hesaplanır?', a: 'Bu araçtaki levha sayısı OSB\'ye göredir; rulo halinde satılan membranlar için gerçek alanı (areaWithWaste), rulonun kapladığı m² değerine bölerek gereken rulo sayısını kendiniz hesaplayabilirsiniz.' },
      { q: 'Güneş paneli (GES) kurulumu için çatı alanı hesabında bu araç kullanılabilir mi?', a: 'Gerçek çatı alanı hesaplaması aynı mantıkla kullanılabilir, ancak panel yerleşimi gölgelenme, yönelim ve montaj boşlukları gibi ek faktörlere bağlıdır; kesin panel sayısı için bir GES firmasına danışmanız önerilir.' },
    ],
  },
  'ev-yapim-maliyeti-planlayici': {
    about: 'Ev yapım maliyeti planlayıcı, temel/hafriyat, kaba yapı, çatı, tesisat, elektrik, sıva/boya, zemin, doğrama ve dış cephe gibi sıfırdan ev yapımının tipik aşamalarını tek tek açıp kapatmanıza ve her aşama için kendi tahmini/teklif tutarınızı girmenize olanak tanır; özellikle köyde veya müstakil arsada ev yaptırmayı planlayanlar için tasarlanmıştır.',
    method: 'İhtiyacınız olmayan aşamaları kapatabilirsiniz (örneğin hazır bir temeliniz varsa "Hafriyat ve temel"i kapatabilirsiniz); kapalı kalemler toplama dahil edilmez. Açık kalemlerin girdiğiniz tutarları toplanarak toplam tahmini yapım maliyeti bulunur; her kalemin toplam içindeki oranı da ayrı ayrı gösterilir. Bu araçta hiçbir kalem için önerilen bir fiyat yoktur; tüm tutarları siz, bölgenizdeki müteahhit/ustalardan aldığınız tekliflere göre girersiniz.',
    faq: [
      { q: 'Köyde ev yapmak şehirde yapmaktan farklı mı bütçelenir?', a: 'Aşamalar aynıdır, ancak köyde/arsada altyapı (yol, su, elektrik bağlantısı) hazır olmayabilir; bu durumda dış cephe ve temel kalemlerinize ek olarak altyapı bağlantı maliyetlerini de ayrı bir kalem olarak bütçenize eklemeniz gerekebilir.' },
      { q: 'Varsayılan tutarlar bir maliyet tahmini/önerisi mi?', a: 'Hayır, alanlarda görünen değerler yalnızca örnek/başlangıç değerleridir; arsa büyüklüğü, ev metrekaresi, malzeme kalitesi ve bölgeye göre gerçek maliyetler çok değişir. Bu tutarları mutlaka aldığınız gerçek tekliflerle değiştirin.' },
      { q: 'Hangi sırayla ilerlemeliyim?', a: 'Genel olarak temel → kaba yapı (duvar/karkas) → çatı → tesisat/elektrik altyapısı → sıva/boya → zemin kaplaması → doğrama sırası izlenir; dış cephe genellikle kaba yapı bittikten sonra planlanır.' },
      { q: 'Diğer inşaat hesaplayıcılarını (boya, fayans, beton...) bu araçla birlikte kullanabilir miyim?', a: 'Evet, örneğin "Beton/Şap Hesaplama" ile temel/döşeme betonu hacmini, "Çatı Hesaplama" ile kiremit ihtiyacını ayrı ayrı hesaplayıp buradaki ilgili kaleme tahmini tutar olarak girebilirsiniz.' },
      { q: 'Arsa alım maliyeti bu bütçeye dahil mi?', a: 'Hayır, bu araç yalnızca yapım (inşaat) maliyetini kapsar; arsa bedeli, tapu harcı gibi kalemler dahil değildir.' },
      { q: 'Mimari proje ve ruhsat masrafları nereye eklenir?', a: 'Bu araçta ayrı bir kalem olarak yer almaz; isterseniz bu masrafları mevcut kalemlerden birine (ör. "Hafriyat ve temel") dahil ederek veya toplam sonucu elle bu tutar kadar artırarak dikkate alabilirsiniz.' },
      { q: 'Birden fazla müteahhitten teklif almalı mıyım?', a: 'Evet, özellikle kaba yapı ve çatı gibi büyük kalemlerde birden fazla müteahhit/ustadan teklif almanız, gerçekçi bir toplam bütçe oluşturmanıza yardımcı olur.' },
    ],
  },
  'alci-siva-hesaplama': {
    about: 'Alçı/sıva hesaplama aracı, duvar/tavan alanı, uygulama kalınlığı (mm) ve seçtiğiniz malzeme türüne (saten alçı, perlitli sıva alçısı, makine sıvası, kaba sıva) göre gereken malzeme miktarını (kg) ve torba sayısını hesaplar. "Ters hesap" modunda ise elinizdeki torba sayısından, o torbaların kaç m² alanı kaplayacağını bulabilirsiniz (ör. "35 kg alçı kaç m² yer yapar?").',
    method: 'Gereken miktar (kg), alan × kalınlık (mm) × malzemenin kg/m²/mm cinsinden sarfiyat oranı formülüyle hesaplanır ve girdiğiniz fire payı kadar büyütülür; bu miktar seçtiğiniz torba ağırlığına bölünüp yukarı yuvarlanarak torba sayısına çevrilir. Her malzemenin sarfiyat oranı farklıdır ve üretici teknik föylerinden alınmıştır: saten alçı ve makine sıvası için 1 mm kalınlıkta ortalama 1 kg/m², perlitli sıva alçısı için ortalama 0,95 kg/m², çimento esaslı kaba sıva için ortalama 1,45 kg/m². Ters hesapta aynı formül tersine çevrilir: torba sayısı × torba ağırlığı, kalınlık × sarfiyat oranına bölünerek kaplanabilir alan bulunur.',
    examples: [
      {
        title: '20 m² alan, 1 mm saten alçı (tipik perdah kalınlığı), %5 fire',
        rows: [
          { label: 'Gereken miktar', value: '21 kg' },
          { label: 'Torba sayısı (35 kg)', value: '1 torba' },
        ],
      },
      {
        title: '10 m² alan, 10 mm (1 cm) kaba sıva, %5 fire',
        rows: [
          { label: 'Gereken miktar', value: '152,25 kg' },
          { label: 'Torba sayısı (35 kg)', value: '5 torba' },
        ],
      },
      {
        title: 'Ters hesap: 1 torba (35 kg) saten alçı, 1 mm kalınlık',
        rows: [
          { label: 'Kaplanabilir alan', value: '35 m²' },
        ],
      },
    ],
    faq: [
      { q: '35 kg alçı kaç m² yer yapar?', a: '1 mm kalınlığında (standart saten perdah alçısı için tipik uygulama kalınlığı) sürüldüğünde, 35 kg saten alçı yaklaşık 35 m² yer kaplar; çünkü saten alçının sarfiyatı üretici teknik föylerine göre 1 mm kalınlıkta yaklaşık 1 kg/m²\'dir. Daha kalın uygulamada (ör. 2 mm) aynı 35 kg yaklaşık 17,5 m² kaplar. Bu aracın "Ters hesap" modunda torba sayınızı ve kalınlığı girerek kendi durumunuz için kesin sonucu görebilirsiniz.' },
      { q: '35 kg sıva alçı kaç m² yer yapar?', a: 'Bu, hangi sıva türü olduğuna göre değişir. Örneğin 10 mm (1 cm) kalınlığında uygulanan makine sıvası için sarfiyat yaklaşık 1 kg/m²/mm olduğundan, 35 kg yaklaşık 3,5 m² kaplar; perlitli sıva alçısında (sarfiyatı biraz daha düşük, ~0,95 kg/m²/mm) bu değer yaklaşık 3,7 m²\'dir. Saten alçı gibi çok ince (1 mm) sürülen bir malzeme değilse, "sıva" kalınlığı genellikle 8-20 mm arasında olur; kendi kalınlığınızı girerek doğru sonucu görebilirsiniz.' },
      { q: 'Alçı sıva m² hesabı nasıl yapılır?', a: 'Genel formül: gereken kg = alan (m²) × kalınlık (mm) × malzemenin kg/m²/mm sarfiyat oranı. Bu araç, seçtiğiniz malzeme türüne göre doğru sarfiyat oranını otomatik kullanır; siz yalnızca alanı, kalınlığı ve malzeme türünü girmeniz yeterlidir.' },
      { q: 'Malzeme türleri arasındaki sarfiyat farkı neden bu kadar önemli?', a: 'Aynı alan ve kalınlıkta bile malzemeye göre gereken kg değişir: örneğin 10 m² alanı 10 mm kalınlıkta kaplamak için saten alçı/makine sıvası ~100 kg gerektirirken, çimento esaslı kaba sıva ~145 kg gerektirir. Yanlış malzeme seçimiyle yapılan hesap, torba sayısında ciddi sapmaya yol açabilir.' },
      { q: 'Fire payı neden ekleniyor?', a: 'Duvar/tavan yüzeyindeki düzensizlikler, karışım sırasında dökülen/kalan malzeme ve taşıma kayıpları nedeniyle gerçek tüketim hesaplanan net miktardan bir miktar fazla olur; %5 tipik bir başlangıç değeridir, çok düzensiz yüzeylerde artırabilirsiniz.' },
      { q: 'Torba ağırlığını neden seçebiliyorum?', a: 'Piyasada alçı/sıva ürünleri farklı ambalaj ağırlıklarıyla satılır (yaygın olarak 25, 35 ve 40 kg); kullanacağınız ürünün ambalaj ağırlığını seçerek doğru torba sayısını görebilirsiniz.' },
      { q: 'Ters hesap modu ne işe yarar?', a: 'Elinizde zaten alınmış belirli sayıda torba varsa (ör. arta kalan malzeme), bu modla o torbaların, girdiğiniz kalınlıkta yaklaşık kaç m² alanı kaplayabileceğini görebilirsiniz — "35 kg alçı kaç m² yapar?" gibi sorguların doğrudan cevabıdır.' },
      { q: 'Kartonpiyer alçısı neden bu araçta yok?', a: 'Kartonpiyer alçısı, diğer dört malzemeden farklı bir amaçla kullanılır: düz bir yüzeye ince bir kalınlıkta sürülen bir kaplama değil, kartonpiyer/kalıp profillerini duvar veya tavana yapıştırmak için kullanılan bir montaj/yapıştırma alçısıdır. Sarfiyatı alan × kalınlık ile değil, karışım oranı (yaklaşık 7-7,5 L su / 10 kg alçı) ve uygulama tekniğiyle (profilin arkasına sürülen şerit miktarı) belirlenir; üreticiler bu ürün için kg/m² cinsinden bir sarfiyat değeri yayınlamaz. Aynı nedenle alçıpan (kartonpiyer değil, drywall) derz dolgusu/macunu da bu araca dahil edilmedi: onun sarfiyatı da sabit bir bant genişliğiyle yapılan derz doldurma işlemine bağlıdır, kullanıcının seçtiği bir kalınlığa göre ölçeklenmez. Bu malzemeleri kullanacaksanız, ürün ambalajındaki karışım/sarfiyat talimatını esas almanız en doğrusudur.' },
    ],
  },
  'klima-btu-hesaplama': {
    about: 'Klima BTU hesaplama aracı, oda alanı, tavan yüksekliği, kat/cephe/güneş alma durumu ve odadaki kişi/elektronik cihaz yüküne göre önerilen BTU (soğutma kapasitesi) aralığını ve buna en yakın standart klima sınıfını (9000/12000/18000/24000 BTU) hesaplar. Sonuç kesin bir mühendislik hesabı değil, Türkiye\'de yaygın kullanılan pratik bir tahmin yöntemidir; bu yüzden tek bir sayı yerine bir aralık olarak sunulur.',
    method: 'Taban ihtiyaç, oda alanının yaklaşık 600 BTU/m² ile çarpılmasıyla bulunur. Tavan yüksekliği 2,5 metrenin üzerindeyse oda hacmiyle orantılı olarak ihtiyaç artırılır. Kat/cephe/güneş alma durumuna göre az güneşli odalarda %5 azaltma, çok güneşli (güney/batı cephe) veya üst kat/çatı katı odalarda %15-25 arası artış uygulanır. 2 kişilik taban varsayımının üzerindeki her kişi ve sürekli çalışan her elektronik cihaz için 600 BTU/h eklenir. Elde edilen değerin ±%10\'u aralık olarak gösterilir ve en yakın standart klima sınıfı önerilir.',
    examples: [
      {
        title: '20 m², 2,5 m tavan, normal maruziyet, 2 kişi',
        rows: [
          { label: 'Önerilen aralık', value: '10.800 - 13.200 BTU/h' },
          { label: 'Tipik klima sınıfı', value: '12.000 BTU' },
        ],
      },
      {
        title: '15 m², çok güneşli + üst kat, 3 kişi + 1 cihaz',
        rows: [
          { label: 'Önerilen aralık', value: '11.205 - 13.695 BTU/h' },
          { label: 'Tipik klima sınıfı', value: '18.000 BTU' },
        ],
      },
    ],
    faq: [
      { q: '9000 BTU kaç m² soğutur?', a: 'Genel kabul gören pratik tabloya göre 9000 BTU\'luk bir klima, iyi yalıtımlı ve normal maruziyetli 10-15 m² arası bir odayı soğutmaya yeterlidir. Çok güneş alan veya üst kat odalarda bu değer daha küçük bir alanla sınırlı kalabilir.' },
      { q: '12000 BTU kaç m² soğutur?', a: '12000 BTU\'luk bir klima, tipik olarak 15-25 m² arası bir odayı soğutur; kesin sınır oda yüksekliği, güneş alma durumu ve kişi sayısına göre değişir.' },
      { q: '18000 BTU kaç m² soğutur?', a: '18000 BTU\'luk bir klima, tipik olarak 25-35 m² arası bir alanı soğutur; salon gibi geniş ve çok güneş alan mekanlarda bu üst sınıra daha erken ihtiyaç duyulabilir.' },
      { q: 'Klima BTU hesabı neden kesin bir sayı değil aralık veriyor?', a: 'BTU ihtiyacı; güneşlenme açısı, pencere/cam alanı, yalıtım kalitesi ve kullanım yoğunluğu gibi bu araca girmeyen birçok faktöre de bağlıdır. Bu yüzden sonuç, gerçekçi bir aralık olarak sunulur; kesin seçim için yetkili bir klima firması veya mühendisin yerinde ısı yükü değerlendirmesi yaptırmanız önerilir.' },
      { q: 'Tavan yüksekliği BTU ihtiyacını neden etkiliyor?', a: 'Soğutulması gereken asıl şey oda alanı değil oda hacmidir; standart 2,5 m\'nin üzerindeki her tavan yüksekliği artışı, aynı zemin alanında daha fazla havanın soğutulması gerektiği anlamına gelir.' },
      { q: 'Üst kat/çatı katı neden daha fazla BTU gerektiriyor?', a: 'Çatıdan gelen güneş ışınımı ve dış sıcaklık etkisi üst kat/çatı katı odalarda ısı kazancını artırır; bu nedenle aynı büyüklükteki ara kat odalarına göre daha yüksek kapasiteli bir klima gerekir.' },
      { q: 'Kişi ve cihaz sayısı neden hesaba dahil ediliyor?', a: 'Her insan vücudu ve çalışan elektronik cihaz (TV, bilgisayar vb.) ortama ısı yayar; kalabalık veya cihaz yoğun odalarda bu ek ısı yükü klima kapasitesi hesabına eklenmelidir.' },
      { q: 'Hesaplanan BTU\'dan daha küçük bir klima alırsam ne olur?', a: 'Klima sürekli tam kapasitede çalışmak zorunda kalır, istenen sıcaklığa hiç ulaşamayabilir veya çok geç ulaşır, enerji tüketimi ve aşınma artar; bu yüzden sınırda kalan durumlarda bir üst kapasiteyi tercih etmek genellikle daha güvenlidir.' },
    ],
  },

  // ── Alışveriş & Kargo (yeni) ──
  'kargo-desi-hesaplama': {
    about: 'Kargo desi hesaplama aracı, gönderdiğiniz kolinin en, boy ve yükseklik ölçülerine göre desi değerini hesaplar ve kargo firmasının faturalamada desi mi yoksa gerçek ağırlığı mı esas alacağını gösterir; birden fazla koliniz varsa hepsini tek seferde toplu olarak hesaplayabilirsiniz.',
    method: 'Desi = (en × boy × yükseklik [cm]) ÷ 3000 formülüyle hesaplanır. Her koli için bu desi değeri, girdiğiniz gerçek ağırlıkla (kg) karşılaştırılır; kargo firmaları ikisinden hangisi büyükse o değeri "kg" birimiyle faturalar. Birden fazla koli eklediğinizde her birinin faturalanacak ağırlığı ayrı ayrı hesaplanıp toplanır.',
    examples: [
      {
        title: '40×30×25 cm, 8 kg, tek koli',
        rows: [
          { label: 'Desi', value: '10' },
          { label: 'Gerçek ağırlık', value: '8 kg' },
          { label: 'Faturalanan ağırlık', value: '10 kg (desi esas alındı)' },
        ],
      },
      {
        title: '20×20×20 cm, 5 kg, tek koli',
        rows: [
          { label: 'Desi', value: '2,67' },
          { label: 'Gerçek ağırlık', value: '5 kg' },
          { label: 'Faturalanan ağırlık', value: '5 kg (gerçek ağırlık esas alındı)' },
        ],
      },
    ],
    faq: [
      { q: 'Desi ne demektir?', a: 'Desi, bir kolinin hacmini ağırlık birimine (kg) çeviren, kargo sektöründe yaygın kullanılan bir hacimsel ağırlık ölçüsüdür; hafif ama hacimli kargoların da adil bir şekilde ücretlendirilmesini sağlar.' },
      { q: '3000 sayısı neyi ifade eder?', a: 'Kara kargosunda yaygın kullanılan standart hacim-ağırlık dönüşüm katsayısıdır. Bazı kurye/havayolu kargo firmaları farklı bir katsayı (ör. 5000 veya 6000) kullanabilir; kesin hesap için taşıyıcınızın tarifesini kontrol edin.' },
      { q: 'Desi mi kg mi daha yüksekse ne olur?', a: 'Kargo firmaları her zaman ikisinden büyük olan değeri esas alarak faturalar; bu yüzden hafif ama hacimli kolilerde desi, ağır ama küçük kolilerde gerçek ağırlık geçerli olur.' },
      { q: 'Aynı koliye birden fazla ürün koyarsam nasıl hesaplarım?', a: 'Koliyi tek bir birim olarak dışından ölçüp tek bir satır olarak girmeniz yeterlidir; içindeki ürün sayısı desi hesabını etkilemez.' },
      { q: 'E-ticaret sitesindeki "X desiye kadar ücretsiz kargo" ne anlama gelir?', a: 'Kolinizin desisi bu sınırı aşarsa satıcı veya kargo firması ek ücret talep edebilir; bu aracı kullanarak gönderiminizin desisini önceden öğrenebilirsiniz.' },
      { q: 'Yurt dışı kargo ve havayolu taşımacılığında da 3000 mü kullanılır?', a: 'Hayır, uluslararası kargo ve havayolu taşımacılığında genellikle 5000 veya 6000 gibi farklı katsayılar kullanılır; bu araç yurt içi kara kargosu standardını esas alır.' },
      { q: 'Ölçüleri nasıl hassas alabilirim?', a: 'Koliyi dışından, en geniş noktalarından cm cinsinden ölçün ve yuvarlamadan (ör. 40,5 cm yerine 41 cm yazmadan) girin; küçük farklar toplam desiyi belirgin şekilde değiştirebilir.' },
      { q: 'Küçük paketler/zarflar için de bu hesap geçerli mi?', a: 'Evet, ancak birçok kargo firması küçük gönderiler için de bir minimum desi/ağırlık ücreti uygular; kesin ücret için taşıyıcınızın güncel tarifesine bakmanız önerilir.' },
    ],
  },
  'beden-cevirici': {
    about: 'Beden çevirici aracı, kadın ve erkek giyim bedenleri ile ayakkabı numaralarını TR, EU, US ve UK standartları arasında hızlıca çevirmenizi sağlar; özellikle yurt dışı sitelerinden alışveriş yaparken doğru bedeni seçmenize yardımcı olur.',
    method: 'Türkiye\'de kullanılan giyim ve ayakkabı bedenleri EU (Avrupa) numaralandırmasıyla birebir aynıdır. Seçtiğiniz kategori ve TR bedene karşılık gelen satır, yaygın kullanılan standart beden dönüşüm tablosundan okunarak US ve UK karşılıkları gösterilir.',
    examples: [
      {
        title: 'Kadın ayakkabı, TR 38',
        rows: [
          { label: 'EU beden', value: '38' },
          { label: 'US beden', value: '7,5' },
          { label: 'UK beden', value: '5' },
        ],
      },
      {
        title: 'Erkek giyim, TR 50',
        rows: [
          { label: 'EU beden', value: '50' },
          { label: 'US beden', value: '40' },
          { label: 'UK beden', value: '40' },
        ],
      },
    ],
    faq: [
      { q: 'TR beden ile EU beden aynı mı?', a: 'Evet, Türkiye\'de giyim ve ayakkabıda kullanılan beden numaraları Avrupa (EU) standardıyla birebir örtüşür; ayrı bir çevrim gerekmez.' },
      { q: 'US ve UK bedenleri neden markaya göre değişebiliyor?', a: 'Bu araçtaki değerler yaygın kabul gören standart dönüşüm tablosuna dayanır; ancak markalar arasında kalıp (fit) farkları olabileceğinden aynı numara markadan markaya biraz farklı oturabilir.' },
      { q: 'Çocuk bedenleri bu araca dahil mi?', a: 'Hayır, bu araç yalnızca yetişkin kadın ve erkek giyim/ayakkabı bedenlerini kapsar; çocuk bedenlerinde farklı bir numaralandırma sistemi kullanılır.' },
      { q: 'Ayakkabıda yarım numaralar nasıl gösteriliyor?', a: 'US ve UK sütunlarında gerektiğinde ondalıklı değerler (ör. 7,5) gösterilir; bu, o TR/EU bedenin US/UK sisteminde tam bir tam sayıya denk gelmediği anlamına gelir.' },
      { q: 'Bu tablo hangi kaynağa dayanıyor?', a: 'Yaygın kullanılan, uluslararası genel-geçer standart beden dönüşüm tablolarına dayanır; resmi tek bir uluslararası otorite olmadığından farklı kaynaklar arasında ±0,5 numara civarında küçük farklar görülebilir.' },
      { q: 'Bir markanın kendi beden tablosuyla bu araç çelişirse hangisine güvenmeliyim?', a: 'Satın alacağınız markanın kendi beden tablosuna öncelik verin; bu araç genel bir başlangıç noktası sunar, kesin kalıp bilgisini yalnızca üretici verebilir.' },
      { q: 'Kadın ve erkek ayakkabı numaralandırması neden farklı?', a: 'Kadın ve erkek ayakkabıları farklı kalıp standartlarına göre üretildiğinden, aynı EU numarası bile kadın ve erkek modelinde farklı US/UK karşılığına sahip olabilir.' },
      { q: 'Listede olmayan bir TR beden için ne yapmalıyım?', a: 'Aracın listesi yaygın kullanılan standart aralığı kapsar; listede olmayan bir ara beden için kendinize en yakın iki bedenin ortalamasını referans alabilirsiniz.' },
    ],
  },
  'altin-cevirici': {
    about: 'Altın çevirici aracı, gram altını çeyrek, yarım, tam ve Cumhuriyet altınına (veya tersine) standart gram karşılıklarına göre çevirir; isterseniz güncel gram fiyatınızı girerek toplam tutarı da hesaplayabilirsiniz.',
    method: 'Her altın türünün piyasada kabul gören sabit bir gram ağırlığı vardır (çeyrek altın 1,75 gr, yarım altın 3,5 gr, tam altın 7 gr, Cumhuriyet altını 7,216 gr). Girdiğiniz miktar önce bu karşılıkla grama çevrilir, ardından hedef birimin gram karşılığına bölünerek sonuç bulunur. Gram fiyatı girerseniz toplam gram bu fiyatla çarpılarak yaklaşık bir tutar hesaplanır.',
    examples: [
      {
        title: '2 tam altın → çeyrek altın, gram fiyatı 4.500 TL',
        rows: [
          { label: 'Toplam gram', value: '14 gr' },
          { label: 'Çeyrek altın karşılığı', value: '8 çeyrek' },
          { label: 'Tahmini tutar', value: '63.000 TL' },
        ],
      },
    ],
    faq: [
      { q: 'Bu araçta güncel altın fiyatı otomatik geliyor mu?', a: 'Hayır, bu araçta gömülü veya canlı bir kur bulunmaz; gram fiyatını kuyumcunuzdan veya güncel piyasa kaynaklarından öğrenip kendiniz girmeniz gerekir.' },
      { q: 'Çeyrek altın neden tam olarak 1,75 gram kabul ediliyor?', a: 'Bu, piyasada ve kuyumculukta yaygın kabul gören standart bir ağırlıktır; basım yılına göre çok küçük farklar olabilir ama hesaplamalarda bu değer referans alınır.' },
      { q: 'Cumhuriyet altını neden diğerlerinden farklı gram ağırlığında?', a: 'Cumhuriyet altını (Ata Lira olarak da bilinir) ayrı bir basım standardına sahiptir ve çeyrek/yarım/tam altın serisinden bağımsız olarak 7,216 gram olarak kabul edilir.' },
      { q: '22 ayar ne anlama gelir?', a: 'Ayar, altının saflık derecesini gösterir; 22 ayar yaklaşık %91,6 saf altın, kalanı ise dayanıklılık için katılan diğer metaller anlamına gelir.' },
      { q: 'Bu araç alış mı satış fiyatını mı esas alıyor?', a: 'Hiçbirini; araç yalnızca gram dönüşümü yapar. Tutar hesaplaması istiyorsanız girdiğiniz gram fiyatı alış ya da satış fiyatı olabilir, bu tamamen sizin tercihinize bağlıdır.' },
      { q: 'Yarım altın gerçekten çeyreğin tam iki katı mı?', a: 'Evet, standart gram karşılıklarında yarım altın (3,5 gr) çeyrek altının (1,75 gr) tam iki katıdır, tam altın (7 gr) ise çeyreğin dört katıdır.' },
      { q: 'İşçilik veya kâr payı bu hesaba dahil mi?', a: 'Hayır, bu araç yalnızca has gram karşılığını hesaplar; fiziksel altın alıp satarken kuyumcular işçilik farkı veya kâr payı ekleyebilir.' },
      { q: 'Gram fiyatını boş bırakırsam ne olur?', a: 'Gram fiyatı girilmezse araç yalnızca gram ve hedef birim çevrimini gösterir, tutar alanı hesaplanmaz.' },
    ],
  },

  // ── Günlük Yaşam (yeni) ──
  'dogalgaz-tuketimi-hesaplama': {
    about: 'Doğalgaz tüketimi hesaplama aracı, sayacınızdan okuduğunuz m³ cinsinden tüketimi kWh\'e çevirir ve girdiğiniz m³ birim fiyatıyla aylık maliyetinizi hesaplar; elektrik faturanızla kıyaslamak için kWh başına maliyeti de gösterir.',
    method: 'Enerji (kWh) = Düzeltilmiş tüketim (m³) × Üst ısıl değer (kcal/m³) ÷ 860,42 (1 kWh\'in kcal karşılığı) formülüyle hesaplanır. "Üst ısıl değer" doğalgazın enerji içeriğidir ve dağıtım şirketinin dönem ortalamasına göre küçük farklar gösterebilir; "düzeltme katsayısı" ise sayacın ölçtüğü hacmi mevsimsel sıcaklık/basınç farklarına göre standart koşullara taşır. Aylık maliyet ise girdiğiniz m³ tüketimin, m³ birim fiyatıyla doğrudan çarpılmasıyla bulunur.',
    examples: [
      {
        title: '120 m³ tüketim, 18 TL/m³ birim fiyat',
        rows: [
          { label: 'Aylık maliyet', value: '2.160 TL' },
          { label: 'Enerji karşılığı', value: '1.276,82 kWh' },
          { label: 'kWh başına maliyet', value: '1,69 TL' },
        ],
      },
    ],
    faq: [
      { q: 'Üst ısıl değer nedir?', a: 'Doğalgazın içerdiği enerji miktarını gösteren bir değerdir (kcal/m³); gazın kaynağına ve faturalandırma dönemine göre küçük farklar gösterebilir, faturanızda da genellikle bu değer belirtilir.' },
      { q: 'Düzeltme katsayısı neden gerekli?', a: 'Doğalgaz sayaçları hacmi ölçerken ortam sıcaklığı ve basıncından etkilenir; düzeltme katsayısı bu ölçümü standart koşullara taşıyarak daha tutarlı bir sonuç verir.' },
      { q: 'Faturamdaki m³ ile bu araca girdiğim m³ aynı mı?', a: 'Evet, sayacınızdan okunan ve faturanızda "tüketim" olarak belirtilen m³ değerini doğrudan girebilirsiniz.' },
      { q: 'kWh sonucu ne işime yarar?', a: 'kWh, elektrik faturanızla ortak bir birim olduğu için ısıtma sisteminizi (doğalgaz kombi mi elektrikli ısıtıcı mı) maliyet açısından karşılaştırmak istediğinizde işinize yarar.' },
      { q: 'Bu araç dağıtım bedeli ve vergileri de hesaplıyor mu?', a: 'Hayır, yalnızca girdiğiniz m³ tüketim ile birim fiyatın çarpımı hesaplanır; faturanızdaki dağıtım bedeli, sayaç okuma bedeli ve KDV gibi kalemler bu tutara ayrıca eklenir.' },
      { q: 'Isıl değer neden dönemden döneme farklı olabiliyor?', a: 'Doğalgazın kaynağı (yerli üretim, ithal boru hattı, LNG vb.) ve karışım oranı zamanla değiştiğinden, enerji içeriği de dönemden döneme küçük farklar gösterebilir.' },
      { q: 'Kombi ile soba tüketimi aynı formülle mi hesaplanır?', a: 'Evet, m³\'ten kWh\'e dönüşüm formülü cihazdan bağımsızdır; hangi cihazı kullanırsanız kullanın, sayaçtan okunan m³ aynı şekilde kWh\'e çevrilir.' },
      { q: '1 m³ doğalgaz yaklaşık kaç kWh eder?', a: 'Tipik bir üst ısıl değerle (varsayılan olarak bu araçta kullanılan) yaklaşık 10,64 kWh\'e karşılık gelir; ancak gerçek değer dönem ve bölgeye göre biraz farklılık gösterebilir.' },
    ],
  },
  'ev-arkadasi-fatura-bolusme-hesaplama': {
    about: 'Ev arkadaşı kira/fatura bölüşme aracı, kira ve fatura kalemlerinizi ev arkadaşlarınız arasında eşit olarak ya da oda büyüklüğü/gelir gibi bir ağırlığa göre orantılı olarak paylaştırmanızı sağlar.',
    method: '"Eşit bölüşüm" modunda tüm kalemlerin toplamı kişi sayısına bölünür. "Ağırlığa göre bölüşüm" modunda ise her kişi için girdiğiniz bir ağırlık (oda metrekaresi, gelir düzeyi vb.) toplam ağırlığa oranlanır ve toplam tutar bu orana göre kişiler arasında paylaştırılır.',
    examples: [
      {
        title: 'Eşit bölüşüm — toplam 20.000 TL, 3 kişi',
        rows: [
          { label: 'Kişi başı pay', value: '6.666,67 TL (%33,33)' },
        ],
      },
      {
        title: 'Ağırlıklı bölüşüm — toplam 20.000 TL, ağırlıklar 20/15/10',
        intro: 'Örneğin oda metrekarelerine göre.',
        rows: [
          { label: '1. kişi payı', value: '8.888,89 TL (%44,44)' },
          { label: '2. kişi payı', value: '6.666,67 TL (%33,33)' },
          { label: '3. kişi payı', value: '4.444,44 TL (%22,22)' },
        ],
      },
    ],
    faq: [
      { q: 'Eşit ve ağırlıklı bölüşüm arasındaki fark nedir?', a: '"Eşit bölüşüm" herkesin aynı miktarı ödemesini varsayar; "ağırlıklı bölüşüm" ise oda büyüklüğü veya gelir gibi girdiğiniz bir ölçüte göre payları orantılı şekilde dağıtır.' },
      { q: 'Ağırlık olarak ne girmeliyim, oda m² mi yoksa gelir mi?', a: 'İkisi de kullanılabilir; grubunuzun hangi ölçütü adil bulduğuna göre karar verebilirsiniz. Örneğin daha büyük odada kalan kişi daha yüksek ağırlık, daha düşük gelirli kişi daha düşük ağırlık girebilir.' },
      { q: 'Bir kişi bir kalemi hiç kullanmıyorsa (ör. sigara, özel bir hizmet) nasıl hariç tutarım?', a: 'Bu araç tüm kalemleri tüm kişilere dağıtır; kullanılmayan bir kalemi hariç tutmak isterseniz o kalemi ayrı bir hesaplamada, ilgili kişiler arasında manuel olarak paylaştırabilirsiniz.' },
      { q: 'Depozito veya bir seferlik giderler bu hesaba dahil edilebilir mi?', a: 'Evet, kalem listesine "Depozito" gibi bir satır ekleyip tutarını girerek diğer kalemlerle birlikte paylaştırabilirsiniz.' },
      { q: 'Kaç kişiye kadar ekleme yapabilirim?', a: 'Bir sınır yoktur; "+ Kişi ekle" butonuyla istediğiniz sayıda ev arkadaşı ekleyebilirsiniz.' },
      { q: 'Kira kontratında isim tek kişideyse bölüşüm sonucu bunu değiştirir mi?', a: 'Hayır, bu araç yalnızca aranızdaki pay dağılımını hesaplar; kira kontratındaki hukuki sorumluluk ev sahibi ile yapılan sözleşmeye bağlıdır.' },
      { q: 'Ağırlıklı bölüşümde ağırlıkların toplamı 100 olmak zorunda mı?', a: 'Hayır, ağırlıklar yalnızca birbirine oranlanır; toplamları 100, 45 veya başka bir sayı olsa da sonuç değişmez.' },
      { q: 'Sonuçları ev arkadaşlarımla nasıl paylaşırım?', a: 'Sonuç kartındaki paylaş butonuyla, girdiğiniz tüm değerleri içeren bir bağlantı kopyalayıp ev arkadaşlarınıza gönderebilirsiniz.' },
    ],
  },
  'abonelik-maliyeti-hesaplama': {
    about: 'Abonelik maliyeti hesaplama aracı, Netflix, Spotify, bulut depolama gibi tüm dijital aboneliklerinizi tek listede toplayarak aylık ve yıllık toplam maliyetinizi, ayrıca bu maliyetin net asgari ücrete göre kaç günlük çalışmaya denk geldiğini hesaplar.',
    method: 'Her abonelik için girdiğiniz aylık tutarlar toplanarak aylık toplam bulunur; bu toplam 12 ile çarpılarak yıllık toplam elde edilir. Yıllık toplam, güncel net asgari ücretin günlük karşılığına (net asgari ücret ÷ 30) bölünerek "yılda kaç günlük net asgari ücrete denk geldiği" hesaplanır.',
    examples: [
      {
        title: 'Netflix 150 TL, Spotify 80 TL, bulut depolama 45 TL',
        rows: [
          { label: 'Aylık toplam', value: '275 TL' },
          { label: 'Yıllık toplam', value: '3.300 TL' },
          { label: 'Asgari ücrete göre karşılığı', value: 'Yılda ~4 günlük net asgari ücret' },
        ],
      },
    ],
    faq: [
      { q: 'Yıllık ödediğim abonelikleri nasıl eklerim?', a: 'Yıllık tutarı 12\'ye bölüp aylık tutar alanına girmeniz yeterlidir; araç tüm hesaplamayı aylık tutarlar üzerinden yapar.' },
      { q: 'Aile paketinde paylaştığım bir abonelik için ne girmeliyim?', a: 'Toplam aile paketi tutarını değil, sizin ödediğiniz veya kendinize ayırdığınız kişi başı payı aylık tutar olarak girmeniz daha doğru bir sonuç verir.' },
      { q: 'Asgari ücret karşılaştırması neden net (brüt değil) üzerinden yapılıyor?', a: 'Net asgari ücret, bir çalışanın eline geçen gerçek harcanabilir geliri yansıttığı için abonelik maliyetinin günlük hayata etkisini daha anlaşılır şekilde gösterir.' },
      { q: 'Otomatik yenilenen ücretsiz deneme süreleri dahil mi?', a: 'Deneme süresi bitip ücretli döneme geçecekse, bu aboneliği normal aylık tutarıyla listeye eklemeniz gerçek maliyetinizi daha doğru yansıtır.' },
      { q: 'Kaç abonelik ekleyebilirim?', a: 'Bir sınır yoktur; "+ Abonelik ekle" ile istediğiniz kadar satır ekleyebilirsiniz.' },
      { q: 'Bu araç bana hangi aboneliği iptal etmem gerektiğini mi söylüyor?', a: 'Hayır, araç yalnızca toplam maliyeti ve büyüklüğünü görünür kılar; hangi aboneliği tutup hangisini iptal edeceğiniz tamamen kendi tercihinize kalmıştır.' },
      { q: 'Döviz cinsinden ödediğim abonelikleri (ör. dolar) nasıl girerim?', a: 'Güncel kurla TL karşılığını hesaplayıp aylık tutar alanına TL cinsinden girmeniz gerekir; bu araçta otomatik döviz çevirisi bulunmaz.' },
      { q: 'Fiyatlar zamanla değiştiğinde sonucu nasıl güncellerim?', a: 'Sayfadaki tutarları güncelleyip yeniden hesaplayabilir, ardından paylaş butonuyla güncel durumu yansıtan yeni bir bağlantı kaydedebilirsiniz.' },
    ],
  },
  'arac-sahip-olma-maliyeti-hesaplama': {
    about: 'Araç sahip olma maliyeti hesaplama aracı, MTV, trafik sigortası, kasko, bakım, lastik ve yakıt gibi yıllık gider kalemlerinizi toplayarak aracınızın gerçek yıllık, aylık ortalama ve kilometre başına maliyetini hesaplar.',
    method: 'Girdiğiniz altı gider kaleminin (MTV, sigorta, kasko, bakım, lastik, yakıt) toplamı yıllık toplam maliyeti verir. Bu toplam 12\'ye bölünerek aylık ortalama, yıllık kilometreye bölünerek de kilometre başına maliyet bulunur; her kalemin toplam içindeki payı da ayrıca gösterilir.',
    examples: [
      {
        title: 'MTV 3.500, sigorta 8.000, kasko 12.000, bakım 4.000, lastik 3.000, yakıt 25.000 TL, 15.000 km/yıl',
        rows: [
          { label: 'Yıllık toplam maliyet', value: '55.500 TL' },
          { label: 'Kilometre başı maliyet', value: '3,70 TL' },
          { label: 'Aylık ortalama', value: '4.625 TL' },
        ],
      },
    ],
    faq: [
      { q: 'Amortisman (değer kaybı) neden bu hesaba dahil değil?', a: 'Değer kaybı, aracın markasına, yaşına ve piyasa koşullarına göre tahmin edilmesi zor bir kalemdir; bu araç yalnızca doğrudan ve düzenli nakit çıkışı olan giderlere odaklanır.' },
      { q: 'Yakıt maliyetimi bilmiyorum, nasıl bulurum?', a: 'Sitedeki Yakıt Maliyeti Hesaplama aracını kullanarak yıllık kilometrenize göre yaklaşık yıllık yakıt giderinizi hesaplayıp bu araca girebilirsiniz.' },
      { q: 'Kredi/taşıt kredisi taksitleri bu hesaba dahil mi?', a: 'Hayır, bu araç yalnızca araca sahip olmanın işletme giderlerini hesaplar; kredi taksitiniz varsa bunu ayrı bir bütçe kalemi olarak değerlendirmeniz gerekir.' },
      { q: 'Kilometre başı maliyet ne işime yarar?', a: 'Farklı araçları, ya da "kendi aracımla mı gitsem toplu taşıma/taksi mi kullansam" kararını karşılaştırmak için pratik bir ölçüttür.' },
      { q: 'Trafik cezaları bu hesaba dahil mi?', a: 'Hayır, cezalar düzenli/öngörülebilir bir gider olmadığından bu hesaba dahil edilmemiştir; ayrı bir gider kalemi olarak değerlendirmeniz önerilir.' },
      { q: 'Kasko zorunlu mu, girmezsem ne olur?', a: 'Kasko yasal bir zorunluluk değildir (trafik sigortası zorunludur); kaskonuz yoksa bu alana 0 girerek diğer kalemlerle hesaplamaya devam edebilirsiniz.' },
      { q: 'Otopark ve otoyol/köprü geçiş ücretleri nereye eklenir?', a: 'Bu araçta ayrı bir kalem olarak yer almaz; isterseniz "bakım" kalemine dahil edebilir veya toplam sonucu kendi hesabınızda bu tutar kadar artırabilirsiniz.' },
      { q: 'Bu hesap ticari araçlar için de geçerli mi?', a: 'Evet, mantık aynıdır; yalnızca gider kalemi tutarlarını ticari aracınızın gerçek MTV, sigorta, bakım ve yakıt giderlerine göre girmeniz yeterlidir.' },
    ],
  },
  'elektrikli-arac-sarj-maliyeti-hesaplama': {
    about: 'Elektrikli araç şarj maliyeti hesaplama aracı, batarya kapasitesi ve elektrik fiyatınıza (ev veya şarj istasyonu) göre tam şarj ve 100 km maliyetini hesaplar; isterseniz benzinli bir araçla karşılaştırma yaparak hangisinin daha ekonomik olduğunu görebilirsiniz.',
    method: 'Tam şarj maliyeti, batarya kapasitesinin (kWh) ev elektrik birim fiyatıyla çarpılmasıyla bulunur. 100 km maliyeti, aracın 100 km başına tükettiği kWh miktarının ilgili birim fiyatla (ev veya istasyon) çarpılmasıyla hesaplanır. Karşılaştırma için girdiğiniz benzinli araç tüketimi ve yakıt fiyatı ile de 100 km\'lik benzin maliyeti hesaplanıp aradaki fark gösterilir.',
    examples: [
      {
        title: '60 kWh batarya, 100 km\'de 16 kWh tüketim, ev fiyatı 2,8 TL/kWh, istasyon 6,5 TL/kWh',
        intro: 'Karşılaştırma için benzinli araç: 100 km\'de 7 L, 43 TL/L.',
        rows: [
          { label: 'Evde tam şarj maliyeti', value: '168 TL' },
          { label: '100 km maliyeti (ev)', value: '44,80 TL' },
          { label: '100 km maliyeti (istasyon)', value: '104 TL' },
          { label: '100 km maliyeti (benzinli araç)', value: '301 TL' },
          { label: '100 km başına tasarruf', value: '256,20 TL' },
        ],
      },
    ],
    faq: [
      { q: '100 km başına tüketimimi nereden öğrenirim?', a: 'Aracın teknik özelliklerinde belirtilen WLTP tüketim değerini veya kendi kullanımınızdan gözlemlediğiniz ortalama tüketimi kullanabilirsiniz; gerçek tüketim sürüş tarzı ve mevsime göre değişebilir.' },
      { q: 'Ev ve istasyon fiyatı neden bu kadar farklı olabiliyor?', a: 'Hızlı (DC) şarj istasyonları, altyapı ve işletme maliyetleri nedeniyle ev elektriğine göre genellikle belirgin şekilde daha yüksek birim fiyat uygular.' },
      { q: 'Pil ömrü veya değer kaybı bu hesaba dahil mi?', a: 'Hayır, bu araç yalnızca enerji (şarj) maliyetini hesaplar; pil sağlığı, değer kaybı ve bakım gibi uzun vadeli maliyetler bu hesaba dahil değildir.' },
      { q: 'Benzinli araç karşılaştırması zorunlu mu?', a: 'Hayır, bu alanlar opsiyoneldir; boş bırakırsanız yalnızca elektrikli aracın şarj maliyeti hesaplanır.' },
      { q: 'AC ve DC şarj arasındaki fark bu hesaba dahil mi?', a: 'Hayır, araç yalnızca girdiğiniz kWh fiyatı ve tüketim değerini kullanır; AC/DC şarj hızı farkı maliyeti değil süreyi etkiler.' },
      { q: 'Kışın artan tüketim hesaba katılıyor mu?', a: 'Hayır, otomatik bir mevsim düzeltmesi yapılmaz; kış aylarında genellikle artan tüketiminizi "100 km başına tüketim" alanına elle girerek güncelleyebilirsiniz.' },
      { q: 'Şarj kaybı (AC-DC dönüşüm verimsizliği) hesaba dahil mi?', a: 'Hayır, bu basitleştirilmiş bir hesaptır; gerçek şarj sırasında birkaç yüzde kayıp yaşanabileceğinden gerçek maliyet hesaplanandan biraz yüksek çıkabilir.' },
      { q: 'Elektrikli araç gerçekten daha ucuz mu?', a: 'Enerji maliyeti açısından genellikle evet; ancak satın alma fiyatı, pil değişim maliyeti ve ikinci el değeri gibi faktörler toplam sahiplik maliyetini etkiler ve bu araca dahil değildir.' },
    ],
  },
  'trafik-cezasi-erken-odeme-hesaplama': {
    about: 'Trafik cezası erken ödeme hesaplama aracı, aldığınız trafik idari para cezasının kanunen tanınan erken ödeme indirimiyle ne kadara düşeceğini ve indirimden yararlanmak için son ödeme süresini hesaplar.',
    method: '2918 sayılı Karayolları Trafik Kanunu\'nun 115. maddesi uyarınca, ceza tutarına sabit bir indirim oranı uygulanır: indirimli tutar = ceza tutarı × (1 − indirim oranı). İndirim, yalnızca cezanın tebliğ tarihinden itibaren kanunen tanınan süre içinde ödenmesi halinde geçerlidir.',
    examples: [
      {
        title: '2.560 TL ceza',
        rows: [
          { label: 'İndirim tutarı', value: '640 TL' },
          { label: 'İndirimli ödeme tutarı', value: '1.920 TL' },
        ],
      },
    ],
    faq: [
      { q: 'İndirim oranı her zaman %25 mi?', a: 'Evet, Karayolları Trafik Kanunu madde 115 uyarınca trafik idari para cezalarında erken ödeme indirimi sabit %25 oranında uygulanır.' },
      { q: 'Erken ödeme süresi neden 15 günden 1 aya çıktı?', a: '31.01.2024 tarihli bir yönetmelik değişikliğiyle (İçişleri Bakanlığı), tebliğ tarihinden itibaren indirimli ödeme için tanınan süre 15 günden 1 aya (30 gün) uzatılmıştır; bu değişiklik hâlâ yürürlüktedir.' },
      { q: 'Süre tebliğ tarihinden mi yoksa cezanın kesildiği tarihten mi başlar?', a: 'Cezanın size resmi olarak tebliğ edildiği (bildirildiği) tarihten itibaren başlar; kesim tarihi ile tebliğ tarihi farklı günlere denk gelebilir.' },
      { q: 'Cezaya itiraz edersem indirim hakkım devam eder mi?', a: 'İtiraz süreci ile erken ödeme indirimi süresi birbirinden bağımsız işler; itiraz düşünüyorsanız bile indirim süresini kaçırmamaya dikkat etmeniz, itirazınız reddedilirse dezavantajlı duruma düşmenizi önler.' },
      { q: 'Taksitle ödersem indirim geçerli mi?', a: 'İndirim, tutarın süresi içinde tam ve tek seferde ödenmesi esasına dayanır; taksitlendirme genellikle bu indirimden yararlanmayı etkileyebileceğinden ödeme kanalınızdaki güncel koşulları kontrol etmeniz önerilir.' },
      { q: 'Süre geçtikten sonra ne olur?', a: 'İndirim hakkı kaybedilir, ceza tam tutar üzerinden borç olarak kalır ve aylık yaklaşık %3,5 civarında gecikme zammı işlemeye başlar.' },
      { q: 'Bu oran tüm trafik cezası türleri için mi geçerli?', a: 'Evet, genel %25 erken ödeme indirimi kural olarak tüm trafik idari para cezalarına uygulanır; ceza türüne göre indirim oranında bir farklılaşma yoktur.' },
      { q: 'Ödemeyi nereden yapabilirim?', a: 'e-Devlet üzerinden "Trafik Cezası Sorgulama ve Ödeme", bankaların internet/mobil şubeleri, PTT şubeleri ve bazı vergi dairesi veznelerinden ödeme yapabilirsiniz.' },
    ],
  },
  'tarif-porsiyon-olcekleme-hesaplama': {
    about: 'Tarif porsiyon ölçekleme aracı, bir yemek tarifinin malzeme miktarlarını mevcut porsiyon sayısından istediğiniz hedef porsiyon sayısına göre otomatik olarak ölçekler; örneğin 4 kişilik bir tarifi kolayca 7 kişilik hale getirebilirsiniz.',
    method: 'Ölçekleme oranı, hedef porsiyon sayısının mevcut (tarifteki) porsiyon sayısına bölünmesiyle bulunur (ör. 4 kişilik tarifi 7 kişiye çıkarmak için oran 7 ÷ 4 = 1,75\'tir). Listenizdeki her malzemenin miktarı bu oranla çarpılarak yeni miktarlar hesaplanır.',
    examples: [
      {
        title: '4 kişilik tarifi 7 kişiye çıkarma (oran 1,75)',
        rows: [
          { label: '200 g un', value: '350 g' },
          { label: '2 adet yumurta', value: '3,5 adet' },
        ],
      },
    ],
    faq: [
      { q: 'Tuz ve baharat miktarını da aynı oranla mı ölçeklemeliyim?', a: 'Bu oran iyi bir başlangıç noktasıdır, ancak tada göre ayarlanan malzemelerde (tuz, baharat, acı biber vb.) sonucu bir başlangıç kabul edip damak tadınıza göre ince ayar yapmanız önerilir.' },
      { q: 'Pişirme süresi de aynı oranda mı artmalı?', a: 'Hayır, pişirme süresi malzeme miktarıyla doğrusal artmaz; özellikle fırın tariflerinde hacim/kalınlık arttıkça pişirme süresi orantısız şekilde uzayabilir, tarifi gözlemleyerek pişirmeniz önerilir.' },
      { q: 'Yumurta gibi bölünemeyen malzemelerde ne yapmalıyım?', a: 'Çıkan ondalıklı sonucu (ör. 3,5 adet) tarifin niteliğine göre yukarı veya aşağı yuvarlayabilir, ya da kalan yarımı çırpıp göz kararı ekleyebilirsiniz.' },
      { q: 'Kalıp veya tepsi boyutunu da değiştirmeli miyim?', a: 'Evet, porsiyon arttıkça genellikle daha büyük bir pişirme kabına ihtiyaç duyarsınız; bu araç yalnızca malzeme miktarlarını hesaplar, kap boyutu önerisi sunmaz.' },
      { q: 'Küçültme (ör. 6 kişilikten 2 kişiye) için de kullanılabilir mi?', a: 'Evet, hedef porsiyon sayısı mevcut porsiyondan küçük olduğunda araç aynı mantıkla malzemeleri orantılı olarak azaltır.' },
      { q: 'Ölçekleme oranı tam olarak nasıl hesaplanıyor?', a: 'Hedef porsiyon sayısının mevcut porsiyon sayısına bölünmesiyle bulunur; bu tek bir çarpan tüm malzeme listesine uygulanır.' },
      { q: 'Malzemeleri farklı birimlerde (bazısı gram, bazısı adet) girebilir miyim?', a: 'Evet, her satırın kendi birimi korunur; araç yalnızca miktarı ölçekler, birimi değiştirmez.' },
      { q: 'Ölçeklenmiş tarifi nasıl kaydederim?', a: 'Sonuç alanındaki paylaş butonuyla, girdiğiniz tüm malzeme ve porsiyon bilgilerini içeren bir bağlantı kopyalayıp kendinize veya birine gönderebilirsiniz.' },
    ],
  },
  'mutfak-olcu-cevirici': {
    about: 'Mutfak ölçü çevirici aracı, Türk mutfağında yaygın kullanılan su bardağı, çay bardağı, yemek kaşığı ve tatlı kaşığı gibi ölçüleri, malzeme tipine (un, şeker, tuz, pirinç, sıvı) göre grama veya başka bir ölçüye çevirir.',
    method: 'Her malzeme tipinin yoğunluğuna göre farklı bir gram karşılığı vardır; bu yüzden aynı "1 su bardağı" un, şeker veya pirinç için farklı gram değeri verir. Girdiğiniz miktar önce seçtiğiniz malzeme tipinin tablosundan grama çevrilir, ardından hedef ölçünün gram karşılığına bölünerek sonuç bulunur. Sıvılarda (su, süt, sıvı yağ) yoğunluk yaklaşık 1 kabul edildiğinden ml ve gram birbirine eşit sayılır.',
    examples: [
      {
        title: '3 su bardağı un → yemek kaşığı',
        rows: [
          { label: 'Gram karşılığı', value: '390 gr' },
          { label: 'Yemek kaşığı karşılığı', value: '43,33 yemek kaşığı' },
        ],
      },
    ],
    faq: [
      { q: 'Su bardağı ile çay bardağı arasındaki fark ne kadar?', a: 'Standart bir su bardağı yaklaşık 200 ml/g, bir çay bardağı ise yaklaşık 100 ml/g olarak kabul edilir; yani çay bardağı su bardağının yarısı büyüklüğündedir.' },
      { q: 'Un ve şeker neden aynı bardakta farklı gram veriyor?', a: 'Un daha hafif ve havadar, şeker ise daha yoğun bir malzeme olduğundan aynı hacimde (1 bardak) farklı ağırlıkta olurlar; bu yüzden her malzeme tipi için ayrı bir tablo kullanılır.' },
      { q: 'Sıvı yağ da su gibi mi hesaplanıyor?', a: 'Evet, bu araçta pratik kullanım için sıvı yağın yoğunluğu suya yakın kabul edilir; hassas tariflerde küçük bir fark olabileceğini unutmayın.' },
      { q: 'Kaşık ölçüleri "silme" mi yoksa "tepeleme" mi?', a: 'Bu tablodaki değerler silme (düz, kaşığın üstünü bir bıçakla düzleştirdiğiniz) ölçüye göre hesaplanmıştır; tepeleme ölçtüğünüzde gerçek miktar daha fazla olur.' },
      { q: 'Un elenmiş mi elenmemiş mi ölçülmeli?', a: 'Tablodaki değerler standart, elenmemiş un için tipik bir ortalamayı yansıtır; elenmiş un daha hafif olduğundan aynı hacimde biraz daha az gram tartabilir.' },
      { q: 'Bu tablo hangi kaynağa dayanıyor?', a: 'Türk mutfağında yemek kitapları ve tarif sitelerinde yaygın olarak kullanılan standart ölçü tablolarına dayanır.' },
      { q: 'Pasta veya ekmek gibi hassas tarifler için yeterince kesin mi?', a: 'Bu araç pratik günlük kullanım için yaklaşık bir değer verir; un/şeker oranının kritik olduğu pasta ve ekmek gibi tariflerde bir mutfak tartısı kullanmanız daha tutarlı sonuç verir.' },
      { q: 'Un dışında hangi malzemeler destekleniyor?', a: 'Un, şeker, tuz, pirinç ve sıvılar (su, süt, sıvı yağ gibi) için ayrı tablolar bulunur; listede olmayan bir malzeme için en yakın yoğunluktaki kategoriyi tahmini olarak kullanabilirsiniz.' },
    ],
  },
  'evcil-hayvan-yasi-hesaplama': {
    about: 'Evcil hayvan yaşı hesaplama aracı, köpeğinizin (boyutuna göre) veya kedinizin yaşını güncel veteriner kaynaklı bir formülle yaklaşık insan yaşına çevirir; eğlenceli ama bilimsel araştırmalara dayanan bir tahmin sunar.',
    method: 'Kediler için Amerikan Hayvan Hastaneleri Birliği (AAHA) ve International Cat Care\'in kabul ettiği "15-9-4" kuralı kullanılır: ilk yıl 15, ikinci yıl toplamda 24 (+9), sonraki her yıl +4 insan yılı eklenir. Köpeklerde de aynı ilk-iki-yıl eğrisi (1. yıl 15, 2. yıl toplam 24) kullanılır, ancak 2 yıldan sonraki her yıl için eklenen insan yılı sayısı ırkın boyutuna göre değişir: küçük ırklarda +4, orta ırklarda +5, büyük ırklarda +6, dev ırklarda +7.',
    examples: [
      {
        title: '3 yaşındaki kedi',
        rows: [{ label: 'İnsan yaşı karşılığı', value: '28 yaş' }],
      },
      {
        title: '5 yaşında büyük ırk köpek (25-45 kg)',
        rows: [{ label: 'İnsan yaşı karşılığı', value: '42 yaş' }],
      },
      {
        title: '10 yaşında küçük ırk köpek (≤10 kg)',
        rows: [{ label: 'İnsan yaşı karşılığı', value: '56 yaş' }],
      },
    ],
    faq: [
      { q: '"1 köpek/kedi yılı = 7 insan yılı" kuralı neden artık kullanılmıyor?', a: 'Bu kural bilimsel bir temele dayanmıyordu; güncel araştırmalar evcil hayvanların ilk yıllarda çok hızlı, sonrasında ise çok daha yavaş yaşlandığını gösteriyor, bu yüzden doğrusal bir çarpan gerçekçi sonuç vermiyor.' },
      { q: 'Neden köpeklerde boyut önemli ama kedilerde değil?', a: 'Köpek ırkları arasında yetişkin ağırlığı ve ömür beklentisi çok büyük farklılıklar gösterir (ör. Chihuahua ile Saint Bernard); kedilerde ırklar arası ömür farkı çok daha az belirgin olduğundan tek bir eğri yeterli kabul edilir.' },
      { q: 'Melez/karışık ırk köpekler için hangi boyut kategorisini seçmeliyim?', a: 'Köpeğinizin yetişkinlikteki (ergin) ağırlığına en yakın kategoriyi (küçük, orta, büyük, dev) seçmeniz en gerçekçi tahmini verir.' },
      { q: 'Bu hesaplama evcil hayvanımın sağlık durumunu mu gösteriyor?', a: 'Hayır, bu yalnızca yaklaşık bir insan yaşı karşılığıdır; tıbbi bir değerlendirme değildir. Hayvanınızın gerçek sağlık ve yaşlanma durumu için veterinerinize danışmanız gerekir.' },
      { q: '1 yaşın altındaki yavrular için doğru çalışıyor mu?', a: 'Evet, ilk yıl içindeki kısmi yaşlar (ör. 0,5 yaş) da orantılı olarak hesaplanır; ancak yavruluk dönemindeki gelişim bireysel farklılıklar gösterebilir.' },
      { q: 'Bu formülün kaynağı nedir?', a: 'Kediler için AAHA ve International Cat Care tarafından kabul edilen "15-9-4" kuralı, köpekler için ise aynı ilk-iki-yıl eğrisinin yaygın veteriner kaynaklarında yer alan boyuta göre uyarlanmış versiyonu kullanılmıştır.' },
      { q: 'Egzotik evcil hayvanlar (tavşan, kuş vb.) için kullanılabilir mi?', a: 'Hayır, bu araç yalnızca kedi ve köpekler için tasarlanmıştır; diğer türlerin yaşlanma eğrisi tamamen farklıdır.' },
      { q: 'Sonuç neden ondalıklı değil tam sayı olarak gösteriliyor?', a: 'Okunabilirliği artırmak için sonuç en yakın tam yaşa yuvarlanır; iç hesaplama ondalıklı değerlerle yapılır.' },
    ],
  },
  'askerlik-terhis-tarihi-hesaplama': {
    about: 'Askerlik terhis tarihi hesaplama aracı, sevk (birliğe katılış) tarihinize ve hizmet türünüze (er/erbaş, yedek subay/astsubay veya bedelli) göre terhis tarihinizi ve terhise kalan gün sayısını hesaplar.',
    method: '7179 sayılı Askeralma Kanunu\'nun 5. maddesine göre belirlenen hizmet süresi sevk tarihine eklenerek terhis tarihi bulunur: er/erbaş için 6 ay, yedek subay/yedek astsubay için 12 ay, bedelli askerlik için 32 gün (28 gün temel askerlik eğitimi + 2 gün yol izni + 2 gün kanuni izin). Kalan gün sayısı, bu terhis tarihi ile bugünün tarihi arasındaki farktır.',
    examples: [
      {
        title: 'Sevk tarihi 9 Temmuz 2026, er/erbaş (6 ay)',
        rows: [{ label: 'Terhis tarihi', value: '9 Ocak 2027' }],
      },
      {
        title: 'Sevk tarihi 9 Temmuz 2026, bedelli askerlik (32 gün)',
        rows: [{ label: 'Terhis tarihi', value: '10 Ağustos 2026' }],
      },
    ],
    faq: [
      { q: 'Hizmet süreleri her zaman aynı mı kalıyor?', a: 'Hayır, askerlik mevzuatı zaman zaman değişebilir; bu araçtaki süreler 7179 sayılı Askeralma Kanunu\'nun 5. maddesine dayanır ve sayfanın altında belirtilen kaynak/güncelleme tarihine göre günceldir. Kesin ve güncel bilgi için ASAL (asal.msb.gov.tr) veya e-Devlet\'teki askerlik durum sorgulamasını esas almanız önerilir.' },
      { q: 'Bedelli askerlik yapanlar yedek subay veya astsubay olabilir mi?', a: 'Hayır, kanuna göre bedelli askerlik yapan vatandaşlar yedek subay veya yedek astsubay statüsünden yararlanamaz.' },
      { q: 'Sevk tarihi ile celp tarihi aynı şey mi?', a: 'Evet, bu araçta "sevk tarihi" olarak kastedilen, birliğinize fiilen katıldığınız tarihtir.' },
      { q: 'Hesaplanan tarih benim kesin terhis tarihim mi?', a: 'Bu araç yasal hizmet süresini esas alan yaklaşık bir tarih verir; birlik içi idari işlemler veya özel durumlar gerçek terhis tarihinizi birkaç gün etkileyebilir.' },
      { q: 'İzin günlerim terhis tarihimi uzatır mı?', a: 'Hayır, kullanılan yasal izinler hizmet süresi içinde sayılır ve genel kural olarak terhis tarihini uzatmaz.' },
      { q: 'Yurt dışında yaşayanlar için süre farklı mı?', a: 'Dövizli/yurt dışı askerlik farklı koşullara ve sürelere tabi olabilir; bu araç yalnızca temel er, yedek subay ve bedelli sürelerini esas alır.' },
      { q: 'Kalan gün sayısı neye göre hesaplanıyor?', a: 'Varsayılan olarak bugünün tarihine göre hesaplanır; hesaplama mantığı sevk tarihinden terhis tarihine kadar olan toplam süreyi esas alır.' },
      { q: 'Sürem doluyor ama terhis işlemleri gecikirse ne olur?', a: 'Bu araç yalnızca yasal hizmet süresini hesaplar; birlik içi idari süreçler (evrak işlemleri, sevk organizasyonu vb.) fiili çıkışınızı birkaç gün geciktirebilir.' },
    ],
  },

  // ── Sağlık (tansiyon & diyabet) ──
  'tansiyon-degerlendirme': {
    about: 'Tansiyon değerlendirme aracı, tek seferlik büyük (sistolik) ve küçük (diastolik) tansiyon ölçümünüzü uluslararası kılavuz kategorilerinden birine yerleştirir; ayrıca nabız basıncı ve ortalama arter basıncı (MAP) gibi tamamlayıcı metrikleri hesaplar.',
    method: 'Sistolik değer ve diastolik değer, ESH 2023 kılavuzunun sınıflandırma tablosunda ayrı ayrı değerlendirilir; ikisinden hangisi daha ağır kategorideyse sonuç kategorisi o değere göre belirlenir. Nabız basıncı sistolik − diastolik, ortalama arter basıncı ise diastolik + (sistolik − diastolik) ÷ 3 formülüyle hesaplanır.',
    examples: [
      {
        title: '118/76 mmHg',
        rows: [{ label: 'Kategori', value: 'Optimal' }, { label: 'Nabız basıncı', value: '42 mmHg' }],
      },
      {
        title: '148/94 mmHg',
        rows: [{ label: 'Kategori', value: 'Evre 1 hipertansiyon' }, { label: 'Ortalama arter basıncı', value: '112 mmHg' }],
      },
      {
        title: '185/122 mmHg',
        rows: [{ label: 'Kategori', value: 'Evre 3 hipertansiyon' }, { label: 'Uyarı', value: '180/120 eylem eşiği üzerinde' }],
      },
    ],
    faq: [
      { q: 'Tek ölçüm hipertansiyon tanısı için yeterli mi?', a: 'Hayır. Kılavuzlar, farklı günlerde tekrarlanan poliklinik ölçümlerini ya da ev tansiyon takibini esas alır; tek bir yüksek ölçüm heyecan, kafein veya ölçüm hatasından da kaynaklanabilir.' },
      { q: 'Nabız basıncı ve ortalama arter basıncı (MAP) ne anlatır?', a: 'Nabız basıncı, kalbin atım sırasında damarlara uyguladığı basınç farkını; MAP ise bir kalp döngüsü boyunca ortalama basıncı yansıtır. İkisi de doktorlar tarafından tamamlayıcı gösterge olarak kullanılır.' },
      { q: 'Ölçümü nasıl doğru yapmalıyım?', a: 'En az 5 dakika dinlendikten sonra, sırtınız desteklenmiş şekilde otururken, kolunuz kalp hizasında ve uygun manşon genişliğiyle ölçüm yapmanız önerilir; ölçümden önce kafein ve sigara kullanılmaması önerilir.' },
      { q: '180/120 mmHg üzerinde çıkarsa ne yapmalıyım?', a: 'Göğüs ağrısı, nefes darlığı, görme ya da konuşma bozukluğu gibi belirtileriniz varsa hemen 112\'yi arayın. Belirtiniz yoksa da vakit kaybetmeden bir sağlık kuruluşuna başvurun; bu ölçüm ölçüm hatasından kaynaklanmış olsa bile değerlendirilmesi gerekir.' },
      { q: 'İzole sistolik hipertansiyon nedir?', a: 'Büyük (sistolik) tansiyonun 140 mmHg ve üzerinde, küçük (diastolik) tansiyonun ise 90 mmHg altında olduğu durumdur; özellikle ileri yaşta sık görülür.' },
      { q: 'Bu araç tedavi ya da ilaç önerir mi?', a: 'Hayır. Bu araç yalnızca girilen ölçümü kılavuz kategorilerine yerleştirir; değerlendirme ve tedavi kararı hekiminize aittir.' },
    ],
  },
  'tansiyon-olcum-ortalamasi': {
    about: 'Ev tansiyon ölçüm ortalaması aracı, günlere yayılan sabah ve akşam ölçümlerinizden genel, sabah ve akşam ortalamalarını hesaplar ve bu ortalamayı kılavuz kategorisine yerleştirir; hekiminize götürmek üzere yazdırılabilir bir çizelge oluşturur. Girdiğiniz ölçümler bu cihazın tarayıcısında otomatik olarak saklanır, sayfaya her döndüğünüzde günlüğünüz hazır bekler; 5 günden fazla kayıt biriktiğinde eşik çizgileriyle birlikte bir trend grafiği de görürsünüz.',
    method: 'Girdiğiniz her geçerli sabah/akşam ölçümü tek bir listede toplanır ve aritmetik ortalaması alınır; ayrıca sabah ölçümleri kendi aralarında, akşam ölçümleri kendi aralarında ayrıca ortalanır. Genel ortalama, tansiyon değerlendirme aracındaki aynı ESH 2023 sınıflandırma mantığıyla kategorize edilir. Trend grafiğindeki 135/85 mmHg çizgisi, ofis ölçümünde ≥140/90 mmHg tanısına karşılık gelen ESH 2023 ev ölçümü (HBPM) eşiğidir.',
    faq: [
      { q: 'Neden tek ölçüm yerine birkaç günün ortalaması alınıyor?', a: 'Poliklinikte alınan tek ölçüm "beyaz önlük etkisi" gibi nedenlerle gerçek değerden yüksek çıkabilir; ev ortamında birkaç gün boyunca alınan ölçümlerin ortalaması kılavuzlarca daha güvenilir kabul edilir.' },
      { q: 'Kaç gün ölçüm girmeliyim?', a: 'Yaygın uygulama, art arda birkaç gün (genellikle bir hafta) sabah ve akşam ölçüm alıp ilk günü değerlendirme dışı bırakmaktır; kesin süre için hekiminizin önerisini esas alın.' },
      { q: 'Sabah ve akşam ölçümü ne zaman yapılmalı?', a: 'Sabah ölçümü genellikle uyandıktan kısa süre sonra (ilaç/kahvaltı öncesi), akşam ölçümü ise yatmadan önce, her seferinde dinlenmiş halde alınır.' },
      { q: 'Bir günün sadece sabah ölçümünü girdim, sorun olur mu?', a: 'Hayır, boş bıraktığınız hücreler hesaba katılmaz; genel ortalama yalnızca girdiğiniz ölçümler üzerinden hesaplanır.' },
      { q: 'Ölçümlerim nerede saklanıyor, verilerim size gönderiliyor mu?', a: 'Ölçümleriniz yalnızca bu cihazın tarayıcısında (localStorage) saklanır; bize veya bir sunucuya gönderilmez. Tarayıcı verilerinizi silerseniz kayıtlarınız da silinir; bu yüzden "yedeği indir" ile arada bir bir JSON dosyasına kopyalamanızı öneririz.' },
      { q: 'Telefon değiştirirsem ya da başka bir tarayıcıdan girersem ölçümlerim gelir mi?', a: 'Hayır, kayıtlar cihaza/tarayıcıya özeldir. Eski cihazda "Yedeği indir" ile bir JSON dosyası alıp yeni cihazda "Yedekten yükle" ile içe aktarabilir, ya da bu sayfanın adres çubuğundaki paylaşım bağlantısını kullanabilirsiniz.' },
      { q: 'Trend grafiği ne zaman görünür?', a: 'En az 5 günlük geçerli ölçüm girdiğinizde, sistolik/diastolik ortalamalarınızı ve 135/85 mmHg ev ölçüm eşiğini gösteren bir çizgi grafik otomatik olarak belirir; son 7, son 30 gün veya tüm kayıtlar arasında filtre yapabilirsiniz.' },
      { q: 'Çizelgeyi hekimime nasıl götürebilirim?', a: '"Ölçüm çizelgesini yazdır" düğmesiyle açılan pencereden yazdırabilir veya PDF olarak kaydedebilirsiniz.' },
      { q: 'Tüm kayıtlarımı silmek istersem ne yapmalıyım?', a: '"Tümünü temizle" düğmesine basıp onaylamanız yeterlidir; bu işlem bu cihazdaki tüm ölçüm günlüğünü siler ve geri alınamaz.' },
    ],
  },
  'tuz-sodyum-cevirici': {
    about: 'Tuz/sodyum çevirici, gıda etiketlerinde sıkça karşılaşılan sodyum (mg) ile günlük hayatta konuştuğumuz tuz (g) birimleri arasında dönüşüm yapar ve girdiğiniz miktarın DSÖ günlük tuz limitine oranını gösterir.',
    method: 'Sodyum, sofra tuzunun (NaCl) yaklaşık %39\'unu oluşturduğundan tuz miktarı, sodyum miktarının yaklaşık 2,5 katına karşılık gelir: tuz (g) = sodyum (g) × 2,5. Oran çubuğu, hesaplanan tuz miktarının DSÖ\'nün önerdiği günlük 5 g sınırına bölünmesiyle bulunur.',
    examples: [
      { title: '400 mg sodyum', rows: [{ label: 'Tuz karşılığı', value: '1 g' }, { label: 'Günlük limite oranı', value: '%20' }] },
      { title: '2.300 mg sodyum (bazı hazır çorbaların günlük porsiyonu)', rows: [{ label: 'Tuz karşılığı', value: '5,75 g' }, { label: 'Günlük limite oranı', value: '%115' }] },
    ],
    faq: [
      { q: 'Etikette "sodyum" mu yoksa "tuz" mu yazar?', a: 'Türkiye\'de ve birçok ülkede besin değeri tablolarında genellikle sodyum (mg) yazar; bazı ürünlerde doğrudan tuz (g) değeri de verilebilir. Hangisi yazılıysa aracın ilgili yönünü kullanabilirsiniz.' },
      { q: 'Günlük 5 g tuz sınırı herkes için mi geçerli?', a: 'Bu, DSÖ\'nün sağlıklı yetişkinler için genel önerisidir; böbrek veya kalp yetmezliği gibi durumlarda hekiminiz daha düşük bir sınır önerebilir.' },
      { q: 'İşlenmiş gıdalarda sodyum nerede gizlenir?', a: 'Ekmek, konserve, şarküteri ürünleri, hazır çorba ve soslarda beklenenden fazla sodyum bulunabilir; toplam günlük alımınızın büyük kısmı çoğunlukla sofra tuzundan değil bu ürünlerden gelir.' },
      { q: 'Bu araç kişiye özel bir tuz kısıtlaması öneriyor mu?', a: 'Hayır, yalnızca birim dönüşümü ve genel DSÖ limitine oranı gösterir; kişisel kısıtlama hekiminizle belirlenmelidir.' },
    ],
  },
  'hba1c-ortalama-seker': {
    about: 'HbA1c ↔ ortalama şeker çevirici, laboratuvar HbA1c sonucunuzu güncel ölçüm cihazlarında alıştığınız mg/dL veya mmol/L cinsinden tahmini ortalama kan şekerine (eAG) çevirir, ya da tersine bir ortalama şeker değerinden tahmini HbA1c hesaplar.',
    method: 'ADA ve NGSP tarafından referans alınan ADAG çalışmasının formülü kullanılır: eAG (mg/dL) = 28,7 × HbA1c(%) − 46,7. mg/dL ↔ mmol/L dönüşümü için 18 katsayısı kullanılır (mmol/L = mg/dL ÷ 18). Sonuç, ADA\'nın normal/prediyabet/diyabet aralıklarıyla karşılaştırılır.',
    examples: [
      { title: 'HbA1c %7,0', rows: [{ label: 'Tahmini ortalama şeker', value: '154 mg/dL (8,6 mmol/L)' }, { label: 'Aralık', value: 'Diyabet aralığı' }] },
      { title: 'HbA1c %5,5', rows: [{ label: 'Tahmini ortalama şeker', value: '111 mg/dL (6,2 mmol/L)' }, { label: 'Aralık', value: 'Normal aralık' }] },
    ],
    faq: [
      { q: 'eAG ile gerçek ortalama şekerim neden birebir aynı değil?', a: 'ADAG formülü, geniş bir katılımcı grubunun ortalamasına dayanan istatistiksel bir ilişkidir; bireysel eritrosit ömrü ve diğer faktörler nedeniyle gerçek değeriniz birkaç birim sapabilir.' },
      { q: 'HbA1c her durumda güvenilir mi?', a: 'Hayır, anemi, hemoglobinopati veya böbrek yetmezliği gibi bazı durumlar HbA1c sonucunu etkileyebilir; bu gibi durumlarda hekiminiz farklı bir tanı yöntemi tercih edebilir.' },
      { q: 'mmol/L birimini ne zaman kullanmalıyım?', a: 'Türkiye\'de yaygın olarak mg/dL kullanılır; ancak birçok Avrupa ülkesinde ve bazı cihazlarda mmol/L birimi görebilirsiniz, bu durumda ilgili birimi seçmeniz yeterlidir.' },
      { q: 'Sonucum "prediyabet aralığında" çıktı, bu tanı mı konuldu demek mi?', a: 'Hayır, bu yalnızca girdiğiniz değerin ADA aralıklarına göre nerede durduğunu gösterir; kesin tanı hekim değerlendirmesi ve laboratuvar sonucuyla birlikte konur.' },
      { q: 'Bu araç tedavi ya da ilaç dozu önerir mi?', a: 'Hayır, yalnızca birim dönüşümü ve kılavuz aralığı bilgisi sunar.' },
    ],
  },
  'seker-olcum-ortalamasi': {
    about: 'Ev şeker ölçüm günlüğü, günlere yayılan açlık ve tokluk kan şekeri ölçümlerinizin ortalamasını ve ADAG formülüyle hesaplanan tahmini HbA1c karşılığını hesaplar; hekiminize götürmek üzere yazdırılabilir bir çizelge oluşturur. Girdiğiniz ölçümler bu cihazın tarayıcısında otomatik olarak saklanır, sayfaya her döndüğünüzde günlüğünüz hazır bekler; 5 günden fazla kayıt biriktiğinde ADA hedef bandıyla birlikte bir trend grafiği de görürsünüz.',
    method: 'Girdiğiniz tüm açlık ve tokluk ölçümleri tek bir listede toplanıp ortalaması alınır; bu genel ortalama, ADAG formülünün tersi kullanılarak (HbA1c = (ortalama + 46,7) ÷ 28,7) tahmini bir HbA1c yüzdesine çevrilir. 70 mg/dL altındaki ölçümler uyarı, 54 mg/dL altındakiler ciddi hipoglisemi olarak ayrıca işaretlenir. Trend grafiğindeki hedef bant (açlık 80-130 mg/dL) ve tokluk üst sınırı (180 mg/dL), ADA Standards of Care 2026\'nın çoğu gebe olmayan yetişkin için önerdiği genel glisemik hedeflerdir.',
    faq: [
      { q: 'Kaç gün ölçüm girmeliyim?', a: 'Ne kadar çok gün ve ölçüm girerseniz tahmini ortalama o kadar güvenilir olur; tek bir günün ölçümü genel eğilimi yansıtmayabilir.' },
      { q: 'Tahmini HbA1c, laboratuvar sonucumdan neden farklı çıkabilir?', a: 'Laboratuvar HbA1c\'si son 2-3 ayın tamamını kapsar; bu araçtaki tahmin ise yalnızca girdiğiniz ölçümlerin ortalamasına dayanır ve ölçmediğiniz saatleri/günleri yansıtmaz.' },
      { q: 'Neden bazı satırlar kırmızı/turuncu işaretleniyor?', a: '70 mg/dL altındaki ölçümler hipoglisemi uyarı eşiği, 54 mg/dL altındakiler ciddi hipoglisemi, 300 mg/dL ve üzerindeki düşmeyen ölçümler ise hiperglisemi acil eşiği olarak ayrıca vurgulanır.' },
      { q: 'Düşük bir ölçüm girdiğimde ne yapmalıyım?', a: 'Bilinç bulanıklığı veya bayılma gibi belirtileriniz varsa hemen 112\'yi arayın; belirtisiz tekrarlayan düşük ölçümleri de en kısa sürede hekiminize bildirin.' },
      { q: 'Ölçümlerim nerede saklanıyor, verilerim size gönderiliyor mu?', a: 'Ölçümleriniz yalnızca bu cihazın tarayıcısında (localStorage) saklanır; bize veya bir sunucuya gönderilmez. Tarayıcı verilerinizi silerseniz kayıtlarınız da silinir; bu yüzden "yedeği indir" ile arada bir bir JSON dosyasına kopyalamanızı öneririz.' },
      { q: 'Telefon değiştirirsem ya da başka bir tarayıcıdan girersem ölçümlerim gelir mi?', a: 'Hayır, kayıtlar cihaza/tarayıcıya özeldir. Eski cihazda "Yedeği indir" ile bir JSON dosyası alıp yeni cihazda "Yedekten yükle" ile içe aktarabilir, ya da bu sayfanın adres çubuğundaki paylaşım bağlantısını kullanabilirsiniz.' },
      { q: 'Trend grafiği ne zaman görünür?', a: 'En az 5 günlük geçerli ölçüm girdiğinizde, açlık/tokluk ortalamalarınızı, ADA\'nın açlık için önerdiği 80-130 mg/dL hedef bandını ve 180 mg/dL tokluk üst sınırını gösteren bir çizgi grafik otomatik olarak belirir; son 7, son 30 gün veya tüm kayıtlar arasında filtre yapabilirsiniz.' },
      { q: 'Bu araç insülin ya da ilaç dozu hesaplar mı?', a: 'Hayır, bu araç yalnızca girdiğiniz ölçümleri toplayıp ortalamasını gösterir; doz ve tedavi kararları hekiminize aittir.' },
      { q: 'Tüm kayıtlarımı silmek istersem ne yapmalıyım?', a: '"Tümünü temizle" düğmesine basıp onaylamanız yeterlidir; bu işlem bu cihazdaki tüm ölçüm günlüğünü siler ve geri alınamaz.' },
    ],
  },
  'karbonhidrat-sayimi': {
    about: 'Karbonhidrat sayımı yardımcısı, öğün öğün girdiğiniz besinlerin karbonhidrat gramlarını toplayarak öğün başına ve gün geneli toplam karbonhidrat miktarınızı hesaplar.',
    method: 'Her kalem için girilen karbonhidrat gramı, seçtiğiniz öğüne eklenir; öğün toplamları ve gün geneli toplam, girilen tüm kalemlerin toplanmasıyla bulunur. Karbonhidrat gramlarını siz, ürün etiketinden veya diyetisyeninizin verdiği besin listesinden girersiniz; site bir gıda veritabanı içermez.',
    faq: [
      { q: 'Karbonhidrat gramını nereden bulmalıyım?', a: 'Ambalajlı ürünlerde besin değeri tablosundaki "karbonhidrat" satırından, ambalajsız besinlerde ise diyetisyeninizin size verdiği porsiyon/karbonhidrat listesinden alabilirsiniz.' },
      { q: 'Bu araç bir gıda veritabanı içeriyor mu?', a: 'Hayır, besin adı alanı yalnızca hatırlatma amaçlıdır; karbonhidrat gramını siz girersiniz.' },
      { q: 'İnsülin/karbonhidrat oranımı bu araçla hesaplayabilir miyim?', a: 'Hayır, bu araç yalnızca öğün ve gün toplamı karbonhidrat gramını hesaplar; insülin/karbonhidrat oranı ve doz ayarlaması hekiminiz ve diyetisyeninizle birlikte belirlenmelidir.' },
      { q: 'Ara öğünleri de eklemeli miyim?', a: 'Evet, karbonhidrat içeren her kalemi (ara öğünler dahil) ayrı bir satır olarak eklemeniz gün toplamının doğruluğunu artırır.' },
      { q: 'Bir kalemi yanlış öğüne eklersem toplam değişir mi?', a: 'Öğün bazlı toplamlar değişir ama gün geneli toplam aynı kalır; kalemi düzenlemek için öğün alanından doğru öğünü yeniden seçebilirsiniz.' },
    ],
  },
  'kredi-erken-kapatma-hesaplama': {
    about: 'Bu araç, kalan vade, taksit tutarı ve faiz oranınıza göre kredinizi bugün kapatırsanız ödeyeceğiniz tutarı ve kurtulacağınız faizi hesaplar. İhtiyaç/taşıt kredisi ile konut kredisi arasındaki yasal fark (tazminat var mı yok mu) net şekilde ayrıştırılır.',
    method: 'Kalan anapara, kalan taksitlerinizin bugünkü değeri olarak (anüite formülünün tersi ile) hesaplanır. İhtiyaç/taşıt gibi genel tüketici kredilerinde Tüketici Kredisi Sözleşmeleri Yönetmeliği madde 15 uyarınca erken ödeme tazminatı YASAKTIR, sadece faiz indirimi uygulanır. Konut kredisinde ve faiz SABİT ise, 6502 sayılı Kanun madde 37 uyarınca kalan vadeye göre %1 (36 aya kadar) veya %2 (36 aydan fazla) tazminat eklenebilir; faiz DEĞİŞKEN ise konut kredisinde de tazminat istenemez.',
    examples: [
      {
        title: 'İhtiyaç kredisi: 12 ay kalan vade, 5.000 TL taksit, %3 aylık faiz',
        rows: [
          { label: 'Kalan anapara', value: '49.770,02 TL' },
          { label: 'Kredi devam etseydi toplam ödeme', value: '60.000 TL' },
          { label: 'Kurtulunacak faiz', value: '10.229,98 TL' },
          { label: 'Erken ödeme tazminatı', value: 'Yok (yasak)' },
        ],
      },
      {
        title: 'Konut kredisi (sabit faiz): 24 ay kalan vade, 8.000 TL taksit, %2 aylık faiz',
        rows: [
          { label: 'Kalan anapara', value: '151.311,40 TL' },
          { label: 'Erken ödeme tazminatı (%1, kalan vade ≤36 ay)', value: '1.513,11 TL' },
          { label: 'Erken kapatma tutarı', value: '152.824,52 TL' },
          { label: 'Net kazanç', value: '39.175,48 TL' },
        ],
      },
    ],
    faq: [
      { q: 'İhtiyaç veya taşıt kredimi erken kapatırsam ceza öder miyim?', a: 'Hayır. Tüketici Kredisi Sözleşmeleri Yönetmeliği madde 15 uyarınca genel tüketici kredilerinde (konut hariç) erken ödeme tazminatı/ceza alınamaz; kredi veren yalnızca ödenmemiş faizi indirmekle yükümlüdür.' },
      { q: 'Konut kredimi erken kapatırsam tazminat öder miyim?', a: 'Faiz oranınız SABİT ise evet, 6502 sayılı Kanun madde 37 uyarınca kalan vadeniz 36 ayı aşmıyorsa en fazla %1, aşıyorsa en fazla %2 tazminat istenebilir. Faiz oranınız DEĞİŞKEN ise konut kredisinde de tazminat istenemez.' },
      { q: '"Kalan anapara" ile bankamın söylediği kapanış tutarı neden farklı olabilir?', a: 'Bu araç, kredinizin standart bir eşit taksitli (anüite) kredi olduğunu varsayarak matematiksel bir tahmin yapar; bankanızın gerçek kapanış ekstresi, ödeme tarihine, gün kesirlerine ve banka içi yuvarlamalara göre küçük farklar gösterebilir.' },
      { q: 'Erken kapatma her zaman avantajlı mıdır?', a: 'Genellikle evet, çünkü kalan faizin tamamından ya da büyük kısmından kurtulursunuz; ancak konut kredisinde tazminat, kurtulacağınız faizden büyükse (çok kısa kalan vadelerde nadiren olabilir) net kazancınız azalabilir — "net kazanç" alanı bunu gösterir.' },
      { q: 'Kısmi erken ödeme yapabilir miyim, yoksa tamamını mı ödemem gerekir?', a: 'Kanunen kısmi erken ödeme de mümkündür; bu araç şu an sadece TAM erken kapatma senaryosunu hesaplar.' },
      { q: 'Erken ödeme başvurusunu nasıl yaparım?', a: 'Bankanıza (şubeden, internet/mobil bankacılıktan ya da çağrı merkezinden) erken kapatma talebinizi iletip güncel kapanış tutarını istemeniz yeterlidir; banka yasal süre içinde size tutarı bildirmekle yükümlüdür.' },
      { q: 'Bu tazminat oranları her yıl değişir mi?', a: 'Hayır, bunlar kanunla belirlenmiş sabit yasal tavanlardır (yönetmelik değişmediği sürece); güncel durumu her ihtimale karşı bu sayfadaki kaynak notundan kontrol edebilirsiniz.' },
    ],
  },
  'kredi-yapilandirma-hesaplama': {
    about: 'Bu araç, mevcut kredinizi olduğu gibi sürdürmek ile bankanızın (veya başka bir bankanın) sunduğu bir yeniden yapılandırma/refinansman teklifini toplam maliyet açısından karşılaştırmanızı sağlar.',
    method: 'Mevcut kredi ile devam etme maliyeti, kalan taksitlerinizin (mevcut tutar × kalan ay sayısı) toplamıdır. Yeni teklifin aylık taksiti, kalan borcunuza yeni faiz oranı ve yeni vade uygulanan standart bir anüite formülüyle hesaplanır; toplam maliyete varsa dosya masrafı da eklenir. İki toplam maliyet karşılaştırılarak hangisinin daha ucuz olduğu ve farkı gösterilir.',
    faq: [
      { q: 'Yapılandırma ile vadeyi uzatmak her zaman kötü müdür?', a: 'Hayır, aylık taksitinizi düşürüp nakit akışınızı rahatlatabilir; ancak genellikle toplam ödeyeceğiniz tutarı artırır. Bu araç her iki etkiyi de ayrı ayrı gösterir, kararı ihtiyacınıza göre siz verirsiniz.' },
      { q: 'Bu araç bana yeni bir faiz teklifi mi üretiyor?', a: 'Hayır, yeni faiz oranı ve vadeyi siz girersiniz (bankanızdan aldığınız teklif); araç sadece bu teklif ile mevcut durumu karşılaştırır.' },
      { q: 'Yapılandırma sırasında erken ödeme tazminatı da öder miyim?', a: 'Bu, mevcut kredinizin türüne (konut mu, ihtiyaç mı) ve faiz tipine bağlıdır; detaylı hesap için Kredi Erken Kapatma aracımızı kullanabilirsiniz — bu araç yapılandırma maliyetine otomatik bir tazminat eklemez.' },
      { q: '"Dosya masrafı" zorunlu mu?', a: 'Hayır, opsiyoneldir; bankanız yeni kredi için bir masraf/ücret talep ediyorsa buraya girerek toplam maliyete dahil edebilirsiniz, talep etmiyorsa boş bırakabilirsiniz.' },
      { q: 'Mevcut kredimin taksit sayısını tam bilmiyorsam ne yapmalıyım?', a: 'Ekstrenizde veya internet bankacılığınızda "kalan taksit sayısı" ya da "kalan vade" bilgisini bulabilirsiniz; yaklaşık bir sayı girerek de kabaca bir fikir edinebilirsiniz.' },
      { q: 'Faiz oranı olarak yıllık mı aylık mı girmeliyim?', a: 'Aylık faiz oranı girilmelidir; bankanız size yıllık oran verdiyse yaklaşık olarak 12\'ye bölebilirsiniz (kesin dönüşüm için bankanızdan aylık orana ait tabloyu isteyin).' },
    ],
  },
  'kredi-karsilastirma': {
    about: 'İki farklı banka kredi teklifini (tutar, faiz oranı, vade ve varsa dosya masrafı) yan yana karşılaştırıp hangisinin toplamda daha ucuza geldiğini net biçimde gösterir.',
    method: 'Her teklif için standart bir eşit taksitli (anüite) kredi formülüyle aylık taksit hesaplanır; toplam maliyet, aylık taksitlerin vade boyunca toplamına (varsa) dosya masrafının eklenmesiyle bulunur. İki teklifin toplam maliyeti karşılaştırılarak aradaki fark ve daha ucuz olan teklif belirlenir.',
    examples: [
      {
        title: 'Teklif A: 100.000 TL, %3 aylık faiz, 12 ay, 500 TL masraf — Teklif B: aynı tutar, %2,5 faiz, 12 ay, 1.500 TL masraf',
        rows: [
          { label: 'Teklif A toplam maliyet', value: '121.054,50 TL' },
          { label: 'Teklif B toplam maliyet', value: '118.484,55 TL' },
          { label: 'Daha ucuz teklif', value: 'Teklif B' },
          { label: 'Fark', value: '2.569,95 TL' },
        ],
      },
    ],
    faq: [
      { q: 'Sadece faiz oranına bakarak karar vermek yeterli mi?', a: 'Hayır, düşük faizli bir teklif yüksek dosya masrafı veya farklı bir vade nedeniyle toplamda daha pahalıya gelebilir; bu yüzden "toplam maliyet" alanına bakmanız önerilir.' },
      { q: 'Vadeler farklıysa karşılaştırma adil olur mu?', a: 'Toplam maliyet karşılaştırması her zaman geçerlidir, ama farklı vadeli teklifleri karşılaştırırken aylık taksit farkının bütçenize etkisini de ayrıca değerlendirmelisiniz.' },
      { q: 'BSMV/KKDF bu hesaba dahil mi?', a: 'Hayır, bu araç sade bir anüite karşılaştırması yapar; ihtiyaç kredilerinde BSMV/KKDF dahil kesin taksit için Kredi Taksiti Hesaplama aracımızı kullanabilirsiniz.' },
      { q: 'Banka adını girmek zorunlu mu?', a: 'Hayır, opsiyoneldir; girerseniz sonuçlarda "Teklif A/B" yerine girdiğiniz isim gösterilir.' },
      { q: 'Üç veya daha fazla teklifi karşılaştırabilir miyim?', a: 'Bu araç şu an yalnızca iki teklifi karşılaştırır; üçüncü bir teklifi denemek için Teklif A veya B alanlarını değiştirip tekrar hesaplayabilirsiniz.' },
      { q: '"Yıllık maliyet oranı" ile bu araç aynı şey mi hesaplıyor?', a: 'Hayır, yıllık maliyet oranı (YMO) bankaların yasal olarak bildirmek zorunda olduğu, tüm vergi ve masrafları standart bir formülle içeren bir orandır; bu araç ise sadece girdiğiniz tutar/faiz/vade/masraf ile basit bir toplam maliyet karşılaştırması yapar. Kesin karar için bankaların size verdiği YMO\'yu da karşılaştırın.' },
    ],
  },
  'kredi-notu-araligi': {
    about: 'Findeks kredi notunuzun (0-1900 arası) hangi risk aralığına denk geldiğini gösterir. Bu araç puanınızı HESAPLAMAZ veya TAHMİN ETMEZ — yalnızca zaten bildiğiniz bir puanı yaygın kullanılan referans aralıklarına yerleştirir.',
    method: 'Girilen puan, 5 aralıktan (çok riskli, orta riskli, az riskli, iyi, çok iyi) hangisine denk geldiğine bakılarak sınıflandırılır. Bu aralıklar KKB\'nin resmi bir yayını DEĞİLDİR; hangikredi.com, sabah.com.tr gibi birden fazla bağımsız kaynakta tutarlı şekilde tekrarlanan, sektörde yaygın kullanılan bir referanstır.',
    faq: [
      { q: 'Bu araç Findeks puanımı hesaplıyor mu?', a: 'Hayır. Bu araç puan hesaplamaz veya tahmin etmez; yalnızca sizin zaten bildiğiniz bir puanı yaygın referans aralıklarına yerleştirir. Gerçek puanınızı yalnızca Findeks.com üzerinden öğrenebilirsiniz.' },
      { q: 'Bu aralıklar resmi mi?', a: 'Hayır, resmi değildir. KKB (Kredi Kayıt Bürosu) kendi resmi sayfasında tam sayısal puan aralıkları yayımlamaz. Buradaki 5 aralık, birden fazla bağımsız kaynakta (hangikredi.com, sabah.com.tr ve benzerleri) tutarlı şekilde tekrarlanan, sektörde yaygın kullanılan bir referanstır — bankalar kendi iç değerlendirme modellerinde farklı eşikler kullanabilir.' },
      { q: 'Findeks puanımı nereden öğrenebilirim?', a: 'Findeks.com üzerinden (veya bankanızın mobil uygulaması üzerinden sunduğu Findeks raporu ile) ücretli/ücretsiz kredi notu sorgulaması yapabilirsiniz.' },
      { q: 'Puanım "iyi" veya "çok iyi" aralığındaysa kredi onayı garanti mi?', a: 'Hayır, kredi onayı bankanın kendi politikasına, gelirinize, mevcut borçlarınıza ve diğer kriterlere de bağlıdır; yüksek kredi notu onay şansınızı artırır ama tek başına garanti etmez.' },
      { q: 'Puanım "çok riskli" veya "orta riskli" aralığındaysa hiç kredi alamaz mıyım?', a: 'Bazı bankalar bu aralıklarda başvuruları reddedebilir, ama her banka aynı politikayı uygulamayabilir; düzenli ödeme geçmişi oluşturarak zamanla puanınızı yükseltebilirsiniz.' },
      { q: 'Puanımı nasıl yükseltirim?', a: 'Bu aracın kapsamı dışındadır, ama genel olarak ödemelerinizi geciktirmemek, kredi kartı kullanım oranınızı düşük tutmak ve gereksiz yeni kredi başvurularından kaçınmak puanınızı zamanla olumlu etkiler.' },
    ],
  },
  'kredi-gecikme-faizi-hesaplama': {
    about: 'Kredi taksidinizi geciktirdiğinizde, geciken tutar ve gün sayısına göre işleyecek gecikme (temerrüt) faizini ve ödeyeceğiniz toplam tutarı hesaplar.',
    method: 'Azami gecikme faizi, sözleşmenizdeki akdi faiz oranının %30 fazlasını geçemez (Tüketici Kredisi Sözleşmeleri Yönetmeliği madde 4/1-e). Bu azami oran 30\'a bölünerek günlük gecikme oranı bulunur; gecikme bedeli, geciken taksit tutarı üzerinden bu günlük oranla gecikilen gün sayısı çarpılarak hesaplanır.',
    examples: [
      {
        title: '5.000 TL taksit, 10 gün gecikme, %3 aylık akdi faiz',
        rows: [
          { label: 'Azami gecikme faizi (aylık)', value: '%3,90' },
          { label: 'Günlük gecikme oranı', value: '%0,13' },
          { label: 'Gecikme bedeli', value: '65 TL' },
          { label: 'Toplam ödenecek', value: '5.065 TL' },
        ],
      },
    ],
    faq: [
      { q: 'Gecikme faizi ile akdi faiz arasındaki fark nedir?', a: 'Akdi faiz, kredi sözleşmenizde normal şartlarda uygulanan faizdir; gecikme (temerrüt) faizi ise ödemeyi zamanında yapmadığınızda ek olarak işleyen, akdi faizin en fazla %30 fazlası kadar olabilen bir orandır.' },
      { q: 'Bankam bu azami oranı her zaman uygular mı?', a: 'Hayır, bu bir TAVANDIR; bankanız bu sınırın altında bir gecikme faizi de uygulayabilir. Kesin oran için kredi sözleşmenizi veya ekstrenizi kontrol edin.' },
      { q: 'Bir günlük gecikme bile faiz doğurur mu?', a: 'Evet, gecikme faizi genellikle vade tarihinden itibaren geçen her gün için işlemeye başlar; bu araç girdiğiniz gün sayısı kadar hesaplar.' },
      { q: 'Gecikmem kredi notumu nasıl etkiler?', a: 'Gecikmeleriniz Kredi Kayıt Bürosu\'na (KKB) bildirilir ve Findeks kredi notunuzu olumsuz etkiler; gecikme ne kadar uzarsa etkisi de o kadar büyür ve sonraki kredi/kredi kartı başvurularınızda sorun yaşayabilirsiniz.' },
      { q: 'Sadece bu taksidi mi, yoksa tüm kredi borcunu mu geciktirmiş sayılırım?', a: 'Bu hesaplama yalnızca girdiğiniz TEK taksit için gecikme bedelini gösterir; ödemeyi uzun süre hiç yapmazsanız kredi sözleşmenize göre "muacceliyet" (kalan borcun tamamının talep edilmesi) gibi ek hukuki sonuçlar doğabilir, bu araç bunu hesaplamaz.' },
      { q: 'Gecikmiş bir taksidi öderken gecikme faizini de ayrıca mı ödemeliyim?', a: 'Evet, bankanız genellikle geciken taksit tutarına gecikme faizini ekleyerek tek bir toplam tahsilat yapar; bu araçtaki "toplam ödenecek tutar" bu toplamı tahmin eder.' },
    ],
  },
};

export function getCalculatorContent(id) {
  return calculatorContent[id];
}
