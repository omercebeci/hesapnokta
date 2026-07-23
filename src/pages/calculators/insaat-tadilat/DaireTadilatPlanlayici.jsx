import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import ShoppingListCard from '../../../components/ShoppingListCard.jsx';
import PrintableMaterialList from '../../../components/PrintableMaterialList.jsx';
import { aggregateRoomRenovationPlan } from '../../../lib/insaatTadilatCalculators.js';
import { formatInteger, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState, serializeRows, deserializeRows } from '../../../hooks/useQueryParamState.js';

let rowIdCounter = 0;
const createRow = (label, length, width, height, boya, zeminTuru, duvarSeramik, siva) => ({
  id: rowIdCounter++,
  label,
  length,
  width,
  height,
  boya: boya ? '1' : '0',
  zeminTuru,
  duvarSeramik: duvarSeramik ? '1' : '0',
  siva: siva ? '1' : '0',
});
const ROW_FIELDS = ['label', 'length', 'width', 'height', 'boya', 'zeminTuru', 'duvarSeramik', 'siva'];
const DEFAULT_ROWS = [
  createRow('Salon', '5', '4', '2,7', true, 'parke', false, false),
  createRow('Yatak Odası', '4', '3,5', '2,7', true, 'parke', false, false),
  createRow('Banyo', '2,5', '2', '2,7', false, 'seramik', true, false),
  createRow('Mutfak', '3,5', '3', '2,7', true, 'seramik', false, false),
  createRow('Hol', '3', '1,5', '2,7', true, 'seramik', false, false),
];

const ZEMIN_OPTIONS = [
  { value: 'yok', label: 'Yok' },
  { value: 'seramik', label: 'Seramik' },
  { value: 'parke', label: 'Parke/Laminat' },
];

export default function DaireTadilatPlanlayici() {
  const [rows, setRows] = useQueryParamState('odalar', DEFAULT_ROWS, {
    serialize: (value) => serializeRows(value, ROW_FIELDS),
    deserialize: (text) => deserializeRows(text, ROW_FIELDS, (v) => ({ id: rowIdCounter++, ...v })) ?? DEFAULT_ROWS,
  });

  const updateRow = (id, field, value) => setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  const toggleRow = (id, field) => setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: row[field] === '1' ? '0' : '1' } : row)));
  const addRow = () => setRows((current) => [...current, createRow('Oda', '3', '3', '2,7', false, 'yok', false, false)]);
  const removeRow = (id) => setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));

  const result = useMemo(() => {
    const rooms = rows.map((row) => ({
      label: row.label?.trim() || 'Oda',
      length: parseLocaleNumber(row.length),
      width: parseLocaleNumber(row.width),
      height: parseLocaleNumber(row.height),
      boya: row.boya === '1',
      zeminTuru: row.zeminTuru === 'seramik' || row.zeminTuru === 'parke' ? row.zeminTuru : null,
      duvarSeramik: row.duvarSeramik === '1',
      siva: row.siva === '1',
    })).filter((room) => Number.isFinite(room.length) && room.length > 0 && Number.isFinite(room.width) && room.width > 0 && Number.isFinite(room.height) && room.height > 0);

    return aggregateRoomRenovationPlan({ rooms });
  }, [rows]);

  const shoppingItems = useMemo(() => {
    const { totals, paintPackages } = result;
    const items = [];
    if (totals.paintLiters > 0) {
      const packageParts = [];
      if (paintPackages.fifteen > 0) packageParts.push(`${paintPackages.fifteen} × 15L`);
      if (paintPackages.sevenHalf > 0) packageParts.push(`${paintPackages.sevenHalf} × 7,5L`);
      if (paintPackages.twoHalf > 0) packageParts.push(`${paintPackages.twoHalf} × 2,5L`);
      items.push({ label: 'Boya', value: `${formatNumber(totals.paintLiters)} L (${packageParts.join(' + ')})` });
    }
    if (totals.floorTileCount > 0) items.push({ label: 'Zemin seramik', value: `${formatInteger(totals.floorTileCount)} adet (${formatInteger(totals.floorTileBoxCount)} kutu)` });
    if (totals.flooringAreaWithWaste > 0) items.push({ label: 'Zemin parke/laminat', value: `${formatNumber(totals.flooringAreaWithWaste)} m² (${formatInteger(totals.flooringPackageCount)} paket) + ${formatNumber(totals.flooringPerimeterM)} m süpürgelik` });
    if (totals.wallTileCount > 0) items.push({ label: 'Duvar seramik', value: `${formatInteger(totals.wallTileCount)} adet (${formatInteger(totals.wallTileBoxCount)} kutu)` });
    if (totals.plasterKg > 0) items.push({ label: 'Sıva/alçı', value: `${formatNumber(totals.plasterKg)} kg (${formatInteger(totals.plasterBagCount)} torba)` });
    return items;
  }, [result]);

  return (
    <CalculatorLayout calculatorId="daire-tadilat-planlayici">
      <div className="calc-card">
        <h2>Odalar</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem', marginTop: -6 }}>Her oda için ölçüleri girin ve yapacağınız işleri işaretleyin; tüm odaların malzemesi tek listede toplanır.</p>
        <div style={{ display: 'grid', gap: 14 }}>
          {rows.map((row) => (
            <div key={row.id} className="info-card" style={{ margin: 0 }}>
              <div className="form-grid">
                <FormField label="Oda adı" htmlFor={`label-${row.id}`}>
                  <input id={`label-${row.id}`} type="text" value={row.label} onChange={(e) => updateRow(row.id, 'label', e.target.value)} />
                </FormField>
                <FormField label="Uzunluk (m)" htmlFor={`length-${row.id}`}>
                  <input id={`length-${row.id}`} type="text" inputMode="decimal" value={row.length} onChange={(e) => updateRow(row.id, 'length', e.target.value)} />
                </FormField>
                <FormField label="Genişlik (m)" htmlFor={`width-${row.id}`}>
                  <input id={`width-${row.id}`} type="text" inputMode="decimal" value={row.width} onChange={(e) => updateRow(row.id, 'width', e.target.value)} />
                </FormField>
                <FormField label="Tavan yüksekliği (m)" htmlFor={`height-${row.id}`}>
                  <input id={`height-${row.id}`} type="text" inputMode="decimal" value={row.height} onChange={(e) => updateRow(row.id, 'height', e.target.value)} />
                </FormField>
                <FormField label="Zemin kaplama" htmlFor={`zemin-${row.id}`} full>
                  <div className="segmented" role="group" aria-label="Zemin kaplama">
                    {ZEMIN_OPTIONS.map((option) => (
                      <button key={option.value} type="button" className={row.zeminTuru === option.value ? 'active' : ''} onClick={() => updateRow(row.id, 'zeminTuru', option.value)}>{option.label}</button>
                    ))}
                  </div>
                </FormField>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                    <input type="checkbox" checked={row.boya === '1'} onChange={() => toggleRow(row.id, 'boya')} /> Boya
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                    <input type="checkbox" checked={row.duvarSeramik === '1'} onChange={() => toggleRow(row.id, 'duvarSeramik')} /> Duvar seramik (tüm duvar yüksekliği)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                    <input type="checkbox" checked={row.siva === '1'} onChange={() => toggleRow(row.id, 'siva')} /> Sıva/Alçı (duvar)
                  </label>
                </div>
                {row.duvarSeramik === '1' && (
                  <p className="hint" style={{ gridColumn: '1 / -1', marginTop: -4 }}>"Duvar seramik" tüm duvar yüksekliği için hesaplanır — banyo gibi tam kaplamalı alanlar için uygundur. Mutfakta genelde tezgah üstü dar bir şerit yeterlidir; bu durumda daha doğru bir sonuç için tekil Fayans/Seramik Hesaplama aracını kendi ölçünüzle kullanmanız önerilir.</p>
                )}
              </div>
              {rows.length > 1 && (
                <button type="button" className="header-home-link" onClick={() => removeRow(row.id)}>Bu odayı kaldır</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" style={{ justifySelf: 'start' }} onClick={addRow}>+ Oda ekle</button>
        </div>
      </div>

      <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
        {shoppingItems.length === 0 ? (
          <p className="hint">Malzeme listesini görmek için en az bir odada bir iş işaretleyin.</p>
        ) : (
          <>
            <ShoppingListCard items={shoppingItems.map((item) => `${item.label}: ${item.value}`)} />
            <PrintableMaterialList items={shoppingItems} />
          </>
        )}
      </div>

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Bu araç yeni bir hesaplama yöntemi kullanmaz: her oda için Boya, Fayans/Seramik, Parke/Laminat ve Alçı/Sıva Hesaplama araçlarındaki aynı formüller çalıştırılır (ör. boya için duvar alanı × kat sayısı ÷ verim), ardından tüm odaların sonuçları tek bir malzeme listesinde toplanır. Oda başına ayrıntılı parametre sormak yerine (fayans ölçüsü, fire payı vb.) ilgili tekil araçla aynı tipik varsayılan değerler kullanılır; hassas/özel bir hesap için o aracı ayrıca kullanabilirsiniz.</p>
      </div>
    </CalculatorLayout>
  );
}
