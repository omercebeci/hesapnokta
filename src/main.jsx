import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import App from './App.jsx';
import UpdatePrompt from './components/UpdatePrompt.jsx';
import './styles.css';

const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
      {/* virtual:pwa-register/react sadece istemci (Vite client) derlemesinde var olan bir
          sanal modüldür — vite.config.js SSR derlemesinde VitePWA eklentisini devre dışı
          bırakır (!isSsrBuild). UpdatePrompt bu yüzden App.jsx'e değil, SSR'ın hiç dokunmadığı
          bu client-only giriş noktasına eklenir (Analytics/SpeedInsights ile aynı desen). */}
      <UpdatePrompt />
    </BrowserRouter>
  </React.StrictMode>
);

// Build sırasında prerender edilmiş statik HTML varsa hydrate edilir (içerik zaten DOM'dadır,
// React sadece etkileşimi devreye alır). Prerender edilmemiş durumlarda (ör. `npm run dev`)
// kök eleman boş olduğundan normal client-side render yapılır.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
