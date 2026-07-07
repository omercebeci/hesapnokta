import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { calculators } from '../data/calculatorRegistry.js';
import { setSeoTags, removeJsonLd } from '../utils/seo.js';
import { useHeadContext } from '../context/HeadContext.jsx';
import Icon from '../components/Icon.jsx';

const PAGE_TITLE = 'Hakkında | HesapNokta';
const PAGE_DESCRIPTION = 'HesapNokta, günlük hayatta ihtiyaç duyduğunuz finans, sağlık, matematik, alışveriş ve zaman hesaplamalarını ücretsiz ve hızlı şekilde yapmanızı sağlayan bir araç koleksiyonudur.';

export default function AboutPage() {
  const headContext = useHeadContext();

  if (headContext) {
    headContext.push({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, path: '/hakkinda', jsonLd: [] });
  }

  useEffect(() => {
    setSeoTags({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, path: '/hakkinda' });
    removeJsonLd('jsonld-calculator-app');
    removeJsonLd('jsonld-calculator-faq');
  }, []);

  return (
    <div className="calculator-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Sayfa yolu">
          <Link to="/">Ana sayfa</Link>
          <span>/</span>
          <span>Hakkında</span>
        </nav>

        <div className="calculator-page-head">
          <span className="cat-badge"><Icon name="activity" size={14} /> Hakkında</span>
          <h1>HesapNokta hakkında</h1>
        </div>

        <section className="seo-content legal-content" aria-label="HesapNokta hakkında bilgi">
          <div className="seo-content-block">
            <h2>Amacımız</h2>
            <p>
              HesapNokta, günlük hayatta sık karşılaşılan hesaplama ihtiyaçlarını tek bir yerde,
              hızlı ve ücretsiz şekilde çözmek için hazırlanmış bir araç koleksiyonudur. Kayıt
              olmadan; sadece ihtiyacınız olan hesaplayıcıyı bulup anında sonucu görmenizi
              hedefliyoruz.
            </p>
            <p>
              Şu anda finans (kredi, maaş, vergi, kira), alışveriş (indirim, taksit), günlük
              yaşam (yakıt, elektrik), sağlık (BMI, kalori, uyku), matematik (yüzde, oran),
              eğitim (not ortalaması, sınav puanı) ve zaman (yaş, tarih farkı) kategorilerinde
              {' '}{calculators.length} hesaplayıcı sunuyoruz. Site sürekli güncelleniyor; yeni
              hesaplayıcılar ve rehber içerikleri düzenli olarak ekleniyor.
            </p>
          </div>

          <div className="seo-content-block">
            <h2>Veriler nasıl güncel tutuluyor?</h2>
            <p>
              Asgari ücret, vergi dilimleri, SGK oranları, kira artış sınırı gibi mevzuata bağlı
              tüm değerler sitede tek bir merkezi veri dosyasında tutulur; bir oran değiştiğinde
              yalnızca bu dosya güncellenir, ilgili hesaplayıcıların tamamı otomatik olarak yeni
              değeri kullanır. Bu değerlerin yanında hangi resmi kaynaktan alındığı ve en son ne
              zaman güncellendiği de sayfalarda ayrıca gösterilir.
            </p>
            <p>
              Buna ek olarak her hafta otomatik bir sağlık kontrolü çalışır ve 90 günden uzun
              süredir güncellenmemiş ya da dönemi geçmiş görünen bir veri olup olmadığını
              denetler; bir şey bulursa bize bildirim gelir. Bu süreç veri güncelliğini takip
              etmemize yardımcı olsa da, önemli mali veya hukuki kararlar öncesinde güncel
              oranı ilgili resmi kaynaktan teyit etmenizi öneririz.
            </p>
          </div>

          <div className="seo-content-block">
            <h2>İletişim</h2>
            <p>
              Bir hesaplayıcıda hata gördüyseniz, eksik bir veri fark ettiyseniz ya da eklenmesini
              istediğiniz bir araç varsa <Link to="/iletisim">iletişim sayfasından</Link> ya da
              her hesaplayıcının altındaki geri bildirim bölümünden bize kolayca ulaşabilirsiniz.
            </p>
            <p>
              Hesaplama sonuçları genel bilgilendirme amaçlıdır ve resmi, hukuki, mali ya da
              tıbbi danışmanlık yerine geçmez; önemli kararlarda ilgili kurum veya uzmana
              danışmanızı öneririz.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
