function readBody(request) {
  if (request.body && typeof request.body === 'object') return Promise.resolve(request.body);
  if (request.body && typeof request.body === 'string') return Promise.resolve(JSON.parse(request.body));

  return new Promise((resolve, reject) => {
    let data = '';
    request.on('data', (chunk) => { data += chunk; });
    request.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ ok: false, message: 'Sadece POST desteklenir.' });
  }

  try {
    const body = await readBody(request);
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

    const token = process.env.QUESTION_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.QUESTION_TELEGRAM_CHAT_ID;

    if (token && chatId) {
      const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message }),
      });

      if (!telegramResponse.ok) {
        return response.status(502).json({ ok: false, message: 'Soru alındı fakat Telegram bildirimi gönderilemedi.' });
      }

      return response.status(200).json({ ok: true, message: 'Sorunuz alındı. En kısa sürede yanıtlanacak.' });
    }

    console.log(message);
    return response.status(202).json({ ok: true, message: 'Sorunuz alındı. Bildirim kanalı yapılandırılınca doğrudan Niko’ya düşecek.' });
  } catch (error) {
    return response.status(500).json({ ok: false, message: 'Soru gönderilirken beklenmeyen bir hata oluştu.' });
  }
}
