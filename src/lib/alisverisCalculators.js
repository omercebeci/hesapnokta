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
