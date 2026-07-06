import { useEffect, useRef, useState } from 'react';

// Bir eleman görünür alana girdiğinde bir kez true döner (scroll-reveal animasyonları için).
export function useInView({ threshold = 0.12, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
}
