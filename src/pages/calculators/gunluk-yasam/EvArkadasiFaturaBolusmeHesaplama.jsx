import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import RatioBar from '../../../components/RatioBar.jsx';
import { calculateRoommateSplit } from '../../../lib/gunlukYasamCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState, serializeRows, deserializeRows } from '../../../hooks/useQueryParamState.js';

let itemIdCounter = 0;
const createItem = (label = '', amount = '') => ({ id: itemIdCounter++, label, amount });
const ITEM_FIELDS = ['label', 'amount'];
const DEFAULT_ITEMS = [createItem('Kira', '15000'), createItem('Elektrik/Su/Doğalgaz', '3000'), createItem('İnternet', '400')];

let personIdCounter = 0;
const createPerson = (name = '', weight = '1') => ({ id: personIdCounter++, name, weight });
const PERSON_FIELDS = ['name', 'weight'];
const DEFAULT_PEOPLE = [createPerson('Kişi 1', '1'), createPerson('Kişi 2', '1')];

export default function EvArkadasiFaturaBolusmeHesaplama() {
  const [mode, setMode] = useQueryParamState('mod', 'equal');
  const [items, setItems] = useQueryParamState('kalemler', DEFAULT_ITEMS, {
    serialize: (value) => serializeRows(value, ITEM_FIELDS),
    deserialize: (text) => deserializeRows(text, ITEM_FIELDS, (v) => createItem(v.label, v.amount)) ?? DEFAULT_ITEMS,
  });
  const [people, setPeople] = useQueryParamState('kisiler', DEFAULT_PEOPLE, {
    serialize: (value) => serializeRows(value, PERSON_FIELDS),
    deserialize: (text) => deserializeRows(text, PERSON_FIELDS, (v) => createPerson(v.name, v.weight)) ?? DEFAULT_PEOPLE,
  });

  const updateItem = (id, field, value) => setItems((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  const addItem = () => setItems((current) => [...current, createItem()]);
  const removeItem = (id) => setItems((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));

  const updatePerson = (id, field, value) => setPeople((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  const addPerson = () => setPeople((current) => [...current, createPerson(`Kişi ${current.length + 1}`)]);
  const removePerson = (id) => setPeople((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));

  const { result, error } = useMemo(() => {
    const parsedItems = items.map((item) => ({ label: item.label || 'Kalem', amount: parseLocaleNumber(item.amount) }));
    const validItems = parsedItems.filter((item) => Number.isFinite(item.amount) && item.amount > 0);

    if (validItems.length === 0) {
      return { result: null, error: 'Lütfen en az bir kalem için geçerli bir tutar girin.' };
    }
    if (people.length === 0) {
      return { result: null, error: 'Lütfen en az bir kişi ekleyin.' };
    }

    const parsedPeople = people.map((person, index) => ({
      name: person.name?.trim() || `Kişi ${index + 1}`,
      weight: parseLocaleNumber(person.weight),
    }));

    if (mode === 'weighted' && parsedPeople.some((p) => !Number.isFinite(p.weight) || p.weight <= 0)) {
      return { result: null, error: 'Ağırlıklı bölüşümde her kişi için 0\'dan büyük bir ağırlık (oda m², gelir vb.) girmelisiniz.' };
    }

    return { result: calculateRoommateSplit({ items: validItems, people: parsedPeople, mode }), error: null };
  }, [items, people, mode]);

  return (
    <CalculatorLayout calculatorId="ev-arkadasi-fatura-bolusme-hesaplama">
      <div className="calc-card">
        <h2>Kira ve fatura kalemleri</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {items.map((item) => (
            <div className="form-grid" key={item.id}>
              <FormField label="Kalem" htmlFor={`item-label-${item.id}`}>
                <input id={`item-label-${item.id}`} type="text" value={item.label} onChange={(e) => updateItem(item.id, 'label', e.target.value)} />
              </FormField>
              <FormField label="Tutar (TL)" htmlFor={`item-amount-${item.id}`}>
                <AmountInput id={`item-amount-${item.id}`} value={item.amount} onChange={(raw) => updateItem(item.id, 'amount', raw)} />
              </FormField>
              {items.length > 1 && (
                <button type="button" className="header-home-link" style={{ justifySelf: 'start' }} onClick={() => removeItem(item.id)}>
                  Bu kalemi kaldır
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" style={{ justifySelf: 'start' }} onClick={addItem}>+ Kalem ekle</button>
        </div>
      </div>

      <div className="calc-card">
        <h2>Bölüşüm yöntemi</h2>
        <div className="form-grid">
          <FormField label="Yöntem" htmlFor="mode">
            <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="equal">Eşit bölüşüm</option>
              <option value="weighted">Ağırlığa göre bölüşüm (oda büyüklüğü, gelir vb.)</option>
            </select>
          </FormField>
        </div>
        <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
          {people.map((person) => (
            <div className="form-grid" key={person.id}>
              <FormField label="Kişi adı" htmlFor={`person-name-${person.id}`}>
                <input id={`person-name-${person.id}`} type="text" value={person.name} onChange={(e) => updatePerson(person.id, 'name', e.target.value)} />
              </FormField>
              {mode === 'weighted' && (
                <FormField label="Ağırlık (oda m², gelir vb.)" htmlFor={`person-weight-${person.id}`}>
                  <input id={`person-weight-${person.id}`} type="text" inputMode="decimal" value={person.weight} onChange={(e) => updatePerson(person.id, 'weight', e.target.value)} />
                </FormField>
              )}
              {people.length > 1 && (
                <button type="button" className="header-home-link" style={{ justifySelf: 'start' }} onClick={() => removePerson(person.id)}>
                  Bu kişiyi kaldır
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" style={{ justifySelf: 'start' }} onClick={addPerson}>+ Kişi ekle</button>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Toplam kira + fatura" value={formatCurrency(result.total)} />
          <ResultMetrics items={result.breakdown.map((row) => ({ label: row.name, value: formatCurrency(row.amount) }))} />
          <div className="result-metric" style={{ display: 'grid', gap: 16 }}>
            {result.breakdown.map((row) => (
              <RatioBar key={row.name} label={row.name} value={row.ratio} tone="accent" />
            ))}
          </div>
        </div>
      )}

      <div className="info-card">
        <h2>Hangi bölüşüm yöntemini seçmeliyim?</h2>
        <p>
          "Eşit bölüşüm" toplam tutarı kişi sayısına böler; herkesin ortak alanı aynı şekilde kullandığı durumlarda
          adildir. "Ağırlığa göre bölüşüm" ise girdiğiniz bir ölçüte (oda metrekaresi, gelir düzeyi, kullanım oranı vb.)
          göre payları orantılar — örneğin daha büyük odada kalan kişi kira payının daha büyük bir kısmını üstlenir.
        </p>
      </div>
    </CalculatorLayout>
  );
}
