// Matematik kategorisi için saf hesaplama fonksiyonları.

const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

// mode: 'percentOf' (X'in %Y'si), 'whatPercent' (A, B'nin yüzde kaçı), 'change' (A'dan B'ye % değişim)
export function calculatePercentage({ mode, valueA, valueB }) {
  const a = safeNumber(valueA);
  const b = safeNumber(valueB);

  if (mode === 'whatPercent') {
    const result = b !== 0 ? (a / b) * 100 : 0;
    return { result: round2(result) };
  }

  if (mode === 'change') {
    const result = a !== 0 ? ((b - a) / a) * 100 : 0;
    return { result: round2(result), difference: round2(b - a) };
  }

  // percentOf: a sayısının %b'si
  const result = (a * b) / 100;
  return { result: round2(result) };
}

// type: 'direct' (doğru orantı, a/b = c/x) veya 'inverse' (ters orantı, a*b = c*x)
export function calculateRatio({ type, a, b, c }) {
  const valueA = safeNumber(a);
  const valueB = safeNumber(b);
  const valueC = safeNumber(c);

  if (type === 'inverse') {
    const x = valueC !== 0 ? (valueA * valueB) / valueC : 0;
    return { result: round2(x) };
  }

  const x = valueA !== 0 ? (valueC * valueB) / valueA : 0;
  return { result: round2(x) };
}

const AREA_SHAPES = {
  rectangle: ({ width, height }) => safeNumber(width) * safeNumber(height),
  square: ({ side }) => safeNumber(side) ** 2,
  circle: ({ radius }) => Math.PI * safeNumber(radius) ** 2,
  triangle: ({ base, height }) => (safeNumber(base) * safeNumber(height)) / 2,
};

const VOLUME_SHAPES = {
  cube: ({ side }) => safeNumber(side) ** 3,
  cuboid: ({ width, height, depth }) => safeNumber(width) * safeNumber(height) * safeNumber(depth),
  cylinder: ({ radius, height }) => Math.PI * safeNumber(radius) ** 2 * safeNumber(height),
  sphere: ({ radius }) => (4 / 3) * Math.PI * safeNumber(radius) ** 3,
  cone: ({ radius, height }) => (1 / 3) * Math.PI * safeNumber(radius) ** 2 * safeNumber(height),
};

export function calculateAreaVolume({ mode, shape, dims }) {
  const shapes = mode === 'volume' ? VOLUME_SHAPES : AREA_SHAPES;
  const formula = shapes[shape];
  if (!formula) return { result: 0 };
  return { result: round2(formula(dims || {})) };
}

// items: [{ value, weight }]. Basit ortalama tüm değerleri eşit ağırlıklandırır; ağırlıklı ortalama
// weight alanını (kredi/yüzde/puan gibi) katsayı olarak kullanır (ör. not ortalaması senaryosu).
export function calculateAverage(items) {
  const validItems = (items || [])
    .map((item) => ({ value: safeNumber(item.value, NaN), weight: safeNumber(item.weight, NaN) }))
    .filter((item) => Number.isFinite(item.value) && Number.isFinite(item.weight) && item.weight > 0);

  if (validItems.length === 0) {
    return { simpleAverage: 0, weightedAverage: 0, totalWeight: 0, count: 0 };
  }

  const simpleAverage = validItems.reduce((sum, item) => sum + item.value, 0) / validItems.length;
  const totalWeight = validItems.reduce((sum, item) => sum + item.weight, 0);
  const weightedAverage = validItems.reduce((sum, item) => sum + item.value * item.weight, 0) / totalWeight;

  return {
    simpleAverage: round2(simpleAverage),
    weightedAverage: round2(weightedAverage),
    totalWeight: round2(totalWeight),
    count: validItems.length,
  };
}

function factorial(n) {
  if (n < 0 || !Number.isFinite(n)) return NaN;
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

// mode: 'combination' (nCr, sıra önemsiz) veya 'permutation' (nPr, sıra önemli)
export function calculateCombinationPermutation({ n, r, mode }) {
  const total = Math.floor(safeNumber(n, NaN));
  const chosen = Math.floor(safeNumber(r, NaN));

  if (!Number.isFinite(total) || !Number.isFinite(chosen) || total < 0 || chosen < 0 || chosen > total || total > 170) {
    return { valid: false };
  }

  const result = mode === 'combination'
    ? factorial(total) / (factorial(chosen) * factorial(total - chosen))
    : factorial(total) / factorial(total - chosen);

  return { valid: true, result: Math.round(result) };
}

// Birim çevirici: uzunluk/ağırlık/hız doğrusal katsayı ile, sıcaklık ayrı formülle çevrilir.
export const UNIT_CATEGORIES = {
  length: {
    label: 'Uzunluk',
    units: {
      mm: { label: 'Milimetre (mm)', factor: 0.001 },
      cm: { label: 'Santimetre (cm)', factor: 0.01 },
      m: { label: 'Metre (m)', factor: 1 },
      km: { label: 'Kilometre (km)', factor: 1000 },
      inch: { label: 'İnç', factor: 0.0254 },
      foot: { label: 'Feet (ft)', factor: 0.3048 },
      yard: { label: 'Yarda', factor: 0.9144 },
      mile: { label: 'Mil', factor: 1609.344 },
    },
  },
  weight: {
    label: 'Ağırlık',
    units: {
      mg: { label: 'Miligram (mg)', factor: 0.000001 },
      g: { label: 'Gram (g)', factor: 0.001 },
      kg: { label: 'Kilogram (kg)', factor: 1 },
      ton: { label: 'Ton', factor: 1000 },
      ounce: { label: 'Ons', factor: 0.0283495 },
      pound: { label: 'Pound (lb)', factor: 0.453592 },
    },
  },
  speed: {
    label: 'Hız',
    units: {
      ms: { label: 'Metre/saniye (m/s)', factor: 1 },
      kmh: { label: 'Kilometre/saat (km/h)', factor: 1 / 3.6 },
      mph: { label: 'Mil/saat (mph)', factor: 0.44704 },
      knot: { label: 'Deniz mili/saat (knot)', factor: 0.514444 },
    },
  },
  temperature: {
    label: 'Sıcaklık',
    units: {
      c: { label: 'Celsius (°C)' },
      f: { label: 'Fahrenheit (°F)' },
      k: { label: 'Kelvin (K)' },
    },
  },
};

function convertTemperature(value, from, to) {
  let celsius;
  if (from === 'f') celsius = (value - 32) * (5 / 9);
  else if (from === 'k') celsius = value - 273.15;
  else celsius = value;

  if (to === 'f') return celsius * (9 / 5) + 32;
  if (to === 'k') return celsius + 273.15;
  return celsius;
}

export function convertUnit({ category, fromUnit, toUnit, value }) {
  const amount = safeNumber(value, NaN);
  if (!Number.isFinite(amount)) return { result: 0 };

  if (category === 'temperature') {
    return { result: round2(convertTemperature(amount, fromUnit, toUnit)) };
  }

  const config = UNIT_CATEGORIES[category];
  const fromFactor = config?.units[fromUnit]?.factor;
  const toFactor = config?.units[toUnit]?.factor;
  if (!fromFactor || !toFactor) return { result: 0 };

  const baseValue = amount * fromFactor;
  return { result: round2(baseValue / toFactor) };
}
