import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

// Yeni bir deploy sonrası service worker güncellendiğinde kullanıcıyı sessizce
// (skipWaiting+clientsClaim ile) değil, bu çubukla bilgilendirir. Site rota bazlı
// code-splitting kullandığından (App.jsx'teki lazy() importları), SW'nin sekmenin
// ortasında sessizce devralması, kullanıcı henüz hiç açmadığı bir hesaplayıcıya
// geçtiğinde eski HTML'in referans verdiği artık var olmayan hash'li JS parçasını
// istemesine ve "Failed to fetch dynamically imported module" hatasıyla sayfanın
// bozulmasına yol açabilir. "Yenile" butonu tam sayfa yenilemesi tetikleyerek bunu
// önler (bkz. vite.config.js: registerType: 'prompt').
export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  const refresh = () => updateServiceWorker(true);
  const dismiss = () => setNeedRefresh(false);

  return (
    <div className="update-prompt" role="status">
      <span>Yeni bir sürüm hazır.</span>
      <div className="update-prompt-actions">
        <button type="button" className="btn-primary" onClick={refresh}>Yenile</button>
        <button type="button" className="update-prompt-dismiss" onClick={dismiss} aria-label="Kapat">Sonra</button>
      </div>
    </div>
  );
}
