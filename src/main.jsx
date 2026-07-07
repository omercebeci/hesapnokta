import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import App from './App.jsx';
import './styles.css';

const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
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
