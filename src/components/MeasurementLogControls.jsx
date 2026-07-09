import React, { useRef, useState } from 'react';
import { sortRowsByDate } from '../lib/saglikCalculators.js';
import { mergeRowsByDate } from '../hooks/useMeasurementRows.js';

// Ölçüm günlüğü sayfalarında (tansiyon/şeker takibi) ortak: tümünü temizle + JSON
// yedek indirme/yükleme. Cihaz değişiminde veri taşımanın tek yolu budur (localStorage
// cihaza özeldir, sunucuya gönderilmez).
export default function MeasurementLogControls({ rows, setRows, fields, createRowFromValues, clearAll, createEmptyRow, fileNamePrefix }) {
  const fileInputRef = useRef(null);
  const [importMessage, setImportMessage] = useState('');

  const handleClearAll = () => {
    const confirmed = window.confirm('Tüm kayıtlı ölçümler bu cihazdan silinsin mi? Bu işlem geri alınamaz.');
    if (confirmed) {
      clearAll(createEmptyRow());
      setImportMessage('');
    }
  };

  const handleExport = () => {
    const plainRows = rows.map((row) => {
      const values = {};
      fields.forEach((field) => { values[field] = row[field] ?? ''; });
      return values;
    });
    const payload = { hesapnokta: true, exportedAt: new Date().toISOString(), rows: plainRows };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileNamePrefix}-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        const importedRaw = Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : null;
        if (!importedRaw) throw new Error('geçersiz format');
        const imported = importedRaw.map((values) => createRowFromValues(values)).filter((row) => row.date);
        if (imported.length === 0) throw new Error('kayıt yok');

        const merged = sortRowsByDate(mergeRowsByDate(rows, imported, createRowFromValues));
        setRows(merged);
        setImportMessage(`✓ Yedek yüklendi: ${imported.length} kayıt işlendi (aynı tarihli kayıtlarda bu cihazdaki veri korunur).`);
      } catch (error) {
        setImportMessage('⚠️ Dosya okunamadı. Bu araçtan daha önce indirilmiş bir yedek dosyası (.json) seçtiğinizden emin olun.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="measurement-log-controls">
      <button type="button" className="header-home-link" onClick={handleExport}>⬇️ Yedeği indir</button>
      <button type="button" className="header-home-link" onClick={handleImportClick}>⬆️ Yedekten yükle</button>
      <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFileChange} style={{ display: 'none' }} />
      <button type="button" className="header-home-link measurement-log-controls-danger" onClick={handleClearAll}>🗑️ Tümünü temizle</button>
      {importMessage && <p className="hint measurement-log-controls-message">{importMessage}</p>}
    </div>
  );
}
