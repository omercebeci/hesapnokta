import { describe, expect, it } from 'vitest';
import { serializeRows, deserializeRows } from './useQueryParamState.js';

describe('serializeRows / deserializeRows', () => {
  const fields = ['value', 'weight'];
  const createRow = (values) => ({ id: 'row', ...values });

  it('serializes rows into a short colon/comma-delimited string', () => {
    const rows = [{ value: '70', weight: '40' }, { value: '85', weight: '60' }];
    expect(serializeRows(rows, fields)).toBe('70:40,85:60');
  });

  it('round-trips serialize -> deserialize back into equivalent row values', () => {
    const rows = [{ value: '70', weight: '40' }, { value: '85', weight: '60' }];
    const text = serializeRows(rows, fields);
    const decoded = deserializeRows(text, fields, createRow);
    expect(decoded).toEqual([
      { id: 'row', value: '70', weight: '40' },
      { id: 'row', value: '85', weight: '60' },
    ]);
  });

  it('returns null for empty input so callers can fall back to defaults', () => {
    expect(deserializeRows('', fields, createRow)).toBeNull();
    expect(deserializeRows(undefined, fields, createRow)).toBeNull();
  });

  it('fills missing trailing fields with empty strings', () => {
    const decoded = deserializeRows('70', fields, createRow);
    expect(decoded).toEqual([{ id: 'row', value: '70', weight: '' }]);
  });

  it('handles a single field (no colon separator)', () => {
    const decoded = deserializeRows('filtreKahve:2,kola:1', ['drinkType', 'count'], createRow);
    expect(decoded).toEqual([
      { id: 'row', drinkType: 'filtreKahve', count: '2' },
      { id: 'row', drinkType: 'kola', count: '1' },
    ]);
  });
});
