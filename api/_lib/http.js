export function readJsonBody(request) {
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

export function getClientIp(request) {
  const forwardedFor = request.headers?.['x-forwarded-for'];
  if (forwardedFor) return String(forwardedFor).split(',')[0].trim();
  return request.socket?.remoteAddress || 'unknown';
}
