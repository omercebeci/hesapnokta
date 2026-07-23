import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics } from '../../../components/Result.jsx';
import { calculateRenovationTimeline, RENOVATION_TASKS } from '../../../lib/insaatTadilatCalculators.js';
import { formatDateTr, formatInteger } from '../../../utils/format.js';
import { useQueryParamState, serializeRows, deserializeRows } from '../../../hooks/useQueryParamState.js';

const TASK_LIST = Object.entries(RENOVATION_TASKS)
  .map(([key, task]) => ({ key, ...task }))
  .sort((a, b) => a.order - b.order);

const ROW_FIELDS = ['enabled'];
const DEFAULT_ROWS = TASK_LIST.map(() => ({ enabled: '1' }));

function addDays(dateStr, days) {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default function TadilatTakvimi() {
  const [rows, setRows] = useQueryParamState('isler', DEFAULT_ROWS, {
    serialize: (value) => serializeRows(value, ROW_FIELDS),
    deserialize: (text) => {
      const parsed = deserializeRows(text, ROW_FIELDS, (v) => ({ enabled: v.enabled }));
      return parsed && parsed.length === TASK_LIST.length ? parsed : DEFAULT_ROWS;
    },
  });
  const [startDate, setStartDate] = useQueryParamState('baslangic', '');

  const toggleRow = (index) => {
    setRows((current) => current.map((row, i) => (i === index ? { enabled: row.enabled === '1' ? '0' : '1' } : row)));
  };

  const result = useMemo(() => {
    const selectedTaskKeys = TASK_LIST.filter((_, index) => rows[index]?.enabled === '1').map((task) => task.key);
    return calculateRenovationTimeline({ selectedTaskKeys });
  }, [rows]);

  const hasValidStartDate = startDate && !Number.isNaN(new Date(`${startDate}T00:00:00`).getTime());

  return (
    <CalculatorLayout calculatorId="tadilat-takvimi">
      <div className="calc-card">
        <h2>Yapılacak işler</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem', marginTop: -6 }}>Yapmayı planladığınız işleri işaretleyin; araç bunları doğru sıraya dizip kuruma/bekleme sürelerini ekleyerek toplam takvimi çıkarır.</p>
        <div style={{ display: 'grid', gap: 8 }}>
          {TASK_LIST.map((task, index) => (
            <label key={task.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
              <input type="checkbox" checked={rows[index]?.enabled === '1'} onChange={() => toggleRow(index)} />
              {task.label}
            </label>
          ))}
        </div>
        <FormField label="Başlangıç tarihi (opsiyonel)" htmlFor="startDate" hint="Girerseniz her iş için tahmini takvim tarihlerini de gösteririz.">
          <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </FormField>
      </div>

      <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
        <p className="rate-disclaimer">⚠️ Süreler ve kuruma/bekleme aralıkları genel tahminlerdir; hava koşulları, mevsim, malzeme türü ve usta yoğunluğuna göre önemli ölçüde değişebilir. Kritik tarihler (ör. taşınma günü) için pay bırakın.</p>

        {result.timeline.length === 0 ? (
          <p className="hint">Takvimi görmek için en az bir iş seçin.</p>
        ) : (
          <>
            <ResultCard
              label="Toplam tahmini süre"
              value={`${formatInteger(result.totalDaysMin)} - ${formatInteger(result.totalDaysMax)} gün`}
              note={hasValidStartDate ? `Tahmini bitiş: ${formatDateTr(addDays(startDate, result.totalDaysMin))} - ${formatDateTr(addDays(startDate, result.totalDaysMax))}` : `Yaklaşık ${formatInteger(Math.round(result.totalDaysMin / 7))} - ${formatInteger(Math.round(result.totalDaysMax / 7))} hafta`}
            />

            <div className="result-metric" style={{ display: 'grid', gap: 12 }}>
              {result.timeline.map((step) => (
                <div key={step.key} className="info-card" style={{ margin: 0 }}>
                  <h3 style={{ marginTop: 0 }}>{step.label}</h3>
                  <ResultMetrics
                    items={[
                      { label: 'İş süresi', value: `${formatInteger(step.workDaysMin)} - ${formatInteger(step.workDaysMax)} gün` },
                      ...(step.waitLabel ? [{ label: step.waitLabel, value: `${formatInteger(step.waitDaysMin)} - ${formatInteger(step.waitDaysMax)} gün` }] : []),
                      ...(hasValidStartDate ? [
                        { label: 'Başlangıç', value: `${formatDateTr(addDays(startDate, step.startDayMin))} - ${formatDateTr(addDays(startDate, step.startDayMax))}` },
                        { label: 'Hazır olma', value: `${formatDateTr(addDays(startDate, step.readyDayMin))} - ${formatDateTr(addDays(startDate, step.readyDayMax))}` },
                      ] : []),
                    ]}
                  />
                  {step.utilityWarning && <p className="hint">🚿⚡ {step.utilityWarning}</p>}
                  {step.homeStayWarning && <p className="hint">🏠 {step.homeStayWarning}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Seçtiğiniz işler, genel kabul gören tadilat sırasına (yıkım → tesisat/elektrik → şap → sıva/alçı → seramik → boya → zemin kaplaması → mobilya/dolap → temizlik) göre dizilir. Şap dökümü, sıva/alçı ve seramik gibi bazı işlerin ardından, bir sonraki iş başlamadan önce beklenmesi gereken bir kuruma süresi eklenir (ör. şap kuruması haftalar sürebilir); bu araç bir sonraki işin, önceki işin hem çalışma hem kuruma süresi tamamlandıktan sonra başladığını varsayar. Süreler, ortalama bir daire/oda kapsamı için yaygın kaynaklarda tekrarlanan tahmini aralıklardır.</p>
      </div>
    </CalculatorLayout>
  );
}
