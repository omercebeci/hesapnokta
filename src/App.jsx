import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const RehberIndexPage = lazy(() => import('./pages/RehberIndexPage.jsx'));
const RehberPostPage = lazy(() => import('./pages/RehberPostPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage.jsx'));

// Finans
const KrediHesaplama = lazy(() => import('./pages/calculators/finans/KrediHesaplama.jsx'));
const KdvHesaplama = lazy(() => import('./pages/calculators/finans/KdvHesaplama.jsx'));
const IndirimHesaplama = lazy(() => import('./pages/calculators/finans/IndirimHesaplama.jsx'));
const KarMarjiHesaplama = lazy(() => import('./pages/calculators/finans/KarMarjiHesaplama.jsx'));
const KarZararHesaplama = lazy(() => import('./pages/calculators/finans/KarZararHesaplama.jsx'));
const MaasZamHesaplama = lazy(() => import('./pages/calculators/finans/MaasZamHesaplama.jsx'));
const KiraArtisHesaplama = lazy(() => import('./pages/calculators/finans/KiraArtisHesaplama.jsx'));
const MevduatFaiziHesaplama = lazy(() => import('./pages/calculators/finans/MevduatFaiziHesaplama.jsx'));
const DovizCevirici = lazy(() => import('./pages/calculators/finans/DovizCevirici.jsx'));
const ButceNabziHesaplama = lazy(() => import('./pages/calculators/finans/ButceNabziHesaplama.jsx'));
const OrtalamaMaliyetHesaplama = lazy(() => import('./pages/calculators/finans/OrtalamaMaliyetHesaplama.jsx'));
const YakitMaliyetiHesaplama = lazy(() => import('./pages/calculators/finans/YakitMaliyetiHesaplama.jsx'));
const BirikimHedefiHesaplama = lazy(() => import('./pages/calculators/finans/BirikimHedefiHesaplama.jsx'));
const BrutNetMaasHesaplama = lazy(() => import('./pages/calculators/finans/BrutNetMaasHesaplama.jsx'));
const KidemIhbarTazminatiHesaplama = lazy(() => import('./pages/calculators/finans/KidemIhbarTazminatiHesaplama.jsx'));
const BilesikFaizHesaplama = lazy(() => import('./pages/calculators/finans/BilesikFaizHesaplama.jsx'));
const EmlakKredisiUygunlukHesaplama = lazy(() => import('./pages/calculators/finans/EmlakKredisiUygunlukHesaplama.jsx'));
const KrediKartiAsgariOdemeHesaplama = lazy(() => import('./pages/calculators/finans/KrediKartiAsgariOdemeHesaplama.jsx'));
const EnflasyonEtkisiHesaplama = lazy(() => import('./pages/calculators/finans/EnflasyonEtkisiHesaplama.jsx'));
const TaksitKarsilastirmaHesaplama = lazy(() => import('./pages/calculators/finans/TaksitKarsilastirmaHesaplama.jsx'));

// Alışveriş
const ZamOraniHesaplama = lazy(() => import('./pages/calculators/alisveris/ZamOraniHesaplama.jsx'));
const BahsisHesapBolusmeHesaplama = lazy(() => import('./pages/calculators/alisveris/BahsisHesapBolusmeHesaplama.jsx'));
const IndirimUstuneIndirimHesaplama = lazy(() => import('./pages/calculators/alisveris/IndirimUstuneIndirimHesaplama.jsx'));

// Günlük Yaşam
const ElektrikTuketimiHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/ElektrikTuketimiHesaplama.jsx'));
const YolculukYakitPayiHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/YolculukYakitPayiHesaplama.jsx'));
const OdaAlaniMalzemeHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/OdaAlaniMalzemeHesaplama.jsx'));

// Sağlık
const VucutKitleIndeksiHesaplama = lazy(() => import('./pages/calculators/saglik/VucutKitleIndeksiHesaplama.jsx'));
const KaloriIhtiyaciHesaplama = lazy(() => import('./pages/calculators/saglik/KaloriIhtiyaciHesaplama.jsx'));
const IdealKiloHesaplama = lazy(() => import('./pages/calculators/saglik/IdealKiloHesaplama.jsx'));
const VucutYagOraniHesaplama = lazy(() => import('./pages/calculators/saglik/VucutYagOraniHesaplama.jsx'));
const GunlukSuIhtiyaciHesaplama = lazy(() => import('./pages/calculators/saglik/GunlukSuIhtiyaciHesaplama.jsx'));
const GebelikHaftasiHesaplama = lazy(() => import('./pages/calculators/saglik/GebelikHaftasiHesaplama.jsx'));
const UykuSaatiHesaplama = lazy(() => import('./pages/calculators/saglik/UykuSaatiHesaplama.jsx'));
const KafeinTakibiHesaplama = lazy(() => import('./pages/calculators/saglik/KafeinTakibiHesaplama.jsx'));
const AdimKaloriDonusumuHesaplama = lazy(() => import('./pages/calculators/saglik/AdimKaloriDonusumuHesaplama.jsx'));

// Eğitim
const DersNotuOrtalamasiHesaplama = lazy(() => import('./pages/calculators/egitim/DersNotuOrtalamasiHesaplama.jsx'));
const SinavPuaniHesaplama = lazy(() => import('./pages/calculators/egitim/SinavPuaniHesaplama.jsx'));

// Matematik
const YuzdeHesaplama = lazy(() => import('./pages/calculators/matematik/YuzdeHesaplama.jsx'));
const OranOrantiHesaplama = lazy(() => import('./pages/calculators/matematik/OranOrantiHesaplama.jsx'));
const AlanHacimHesaplama = lazy(() => import('./pages/calculators/matematik/AlanHacimHesaplama.jsx'));
const OrtalamaHesaplama = lazy(() => import('./pages/calculators/matematik/OrtalamaHesaplama.jsx'));
const KombinasyonPermutasyonHesaplama = lazy(() => import('./pages/calculators/matematik/KombinasyonPermutasyonHesaplama.jsx'));
const BirimCevirici = lazy(() => import('./pages/calculators/matematik/BirimCevirici.jsx'));

// Zaman
const YasHesaplama = lazy(() => import('./pages/calculators/zaman/YasHesaplama.jsx'));
const TarihFarkiHesaplama = lazy(() => import('./pages/calculators/zaman/TarihFarkiHesaplama.jsx'));
const SaatFarkiHesaplama = lazy(() => import('./pages/calculators/zaman/SaatFarkiHesaplama.jsx'));
const GunSayaciHesaplama = lazy(() => import('./pages/calculators/zaman/GunSayaciHesaplama.jsx'));

export default function App() {
  return (
    <ThemeProvider>
      <Header />
      <main>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/kredi-hesaplama" element={<KrediHesaplama />} />
            <Route path="/kdv-hesaplama" element={<KdvHesaplama />} />
            <Route path="/indirim-hesaplama" element={<IndirimHesaplama />} />
            <Route path="/kar-marji-hesaplama" element={<KarMarjiHesaplama />} />
            <Route path="/kar-zarar-hesaplama" element={<KarZararHesaplama />} />
            <Route path="/maas-zam-hesaplama" element={<MaasZamHesaplama />} />
            <Route path="/kira-artis-hesaplama" element={<KiraArtisHesaplama />} />
            <Route path="/mevduat-faizi-hesaplama" element={<MevduatFaiziHesaplama />} />
            <Route path="/doviz-cevirici" element={<DovizCevirici />} />
            <Route path="/butce-nabzi-hesaplama" element={<ButceNabziHesaplama />} />
            <Route path="/ortalama-maliyet-hesaplama" element={<OrtalamaMaliyetHesaplama />} />
            <Route path="/yakit-maliyeti-hesaplama" element={<YakitMaliyetiHesaplama />} />
            <Route path="/birikim-hedefi-hesaplama" element={<BirikimHedefiHesaplama />} />
            <Route path="/brut-net-maas-hesaplama" element={<BrutNetMaasHesaplama />} />
            <Route path="/kidem-ihbar-tazminati-hesaplama" element={<KidemIhbarTazminatiHesaplama />} />
            <Route path="/bilesik-faiz-hesaplama" element={<BilesikFaizHesaplama />} />
            <Route path="/emlak-kredisi-uygunluk-hesaplama" element={<EmlakKredisiUygunlukHesaplama />} />
            <Route path="/kredi-karti-asgari-odeme-hesaplama" element={<KrediKartiAsgariOdemeHesaplama />} />
            <Route path="/enflasyon-etkisi-hesaplama" element={<EnflasyonEtkisiHesaplama />} />
            <Route path="/taksit-karsilastirma-hesaplama" element={<TaksitKarsilastirmaHesaplama />} />

            <Route path="/zam-orani-hesaplama" element={<ZamOraniHesaplama />} />
            <Route path="/bahsis-hesap-bolusme-hesaplama" element={<BahsisHesapBolusmeHesaplama />} />
            <Route path="/indirim-ustune-indirim-hesaplama" element={<IndirimUstuneIndirimHesaplama />} />

            <Route path="/elektrik-tuketimi-hesaplama" element={<ElektrikTuketimiHesaplama />} />
            <Route path="/yolculuk-yakit-payi-hesaplama" element={<YolculukYakitPayiHesaplama />} />
            <Route path="/oda-alani-malzeme-hesaplama" element={<OdaAlaniMalzemeHesaplama />} />

            <Route path="/vucut-kitle-indeksi-hesaplama" element={<VucutKitleIndeksiHesaplama />} />
            <Route path="/kalori-ihtiyaci-hesaplama" element={<KaloriIhtiyaciHesaplama />} />
            <Route path="/ideal-kilo-hesaplama" element={<IdealKiloHesaplama />} />
            <Route path="/vucut-yag-orani-hesaplama" element={<VucutYagOraniHesaplama />} />
            <Route path="/gunluk-su-ihtiyaci-hesaplama" element={<GunlukSuIhtiyaciHesaplama />} />
            <Route path="/gebelik-haftasi-hesaplama" element={<GebelikHaftasiHesaplama />} />
            <Route path="/uyku-saati-hesaplama" element={<UykuSaatiHesaplama />} />
            <Route path="/kafein-takibi-hesaplama" element={<KafeinTakibiHesaplama />} />
            <Route path="/adim-kalori-donusumu-hesaplama" element={<AdimKaloriDonusumuHesaplama />} />

            <Route path="/ders-notu-ortalamasi-hesaplama" element={<DersNotuOrtalamasiHesaplama />} />
            <Route path="/sinav-puani-hesaplama" element={<SinavPuaniHesaplama />} />

            <Route path="/yuzde-hesaplama" element={<YuzdeHesaplama />} />
            <Route path="/oran-oranti-hesaplama" element={<OranOrantiHesaplama />} />
            <Route path="/alan-hacim-hesaplama" element={<AlanHacimHesaplama />} />
            <Route path="/ortalama-hesaplama" element={<OrtalamaHesaplama />} />
            <Route path="/kombinasyon-permutasyon-hesaplama" element={<KombinasyonPermutasyonHesaplama />} />
            <Route path="/birim-cevirici" element={<BirimCevirici />} />

            <Route path="/yas-hesaplama" element={<YasHesaplama />} />
            <Route path="/tarih-farki-hesaplama" element={<TarihFarkiHesaplama />} />
            <Route path="/saat-farki-hesaplama" element={<SaatFarkiHesaplama />} />
            <Route path="/gun-sayaci-hesaplama" element={<GunSayaciHesaplama />} />

            <Route path="/rehber" element={<RehberIndexPage />} />
            <Route path="/rehber/:slug" element={<RehberPostPage />} />

            <Route path="/hakkinda" element={<AboutPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/gizlilik-politikasi" element={<PrivacyPolicyPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
