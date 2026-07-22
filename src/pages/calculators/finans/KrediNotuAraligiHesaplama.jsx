import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import RatioBar from '../../../components/RatioBar.jsx';
import RelatedTools from '../../../components/RelatedTools.jsx';
import { ResultCard, ResultError } from '../../../components/Result.jsx';
import { getFindeksScoreRange } from '../../../lib/finansCalculators.js';
import { parseLocaleNumber } from '../../../utils/format.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const FINDEKS_VERISI = GUNCEL_VERILER.findeksPuanAraliklari;

const TONE_BY_KEY = {
  cokRiskli: 'danger',
  ortaRiskli: 'warning',
  azRiskli: 'warning',
  iyi: 'accent',
  cokIyi: 'success',
};

export default function KrediNotuAraligiHesaplama() {
  const [score, setScore] = useQueryParamState('puan', '1500');

  const { result, error } = useMemo(() => {
    const parsed = parseLocaleNumber(score);
    if (!Number.isFinite(parsed)) {
      return { result: null, error: 'Lütfen 0-1900 arasında bir Findeks kredi notu girin.' };
    }
    return { result: getFindeksScoreRange(parsed), error: null };
  }, [score]);

  return (
    <CalculatorLayout calculatorId="kredi-notu-araligi">
      {/* ÖNEMLİ: bu şeffaflık notu gizli bir dipnot DEĞİL — sonuç kartının hemen yanında,
          her zaman görünür durmalı. Bu aralıklar KKB'nin resmi bir yayını değildir. */}
      <div className="calc-card" style={{ background: 'var(--warning-soft)', borderColor: 'var(--warning)' }}>
        <p style={{ margin: 0, fontSize: '.88rem', color: 'var(--text-secondary)' }}>
          ⚠️ <strong>KKB (Kredi Kayıt Bürosu) resmi bir puan aralığı tablosu yayımlamaz.</strong> Aşağıdaki aralıklar,
          birden fazla bağımsız kaynakta tutarlı şekilde tekrarlanan YAYGIN SEKTÖR REFERANSIDIR — bankalar kendi iç
          değerlendirme modellerinde farklı eşikler kullanabilir. Bu araç puanınızı HESAPLAMAZ veya TAHMİN ETMEZ;
          gerçek Findeks kredi notunuzu yalnızca <strong>Findeks.com</strong> üzerinden öğrenebilirsiniz.
        </p>
      </div>

      <div className="calc-card">
        <h2>Findeks kredi notunuz</h2>
        <div className="form-grid">
          <FormField label="Findeks kredi notu (0-1900)" htmlFor="score" full hint="Findeks.com üzerinden öğrendiğiniz notu girin">
            <input id="score" type="text" inputMode="numeric" value={score} onChange={(e) => setScore(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          {result.isOutOfBounds && (
            <p className="rate-disclaimer">⚠️ Girdiğiniz puan geçerli Findeks aralığının (0-1900) dışında; en yakın sınıra ({result.score}) göre gösteriliyor.</p>
          )}
          <ResultCard
            tone={TONE_BY_KEY[result.range?.key] === 'danger' ? 'danger' : TONE_BY_KEY[result.range?.key] === 'warning' ? 'warning' : undefined}
            label={`Puanınız (${result.score}) şu aralıkta:`}
            value={result.range?.label ?? '—'}
            note="Bu, birden fazla bağımsız kaynakta tutarlı şekilde tekrarlanan yaygın bir sektör referansıdır — resmi bir KKB sınıflandırması değildir."
          />
          <RatioBar label="0-1900 skalasındaki konumunuz" value={(result.score / 1900) * 100} tone={TONE_BY_KEY[result.range?.key] || 'accent'} />
          <div className="calc-card" style={{ background: 'var(--bg-soft)' }}>
            <h2 style={{ fontSize: '1.05rem' }}>Tüm risk aralıkları</h2>
            <table className="schedule-table">
              <thead>
                <tr><th>Aralık</th><th>Puan</th></tr>
              </thead>
              <tbody>
                {FINDEKS_VERISI.value.map((r) => (
                  <tr key={r.key} style={r.key === result.range?.key ? { fontWeight: 700, color: 'var(--accent)' } : undefined}>
                    <td>{r.label}{r.key === result.range?.key ? ' ← siz buradasınız' : ''}</td>
                    <td>{r.min} - {r.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl yorumlanır?</h2>
        <ul>
          <li>Findeks kredi notu, ödeme alışkanlıklarınız, mevcut borçluluk durumunuz, yeni finansman ürünleri ve kredi kullanım yoğunluğunuza göre KKB (Kredi Kayıt Bürosu) tarafından hesaplanan, 0-1900 arası bir puandır.</li>
          <li>Bu araç yalnızca girdiğiniz puanı YUKARIDA AÇIKLANAN yaygın referans aralığına yerleştirir; puanınızı hesaplamaz, tahmin etmez ve resmi bir KKB kaynağı değildir.</li>
          <li>Bankalar kredi/kart başvurularını değerlendirirken kendi iç politikalarını uygular; aynı puan farklı bankalarda farklı sonuç verebilir.</li>
          <li>Güncel ve doğru puanınızı öğrenmenin tek yolu Findeks.com üzerinden resmi rapor almaktır.</li>
        </ul>
        <RelatedTools items={[
          { to: '/kredi-gecikme-faizi-hesaplama', label: 'Kredi Gecikme Faizi' },
          { to: '/kredi-karti-asgari-odeme-hesaplama', label: 'Kredi Kartı Asgari Ödeme' },
          { to: '/emlak-kredisi-uygunluk-hesaplama', label: 'Emlak Kredisi Uygunluk' },
        ]} />
      </div>
    </CalculatorLayout>
  );
}
