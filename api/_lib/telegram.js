// Tüm iletişim/geri bildirim uçlarının ortak Telegram bildirim altyapısı.
// TELEGRAM_BOT_TOKEN ve TELEGRAM_CHAT_ID tanımlı değilse mesaj gönderilmez
// (configured: false döner) — çağıran uç bu durumda isteği loglayıp
// kullanıcıya yine de başarı mesajı gösterebilir.
export async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { configured: false, sent: false };
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  return { configured: true, sent: response.ok };
}
