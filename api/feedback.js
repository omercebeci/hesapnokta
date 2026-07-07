import { readJsonBody, getClientIp } from './_lib/http.js';
import { sendTelegramMessage } from './_lib/telegram.js';
import { createRateLimiter } from './_lib/rateLimit.js';

const VALID_VOTES = new Set(['up', 'down']);
const isRateLimited = createRateLimiter(20_000);

function formatVote(vote) {
  if (vote === 'up') return '👍 İşe yaradı';
  if (vote === 'down') return '👎 İşe yaramadı';
  return '—';
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ ok: false, message: 'Sadece POST desteklenir.' });
  }

  try {
    const body = await readJsonBody(request);

    // Honeypot: gizli alan doluysa bot olarak kabul edip sessizce başarı dön.
    if (body.website) {
      return response.status(200).json({ ok: true, message: 'Teşekkürler!' });
    }

    if (isRateLimited(getClientIp(request))) {
      return response.status(429).json({ ok: false, message: 'Çok sık gönderim yapıldı, lütfen biraz sonra tekrar deneyin.' });
    }

    const page = String(body.page || 'Bilinmeyen sayfa').slice(0, 120);
    const vote = VALID_VOTES.has(body.vote) ? body.vote : null;
    const text = String(body.text || '').trim().slice(0, 500);

    if (!vote && !text) {
      return response.status(400).json({ ok: false, message: 'Geçersiz gönderim.' });
    }

    const message = [
      '💬 HesapNokta geri bildirim',
      `Sayfa: ${page}`,
      `Değerlendirme: ${formatVote(vote)}`,
      text ? `\n${text}` : null,
      `Tarih: ${new Date().toISOString().slice(0, 10)}`,
    ].filter(Boolean).join('\n');

    const result = await sendTelegramMessage(message);

    if (result.configured && !result.sent) {
      return response.status(502).json({ ok: false, message: 'Geri bildirim alındı fakat bildirim gönderilemedi.' });
    }

    if (!result.configured) {
      console.log(message);
    }

    return response.status(200).json({ ok: true, message: 'Teşekkürler!' });
  } catch (error) {
    return response.status(500).json({ ok: false, message: 'Geri bildirim gönderilirken beklenmeyen bir hata oluştu.' });
  }
}
