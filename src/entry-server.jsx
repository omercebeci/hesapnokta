import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
import { HeadContext } from './context/HeadContext.jsx';

// Build sırasında (prerender script'i tarafından) her route için bir kez çağrılır.
// Sayfalar React.lazy() ile kod bölünmesi (code-splitting) kullandığından, Suspense'i
// desteklemeyen renderToString yerine renderToPipeableStream + onAllReady kullanılır;
// bu, tüm lazy bileşenler tam olarak çözülene kadar bekleyip eksiksiz HTML üretir.
export function render(url) {
  return new Promise((resolve, reject) => {
    const headEntries = [];
    const headApi = { push: (entry) => headEntries.push(entry) };

    const { pipe } = renderToPipeableStream(
      <HeadContext.Provider value={headApi}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadContext.Provider>,
      {
        onAllReady() {
          const chunks = [];
          const passThrough = new PassThrough();
          passThrough.on('data', (chunk) => chunks.push(chunk));
          passThrough.on('end', () => {
            resolve({ html: Buffer.concat(chunks).toString('utf-8'), head: headEntries[0] || null });
          });
          passThrough.on('error', reject);
          pipe(passThrough);
        },
        onError(error) {
          reject(error);
        },
      },
    );
  });
}
