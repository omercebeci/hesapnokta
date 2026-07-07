import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler from './feedback.js';

function createRequest({ method = 'POST', body = {}, ip = '9.9.9.9' } = {}) {
  return {
    method,
    body,
    headers: { 'x-forwarded-for': ip },
    socket: { remoteAddress: ip },
  };
}

function createResponse() {
  const response = {
    statusCode: null,
    body: null,
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
  return response;
}

describe('POST /api/feedback', () => {
  beforeEach(() => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', 'test-token');
    vi.stubEnv('TELEGRAM_CHAT_ID', 'test-chat');
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('rejects non-POST methods', async () => {
    const response = createResponse();
    await handler(createRequest({ method: 'GET', ip: '1.1.1.1' }), response);
    expect(response.statusCode).toBe(405);
  });

  it('sends a Telegram message for a thumbs-up vote and returns ok', async () => {
    const response = createResponse();
    await handler(createRequest({ body: { page: 'Kredi Hesaplama', vote: 'up' }, ip: '2.2.2.2' }), response);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [, options] = global.fetch.mock.calls[0];
    const sentText = JSON.parse(options.body).text;
    expect(sentText).toContain('Kredi Hesaplama');
    expect(sentText).toContain('👍');
  });

  it('includes free-text feedback in the Telegram message', async () => {
    const response = createResponse();
    await handler(createRequest({ body: { page: 'KDV Hesaplama', vote: 'down', text: 'Sonuç yanlış görünüyor' }, ip: '3.3.3.3' }), response);

    const sentText = JSON.parse(global.fetch.mock.calls[0][1].body).text;
    expect(sentText).toContain('👎');
    expect(sentText).toContain('Sonuç yanlış görünüyor');
  });

  it('truncates feedback text to 500 characters', async () => {
    const response = createResponse();
    const longText = 'a'.repeat(600);
    await handler(createRequest({ body: { page: 'Test', text: longText }, ip: '4.4.4.4' }), response);

    const sentText = JSON.parse(global.fetch.mock.calls[0][1].body).text;
    expect(sentText).toContain('a'.repeat(500));
    expect(sentText).not.toContain('a'.repeat(501));
  });

  it('rejects a submission with neither a vote nor text', async () => {
    const response = createResponse();
    await handler(createRequest({ body: { page: 'Test' }, ip: '5.5.5.5' }), response);

    expect(response.statusCode).toBe(400);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('silently accepts but ignores honeypot-filled submissions', async () => {
    const response = createResponse();
    await handler(createRequest({ body: { page: 'Test', vote: 'up', website: 'http://spam.example' }, ip: '6.6.6.6' }), response);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('rate limits a second submission from the same IP within the window', async () => {
    const first = createResponse();
    await handler(createRequest({ body: { vote: 'up' }, ip: '7.7.7.7' }), first);
    expect(first.statusCode).toBe(200);

    const second = createResponse();
    await handler(createRequest({ body: { vote: 'up' }, ip: '7.7.7.7' }), second);
    expect(second.statusCode).toBe(429);
  });

  it('returns 202-equivalent ok response when Telegram env vars are not configured', async () => {
    vi.unstubAllEnvs();
    const response = createResponse();
    await handler(createRequest({ body: { vote: 'up' }, ip: '8.8.8.8' }), response);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
