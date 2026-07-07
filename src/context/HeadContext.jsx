import { createContext, useContext } from 'react';

// Yalnızca build sırasındaki statik HTML üretimi (prerender) sırasında kullanılır.
// Normal tarayıcıda bu context sağlanmaz (null kalır) ve sayfalar SEO etiketlerini
// mevcut client-side yöntemle (useEffect + document mutasyonu) günceller.
export const HeadContext = createContext(null);

export function useHeadContext() {
  return useContext(HeadContext);
}
