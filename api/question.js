import { readJsonBody } from './_lib/http.js';
import { sendTelegramMessage } from './_lib/telegram.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ ok: false, message: 'Sadece POST desteklenir.' });
  }

  try {
    const body = await readJsonBody(request);
    const name = String(body.name || 'Ziyaretçi').slice(0, 80);
    const topic = String(body.topic || 'Genel soru').slice(0, 80);
    const contact = String(body.contact || 'Belirtilmedi').slice(0, 120);
    const question = String(body.question || '').trim().slice(0, 2000);

    if (!question || question.length < 5) {
      return response.status(400).json({ ok: false, message: 'Lütfen en az birkaç kelimelik bir soru yazın.' });
    }

    const message = [
      '📩 HesapNokta yeni soru',
      `Konu: ${topic}`,
      `İsim: ${name}`,
      `İletişim: ${contact}`,
      '',
      question,
    ].join('\n');

    const result = await sendTelegramMessage(message);

    if (result.configured && !result.sent) {
      return response.status(502).json({ ok: false, message: 'Soru alındı fakat Telegram bildirimi gönderilemedi.' });
    }

    if (!result.configured) {
      console.log(message);
      return response.status(202).json({ ok: true, message: 'Sorunuz alındı. Bildirim kanalı yapılandırılınca doğrudan Niko’ya düşecek.' });
    }

    return response.status(200).json({ ok: true, message: 'Sorunuz alındı. En kısa sürede yanıtlanacak.' });
  } catch (error) {
    return response.status(500).json({ ok: false, message: 'Soru gönderilirken beklenmeyen bir hata oluştu.' });
  }
}
