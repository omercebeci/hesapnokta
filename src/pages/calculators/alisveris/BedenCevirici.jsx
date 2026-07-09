import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { SIZE_TABLES, findSizeRow } from '../../../lib/alisverisCalculators.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const CATEGORY_OPTIONS = [
  { id: 'kadinGiyim', label: 'Kadın Giyim' },
  { id: 'erkekGiyim', label: 'Erkek Giyim' },
  { id: 'kadinAyakkabi', label: 'Kadın Ayakkabı' },
  { id: 'erkekAyakkabi', label: 'Erkek Ayakkabı' },
];

export default function BedenCevirici() {
  const [category, setCategory] = useQueryParamState('kategori', 'kadinGiyim');
  const [trSize, setTrSize] = useQueryParamState('beden', String(SIZE_TABLES.kadinGiyim[0].tr));

  const table = SIZE_TABLES[category] || SIZE_TABLES.kadinGiyim;

  const row = useMemo(() => findSizeRow(category, 'tr', Number(trSize)), [category, trSize]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setTrSize(String(SIZE_TABLES[newCategory][0].tr));
  };

  return (
    <CalculatorLayout calculatorId="beden-cevirici">
      <div className="calc-card">
        <h2>Beden bilgileri</h2>
        <div className="form-grid">
          <FormField label="Kategori" htmlFor="category">
            <select id="category" value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
              {CATEGORY_OPTIONS.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
            </select>
          </FormField>
          <FormField label="TR beden" htmlFor="trSize">
            <select id="trSize" value={trSize} onChange={(e) => setTrSize(e.target.value)}>
              {table.map((r) => <option key={r.tr} value={r.tr}>{r.tr}</option>)}
            </select>
          </FormField>
        </div>
      </div>

      {row ? (
        <div key={`${category}-${trSize}`} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="EU beden" value={String(row.eu)} />
          <ResultMetrics
            items={[
              { label: 'US beden', value: String(row.us) },
              { label: 'UK beden', value: String(row.uk) },
            ]}
          />
        </div>
      ) : (
        <ResultError message="Seçilen kategori için beden bulunamadı." />
      )}

      <div className="info-card">
        <h2>Nasıl kullanılır?</h2>
        <p>Türkiye'de kullanılan giyim ve ayakkabı bedenleri EU (Avrupa) numaralandırmasıyla aynıdır (TR beden = EU beden). US ve UK karşılıkları yaygın kullanılan standart beden dönüşüm tablolarına dayanır; marka ve modele göre kalıp farkı olabileceğinden kesin ölçü için satıcının kendi beden tablosunu kontrol etmenizde fayda var.</p>
      </div>
    </CalculatorLayout>
  );
}
