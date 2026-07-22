// Finans kategorisi için saf hesaplama fonksiyonları (UI'dan bağımsız).
import { GUNCEL_VERILER } from '../data/guncelVeriler.js';

export const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export function calculateDeposit({ principal, annualRate, days, taxRate = 5 }) {
  const p = safeNumber(principal);
  const r = safeNumber(annualRate) / 100;
  const d = safeNumber(days);
  const t = safeNumber(taxRate) / 100;
  const grossInterest = p * r * (d / 365);
  const tax = grossInterest * t;
  const netInterest = grossInterest - tax;
  return {
    grossInterest: round2(grossInterest),
    tax: round2(tax),
    netInterest: round2(netInterest),
    maturityAmount: round2(p + netInterest),
  };
}

export function calculateLoan({ amount, monthlyRate, months, bsmvRate = 15, kkdfRate = 15 }) {
  const principal = safeNumber(amount);
  const baseRate = safeNumber(monthlyRate) / 100;
  const bsmv = safeNumber(bsmvRate) / 100;
  const kkdf = safeNumber(kkdfRate) / 100;
  const n = Math.max(1, Math.floor(safeNumber(months, 1)));
  const effectiveRate = baseRate * (1 + bsmv + kkdf);
  const monthlyPayment = effectiveRate === 0
    ? principal / n
    : principal * (effectiveRate * Math.pow(1 + effectiveRate, n)) / (Math.pow(1 + effectiveRate, n) - 1);

  let remaining = principal;
  let totalInterest = 0;
  let totalBsmv = 0;
  let totalKkdf = 0;
  for (let month = 0; month < n; month += 1) {
    const interest = remaining * baseRate;
    const bsmvAmount = interest * bsmv;
    const kkdfAmount = interest * kkdf;
    const principalPayment = monthlyPayment - interest - bsmvAmount - kkdfAmount;
    remaining = Math.max(0, remaining - principalPayment);
    totalInterest += interest;
    totalBsmv += bsmvAmount;
    totalKkdf += kkdfAmount;
  }

  const totalPayment = monthlyPayment * n;
  return {
    monthlyPayment: round2(monthlyPayment),
    totalPayment: round2(totalPayment),
    totalInterest: round2(totalInterest),
    bsmv: round2(totalBsmv),
    kkdf: round2(totalKkdf),
    totalTaxes: round2(totalBsmv + totalKkdf),
    totalCost: round2(totalPayment - principal),
  };
}

export function calculateRentIncrease({ currentRent, increaseRate, legalCapRate }) {
  const rent = safeNumber(currentRent);
  const requested = safeNumber(increaseRate);
  const cap = legalCapRate === undefined || legalCapRate === '' ? requested : safeNumber(legalCapRate);
  const appliedRate = Math.min(requested, cap);
  const newRent = rent * (1 + appliedRate / 100);
  return {
    appliedRate: round2(appliedRate),
    newRent: round2(newRent),
    monthlyDifference: round2(newRent - rent),
    yearlyDifference: round2((newRent - rent) * 12),
  };
}

export function calculateFuelCost({ distanceKm, consumptionPer100Km, fuelPrice }) {
  const distance = safeNumber(distanceKm);
  const consumption = safeNumber(consumptionPer100Km);
  const price = safeNumber(fuelPrice);
  const fuelNeeded = distance * consumption / 100;
  const totalCost = fuelNeeded * price;
  return {
    fuelNeeded: round2(fuelNeeded),
    totalCost: round2(totalCost),
    costPerKm: distance > 0 ? round2(totalCost / distance) : 0,
  };
}

export function calculateAverageCost(items) {
  const totals = items.reduce((acc, item) => {
    const quantity = safeNumber(item.quantity);
    const price = safeNumber(item.price);
    acc.totalQuantity += quantity;
    acc.totalCost += quantity * price;
    return acc;
  }, { totalQuantity: 0, totalCost: 0 });
  return {
    totalQuantity: round2(totals.totalQuantity),
    totalCost: round2(totals.totalCost),
    averageCost: totals.totalQuantity > 0 ? round2(totals.totalCost / totals.totalQuantity) : 0,
  };
}

export function calculateSavingsGoal({ targetAmount, currentSavings, currentAmount = 0, months, monthlyContribution, annualReturnRate = 0 }) {
  const target = Math.max(0, safeNumber(targetAmount));
  const current = Math.max(0, safeNumber(currentSavings ?? currentAmount));
  const plannedMonths = Math.max(1, Math.floor(safeNumber(months, 0)));

  if (monthlyContribution === undefined && months !== undefined) {
    const remainingAmount = Math.max(0, target - current);
    const monthlyNeeded = remainingAmount / plannedMonths;
    return {
      remainingAmount: round2(remainingAmount),
      monthlyNeeded: round2(monthlyNeeded),
      weeklyNeeded: round2(monthlyNeeded * 12 / 52),
      dailyNeeded: round2(monthlyNeeded * 12 / 365),
    };
  }

  const monthly = Math.max(0, safeNumber(monthlyContribution));
  const monthlyRate = safeNumber(annualReturnRate) / 100 / 12;

  if (current >= target) {
    return { months: 0, years: 0, projectedAmount: round2(current), status: 'Hedef tamam' };
  }

  if (monthly === 0 && monthlyRate <= 0) {
    return { months: Infinity, years: Infinity, projectedAmount: round2(current), status: 'Aylık katkı gerekli' };
  }

  let balance = current;
  let elapsedMonths = 0;
  while (balance < target && elapsedMonths < 1200) {
    balance = balance * (1 + monthlyRate) + monthly;
    elapsedMonths += 1;
  }

  return {
    months: elapsedMonths,
    years: round2(elapsedMonths / 12),
    projectedAmount: round2(balance),
    status: elapsedMonths >= 1200 ? '100 yıldan uzun' : 'Plan çalışıyor',
  };
}

export function calculateBudgetPulse({ monthlyIncome, fixedExpenses, debtPayments, savings }) {
  const income = Math.max(0, safeNumber(monthlyIncome));
  const expenses = Math.max(0, safeNumber(fixedExpenses));
  const debt = Math.max(0, safeNumber(debtPayments));
  const saved = Math.max(0, safeNumber(savings));
  const freeCash = income - expenses - debt - saved;
  const debtRatio = income > 0 ? (debt / income) * 100 : 0;
  const savingsRatio = income > 0 ? (saved / income) * 100 : 0;
  const expenseRatio = income > 0 ? (expenses / income) * 100 : 0;

  let riskLevel = 'düşük';
  let recommendation = 'Bütçe dengeli görünüyor; acil durum fonunu büyütmeye devam edin.';
  if (debtRatio > 35 || freeCash < 0) {
    riskLevel = 'yüksek';
    recommendation = 'Borç/gider baskısı yüksek; yeni borç almadan önce giderleri azaltın.';
  } else if (debtRatio >= 20 || savingsRatio < 15) {
    riskLevel = 'orta';
    recommendation = 'Borç oranı izlenmeli; birikim oranını %15 üstüne taşımaya çalışın.';
  }

  return {
    freeCash: round2(freeCash),
    debtRatio: round2(debtRatio),
    savingsRatio: round2(savingsRatio),
    expenseRatio: round2(expenseRatio),
    riskLevel,
    recommendation,
  };
}

export function calculateProfitMargin({ cost, salePrice, quantity = 1 }) {
  const unitCost = safeNumber(cost);
  const unitSale = safeNumber(salePrice);
  const qty = Math.max(0, safeNumber(quantity, 1));
  const revenue = unitSale * qty;
  const totalCost = unitCost * qty;
  const profit = revenue - totalCost;
  return {
    revenue: round2(revenue),
    totalCost: round2(totalCost),
    profit: round2(profit),
    marginRate: revenue > 0 ? round2((profit / revenue) * 100) : 0,
    markupRate: totalCost > 0 ? round2((profit / totalCost) * 100) : 0,
  };
}

export function calculateVat({ amount, vatRate = 20, mode = 'add' }) {
  const value = Math.max(0, safeNumber(amount));
  const rate = Math.max(0, safeNumber(vatRate)) / 100;
  if (mode === 'included') {
    const netAmount = rate > 0 ? value / (1 + rate) : value;
    const vatAmount = value - netAmount;
    return {
      netAmount: round2(netAmount),
      vatAmount: round2(vatAmount),
      grossAmount: round2(value),
    };
  }
  const vatAmount = value * rate;
  return {
    netAmount: round2(value),
    vatAmount: round2(vatAmount),
    grossAmount: round2(value + vatAmount),
  };
}

export function calculateDiscount({ listPrice, discountRate }) {
  const price = Math.max(0, safeNumber(listPrice));
  const rate = Math.max(0, safeNumber(discountRate)) / 100;
  const discountAmount = price * rate;
  return {
    discountAmount: round2(discountAmount),
    finalPrice: round2(price - discountAmount),
    savedRate: round2(rate * 100),
  };
}

export function calculateSalaryIncrease({ currentSalary, increaseRate }) {
  const salary = Math.max(0, safeNumber(currentSalary));
  const rate = safeNumber(increaseRate) / 100;
  const increaseAmount = salary * rate;
  const newSalary = salary + increaseAmount;
  return {
    increaseAmount: round2(increaseAmount),
    newSalary: round2(newSalary),
    annualDifference: round2(increaseAmount * 12),
  };
}

export function calculateInvestmentReturn({ buyPrice, currentPrice, quantity = 1 }) {
  const buy = Math.max(0, safeNumber(buyPrice));
  const current = Math.max(0, safeNumber(currentPrice));
  const qty = Math.max(0, safeNumber(quantity, 1));
  const invested = buy * qty;
  const currentValue = current * qty;
  const profit = currentValue - invested;
  return {
    invested: round2(invested),
    currentValue: round2(currentValue),
    profit: round2(profit),
    returnRate: invested > 0 ? round2((profit / invested) * 100) : 0,
  };
}

// calculateLoan ile aynı anüite formülünü kullanarak ay ay ödeme planı üretir (görsel gösterim içindir, calculateLoan'ın sonucunu değiştirmez).
export function generateLoanSchedule({ amount, monthlyRate, months, bsmvRate = 15, kkdfRate = 15 }) {
  const principal = safeNumber(amount);
  const baseRate = safeNumber(monthlyRate) / 100;
  const bsmv = safeNumber(bsmvRate) / 100;
  const kkdf = safeNumber(kkdfRate) / 100;
  const n = Math.max(1, Math.floor(safeNumber(months, 1)));
  const effectiveRate = baseRate * (1 + bsmv + kkdf);
  const monthlyPayment = effectiveRate === 0
    ? principal / n
    : principal * (effectiveRate * Math.pow(1 + effectiveRate, n)) / (Math.pow(1 + effectiveRate, n) - 1);

  let remaining = principal;
  const rows = [];
  for (let month = 1; month <= n; month += 1) {
    const interest = remaining * baseRate;
    const bsmvAmount = interest * bsmv;
    const kkdfAmount = interest * kkdf;
    const principalPayment = monthlyPayment - interest - bsmvAmount - kkdfAmount;
    remaining = Math.max(0, remaining - principalPayment);
    rows.push({
      month,
      payment: round2(monthlyPayment),
      principalPayment: round2(principalPayment),
      interest: round2(interest + bsmvAmount + kkdfAmount),
      remaining: round2(remaining),
    });
  }
  return rows;
}

// Kur manuel girilir (canlı döviz API'si kullanılmaz); iki yönlü çevirim yapar.
export function calculateCurrencyConversion({ amount, rate, direction = 'toForeign' }) {
  const value = safeNumber(amount);
  const exchangeRate = safeNumber(rate);
  if (exchangeRate <= 0) {
    return { convertedAmount: 0, rate: 0 };
  }
  const convertedAmount = direction === 'toForeign' ? value / exchangeRate : value * exchangeRate;
  return {
    convertedAmount: round2(convertedAmount),
    rate: round2(exchangeRate),
  };
}

// ── 2026 bordro parametreleri — src/data/guncelVeriler.js dosyasından okunur, burada gömülü değer yoktur. ──
const SGK_EMPLOYEE_RATE = GUNCEL_VERILER.sgkIsciPayiOrani.value;
const UNEMPLOYMENT_EMPLOYEE_RATE = GUNCEL_VERILER.issizlikSigortasiIsciPayiOrani.value;
const STAMP_TAX_RATE = GUNCEL_VERILER.damgaVergisiOrani.value;
const MIN_WAGE_GROSS = GUNCEL_VERILER.asgariUcret.brutAylik.value;

function calculateProgressiveIncomeTax(base) {
  let remaining = Math.max(0, base);
  let tax = 0;
  let lowerBound = 0;
  for (const bracket of GUNCEL_VERILER.gelirVergisiDilimleri.value) {
    if (remaining <= 0) break;
    const bracketSize = bracket.upTo - lowerBound;
    const taxableInBracket = Math.min(remaining, bracketSize);
    tax += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
    lowerBound = bracket.upTo;
  }
  return tax;
}

function grossToNetBreakdown(gross) {
  const sgk = gross * SGK_EMPLOYEE_RATE;
  const unemployment = gross * UNEMPLOYMENT_EMPLOYEE_RATE;
  const incomeTaxBase = gross - sgk - unemployment;
  const incomeTax = calculateProgressiveIncomeTax(incomeTaxBase);
  const stampTax = gross * STAMP_TAX_RATE;

  // Asgari ücret istisnası: asgari ücrete isabet eden gelir/damga vergisi çalışandan kesilmez.
  const minWageBase = MIN_WAGE_GROSS * (1 - SGK_EMPLOYEE_RATE - UNEMPLOYMENT_EMPLOYEE_RATE);
  const minWageIncomeTaxExemption = calculateProgressiveIncomeTax(minWageBase);
  const minWageStampTaxExemption = MIN_WAGE_GROSS * STAMP_TAX_RATE;

  const netIncomeTax = Math.max(0, incomeTax - minWageIncomeTaxExemption);
  const netStampTax = Math.max(0, stampTax - minWageStampTaxExemption);
  const netSalary = gross - sgk - unemployment - netIncomeTax - netStampTax;

  return {
    grossSalary: round2(gross),
    sgkDeduction: round2(sgk),
    unemploymentDeduction: round2(unemployment),
    incomeTax: round2(netIncomeTax),
    stampTax: round2(netStampTax),
    totalDeductions: round2(gross - netSalary),
    netSalary: round2(netSalary),
  };
}

// Brüt→net veya net→brüt maaş dönüşümü. Net→brüt yönünde kapalı formül olmadığından ikili arama (binary search) kullanılır.
// Varsayım: ilgili ay, yılın ilk ayı kabul edilir (kümülatif matrah sıfırdan başlar); önceki aylardan gelen kümülatif matrah dikkate alınmaz.
export function calculateSalaryConversion({ amount, mode = 'grossToNet' }) {
  const value = Math.max(0, safeNumber(amount));

  if (mode === 'netToGross') {
    let low = value;
    let high = Math.max(value * 2.2, 1);
    for (let i = 0; i < 60; i += 1) {
      const mid = (low + high) / 2;
      const candidate = grossToNetBreakdown(mid);
      if (candidate.netSalary < value) low = mid; else high = mid;
    }
    return grossToNetBreakdown((low + high) / 2);
  }

  return grossToNetBreakdown(value);
}

// Kıdem tazminatı tavanı ve ihbar süreleri tablosu — src/data/guncelVeriler.js dosyasından okunur.
const SEVERANCE_CEILING = GUNCEL_VERILER.kidemTazminatiTavani.value;
const MS_PER_DAY_FINANS = 1000 * 60 * 60 * 24;

function getNoticeWeeks(totalYears) {
  const match = GUNCEL_VERILER.ihbarSureleri.value.find((row) => totalYears < row.kidemUstSiniriYil);
  return match ? match.hafta : GUNCEL_VERILER.ihbarSureleri.value.at(-1).hafta;
}

// Kıdem tazminatına yasal tavan uygulanır; ihbar tazminatına tavan uygulanmaz. İhbar süreleri İş Kanunu m.17'deki sabit tablodan alınır.
export function calculateSeveranceAndNotice({ grossSalary, startDate, endDate }) {
  const gross = Math.max(0, safeNumber(grossSalary));
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return { valid: false };
  }

  const totalDays = Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY_FINANS);
  const totalYears = totalDays / 365.25;

  const dailyGross = gross / 30;
  const cappedDailyGross = Math.min(dailyGross, SEVERANCE_CEILING / 30);
  const severancePay = cappedDailyGross * 30 * totalYears;

  const noticeWeeks = getNoticeWeeks(totalYears);
  const noticePay = dailyGross * noticeWeeks * 7;

  return {
    valid: true,
    totalYears: round2(totalYears),
    isCapped: dailyGross > SEVERANCE_CEILING / 30,
    severancePay: round2(severancePay),
    noticeWeeks,
    noticePay: round2(noticePay),
    totalPay: round2(severancePay + noticePay),
  };
}

const COMPOUND_FREQUENCY_PER_YEAR = { monthly: 12, yearly: 1, daily: 365 };

// Aylık düzenli katkı (DCA) desteğiyle bileşik faiz / yatırım getirisi hesaplar.
export function calculateCompoundInterest({ principal, annualRate, years, monthlyContribution = 0, frequency = 'monthly' }) {
  const p = Math.max(0, safeNumber(principal));
  const rate = safeNumber(annualRate) / 100;
  const t = Math.max(0, safeNumber(years));
  const contribution = Math.max(0, safeNumber(monthlyContribution));
  const n = COMPOUND_FREQUENCY_PER_YEAR[frequency] || 12;

  const periodRate = rate / n;
  const totalPeriods = n * t;
  const principalFV = p * Math.pow(1 + periodRate, totalPeriods);

  const monthlyRate = rate / 12;
  const totalMonths = 12 * t;
  const contributionFV = contribution === 0
    ? 0
    : (monthlyRate === 0 ? contribution * totalMonths : contribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate));

  const futureValue = principalFV + contributionFV;
  const totalContributions = p + contribution * totalMonths;
  const totalInterest = futureValue - totalContributions;

  return {
    futureValue: round2(futureValue),
    totalContributions: round2(totalContributions),
    totalInterest: round2(totalInterest),
  };
}

// Aylık gelire göre (borç/gelir oranı sınırı ile) alınabilecek maksimum taksit ve kredi tutarını tahmini hesaplar.
// Basitleştirilmiştir: BSMV/KKDF, teminat ve banka özel politikaları dahil değildir.
export function calculateMortgageAffordability({ monthlyIncome, existingDebtPayments = 0, maxDebtToIncomeRatio = 40, monthlyRate, months }) {
  const income = Math.max(0, safeNumber(monthlyIncome));
  const existingDebt = Math.max(0, safeNumber(existingDebtPayments));
  const ratio = Math.max(0, safeNumber(maxDebtToIncomeRatio, 40)) / 100;
  const r = Math.max(0, safeNumber(monthlyRate)) / 100;
  const n = Math.max(1, Math.floor(safeNumber(months, 1)));

  const maxInstallment = Math.max(0, income * ratio - existingDebt);
  const maxLoanAmount = r === 0
    ? maxInstallment * n
    : maxInstallment * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));

  return {
    maxInstallment: round2(maxInstallment),
    maxLoanAmount: round2(maxLoanAmount),
  };
}

// Asgari ödeme eşiği ve oranları — src/data/guncelVeriler.js dosyasından okunur (2026 BDDK düzenlemesi).
const { esikTutar: CREDIT_CARD_MIN_PAYMENT_THRESHOLD, esikAltiOran: CREDIT_CARD_RATE_BELOW, esikUstuOran: CREDIT_CARD_RATE_ABOVE } = GUNCEL_VERILER.krediKartiAsgariOdeme;

// Erken ödeme / gecikme faizi / Findeks aralıkları — src/data/guncelVeriler.js'ten okunur.
const { kalanVadeAyEsigi: KONUT_ERKEN_ODEME_VADE_ESIGI, tazminatOraniKisaVade: KONUT_ERKEN_ODEME_ORANI_KISA, tazminatOraniUzunVade: KONUT_ERKEN_ODEME_ORANI_UZUN } = GUNCEL_VERILER.konutKredisiErkenOdemeTazminati;
const { azamiCarpan: GECIKME_FAIZI_AZAMI_CARPAN } = GUNCEL_VERILER.tuketiciKredisiGecikmeFaizTavani;
const FINDEKS_PUAN_ARALIKLARI = GUNCEL_VERILER.findeksPuanAraliklari.value;

export function calculateCreditCardPayment({ cardLimit, statementBalance, monthlyInterestRate, lateInterestRate, daysLate = 0 }) {
  const limit = Math.max(0, safeNumber(cardLimit));
  const balance = Math.max(0, safeNumber(statementBalance));
  const monthlyRate = Math.max(0, safeNumber(monthlyInterestRate)) / 100;
  const lateRate = Math.max(0, safeNumber(lateInterestRate)) / 100;
  const overdueDays = Math.max(0, safeNumber(daysLate));

  const minimumPaymentRate = limit > CREDIT_CARD_MIN_PAYMENT_THRESHOLD ? CREDIT_CARD_RATE_ABOVE : CREDIT_CARD_RATE_BELOW;
  const minimumPayment = balance * minimumPaymentRate;
  const remainingIfMinimumPaid = balance - minimumPayment;
  const nextCycleInterest = remainingIfMinimumPaid * monthlyRate;
  const lateInterestAmount = overdueDays > 0 ? balance * (lateRate / 30) * overdueDays : 0;
  const totalNextCycleDebt = remainingIfMinimumPaid + nextCycleInterest + lateInterestAmount;

  return {
    minimumPaymentRate: round2(minimumPaymentRate * 100),
    minimumPayment: round2(minimumPayment),
    remainingIfMinimumPaid: round2(remainingIfMinimumPaid),
    nextCycleInterest: round2(nextCycleInterest),
    lateInterestAmount: round2(lateInterestAmount),
    totalNextCycleDebt: round2(totalNextCycleDebt),
  };
}

// Simülasyonların sonsuz döngüye girmesini önleyen güvenlik sınırı (50 yıl) ve
// "borç kapandı" kabul edilen küçük bakiye eşiği (1 TL altı küsuratlar son ay
// tamamen ödenmiş sayılır).
const DEBT_PAYOFF_MAX_MONTHS = 600;
const DEBT_PAYOFF_EPSILON = 1;

// "Her ay yalnızca asgariyi ödersem borç kaç ayda kapanır?" simülasyonu. Asgari
// ödeme oranı (limite göre %20/%40, bkz. calculateCreditCardPayment) HER AY o
// ayın kalan bakiyesine göre yeniden hesaplanır — sabit bir TL tutarı değildir.
// Döngü, calculateCreditCardPayment'daki TEK DÖNGÜLÜK formülün (asgari önce
// düşülür, faiz kalan bakiye üzerinden bir SONRAKİ ekstreye işler) ardışık
// olarak zincirlenmesiyle kurulur — iki hesaplama arasında tutarlılık sağlar.
export function simulateMinimumPaymentPayoff({ cardLimit, statementBalance, monthlyInterestRate }) {
  const limit = Math.max(0, safeNumber(cardLimit));
  const initialBalance = Math.max(0, safeNumber(statementBalance));
  const monthlyRate = Math.max(0, safeNumber(monthlyInterestRate)) / 100;
  const minimumPaymentRate = limit > CREDIT_CARD_MIN_PAYMENT_THRESHOLD ? CREDIT_CARD_RATE_ABOVE : CREDIT_CARD_RATE_BELOW;

  // KRİTİK: asgari ödeme oranı sabit olduğundan, her ay bakiyenin çarpıldığı
  // (1 - asgariOran) * (1 + aylıkFaiz) çarpanı da sabittir. Bu çarpan 1'e eşit
  // veya büyükse, asgari ödeme o ayki faizi hiç karşılamıyor demektir — bakiye
  // hiçbir zaman küçülmez (aynı kalır ya da büyür). Bunu tüm ayları simüle
  // etmeden ÖNCEDEN, analitik olarak tespit ederiz.
  const monthlyMultiplier = (1 - minimumPaymentRate) * (1 + monthlyRate);
  const neverPaysOff = initialBalance > 0 && monthlyMultiplier >= 1;

  const schedule = [];
  let totalPaid = 0;
  let totalInterest = 0;
  let balance = initialBalance;

  if (initialBalance > 0 && !neverPaysOff) {
    let month = 0;
    while (balance > DEBT_PAYOFF_EPSILON && month < DEBT_PAYOFF_MAX_MONTHS) {
      month += 1;
      const scheduledPayment = balance * minimumPaymentRate;
      const remainingAfterPayment = balance - scheduledPayment;
      const scheduledInterest = remainingAfterPayment * monthlyRate;
      let nextBalance = remainingAfterPayment + scheduledInterest;
      let payment = scheduledPayment;
      let interest = scheduledInterest;

      if (nextBalance <= DEBT_PAYOFF_EPSILON) {
        // Son ay: küçük kalan bakiyeyi tamamen kapatmak için formülün ürettiği
        // asgari yerine borcun tamamı ödenir (küsurat kapanışı).
        payment = balance;
        interest = 0;
        nextBalance = 0;
      }

      totalPaid += payment;
      totalInterest += interest;
      schedule.push({ month, payment: round2(payment), interest: round2(interest), remaining: round2(Math.max(0, nextBalance)) });
      balance = nextBalance;
    }
  }

  const monthsToPayoff = neverPaysOff || initialBalance <= 0 ? null : schedule.length;

  return {
    neverPaysOff,
    monthsToPayoff,
    totalPaid: round2(totalPaid),
    totalInterest: round2(totalInterest),
    interestToPrincipalRatio: initialBalance > 0 ? round2((totalInterest / initialBalance) * 100) : 0,
    schedule,
  };
}

// Karşılaştırma senaryosu: "asgari yerine her ay sabit X TL ödeseydim". Standart
// bir taksitli geri ödeme gibi modellenir — ÖNCE mevcut bakiyeye o ayın faizi
// işler, SONRA sabit ödeme düşülür (asgari-ödeme modelinden farklı sırayla;
// çünkü burada "asgari ekstre yüzdesi" değil kullanıcının kendi belirlediği
// sabit bir taksit tutarı var — günlük hayattaki "her ay bu kadar ayırıyorum"
// mantığına karşılık gelir).
export function simulateFixedPaymentPayoff({ statementBalance, monthlyInterestRate, fixedPayment }) {
  const initialBalance = Math.max(0, safeNumber(statementBalance));
  const monthlyRate = Math.max(0, safeNumber(monthlyInterestRate)) / 100;
  const payment = Math.max(0, safeNumber(fixedPayment));

  // Bakiye küçüldükçe faiz de küçülür; bu yüzden ödeme İLK ayın faizini
  // karşılıyorsa sonraki tüm aylarda da karşılar (analitik kısayol).
  const firstMonthInterest = initialBalance * monthlyRate;
  const neverPaysOff = initialBalance > 0 && payment <= firstMonthInterest;

  const schedule = [];
  let totalPaid = 0;
  let totalInterest = 0;
  let balance = initialBalance;

  if (initialBalance > 0 && !neverPaysOff) {
    let month = 0;
    while (balance > DEBT_PAYOFF_EPSILON && month < DEBT_PAYOFF_MAX_MONTHS) {
      month += 1;
      const interest = balance * monthlyRate;
      const balanceWithInterest = balance + interest;
      let actualPayment = payment;
      let nextBalance = balanceWithInterest - actualPayment;

      if (nextBalance <= DEBT_PAYOFF_EPSILON) {
        actualPayment = balanceWithInterest;
        nextBalance = 0;
      }

      totalPaid += actualPayment;
      totalInterest += interest;
      schedule.push({ month, payment: round2(actualPayment), interest: round2(interest), remaining: round2(Math.max(0, nextBalance)) });
      balance = nextBalance;
    }
  }

  const monthsToPayoff = neverPaysOff || initialBalance <= 0 ? null : schedule.length;

  return {
    neverPaysOff,
    monthsToPayoff,
    totalPaid: round2(totalPaid),
    totalInterest: round2(totalInterest),
    interestToPrincipalRatio: initialBalance > 0 ? round2((totalInterest / initialBalance) * 100) : 0,
    schedule,
  };
}

// Bugünkü bir tutarın enflasyon nedeniyle gelecekte hem nominal karşılığını hem de alım gücü kaybını hesaplar.
export function calculateInflationImpact({ amount, annualInflationRate, years }) {
  const value = Math.max(0, safeNumber(amount));
  const rate = safeNumber(annualInflationRate) / 100;
  const t = Math.max(0, safeNumber(years));
  const factor = Math.pow(1 + rate, t);

  const futureNominalNeeded = value * factor;
  const erodedPurchasingPower = factor !== 0 ? value / factor : 0;
  const purchasingPowerLossRate = factor !== 0 ? (1 - 1 / factor) * 100 : 0;

  return {
    futureNominalNeeded: round2(futureNominalNeeded),
    erodedPurchasingPower: round2(erodedPurchasingPower),
    purchasingPowerLossRate: round2(purchasingPowerLossRate),
  };
}

// Peşin fiyat ile taksitli toplam fiyatı karşılaştırıp taksitlendirmenin gerçek maliyetini hesaplar.
export function calculateInstallmentComparison({ cashPrice, installmentCount, monthlyInstallment }) {
  const cash = Math.max(0, safeNumber(cashPrice));
  const count = Math.max(1, Math.floor(safeNumber(installmentCount, 1)));
  const monthly = Math.max(0, safeNumber(monthlyInstallment));

  const totalInstallmentPrice = monthly * count;
  const extraCost = totalInstallmentPrice - cash;
  const extraCostRate = cash > 0 ? (extraCost / cash) * 100 : 0;

  return {
    totalInstallmentPrice: round2(totalInstallmentPrice),
    extraCost: round2(extraCost),
    extraCostRate: round2(extraCostRate),
  };
}

// ═══════════════════════════════════════════════════════════════
// KREDİ ERKEN KAPATMA
// ═══════════════════════════════════════════════════════════════
// Kalan vade + taksit + faizden (standart anüite formülünün TERSİNE çalışarak)
// kalan anaparayı türetir, sonra kredi türüne göre erken kapatma tutarını hesaplar:
// - 'ihtiyac-tasit': tazminat YASAKTIR (Tüketici Kredisi Sözl. Yönetmeliği m.15),
//   erken kapatma tutarı = kalan anapara.
// - 'konut' + sabit faiz: kalan vadeye göre %1/%2 tazminat eklenir (6502 m.37).
// - 'konut' + değişken faiz: tazminat YASAKTIR (6502 m.37, aynı madde).
export function calculateEarlyLoanPayoff({ remainingMonths, monthlyInstallment, monthlyRate, loanType = 'ihtiyac-tasit', rateType = 'sabit' }) {
  const n = Math.max(1, Math.floor(safeNumber(remainingMonths, 1)));
  const installment = Math.max(0, safeNumber(monthlyInstallment));
  const rate = Math.max(0, safeNumber(monthlyRate)) / 100;

  // Kalan anapara = kalan taksitlerin bugünkü değeri (anüitenin bugünkü değeri formülü).
  const remainingPrincipal = rate === 0
    ? installment * n
    : installment * (1 - Math.pow(1 + rate, -n)) / rate;

  const totalRemainingIfContinued = installment * n;
  const interestSaved = Math.max(0, totalRemainingIfContinued - remainingPrincipal);

  const isKonut = loanType === 'konut';
  const isSabitFaizli = rateType === 'sabit';
  const tazminatUygulanir = isKonut && isSabitFaizli;

  const tazminatOrani = n <= KONUT_ERKEN_ODEME_VADE_ESIGI ? KONUT_ERKEN_ODEME_ORANI_KISA : KONUT_ERKEN_ODEME_ORANI_UZUN;
  const penalty = tazminatUygulanir ? remainingPrincipal * tazminatOrani : 0;

  const payoffAmount = remainingPrincipal + penalty;
  const netSaving = interestSaved - penalty;

  return {
    remainingPrincipal: round2(remainingPrincipal),
    totalRemainingIfContinued: round2(totalRemainingIfContinued),
    interestSaved: round2(interestSaved),
    tazminatUygulanir,
    tazminatOrani: round2(tazminatOrani * 100),
    penalty: round2(penalty),
    payoffAmount: round2(payoffAmount),
    netSaving: round2(netSaving),
  };
}

// ═══════════════════════════════════════════════════════════════
// KREDİ YAPILANDIRMA KARŞILAŞTIRMA
// ═══════════════════════════════════════════════════════════════
// Mevcut kredinin (kalan borç, taksit, kalan vade) devamı ile yeni bir
// yapılandırma teklifinin (faiz, vade, opsiyonel dosya masrafı) toplam
// maliyetini karşılaştırır.
export function calculateLoanRestructure({ currentRemainingBalance, currentInstallment, currentRemainingMonths, newMonthlyRate, newMonths, newFee = 0 }) {
  const currentBalance = Math.max(0, safeNumber(currentRemainingBalance));
  const currentPayment = Math.max(0, safeNumber(currentInstallment));
  const currentMonths = Math.max(1, Math.floor(safeNumber(currentRemainingMonths, 1)));
  const newRate = Math.max(0, safeNumber(newMonthlyRate)) / 100;
  const newN = Math.max(1, Math.floor(safeNumber(newMonths, 1)));
  const fee = Math.max(0, safeNumber(newFee));

  const currentTotalIfContinued = currentPayment * currentMonths;

  const newMonthlyPayment = newRate === 0
    ? currentBalance / newN
    : currentBalance * (newRate * Math.pow(1 + newRate, newN)) / (Math.pow(1 + newRate, newN) - 1);
  const newTotalPayment = newMonthlyPayment * newN + fee;

  const totalDifference = newTotalPayment - currentTotalIfContinued;
  const monthlyPaymentDifference = newMonthlyPayment - currentPayment;

  return {
    currentTotalIfContinued: round2(currentTotalIfContinued),
    newMonthlyPayment: round2(newMonthlyPayment),
    newTotalPayment: round2(newTotalPayment),
    totalDifference: round2(totalDifference),
    monthlyPaymentDifference: round2(monthlyPaymentDifference),
    isNewOfferCheaper: totalDifference < 0,
  };
}

// ═══════════════════════════════════════════════════════════════
// İKİ KREDİ TEKLİFİNİ KARŞILAŞTIRMA
// ═══════════════════════════════════════════════════════════════
function calculateSingleLoanOffer({ amount, monthlyRate, months, fee = 0 }) {
  const principal = Math.max(0, safeNumber(amount));
  const rate = Math.max(0, safeNumber(monthlyRate)) / 100;
  const n = Math.max(1, Math.floor(safeNumber(months, 1)));
  const processingFee = Math.max(0, safeNumber(fee));

  const monthlyPayment = rate === 0
    ? principal / n
    : principal * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
  const totalPayment = monthlyPayment * n + processingFee;
  const totalInterest = totalPayment - principal - processingFee;

  return {
    monthlyPayment: round2(monthlyPayment),
    totalPayment: round2(totalPayment),
    totalInterest: round2(totalInterest),
    totalCost: round2(totalPayment),
  };
}

export function compareTwoLoanOffers({ offerA, offerB }) {
  const resultA = calculateSingleLoanOffer(offerA);
  const resultB = calculateSingleLoanOffer(offerB);
  const costDifference = round2(resultB.totalCost - resultA.totalCost);

  let cheaperOffer = 'esit';
  if (costDifference > 0.005) cheaperOffer = 'A';
  else if (costDifference < -0.005) cheaperOffer = 'B';

  return { offerA: resultA, offerB: resultB, costDifference: Math.abs(costDifference), cheaperOffer };
}

// ═══════════════════════════════════════════════════════════════
// KREDİ NOTU (FİNDEKS) ARALIĞI — puan hesaplamaz/tahmin etmez, sadece
// GUNCEL_VERILER'daki (resmi olmayan, yaygın referans) tabloya göre girilen
// puanın hangi aralığa düştüğünü gösterir.
// ═══════════════════════════════════════════════════════════════
export function getFindeksScoreRange(score) {
  const raw = safeNumber(score, NaN);
  const isValid = Number.isFinite(raw);
  const clamped = isValid ? Math.min(1900, Math.max(0, raw)) : 0;
  const isOutOfBounds = isValid && (raw < 0 || raw > 1900);

  const range = FINDEKS_PUAN_ARALIKLARI.find((r) => clamped >= r.min && clamped <= r.max) || null;
  const rangeSize = range ? range.max - range.min : 0;
  const positionInRange = range && rangeSize > 0 ? round2(((clamped - range.min) / rangeSize) * 100) : 0;

  return { score: round2(clamped), isValid, isOutOfBounds, range, positionInRange };
}

// ═══════════════════════════════════════════════════════════════
// GECİKME (TEMERRÜT) FAİZİ
// ═══════════════════════════════════════════════════════════════
// Azami gecikme faizi = akdi faiz oranının %30 fazlasını GEÇEMEZ (Tüketici
// Kredisi Sözleşmeleri Yönetmeliği m.4/1-e). Kullanıcı akdi faiz oranını
// değiştirebilir; azami çarpan GUNCEL_VERILER'dan gelir.
export function calculateLoanLateFee({ installmentAmount, daysLate, contractMonthlyRate }) {
  const installment = Math.max(0, safeNumber(installmentAmount));
  const days = Math.max(0, safeNumber(daysLate));
  const contractRate = Math.max(0, safeNumber(contractMonthlyRate));

  const maxLateRate = contractRate * GECIKME_FAIZI_AZAMI_CARPAN;
  const dailyRate = maxLateRate / 30;
  const lateFeeAmount = installment * (dailyRate / 100) * days;
  const totalPayable = installment + lateFeeAmount;

  return {
    maxLateMonthlyRate: round2(maxLateRate),
    dailyRate: round2(dailyRate),
    lateFeeAmount: round2(lateFeeAmount),
    totalPayable: round2(totalPayable),
  };
}
