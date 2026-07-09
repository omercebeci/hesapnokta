import React from 'react';
import { useCalculatorContext } from '../context/CalculatorContext.jsx';
import { formatDateTr } from '../utils/format.js';

function todayLocalDateStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Ev ölçüm çizelgelerini (tansiyon, şeker takibi) hekime götürülecek şekilde
// yazdırmak için kullanılır. columns/rows/summaryRows genel amaçlı tutulur.
export default function PrintableMeasurementLog({ columns, rows, summaryRows, note }) {
  const calculator = useCalculatorContext();

  return (
    <>
      <button type="button" className="btn-primary print-plan-button no-print" onClick={() => window.print()}>
        🖨️ Ölçüm çizelgesini yazdır
      </button>
      <p className="hint no-print" style={{ marginTop: -8 }}>Hekiminize götürmek için "PDF olarak kaydet" seçeneğini kullanabilirsiniz.</p>

      <div className="print-summary" aria-hidden="true">
        <h1>HesapNokta</h1>
        <p className="print-summary-meta">{calculator?.title} — {formatDateTr(todayLocalDateStr())}</p>
        <table className="print-summary-table">
          <thead>
            <tr>{columns.map((col) => <th key={col.key}>{col.label}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id ?? index}>
                {columns.map((col) => <td key={col.key}>{row[col.key] ?? '—'}</td>)}
              </tr>
            ))}
          </tbody>
          {summaryRows?.length > 0 && (
            <tfoot>
              {summaryRows.map((summary) => (
                <tr key={summary.label}>
                  <td>{summary.label}</td>
                  {columns.slice(1).map((col) => <td key={col.key}>{summary.values[col.key] ?? '—'}</td>)}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
        {note && <p className="print-summary-note">{note}</p>}
      </div>
    </>
  );
}
