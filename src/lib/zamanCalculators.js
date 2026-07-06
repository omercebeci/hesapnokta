// Zaman/tarih kategorisi için saf hesaplama fonksiyonları.

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// İki tarih arasındaki farkı takvim yılı/ay/gün olarak hesaplar (ödünç alma dahil).
function calendarDiff(startDate, endDate) {
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    const daysInPrevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    days += daysInPrevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function calculateAge({ birthDate, referenceDate }) {
  const birth = parseDate(birthDate);
  const reference = parseDate(referenceDate) || new Date();
  if (!birth || birth > reference) {
    return { valid: false };
  }

  const { years, months, days } = calendarDiff(birth, reference);
  const totalDays = Math.floor((reference.getTime() - birth.getTime()) / MS_PER_DAY);

  // Bir sonraki doğum günü
  const nextBirthday = new Date(reference.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday.getTime() < reference.getTime()) {
    nextBirthday.setFullYear(reference.getFullYear() + 1);
  }
  const daysUntilNextBirthday = Math.ceil((nextBirthday.getTime() - reference.getTime()) / MS_PER_DAY);

  return {
    valid: true,
    years,
    months,
    days,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    daysUntilNextBirthday,
  };
}

export function calculateDateDiff({ startDate, endDate }) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end) {
    return { valid: false };
  }

  const earlier = start <= end ? start : end;
  const later = start <= end ? end : start;
  const { years, months, days } = calendarDiff(earlier, later);
  const totalDays = Math.floor((later.getTime() - earlier.getTime()) / MS_PER_DAY);

  return {
    valid: true,
    reversed: start > end,
    years,
    months,
    days,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalMonths: years * 12 + months,
  };
}

// "HH:MM" biçiminde iki saat arası süre hesaplar (mesai/çalışma saati); bitiş, başlangıçtan küçük/eşitse ertesi güne sarkar.
export function calculateTimeDuration({ startTime, endTime, breakMinutes = 0 }) {
  if (!startTime || !endTime) return { valid: false };

  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  if (![startH, startM, endH, endM].every((value) => Number.isFinite(value))) {
    return { valid: false };
  }

  const startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;
  const overnight = endMinutes <= startMinutes;
  if (overnight) endMinutes += 24 * 60;

  const breakM = Math.max(0, Number(breakMinutes) || 0);
  const totalMinutes = Math.max(0, endMinutes - startMinutes - breakM);

  return {
    valid: true,
    overnight,
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
    totalMinutes,
    decimalHours: Math.round((totalMinutes / 60) * 100) / 100,
  };
}

// Hedef tarihe kaç gün kaldığını (veya kaç gün geçtiğini) hesaplar.
export function calculateCountdown({ targetDate, referenceDate }) {
  const target = parseDate(targetDate);
  const reference = parseDate(referenceDate) || new Date();
  if (!target) return { valid: false };

  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const referenceMidnight = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate()).getTime();
  const totalDays = Math.round((targetMidnight - referenceMidnight) / MS_PER_DAY);

  return {
    valid: true,
    totalDays,
    isPast: totalDays < 0,
    isToday: totalDays === 0,
    weeks: Math.floor(Math.abs(totalDays) / 7),
    remainderDays: Math.abs(totalDays) % 7,
  };
}
