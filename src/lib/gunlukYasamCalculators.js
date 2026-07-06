// Günlük Yaşam kategorisi için saf hesaplama fonksiyonları.

const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

// Cihazın watt gücü ve günlük kullanım saatine göre aylık elektrik tüketimi ve maliyetini hesaplar.
export function calculateElectricityCost({ watt, hoursPerDay, daysPerMonth = 30, pricePerKwh }) {
  const power = Math.max(0, safeNumber(watt));
  const hours = Math.max(0, safeNumber(hoursPerDay));
  const days = Math.max(1, safeNumber(daysPerMonth, 30));
  const price = Math.max(0, safeNumber(pricePerKwh));

  const dailyKwh = (power * hours) / 1000;
  const monthlyKwh = dailyKwh * days;
  const monthlyCost = monthlyKwh * price;

  return {
    dailyKwh: round2(dailyKwh),
    monthlyKwh: round2(monthlyKwh),
    monthlyCost: round2(monthlyCost),
  };
}

// Bir yolculuğun toplam yakıt maliyetini hesaplayıp araçtaki kişi sayısına böler.
export function calculateFuelSplitCost({ distanceKm, consumptionPer100Km, fuelPrice, peopleCount }) {
  const distance = Math.max(0, safeNumber(distanceKm));
  const consumption = Math.max(0, safeNumber(consumptionPer100Km));
  const price = Math.max(0, safeNumber(fuelPrice));
  const people = Math.max(1, Math.floor(safeNumber(peopleCount, 1)));

  const fuelNeeded = (distance * consumption) / 100;
  const totalCost = fuelNeeded * price;
  const perPerson = totalCost / people;

  return {
    fuelNeeded: round2(fuelNeeded),
    totalCost: round2(totalCost),
    perPerson: round2(perPerson),
  };
}

// Oda ölçülerine göre zemin alanını (halı/döşeme için) ve duvar alanına göre boya ihtiyacını hesaplar.
export function calculateRoomMaterials({ length, width, height, paintCoveragePerLiter = 10, coatCount = 2, wasteRate = 10 }) {
  const l = Math.max(0, safeNumber(length));
  const w = Math.max(0, safeNumber(width));
  const h = Math.max(0, safeNumber(height));
  const coverage = Math.max(0.1, safeNumber(paintCoveragePerLiter, 10));
  const coats = Math.max(1, safeNumber(coatCount, 2));
  const waste = Math.max(0, safeNumber(wasteRate, 10));

  const floorArea = l * w;
  const wallArea = 2 * (l + w) * h;
  const netPaintLiters = (wallArea * coats) / coverage;
  const totalPaintLiters = netPaintLiters * (1 + waste / 100);

  return {
    floorArea: round2(floorArea),
    wallArea: round2(wallArea),
    totalPaintLiters: round2(totalPaintLiters),
  };
}
