import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setSeoTags, removeJsonLd } from '../utils/seo.js';
import { useHeadContext } from '../context/HeadContext.jsx';
import Icon from '../components/Icon.jsx';

const PAGE_TITLE = 'Gizlilik Politikası | HesapNokta';
const PAGE_DESCRIPTION = 'HesapNokta çerez kullanımı, Google AdSense reklam çerezleri ve KVKK kapsamındaki haklarınız hakkında gizlilik politikası.';

export default function PrivacyPolicyPage() {
  const headContext = useHeadContext();

  if (headContext) {
    headContext.push({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, path: '/gizlilik-politikasi', jsonLd: [] });
  }

  useEffect(() => {
    setSeoTags({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, path: '/gizlilik-politikasi' });
    removeJsonLd('jsonld-calculator-app');
    removeJsonLd('jsonld-calculator-faq');
  }, []);

  return (
    <div className="calculator-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Sayfa yolu">
          <Link to="/">Ana sayfa</Link>
          <span>/</span>
          <span>Gizlilik Politikası</span>
        </nav>

        <div className="calculator-page-head">
          <span className="cat-badge"><Icon name="shield-check" size={14} /> Gizlilik</span>
          <h1>Gizlilik Politikası</h1>
          <p>Son güncelleme: Temmuz 2026</p>
        </div>

        <section className="seo-content legal-content" aria-label="Gizlilik politikası metni">
          <div className="seo-content-block">
            <h2>1. Giriş</h2>
            <p>
              Bu gizlilik politikası, HesapNokta ("site", "biz") tarafından işletilen
              hesapnokta.com adresini ziyaret ettiğinizde hangi verilerin toplandığını, bu
              verilerin nasıl kullanıldığını ve 6698 sayılı Kişisel Verilerin Korunması Kanunu
              ("KVKK") kapsamında sahip olduğunuz hakları açıklar. Siteyi kullanarak bu
              politikayı kabul etmiş sayılırsınız.
            </p>
          </div>

          <div className="seo-content-block">
            <h2>2. Hangi veriler toplanıyor?</h2>
            <p>
              HesapNokta'daki hesaplayıcılar tamamen tarayıcınızda (cihazınızda) çalışır;
              girdiğiniz sayılar, tarihler veya diğer hesaplama bilgileri sunucularımıza
              gönderilmez ya da kaydedilmez. Yalnızca "Bize Ulaşın" / "İletişim" formunu
              doldurursanız, girdiğiniz isim (opsiyonel), iletişim bilgisi (opsiyonel) ve
              sorunuzun metni tarafımıza iletilir; bu veriler yalnızca sorunuzu
              yanıtlayabilmek amacıyla kullanılır ve pazarlama amacıyla kullanılmaz.
            </p>
          </div>

          <div className="seo-content-block">
            <h2>3. Çerezler ve benzer teknolojiler</h2>
            <p>Sitemizde üç tür çerez/depolama teknolojisi kullanılabilir:</p>
            <ul>
              <li>
                <strong>Zorunlu depolama:</strong> Seçtiğiniz tema (açık/koyu) gibi tercihler,
                tarayıcınızın yerel depolama alanında (localStorage) saklanır; bu, sitenin
                temel işlevselliği için gereklidir ve kişisel veri içermez.
              </li>
              <li>
                <strong>Analitik çerezler:</strong> Site trafiğini ve performansını ölçmek için
                Vercel Analytics kullanılır. Bu araç, ziyaretçileri kişisel olarak tanımlamadan
                sayfa görüntüleme ve performans verileri toplar.
              </li>
              <li>
                <strong>Reklam çerezleri:</strong> Sitemizde Google AdSense aracılığıyla
                reklamlar yayınlanabilir. Google ve reklam ortakları, ilginize dayalı reklamlar
                göstermek için çerezler ve benzer teknolojiler kullanabilir. Bu çerezler,
                sitemizi ve diğer web sitelerini ziyaretlerinize dayanarak size özel reklamlar
                sunmak amacıyla Google tarafından kullanılır.
              </li>
            </ul>
          </div>

          <div className="seo-content-block">
            <h2>4. Google AdSense ve reklamcılık</h2>
            <p>
              Google, üçüncü taraf tedarikçi olarak sitemizde reklam göstermek için çerezler
              kullanır. Google'ın reklam çerezi kullanımı, Google'ın kullanıcılara sitemiz ve
              diğer internet sitelerindeki önceki ziyaretlerine dayanarak reklam
              göstermesini sağlar. Kişiselleştirilmiş reklamları devre dışı bırakmak
              isteyen kullanıcılar{' '}
              <a href="https://myadcenter.google.com/personalizationoff" target="_blank" rel="noopener noreferrer">
                Google Reklam Ayarları
              </a>{' '}
              sayfasını ziyaret edebilir; ayrıca{' '}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
                www.aboutads.info
              </a>{' '}
              adresinden üçüncü taraf tedarikçilerin çerezlerini de yönetebilirsiniz.
            </p>
          </div>

          <div className="seo-content-block">
            <h2>5. Üçüncü taraf bağlantılar</h2>
            <p>
              Sitemizdeki bazı içerikler (rehber yazıları, hesaplayıcı açıklamaları) genel
              bilgi amaçlı olup üçüncü taraf kaynaklara atıfta bulunabilir. Bu üçüncü taraf
              sitelerin kendi gizlilik politikalarından HesapNokta sorumlu değildir.
            </p>
          </div>

          <div className="seo-content-block">
            <h2>6. Verilerin saklanması ve güvenliği</h2>
            <p>
              İletişim formu üzerinden ilettiğiniz veriler, yalnızca sorunuzu yanıtlamak için
              gerekli süre boyunca saklanır ve makul teknik önlemlerle korunur. Hesaplayıcı
              girdileriniz sunucularımıza hiç ulaşmadığından bu veriler için ayrıca bir
              saklama süreci bulunmamaktadır.
            </p>
          </div>

          <div className="seo-content-block">
            <h2>7. KVKK kapsamındaki haklarınız</h2>
            <p>
              6698 sayılı KVKK'nın 11. maddesi uyarınca, kişisel verilerinizle ilgili olarak:
            </p>
            <ul>
              <li>Verilerinizin işlenip işlenmediğini öğrenme,</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
              <li>Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
              <li>İşlenmesini gerektiren sebeplerin ortadan kalkması hâlinde silinmesini/yok edilmesini isteme,</li>
              <li>Bu işlemlerin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
              <li>Aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
              <li>Kanuna aykırı işlenme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
            </ul>
            <p>
              haklarına sahipsiniz. Bu haklarınızı kullanmak için{' '}
              <Link to="/iletisim">İletişim</Link> sayfamızdaki formu kullanabilirsiniz.
            </p>
          </div>

          <div className="seo-content-block">
            <h2>8. Politikadaki değişiklikler</h2>
            <p>
              Bu gizlilik politikası, yasal düzenlemeler veya site uygulamalarındaki
              değişikliklere göre güncellenebilir. Güncel sürüm her zaman bu sayfada yer alır.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
