import { describe, expect, it } from 'vitest';
import {
  calculateDeposit,
  calculateLoan,
  calculateRentIncrease,
  calculateFuelCost,
  calculateAverageCost,
  calculateSavingsGoal,
  calculateBudgetPulse,
  calculateVat,
  calculateDiscount,
  calculateSalaryIncrease,
  calculateInvestmentReturn,
  calculateProfitMargin,
  calculateCurrencyConversion,
  generateLoanSchedule,
  calculateSalaryConversion,
  calculateSeveranceAndNotice,
  calculateCompoundInterest,
  calculateMortgageAffordability,
  calculateCreditCardPayment,
  calculateInflationImpact,
  calculateInstallmentComparison,
  simulateMinimumPaymentPayoff,
  simulateFixedPaymentPayoff,
  calculateEarlyLoanPayoff,
  calculateLoanRestructure,
  compareTwoLoanOffers,
  getFindeksScoreRange,
  calculateLoanLateFee,
  round2,
} from './finansCalculators.js';

describe('finans hesaplayıcıları', () => {
  it('mevduat net faizini stopaj ile hesaplar', () => {
    expect(calculateDeposit({ principal: 100000, annualRate: 45, days: 32, taxRate: 5 })).toEqual({
      grossInterest: 3945.21,
      tax: 197.26,
      netInterest: 3747.95,
      maturityAmount: 103747.95,
    });
  });

  it('sabit taksitli krediyi BSMV ve KKDF ile hesaplar', () => {
    expect(calculateLoan({ amount: 100000, monthlyRate: 3.5, months: 12, bsmvRate: 15, kkdfRate: 15 })).toEqual({
      monthlyPayment: 10998.01,
      totalPayment: 131976.1,
      totalInterest: 24597,
      bsmv: 3689.55,
      kkdf: 3689.55,
      totalTaxes: 7379.1,
      totalCost: 31976.1,
    });
  });

  it('kira artışını yasal üst sınırla sınırlar', () => {
    expect(calculateRentIncrease({ currentRent: 12000, increaseRate: 60, legalCapRate: 25 })).toEqual({
      appliedRate: 25,
      newRent: 15000,
      monthlyDifference: 3000,
      yearlyDifference: 36000,
    });
  });

  it('yolculuk yakıt maliyetini hesaplar', () => {
    expect(calculateFuelCost({ distanceKm: 450, consumptionPer100Km: 7.2, fuelPrice: 43.15 })).toEqual({
      fuelNeeded: 32.4,
      totalCost: 1398.06,
      costPerKm: 3.11,
    });
  });

  it('ağırlıklı ortalama maliyeti hesaplar', () => {
    expect(calculateAverageCost([
      { quantity: 10, price: 100 },
      { quantity: 5, price: 130 },
    ])).toEqual({
      totalQuantity: 15,
      totalCost: 1650,
      averageCost: 110,
    });
  });

  it('hedefe ulaşmak için gereken aylık birikimi hesaplar', () => {
    expect(calculateSavingsGoal({ targetAmount: 200000, currentSavings: 20000, months: 24 })).toEqual({
      remainingAmount: 180000,
      monthlyNeeded: 7500,
      weeklyNeeded: 1730.77,
      dailyNeeded: 246.58,
    });
  });

  it('bütçe risk seviyesini belirler', () => {
    expect(calculateBudgetPulse({ monthlyIncome: 40000, fixedExpenses: 18000, debtPayments: 6000, savings: 4000 })).toEqual({
      freeCash: 12000,
      debtRatio: 15,
      savingsRatio: 10,
      expenseRatio: 45,
      riskLevel: 'orta',
      recommendation: 'Borç oranı izlenmeli; birikim oranını %15 üstüne taşımaya çalışın.',
    });
  });

  it('KDV hariç tutara vergi ekler', () => {
    expect(calculateVat({ amount: 1000, vatRate: 20, mode: 'add' })).toEqual({
      netAmount: 1000,
      vatAmount: 200,
      grossAmount: 1200,
    });
  });

  it('KDV dahil tutardan vergiyi ayrıştırır', () => {
    expect(calculateVat({ amount: 1200, vatRate: 20, mode: 'included' })).toEqual({
      netAmount: 1000,
      vatAmount: 200,
      grossAmount: 1200,
    });
  });

  it('indirimli fiyatı hesaplar', () => {
    expect(calculateDiscount({ listPrice: 1000, discountRate: 20 })).toEqual({
      discountAmount: 200,
      finalPrice: 800,
      savedRate: 20,
    });
  });

  it('maaş zammını hesaplar', () => {
    expect(calculateSalaryIncrease({ currentSalary: 30000, increaseRate: 25 })).toEqual({
      increaseAmount: 7500,
      newSalary: 37500,
      annualDifference: 90000,
    });
  });

  it('yatırım kâr/zararını hesaplar', () => {
    expect(calculateInvestmentReturn({ buyPrice: 100, currentPrice: 120, quantity: 10 })).toEqual({
      invested: 1000,
      currentValue: 1200,
      profit: 200,
      returnRate: 20,
    });
  });

  it('kâr marjı ve kâr yüzdesini hesaplar', () => {
    expect(calculateProfitMargin({ cost: 100, salePrice: 150, quantity: 2 })).toEqual({
      revenue: 300,
      totalCost: 200,
      profit: 100,
      marginRate: 33.33,
      markupRate: 50,
    });
  });

  it('TL tutarını dövize çevirir', () => {
    expect(calculateCurrencyConversion({ amount: 100, rate: 34.5, direction: 'toForeign' })).toEqual({
      convertedAmount: 2.9,
      rate: 34.5,
    });
  });

  it('döviz tutarını TL\'ye çevirir', () => {
    expect(calculateCurrencyConversion({ amount: 100, rate: 34.5, direction: 'toTl' })).toEqual({
      convertedAmount: 3450,
      rate: 34.5,
    });
  });

  it('kredi ödeme planında ay sayısı kadar satır üretir ve borcu sıfırlar', () => {
    const schedule = generateLoanSchedule({ amount: 100000, monthlyRate: 3.5, months: 12, bsmvRate: 15, kkdfRate: 15 });
    expect(schedule).toHaveLength(12);
    expect(schedule[0].month).toBe(1);
    expect(schedule.at(-1).remaining).toBe(0);
  });

  it('2026 asgari ücrette gelir/damga vergisi istisnası net maaşı brüt-kesinti farkına eşitler', () => {
    expect(calculateSalaryConversion({ amount: 33030, mode: 'grossToNet' })).toEqual({
      grossSalary: 33030,
      sgkDeduction: 4624.2,
      unemploymentDeduction: 330.3,
      incomeTax: 0,
      stampTax: 0,
      totalDeductions: 4954.5,
      netSalary: 28075.5,
    });
  });

  it('asgari ücretin üzerindeki brüt maaşta gelir/damga vergisi istisna sonrası kesilir', () => {
    expect(calculateSalaryConversion({ amount: 50000, mode: 'grossToNet' })).toEqual({
      grossSalary: 50000,
      sgkDeduction: 7000,
      unemploymentDeduction: 500,
      incomeTax: 2163.68,
      stampTax: 128.8,
      totalDeductions: 9792.48,
      netSalary: 40207.52,
    });
  });

  it('net maaştan brüt maaşı ikili arama ile bulur (yaklaşık)', () => {
    const result = calculateSalaryConversion({ amount: 28075.5, mode: 'netToGross' });
    expect(result.netSalary).toBeCloseTo(28075.5, 1);
    expect(result.grossSalary).toBeCloseTo(33030, 0);
  });

  it('kıdem ve ihbar tazminatını tavan uygulanmadan hesaplar', () => {
    const result = calculateSeveranceAndNotice({ grossSalary: 50000, startDate: '2021-01-01', endDate: '2026-01-01' });
    expect(result).toEqual({
      valid: true,
      totalYears: 5,
      isCapped: false,
      severancePay: 249965.78,
      noticeWeeks: 8,
      noticePay: 93333.33,
      totalPay: 343299.11,
    });
  });

  it('yüksek maaşta kıdem tazminatına 2026 2. dönem tavanını uygular', () => {
    const result = calculateSeveranceAndNotice({ grossSalary: 500000, startDate: '2021-01-01', endDate: '2026-01-01' });
    expect(result.isCapped).toBe(true);
    expect(result.severancePay).toBe(368598.88);
  });

  it('bileşik faizi katkısız hesaplar', () => {
    expect(calculateCompoundInterest({ principal: 100000, annualRate: 12, years: 5, monthlyContribution: 0 })).toEqual({
      futureValue: 181669.67,
      totalContributions: 100000,
      totalInterest: 81669.67,
    });
  });

  it('bileşik faizi aylık katkı ile hesaplar', () => {
    expect(calculateCompoundInterest({ principal: 10000, annualRate: 12, years: 2, monthlyContribution: 1000 })).toEqual({
      futureValue: 39670.81,
      totalContributions: 34000,
      totalInterest: 5670.81,
    });
  });

  it('gelire göre maksimum kredi tutarını hesaplar', () => {
    expect(calculateMortgageAffordability({ monthlyIncome: 50000, existingDebtPayments: 0, maxDebtToIncomeRatio: 40, monthlyRate: 3, months: 120 })).toEqual({
      maxInstallment: 20000,
      maxLoanAmount: 647460.45,
    });
  });

  it('kart limiti 50.000 TL altındaysa asgari ödeme oranı %20 uygular', () => {
    expect(calculateCreditCardPayment({ cardLimit: 30000, statementBalance: 10000, monthlyInterestRate: 3.25, lateInterestRate: 3.55, daysLate: 0 })).toEqual({
      minimumPaymentRate: 20,
      minimumPayment: 2000,
      remainingIfMinimumPaid: 8000,
      nextCycleInterest: 260,
      lateInterestAmount: 0,
      totalNextCycleDebt: 8260,
    });
  });

  it('kart limiti 50.000 TL üzerindeyse %40 asgari ödeme uygular ve gecikme faizi ekler', () => {
    expect(calculateCreditCardPayment({ cardLimit: 60000, statementBalance: 10000, monthlyInterestRate: 3.25, lateInterestRate: 3.55, daysLate: 10 })).toEqual({
      minimumPaymentRate: 40,
      minimumPayment: 4000,
      remainingIfMinimumPaid: 6000,
      nextCycleInterest: 195,
      lateInterestAmount: 118.33,
      totalNextCycleDebt: 6313.33,
    });
  });

  it('enflasyonun alım gücü kaybını ve nominal karşılığını hesaplar', () => {
    expect(calculateInflationImpact({ amount: 100000, annualInflationRate: 30, years: 5 })).toEqual({
      futureNominalNeeded: 371293,
      erodedPurchasingPower: 26932.91,
      purchasingPowerLossRate: 73.07,
    });
  });

  it('taksitli fiyatın peşin fiyata göre ek maliyetini hesaplar', () => {
    expect(calculateInstallmentComparison({ cashPrice: 10000, installmentCount: 12, monthlyInstallment: 950 })).toEqual({
      totalInstallmentPrice: 11400,
      extraCost: 1400,
      extraCostRate: 14,
    });
  });

  describe('simulateMinimumPaymentPayoff', () => {
    it('sadece asgari ödeyerek borcun ay ay kapanışını simüle eder', () => {
      const result = simulateMinimumPaymentPayoff({ cardLimit: 20000, statementBalance: 10000, monthlyInterestRate: 3.25 });
      expect(result.neverPaysOff).toBe(false);
      expect(result.monthsToPayoff).toBe(49);
      expect(result.totalPaid).toBe(11494.1);
      expect(result.totalInterest).toBe(1494.1);
      expect(result.schedule).toHaveLength(49);
      expect(result.schedule[0]).toEqual({ month: 1, payment: 2000, interest: 260, remaining: 8260 });
    });

    it('son ay küsuratı tam kapatır (kalan bakiye sıfıra iner)', () => {
      const result = simulateMinimumPaymentPayoff({ cardLimit: 20000, statementBalance: 10000, monthlyInterestRate: 3.25 });
      const lastMonth = result.schedule[result.schedule.length - 1];
      expect(lastMonth.remaining).toBe(0);
      // toplamların tutarlılığı: tüm ay bazlı (2 ondalığa yuvarlanmış) ödeme/faizlerin
      // toplamı, tam hassasiyetle biriktirilen totalPaid/totalInterest'e çok yakın olmalı
      // (49 ay boyunca her ayki yuvarlama birikince birkaç kuruşluk fark oluşabilir).
      const sumPayments = round2(result.schedule.reduce((acc, row) => acc + row.payment, 0));
      const sumInterest = round2(result.schedule.reduce((acc, row) => acc + row.interest, 0));
      expect(Math.abs(sumPayments - result.totalPaid)).toBeLessThan(0.05);
      expect(Math.abs(sumInterest - result.totalInterest)).toBeLessThan(0.05);
    });

    it('KRİTİK: asgari ödeme aylık faizi karşılamıyorsa borç hiç kapanmaz', () => {
      // %20 asgari oranı, %30 aylık faizi karşılamaz: (1-0.20)*(1+0.30)=1.04 >= 1
      const result = simulateMinimumPaymentPayoff({ cardLimit: 20000, statementBalance: 10000, monthlyInterestRate: 30 });
      expect(result.neverPaysOff).toBe(true);
      expect(result.monthsToPayoff).toBeNull();
      expect(result.schedule).toEqual([]);
    });

    it('bakiye sıfırsa hiçbir şey simüle etmez', () => {
      const result = simulateMinimumPaymentPayoff({ cardLimit: 20000, statementBalance: 0, monthlyInterestRate: 3.25 });
      expect(result.neverPaysOff).toBe(false);
      expect(result.monthsToPayoff).toBeNull();
      expect(result.schedule).toEqual([]);
    });
  });

  describe('simulateFixedPaymentPayoff', () => {
    it('sabit aylık ödemeyle borcun kapanışını simüle eder', () => {
      const result = simulateFixedPaymentPayoff({ statementBalance: 10000, monthlyInterestRate: 3.25, fixedPayment: 2000 });
      expect(result.neverPaysOff).toBe(false);
      expect(result.monthsToPayoff).toBe(6);
      expect(result.totalPaid).toBe(11097.18);
      expect(result.totalInterest).toBe(1097.18);
      expect(result.schedule[result.schedule.length - 1]).toEqual({ month: 6, payment: 1097.18, interest: 34.54, remaining: 0 });
    });

    it('sabit ödeme asgari yoldan daha hızlı kapanır ve daha az faiz öder (karşılaştırma senaryosu)', () => {
      const minimumOnly = simulateMinimumPaymentPayoff({ cardLimit: 20000, statementBalance: 10000, monthlyInterestRate: 3.25 });
      const fixed = simulateFixedPaymentPayoff({ statementBalance: 10000, monthlyInterestRate: 3.25, fixedPayment: 2000 });
      expect(fixed.monthsToPayoff).toBeLessThan(minimumOnly.monthsToPayoff);
      expect(fixed.totalInterest).toBeLessThan(minimumOnly.totalInterest);
    });

    it('KRİTİK: sabit ödeme o ayki faizi karşılamıyorsa borç hiç kapanmaz', () => {
      const result = simulateFixedPaymentPayoff({ statementBalance: 10000, monthlyInterestRate: 3.25, fixedPayment: 300 });
      expect(result.neverPaysOff).toBe(true);
      expect(result.monthsToPayoff).toBeNull();
    });
  });

  describe('calculateEarlyLoanPayoff', () => {
    it('ihtiyaç/taşıt kredisinde tazminat uygulanmaz, sadece faiz indirimi olur', () => {
      expect(calculateEarlyLoanPayoff({ remainingMonths: 12, monthlyInstallment: 5000, monthlyRate: 3, loanType: 'ihtiyac-tasit' })).toEqual({
        remainingPrincipal: 49770.02,
        totalRemainingIfContinued: 60000,
        interestSaved: 10229.98,
        tazminatUygulanir: false,
        tazminatOrani: 1,
        penalty: 0,
        payoffAmount: 49770.02,
        netSaving: 10229.98,
      });
    });

    it('konut kredisinde sabit faiz + kalan vade ≤36 ay: %1 tazminat uygulanır', () => {
      const result = calculateEarlyLoanPayoff({ remainingMonths: 24, monthlyInstallment: 8000, monthlyRate: 2, loanType: 'konut', rateType: 'sabit' });
      expect(result.tazminatUygulanir).toBe(true);
      expect(result.tazminatOrani).toBe(1);
      expect(result.penalty).toBe(1513.11);
    });

    it('konut kredisinde sabit faiz + kalan vade >36 ay: %2 tazminat uygulanır', () => {
      const result = calculateEarlyLoanPayoff({ remainingMonths: 48, monthlyInstallment: 8000, monthlyRate: 2, loanType: 'konut', rateType: 'sabit' });
      expect(result.tazminatUygulanir).toBe(true);
      expect(result.tazminatOrani).toBe(2);
      expect(result.penalty).toBe(4907.7);
    });

    it('konut kredisinde DEĞİŞKEN faizde tazminat hiç uygulanmaz', () => {
      const result = calculateEarlyLoanPayoff({ remainingMonths: 48, monthlyInstallment: 8000, monthlyRate: 2, loanType: 'konut', rateType: 'degisken' });
      expect(result.tazminatUygulanir).toBe(false);
      expect(result.penalty).toBe(0);
      expect(result.payoffAmount).toBe(result.remainingPrincipal);
    });
  });

  describe('calculateLoanRestructure', () => {
    it('mevcut kredi ile yeni teklifin toplam maliyetini karşılaştırır', () => {
      expect(calculateLoanRestructure({ currentRemainingBalance: 100000, currentInstallment: 6000, currentRemainingMonths: 20, newMonthlyRate: 2.5, newMonths: 24, newFee: 1000 })).toEqual({
        currentTotalIfContinued: 120000,
        newMonthlyPayment: 5591.28,
        newTotalPayment: 135190.77,
        totalDifference: 15190.77,
        monthlyPaymentDifference: -408.72,
        isNewOfferCheaper: false,
      });
    });
  });

  describe('compareTwoLoanOffers', () => {
    it('iki kredi teklifinin toplam maliyetini karşılaştırıp ucuz olanı işaretler', () => {
      const result = compareTwoLoanOffers({
        offerA: { amount: 100000, monthlyRate: 3, months: 12, fee: 500 },
        offerB: { amount: 100000, monthlyRate: 2.5, months: 12, fee: 1500 },
      });
      expect(result.offerA.totalCost).toBe(121054.5);
      expect(result.offerB.totalCost).toBe(118484.55);
      expect(result.cheaperOffer).toBe('B');
      expect(result.costDifference).toBe(2569.95);
    });

    it('iki teklif eşit maliyetliyse "esit" döner', () => {
      const identical = { amount: 50000, monthlyRate: 2, months: 12, fee: 0 };
      const result = compareTwoLoanOffers({ offerA: identical, offerB: identical });
      expect(result.cheaperOffer).toBe('esit');
      expect(result.costDifference).toBe(0);
    });
  });

  describe('getFindeksScoreRange', () => {
    it('geçerli bir puanı doğru aralığa yerleştirir', () => {
      expect(getFindeksScoreRange(1600)).toEqual({
        score: 1600,
        isValid: true,
        isOutOfBounds: false,
        range: { key: 'iyi', label: 'İyi', min: 1500, max: 1699 },
        positionInRange: 50.25,
      });
    });

    it('sınır dışı (negatif) puanı 0\'a sabitler ve uyarır', () => {
      const result = getFindeksScoreRange(-50);
      expect(result.isOutOfBounds).toBe(true);
      expect(result.score).toBe(0);
      expect(result.range.key).toBe('cokRiskli');
    });

    it('sınır dışı (1900 üstü) puanı 1900\'e sabitler ve uyarır', () => {
      const result = getFindeksScoreRange(2500);
      expect(result.isOutOfBounds).toBe(true);
      expect(result.score).toBe(1900);
      expect(result.range.key).toBe('cokIyi');
    });
  });

  describe('calculateLoanLateFee', () => {
    it('azami gecikme faizini (akdi faizin %30 fazlası) ve gecikme bedelini hesaplar', () => {
      expect(calculateLoanLateFee({ installmentAmount: 5000, daysLate: 10, contractMonthlyRate: 3 })).toEqual({
        maxLateMonthlyRate: 3.9,
        dailyRate: 0.13,
        lateFeeAmount: 65,
        totalPayable: 5065,
      });
    });

    it('gecikme günü sıfırsa gecikme bedeli sıfırdır', () => {
      const result = calculateLoanLateFee({ installmentAmount: 5000, daysLate: 0, contractMonthlyRate: 3 });
      expect(result.lateFeeAmount).toBe(0);
      expect(result.totalPayable).toBe(5000);
    });
  });
});
