import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
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
const KrediErkenKapatmaHesaplama = lazy(() => import('./pages/calculators/finans/KrediErkenKapatmaHesaplama.jsx'));
const KrediYapilandirmaHesaplama = lazy(() => import('./pages/calculators/finans/KrediYapilandirmaHesaplama.jsx'));
const KrediKarsilastirmaHesaplama = lazy(() => import('./pages/calculators/finans/KrediKarsilastirmaHesaplama.jsx'));
const KrediNotuAraligiHesaplama = lazy(() => import('./pages/calculators/finans/KrediNotuAraligiHesaplama.jsx'));
const KrediGecikmeFaiziHesaplama = lazy(() => import('./pages/calculators/finans/KrediGecikmeFaiziHesaplama.jsx'));

// Alışveriş & Kargo
const ZamOraniHesaplama = lazy(() => import('./pages/calculators/alisveris/ZamOraniHesaplama.jsx'));
const BahsisHesapBolusmeHesaplama = lazy(() => import('./pages/calculators/alisveris/BahsisHesapBolusmeHesaplama.jsx'));
const IndirimUstuneIndirimHesaplama = lazy(() => import('./pages/calculators/alisveris/IndirimUstuneIndirimHesaplama.jsx'));
const KargoDesiHesaplama = lazy(() => import('./pages/calculators/alisveris/KargoDesiHesaplama.jsx'));
const BedenCevirici = lazy(() => import('./pages/calculators/alisveris/BedenCevirici.jsx'));
const AltinCevirici = lazy(() => import('./pages/calculators/alisveris/AltinCevirici.jsx'));

// Günlük Yaşam
const ElektrikTuketimiHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/ElektrikTuketimiHesaplama.jsx'));
const YolculukYakitPayiHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/YolculukYakitPayiHesaplama.jsx'));
const OdaAlaniMalzemeHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/OdaAlaniMalzemeHesaplama.jsx'));
const DogalgazTuketimiHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/DogalgazTuketimiHesaplama.jsx'));
const EvArkadasiFaturaBolusmeHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/EvArkadasiFaturaBolusmeHesaplama.jsx'));
const AbonelikMaliyetiHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/AbonelikMaliyetiHesaplama.jsx'));
const AracSahipOlmaMaliyetiHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/AracSahipOlmaMaliyetiHesaplama.jsx'));
const ElektrikliAracSarjMaliyetiHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/ElektrikliAracSarjMaliyetiHesaplama.jsx'));
const TrafikCezasiErkenOdemeHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/TrafikCezasiErkenOdemeHesaplama.jsx'));
const TarifPorsiyonOlceklemeHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/TarifPorsiyonOlceklemeHesaplama.jsx'));
const MutfakOlcuCevirici = lazy(() => import('./pages/calculators/gunluk-yasam/MutfakOlcuCevirici.jsx'));
const EvcilHayvanYasiHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/EvcilHayvanYasiHesaplama.jsx'));
const AskerlikTerhisTarihiHesaplama = lazy(() => import('./pages/calculators/gunluk-yasam/AskerlikTerhisTarihiHesaplama.jsx'));

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
const TansiyonDegerlendirmeHesaplama = lazy(() => import('./pages/calculators/saglik/TansiyonDegerlendirmeHesaplama.jsx'));
const TansiyonOlcumOrtalamasiHesaplama = lazy(() => import('./pages/calculators/saglik/TansiyonOlcumOrtalamasiHesaplama.jsx'));
const TuzSodyumCeviriciHesaplama = lazy(() => import('./pages/calculators/saglik/TuzSodyumCeviriciHesaplama.jsx'));
const Hba1cOrtalamaSekerHesaplama = lazy(() => import('./pages/calculators/saglik/Hba1cOrtalamaSekerHesaplama.jsx'));
const SekerOlcumOrtalamasiHesaplama = lazy(() => import('./pages/calculators/saglik/SekerOlcumOrtalamasiHesaplama.jsx'));
const KarbonhidratSayimiHesaplama = lazy(() => import('./pages/calculators/saglik/KarbonhidratSayimiHesaplama.jsx'));

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

// İnşaat & Tadilat
const BoyaHesaplama = lazy(() => import('./pages/calculators/insaat-tadilat/BoyaHesaplama.jsx'));
const FayansSeramikHesaplama = lazy(() => import('./pages/calculators/insaat-tadilat/FayansSeramikHesaplama.jsx'));
const DuvarTuglaGazbetonHesaplama = lazy(() => import('./pages/calculators/insaat-tadilat/DuvarTuglaGazbetonHesaplama.jsx'));
const BetonSapHesaplama = lazy(() => import('./pages/calculators/insaat-tadilat/BetonSapHesaplama.jsx'));
const ParkeLaminatHesaplama = lazy(() => import('./pages/calculators/insaat-tadilat/ParkeLaminatHesaplama.jsx'));
const BanyoTadilatButcesiHesaplama = lazy(() => import('./pages/calculators/insaat-tadilat/BanyoTadilatButcesiHesaplama.jsx'));
const MutfakTadilatButcesiHesaplama = lazy(() => import('./pages/calculators/insaat-tadilat/MutfakTadilatButcesiHesaplama.jsx'));
const CatiHesaplama = lazy(() => import('./pages/calculators/insaat-tadilat/CatiHesaplama.jsx'));
const EvYapimMaliyetiPlanlayici = lazy(() => import('./pages/calculators/insaat-tadilat/EvYapimMaliyetiPlanlayici.jsx'));
const AlciSivaHesaplama = lazy(() => import('./pages/calculators/insaat-tadilat/AlciSivaHesaplama.jsx'));
const KlimaBtuHesaplama = lazy(() => import('./pages/calculators/insaat-tadilat/KlimaBtuHesaplama.jsx'));
const RadyatorDilimHesaplama = lazy(() => import('./pages/calculators/insaat-tadilat/RadyatorDilimHesaplama.jsx'));
const MantolamaHesaplama = lazy(() => import('./pages/calculators/insaat-tadilat/MantolamaHesaplama.jsx'));
const MolozHafriyatHesaplama = lazy(() => import('./pages/calculators/insaat-tadilat/MolozHafriyatHesaplama.jsx'));
const DemirAgirlikHesaplama = lazy(() => import('./pages/calculators/insaat-tadilat/DemirAgirlikHesaplama.jsx'));

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
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
            <Route path="/kredi-erken-kapatma-hesaplama" element={<KrediErkenKapatmaHesaplama />} />
            <Route path="/kredi-yapilandirma-hesaplama" element={<KrediYapilandirmaHesaplama />} />
            <Route path="/kredi-karsilastirma" element={<KrediKarsilastirmaHesaplama />} />
            <Route path="/kredi-notu-araligi" element={<KrediNotuAraligiHesaplama />} />
            <Route path="/kredi-gecikme-faizi-hesaplama" element={<KrediGecikmeFaiziHesaplama />} />

            <Route path="/zam-orani-hesaplama" element={<ZamOraniHesaplama />} />
            <Route path="/bahsis-hesap-bolusme-hesaplama" element={<BahsisHesapBolusmeHesaplama />} />
            <Route path="/indirim-ustune-indirim-hesaplama" element={<IndirimUstuneIndirimHesaplama />} />
            <Route path="/kargo-desi-hesaplama" element={<KargoDesiHesaplama />} />
            <Route path="/beden-cevirici" element={<BedenCevirici />} />
            <Route path="/altin-cevirici" element={<AltinCevirici />} />

            <Route path="/elektrik-tuketimi-hesaplama" element={<ElektrikTuketimiHesaplama />} />
            <Route path="/yolculuk-yakit-payi-hesaplama" element={<YolculukYakitPayiHesaplama />} />
            <Route path="/oda-alani-malzeme-hesaplama" element={<OdaAlaniMalzemeHesaplama />} />
            <Route path="/dogalgaz-tuketimi-hesaplama" element={<DogalgazTuketimiHesaplama />} />
            <Route path="/ev-arkadasi-fatura-bolusme-hesaplama" element={<EvArkadasiFaturaBolusmeHesaplama />} />
            <Route path="/abonelik-maliyeti-hesaplama" element={<AbonelikMaliyetiHesaplama />} />
            <Route path="/arac-sahip-olma-maliyeti-hesaplama" element={<AracSahipOlmaMaliyetiHesaplama />} />
            <Route path="/elektrikli-arac-sarj-maliyeti-hesaplama" element={<ElektrikliAracSarjMaliyetiHesaplama />} />
            <Route path="/trafik-cezasi-erken-odeme-hesaplama" element={<TrafikCezasiErkenOdemeHesaplama />} />
            <Route path="/tarif-porsiyon-olcekleme-hesaplama" element={<TarifPorsiyonOlceklemeHesaplama />} />
            <Route path="/mutfak-olcu-cevirici" element={<MutfakOlcuCevirici />} />
            <Route path="/evcil-hayvan-yasi-hesaplama" element={<EvcilHayvanYasiHesaplama />} />
            <Route path="/askerlik-terhis-tarihi-hesaplama" element={<AskerlikTerhisTarihiHesaplama />} />

            <Route path="/vucut-kitle-indeksi-hesaplama" element={<VucutKitleIndeksiHesaplama />} />
            <Route path="/kalori-ihtiyaci-hesaplama" element={<KaloriIhtiyaciHesaplama />} />
            <Route path="/ideal-kilo-hesaplama" element={<IdealKiloHesaplama />} />
            <Route path="/vucut-yag-orani-hesaplama" element={<VucutYagOraniHesaplama />} />
            <Route path="/gunluk-su-ihtiyaci-hesaplama" element={<GunlukSuIhtiyaciHesaplama />} />
            <Route path="/gebelik-haftasi-hesaplama" element={<GebelikHaftasiHesaplama />} />
            <Route path="/uyku-saati-hesaplama" element={<UykuSaatiHesaplama />} />
            <Route path="/kafein-takibi-hesaplama" element={<KafeinTakibiHesaplama />} />
            <Route path="/adim-kalori-donusumu-hesaplama" element={<AdimKaloriDonusumuHesaplama />} />
            <Route path="/tansiyon-degerlendirme" element={<TansiyonDegerlendirmeHesaplama />} />
            <Route path="/tansiyon-olcum-ortalamasi" element={<TansiyonOlcumOrtalamasiHesaplama />} />
            <Route path="/tuz-sodyum-cevirici" element={<TuzSodyumCeviriciHesaplama />} />
            <Route path="/hba1c-ortalama-seker" element={<Hba1cOrtalamaSekerHesaplama />} />
            <Route path="/seker-olcum-ortalamasi" element={<SekerOlcumOrtalamasiHesaplama />} />
            <Route path="/karbonhidrat-sayimi" element={<KarbonhidratSayimiHesaplama />} />

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

            <Route path="/boya-hesaplama" element={<BoyaHesaplama />} />
            <Route path="/fayans-seramik-hesaplama" element={<FayansSeramikHesaplama />} />
            <Route path="/duvar-tugla-gazbeton-hesaplama" element={<DuvarTuglaGazbetonHesaplama />} />
            <Route path="/beton-sap-hesaplama" element={<BetonSapHesaplama />} />
            <Route path="/parke-laminat-hesaplama" element={<ParkeLaminatHesaplama />} />
            <Route path="/banyo-tadilat-butcesi-hesaplama" element={<BanyoTadilatButcesiHesaplama />} />
            <Route path="/mutfak-tadilat-butcesi-hesaplama" element={<MutfakTadilatButcesiHesaplama />} />
            <Route path="/cati-hesaplama" element={<CatiHesaplama />} />
            <Route path="/ev-yapim-maliyeti-planlayici" element={<EvYapimMaliyetiPlanlayici />} />
            <Route path="/alci-siva-hesaplama" element={<AlciSivaHesaplama />} />
            <Route path="/klima-btu-hesaplama" element={<KlimaBtuHesaplama />} />
            <Route path="/radyator-dilim-hesaplama" element={<RadyatorDilimHesaplama />} />
            <Route path="/mantolama-hesaplama" element={<MantolamaHesaplama />} />
            <Route path="/moloz-hafriyat-hesaplama" element={<MolozHafriyatHesaplama />} />
            <Route path="/demir-agirlik-hesaplama" element={<DemirAgirlikHesaplama />} />

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
      <SpeedInsights />
    </ThemeProvider>
  );
}
