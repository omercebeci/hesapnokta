import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Route değişiminde pencereyi en üste kaydırır. Geri/ileri (POP) gezinmelerinde
// tarayıcının kendi scroll restorasyonuna karışmamak için hiçbir şey yapmaz —
// yalnızca yeni bir sayfaya gidildiğinde (PUSH/REPLACE) en üste sıçrar.
// `behavior: 'instant'` zorunlu: styles.css'te global `scroll-behavior: smooth`
// tanımlı olduğundan, `window.scrollTo(0, 0)` (varsayılan 'auto') bu CSS'i miras
// alıp animasyonlu kaydırır — 'instant' bunu bypass eder.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, navigationType]);

  return null;
}
