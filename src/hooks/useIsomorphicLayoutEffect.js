import { useEffect, useLayoutEffect } from 'react';

// SSR sırasında useLayoutEffect konsola uyarı basar (sunucuda hiç çalışmaz); tarayıcıda ise
// paylaşılan/yerel veriyi ilk boyamadan ÖNCE uygulayarak "örnek veri → gerçek veri" sıçramasını
// engellemek için gerekli. Sunucuda useEffect'e (no-op), tarayıcıda useLayoutEffect'e döner.
export const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
