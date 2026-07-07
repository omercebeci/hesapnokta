import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler from './question.js';

function createRequest({ method = 'POST', body = {} } = {}) {
  return { method, body };
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

describe('POST /api/question', () => {
  beforeEach(() => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', 'test-token');
    vi.stubEnv('TELEGRAM_CHAT_ID', 'test-chat');
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('rejects a question shorter than 5 characters', async () => {
    const response = createResponse();
    await handler(createRequest({ body: { question: 'Hi' } }), response);
    expect(response.statusCode).toBe(400);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('sends the question via the shared Telegram helper (TELEGRAM_BOT_TOKEN/CHAT_ID)', async () => {
    const response = createResponse();
    await handler(createRequest({ body: { name: 'Ada', question: 'Kredi hesaplama nasıl çalışır?' } }), response);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toContain('test-token');
    const payload = JSON.parse(options.body);
    expect(payload.chat_id).toBe('test-chat');
    expect(payload.text).toContain('Ada');
    expect(payload.text).toContain('Kredi hesaplama nasıl çalışır?');
  });

  it('falls back to a logged, still-ok response when Telegram env vars are missing', async () => {
    vi.unstubAllEnvs();
    const response = createResponse();
    await handler(createRequest({ body: { question: 'Bu bir sorudur.' } }), response);

    expect(response.statusCode).toBe(202);
    expect(response.body.ok).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
