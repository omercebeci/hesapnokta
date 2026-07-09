// Alışveriş kategorisi için saf hesaplama fonksiyonları.

const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

// Eski fiyattan yeni fiyata geçişteki zam/indirim tutarını ve oranını hesaplar.
export function calculatePriceChangeRate({ oldPrice, newPrice }) {
  const oldValue = Math.max(0, safeNumber(oldPrice));
  const newValue = Math.max(0, safeNumber(newPrice));
  const changeAmount = newValue - oldValue;
  const changeRate = oldValue > 0 ? (changeAmount / oldValue) * 100 : 0;

  return {
    changeAmount: round2(changeAmount),
    changeRate: round2(changeRate),
    isIncrease: changeAmount >= 0,
  };
}

// Art arda uygulanan indirimlerin (ör. %20 + %10) toplamda gerçekte kaç ettiğini hesaplar.
// İndirimler toplanmaz, sırayla önceki indirimli fiyat üzerinden uygulanır.
export function calculateStackedDiscount({ price, discountRates }) {
  const startPrice = Math.max(0, safeNumber(price));
  const rates = (discountRates || [])
    .map((rate) => safeNumber(rate, NaN))
    .filter((rate) => Number.isFinite(rate) && rate >= 0 && rate <= 100);

  const finalPrice = rates.reduce((currentPrice, rate) => currentPrice * (1 - rate / 100), startPrice);
  const totalDiscountAmount = startPrice - finalPrice;
  const effectiveDiscountRate = startPrice > 0 ? (totalDiscountAmount / startPrice) * 100 : 0;

  return {
    finalPrice: round2(finalPrice),
    totalDiscountAmount: round2(totalDiscountAmount),
    effectiveDiscountRate: round2(effectiveDiscountRate),
  };
}

// Hesap tutarına bahşiş ekleyip kişi sayısına bölerek kişi başı ödemeyi hesaplar.
export function calculateTipSplit({ billAmount, tipPercentage, peopleCount }) {
  const bill = Math.max(0, safeNumber(billAmount));
  const tipRate = Math.max(0, safeNumber(tipPercentage)) / 100;
  const people = Math.max(1, Math.floor(safeNumber(peopleCount, 1)));

  const tipAmount = bill * tipRate;
  const totalWithTip = bill + tipAmount;
  const perPerson = totalWithTip / people;

  return {
    tipAmount: round2(tipAmount),
    totalWithTip: round2(totalWithTip),
    perPerson: round2(perPerson),
  };
}

// ── Kargo desi hesaplama ──
// Desi = (en × boy × yükseklik) / 3000. Kargo firmaları faturalamada
// desi ile gerçek ağırlıktan HANGİSİ BÜYÜKSE onu esas alır ("desi-kg karşılaştırması").
export function calculateDesi({ lengthCm, widthCm, heightCm }) {
  const length = Math.max(0, safeNumber(lengthCm));
  const width = Math.max(0, safeNumber(widthCm));
  const height = Math.max(0, safeNumber(heightCm));
  return round2((length * width * height) / 3000);
}

export function calculateCargoShipment(packages) {
  const list = packages || [];

  const breakdown = list.map((pkg) => {
    const length = Math.max(0, safeNumber(pkg.lengthCm));
    const width = Math.max(0, safeNumber(pkg.widthCm));
    const height = Math.max(0, safeNumber(pkg.heightCm));
    const weight = Math.max(0, safeNumber(pkg.weightKg));
    const quantity = Math.max(1, Math.floor(safeNumber(pkg.quantity, 1)));

    const desi = (length * width * height) / 3000;
    const billableUnit = Math.max(desi, weight);

    return {
      desi: round2(desi),
      weight: round2(weight),
      quantity,
      billableUnit: round2(billableUnit),
      billableTotal: round2(billableUnit * quantity),
      desiWins: desi >= weight,
    };
  });

  const totalDesi = breakdown.reduce((sum, item) => sum + item.desi * item.quantity, 0);
  const totalWeight = breakdown.reduce((sum, item) => sum + item.weight * item.quantity, 0);
  const totalBillableWeight = breakdown.reduce((sum, item) => sum + item.billableTotal, 0);

  return {
    breakdown,
    totalDesi: round2(totalDesi),
    totalWeight: round2(totalWeight),
    totalBillableWeight: round2(totalBillableWeight),
  };
}

// ── Beden çevirici ──
// TR bedenleri kadın/erkek giyimde EU ile aynı numaralandırmayı, ayakkabıda da EU ölçeğini kullanır;
// US/UK karşılıkları yaygın kullanılan standart beden tablolarından alınmıştır.
export const SIZE_TABLES = {
  kadinGiyim: [
    { tr: 34, eu: 34, us: 2, uk: 6 },
    { tr: 36, eu: 36, us: 4, uk: 8 },
    { tr: 38, eu: 38, us: 6, uk: 10 },
    { tr: 40, eu: 40, us: 8, uk: 12 },
    { tr: 42, eu: 42, us: 10, uk: 14 },
    { tr: 44, eu: 44, us: 12, uk: 16 },
    { tr: 46, eu: 46, us: 14, uk: 18 },
    { tr: 48, eu: 48, us: 16, uk: 20 },
  ],
  erkekGiyim: [
    { tr: 44, eu: 44, us: 34, uk: 34 },
    { tr: 46, eu: 46, us: 36, uk: 36 },
    { tr: 48, eu: 48, us: 38, uk: 38 },
    { tr: 50, eu: 50, us: 40, uk: 40 },
    { tr: 52, eu: 52, us: 42, uk: 42 },
    { tr: 54, eu: 54, us: 44, uk: 44 },
    { tr: 56, eu: 56, us: 46, uk: 46 },
  ],
  kadinAyakkabi: [
    { tr: 35, eu: 35, us: 5, uk: 2.5 },
    { tr: 36, eu: 36, us: 6, uk: 3.5 },
    { tr: 37, eu: 37, us: 6.5, uk: 4 },
    { tr: 38, eu: 38, us: 7.5, uk: 5 },
    { tr: 39, eu: 39, us: 8.5, uk: 6 },
    { tr: 40, eu: 40, us: 9, uk: 6.5 },
    { tr: 41, eu: 41, us: 10, uk: 7.5 },
  ],
  erkekAyakkabi: [
    { tr: 39, eu: 39, us: 6.5, uk: 6 },
    { tr: 40, eu: 40, us: 7.5, uk: 7 },
    { tr: 41, eu: 41, us: 8.5, uk: 7.5 },
    { tr: 42, eu: 42, us: 9, uk: 8 },
    { tr: 43, eu: 43, us: 10, uk: 9 },
    { tr: 44, eu: 44, us: 10.5, uk: 9.5 },
    { tr: 45, eu: 45, us: 11.5, uk: 10.5 },
    { tr: 46, eu: 46, us: 12, uk: 11 },
  ],
};

export function findSizeRow(tableName, unit, value) {
  const table = SIZE_TABLES[tableName];
  if (!table) return null;
  const target = safeNumber(value, NaN);
  return table.find((row) => Number(row[unit]) === target) || null;
}

// ── Altın çevirici ──
// Standart gram karşılıkları (22 ayar, güncel kur değişse de sabit kalan fiziksel ağırlıklardır).
export const GOLD_UNIT_GRAMS = {
  gram: 1,
  ceyrek: 1.75,
  yarim: 3.5,
  tam: 7,
  cumhuriyet: 7.216,
};

export function convertGoldUnits({ amount, fromUnit, toUnit, gramPrice }) {
  const rawAmount = Math.max(0, safeNumber(amount));
  const fromGrams = GOLD_UNIT_GRAMS[fromUnit] ?? 1;
  const toGrams = GOLD_UNIT_GRAMS[toUnit] ?? 1;

  const totalGrams = rawAmount * fromGrams;
  const convertedAmount = totalGrams / toGrams;
  const price = Math.max(0, safeNumber(gramPrice));

  return {
    totalGrams: round2(totalGrams),
    convertedAmount: round2(convertedAmount),
    totalPrice: price > 0 ? round2(totalGrams * price) : null,
  };
}
