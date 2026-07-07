// Basit bellek-içi rate limit: aynı anahtar (ör. IP) için pencere süresi
// dolmadan ikinci bir istek gelirse true döner. Sunucu soğuk başlatıldığında
// (cold start) sıfırlanır — bu, çoğu spam denemesini engellemeye yeter.
export function createRateLimiter(windowMs) {
  const lastHitAt = new Map();

  return function isRateLimited(key) {
    const now = Date.now();
    const last = lastHitAt.get(key);
    lastHitAt.set(key, now);

    if (lastHitAt.size > 5000) lastHitAt.clear();

    return typeof last === 'number' && now - last < windowMs;
  };
}
