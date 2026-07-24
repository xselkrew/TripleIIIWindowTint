import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type SVGProps } from 'react';

export interface LogoAsset {
  id: number;
  name: string;
  kind: 'bmw' | 'image';
  src?: string;
}

interface LogoCarouselProps {
  logos: LogoAsset[];
  cycleInterval?: number;
}

function BMWIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 498.503 498.503" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M249.251 498.503c66.577 0 129.168-25.928 176.247-73.005 47.077-47.078 73.005-109.67 73.005-176.247 0-66.576-25.928-129.168-73.005-176.246C378.42 25.927 315.828 0 249.251 0 111.813 0 0 111.813 0 249.251c0 66.577 25.927 129.169 73.005 176.247 47.078 47.077 109.67 73.005 176.246 73.005z" />
      <path d="M8.624 249.251c0-64.272 25.03-124.699 70.479-170.148 45.449-45.45 105.875-70.479 170.148-70.479s124.7 25.029 170.148 70.479c45.449 45.449 70.479 105.875 70.479 170.148 0 132.683-107.945 240.628-240.627 240.628-64.273 0-124.699-25.03-170.148-70.479C33.654 373.95 8.624 313.524 8.624 249.251z" fill="#fff" />
      <path d="M249.251 18.541c-127.416 0-230.71 103.294-230.71 230.71s103.294 230.711 230.71 230.711c127.416 0 230.71-103.295 230.71-230.711s-103.294-230.71-230.71-230.71z" />
      <path d="M249.251 396.621c-81.389 0-147.37-65.98-147.37-147.37 0-81.389 65.981-147.37 147.37-147.37 81.389 0 147.37 65.981 147.37 147.37 0 81.39-65.98 147.37-147.37 147.37z" fill="#fff" />
      <path d="M111.362 249.251h137.889V111.362c-76.153 0-137.889 61.737-137.889 137.889zm137.889 0v137.89c76.153 0 137.889-61.736 137.889-137.89H249.251z" />
      <path d="M140.952 108.643c-4.885-4.748-12.436-6.179-19.525-1.784 1.354-3.509.801-7.09.082-9.066-3.054-5.569-4.12-6.266-6.637-8.378-8.148-6.837-16.723-1-22.856 6.309l-29.632 35.313 46.581 39.087 31.249-37.24c7.14-8.509 8.244-16.945.738-24.241zm116.018-16.78l15.997-42.401v42.401h12.158V31.137h-18.267l-16.615 43.479h.172L233.8 31.137h-18.266v60.726h12.157V49.462l15.998 42.401h13.281zm163.46 25.264l-22.89 32.407 35.486-16.847 9.396 11.603-55.854 27.075-11.027-13.727 21.969-32.123-.13-.161-35.989 14.81-11.135-13.64 38.097-49.004 9.396 11.603-23.857 31.208 36.458-15.652 10.08 12.448z" fill="#fff" />
      <path d="M98.491 104.464c2.062-2.458 6.722-2.357 9.719.157 3.295 2.765 3.303 6.685 1.09 9.321l-17.597 20.971-11.01-9.239 17.798-21.21zm31.309 24.739l-18.553 22.11-11.634-9.762 18.703-22.29c2.112-2.517 6.821-3.25 9.997-.584 3.595 3.015 3.951 7.59 1.487 10.526z" />
    </svg>
  );
}

function BrandMark({ logo }: { logo: LogoAsset }) {
  if (logo.kind === 'bmw') {
    return <BMWIcon className="brand-carousel-mark" aria-hidden="true" />;
  }

  return <img className="brand-carousel-mark" src={logo.src} alt="" aria-hidden="true" />;
}

export function LogoCarousel({ logos, cycleInterval = 2000 }: LogoCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry?.isIntersecting ?? false);
    }, { rootMargin: '80px' });

    const onVisibilityChange = () => setTabVisible(!document.hidden);
    observer.observe(root);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || !isVisible || !tabVisible || logos.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % logos.length);
    }, cycleInterval);
    return () => window.clearInterval(interval);
  }, [cycleInterval, isVisible, logos.length, reduceMotion, tabVisible]);

  if (!logos.length) return null;

  return (
    <div
      ref={rootRef}
      className="brand-carousel"
      role="img"
      aria-label={`Vehicle brands serviced include ${logos.map((logo) => logo.name).join(', ')}`}
    >
      {[0, 1, 2].map((columnIndex) => {
        const logo = logos[(activeIndex + columnIndex) % logos.length];
        return (
          <motion.div
            className="brand-carousel-column"
            key={columnIndex}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : columnIndex * 0.1, duration: 0.45 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="brand-carousel-logo"
                key={logo.id}
                initial={reduceMotion ? false : { y: '12%', opacity: 0, filter: 'blur(8px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={reduceMotion ? undefined : { y: '-18%', opacity: 0, filter: 'blur(6px)' }}
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 24 }}
              >
                <BrandMark logo={logo} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
