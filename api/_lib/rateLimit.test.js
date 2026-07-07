import { describe, expect, it, vi } from 'vitest';
import { createRateLimiter } from './rateLimit.js';

describe('createRateLimiter', () => {
  it('does not rate limit the first hit for a key', () => {
    const isRateLimited = createRateLimiter(1000);
    expect(isRateLimited('1.2.3.4')).toBe(false);
  });

  it('rate limits a second hit within the window', () => {
    const isRateLimited = createRateLimiter(1000);
    isRateLimited('1.2.3.4');
    expect(isRateLimited('1.2.3.4')).toBe(true);
  });

  it('allows a hit again after the window has passed', () => {
    vi.useFakeTimers();
    const isRateLimited = createRateLimiter(1000);
    isRateLimited('1.2.3.4');
    vi.advanceTimersByTime(1001);
    expect(isRateLimited('1.2.3.4')).toBe(false);
    vi.useRealTimers();
  });

  it('tracks different keys independently', () => {
    const isRateLimited = createRateLimiter(1000);
    isRateLimited('1.2.3.4');
    expect(isRateLimited('5.6.7.8')).toBe(false);
  });
});
