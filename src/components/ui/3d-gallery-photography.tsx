import { Image as DreiImage } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Group } from 'three';
import './3d-gallery-photography.css';

export interface GalleryImage {
  id: string;
  carouselUrl: string;
  viewerUrl: string;
  alt: string;
}

interface InfiniteGalleryProps {
  images: GalleryImage[];
  speed?: number;
  zSpacing?: number;
  visibleCount?: number;
  falloff?: { near: number; far: number };
  className?: string;
}

class GalleryErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

interface GalleryPlaneProps {
  image: GalleryImage;
  imageIndex: number;
  total: number;
  positionRef: React.RefObject<number>;
  zSpacing: number;
  falloff: { near: number; far: number };
  draggedRef: React.RefObject<boolean>;
  onOpen: (index: number) => void;
}

const wrapDistance = (value: number, total: number) => {
  const half = total / 2;
  return ((value + half) % total + total) % total - half;
};

function GalleryPlane({
  image,
  imageIndex,
  total,
  positionRef,
  zSpacing,
  falloff,
  draggedRef,
  onOpen,
}: GalleryPlaneProps) {
  const group = useRef<Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const distance = wrapDistance(imageIndex - positionRef.current, total);
    const absoluteDistance = Math.abs(distance);
    const arcStep = 0.31;
    const angle = Math.max(-1.28, Math.min(1.28, distance * arcStep));
    const radius = 7.2 + zSpacing * 0.35;
    const depth = absoluteDistance * zSpacing;
    const visibility = Math.max(
      0.12,
      Math.min(1, 1 - (depth - falloff.near) / Math.max(1, falloff.far - falloff.near)),
    );
    group.current.position.set(
      Math.sin(angle) * radius,
      -absoluteDistance * 0.055,
      (Math.cos(angle) - 1) * radius,
    );
    group.current.rotation.set(0, -angle, distance * -0.008);
    group.current.scale.setScalar((0.74 + visibility * 0.22) * (absoluteDistance < 0.5 ? 1.06 : 1));
    group.current.visible = depth <= falloff.far + zSpacing;
  });

  return (
    <group ref={group}>
      <DreiImage
        url={image.carouselUrl}
        scale={[4.8, 3.6]}
        radius={0.12}
        transparent
        onClick={(event) => {
          event.stopPropagation();
          if (!draggedRef.current) onOpen(imageIndex);
        }}
      />
    </group>
  );
}

interface GallerySceneProps {
  images: GalleryImage[];
  positionRef: React.RefObject<number>;
  targetRef: React.RefObject<number>;
  speed: number;
  zSpacing: number;
  visibleCount: number;
  falloff: { near: number; far: number };
  isRunningRef: React.RefObject<boolean>;
  draggedRef: React.RefObject<boolean>;
  onActiveChange: (index: number) => void;
  onOpen: (index: number) => void;
}

function GalleryScene({
  images,
  positionRef,
  targetRef,
  speed,
  zSpacing,
  visibleCount,
  falloff,
  isRunningRef,
  draggedRef,
  onActiveChange,
  onOpen,
}: GallerySceneProps) {
  const lastActive = useRef(-1);
  const [centerIndex, setCenterIndex] = useState(0);
  const renderedIndices = useMemo(() => {
    const count = Math.min(images.length, visibleCount);
    const start = centerIndex - Math.floor(count / 2);
    return Array.from(
      { length: count },
      (_, offset) => ((start + offset) % images.length + images.length) % images.length,
    );
  }, [centerIndex, images.length, visibleCount]);

  useFrame((_, delta) => {
    if (isRunningRef.current) targetRef.current += delta * speed * 0.28;
    positionRef.current += (targetRef.current - positionRef.current) * Math.min(1, delta * 7);
    const active = ((Math.round(positionRef.current) % images.length) + images.length) % images.length;
    if (active !== lastActive.current) {
      lastActive.current = active;
      setCenterIndex(active);
      onActiveChange(active);
    }
  });

  return (
    <>
      <ambientLight intensity={1.25} />
      {renderedIndices.map((imageIndex) => (
        <GalleryPlane
          key={images[imageIndex].id}
          image={images[imageIndex]}
          imageIndex={imageIndex}
          total={images.length}
          positionRef={positionRef}
          zSpacing={zSpacing}
          falloff={falloff}
          draggedRef={draggedRef}
          onOpen={onOpen}
        />
      ))}
    </>
  );
}

function StaticGallery({ images, onOpen }: { images: GalleryImage[]; onOpen: (index: number) => void }) {
  return (
    <div className="gallery-static-grid">
      {images.map((image, index) => (
        <button key={image.id} type="button" onClick={() => onOpen(index)}>
          <img src={image.carouselUrl} alt={image.alt} loading="lazy" />
        </button>
      ))}
    </div>
  );
}

function GalleryLightbox({
  images,
  index,
  onChange,
  onClose,
}: {
  images: GalleryImage[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<number | null>(null);

  const move = useCallback(
    (delta: number) => onChange((index + delta + images.length) % images.length),
    [images.length, index, onChange],
  );

  useEffect(() => {
    const previousActive = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'Tab' && dialog.current) {
        const controls = [...dialog.current.querySelectorAll<HTMLElement>('button')];
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActive?.focus();
    };
  }, [move, onClose]);

  return (
    <div
      ref={dialog}
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Project photo ${index + 1} of ${images.length}`}
      onPointerDown={(event) => {
        touchStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (touchStart.current === null) return;
        const distance = event.clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(distance) > 55) move(distance > 0 ? -1 : 1);
      }}
    >
      <button
        ref={closeButton}
        className="gallery-lightbox-close"
        type="button"
        onClick={onClose}
        aria-label="Close fullscreen photo"
      >
        ×
      </button>
      <button className="gallery-lightbox-nav previous" type="button" onClick={() => move(-1)} aria-label="Previous photo">
        ‹
      </button>
      <img src={images[index].viewerUrl} alt={images[index].alt} />
      <button className="gallery-lightbox-nav next" type="button" onClick={() => move(1)} aria-label="Next photo">
        ›
      </button>
      <span className="gallery-lightbox-count" aria-live="polite">
        {index + 1} / {images.length}
      </span>
    </div>
  );
}

export default function InfiniteGallery({
  images,
  speed = 1.2,
  zSpacing = 3,
  visibleCount = 12,
  falloff = { near: 0.8, far: 14 },
  className = '',
}: InfiniteGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [canUseWebGL, setCanUseWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isOnscreen, setIsOnscreen] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [webGLFailed, setWebGLFailed] = useState(false);
  const positionRef = useRef(0);
  const targetRef = useRef(0);
  const isRunningRef = useRef(true);
  const draggedRef = useRef(false);
  const pointerStart = useRef<{ x: number; target: number } | null>(null);
  const resumeTimer = useRef<number | null>(null);
  const snapTimer = useRef<number | null>(null);
  const shell = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 850px), (pointer: coarse)');
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    setCanUseWebGL(Boolean(gl));

    const syncMedia = () => {
      setReducedMotion(reduced.matches);
      setIsMobile(mobile.matches);
    };
    syncMedia();
    reduced.addEventListener('change', syncMedia);
    mobile.addEventListener('change', syncMedia);

    const syncVisibility = () => setIsDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', syncVisibility);
    const observer = new IntersectionObserver(([entry]) => setIsOnscreen(entry?.isIntersecting ?? false), {
      rootMargin: '120px',
    });
    if (shell.current) observer.observe(shell.current);

    return () => {
      reduced.removeEventListener('change', syncMedia);
      mobile.removeEventListener('change', syncMedia);
      document.removeEventListener('visibilitychange', syncVisibility);
      observer.disconnect();
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
    };
  }, []);

  useEffect(() => {
    isRunningRef.current = isOnscreen && isDocumentVisible && lightboxIndex === null && !reducedMotion;
  }, [isDocumentVisible, isOnscreen, lightboxIndex, reducedMotion]);

  const pauseAfterInteraction = useCallback(() => {
    isRunningRef.current = false;
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      isRunningRef.current = isOnscreen && isDocumentVisible && lightboxIndex === null && !reducedMotion;
    }, 3000);
  }, [isDocumentVisible, isOnscreen, lightboxIndex, reducedMotion]);

  const nudge = useCallback(
    (amount: number) => {
      pauseAfterInteraction();
      targetRef.current += amount;
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
      snapTimer.current = window.setTimeout(() => {
        targetRef.current = Math.round(targetRef.current);
      }, 180);
    },
    [pauseAfterInteraction],
  );

  const openImage = useCallback((index: number) => setLightboxIndex(index), []);
  const closeImage = useCallback(() => setLightboxIndex(null), []);

  if (!images.length) return null;

  const useStatic = reducedMotion || !canUseWebGL || webGLFailed;
  const actualVisibleCount = isMobile ? Math.min(7, visibleCount) : Math.min(images.length, visibleCount);

  return (
    <>
      <section
        ref={shell}
        className={`infinite-gallery ${className}`}
        tabIndex={0}
        aria-label="Interactive project photo gallery"
        onWheel={(event) => {
          if (useStatic) return;
          event.preventDefault();
          nudge(event.deltaY * 0.0025);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            nudge(-1);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            nudge(1);
          }
          if (event.key === 'Enter') openImage(activeIndex);
        }}
        onPointerDown={(event) => {
          if (useStatic) return;
          if ((event.target as HTMLElement).closest('button')) return;
          draggedRef.current = false;
          pointerStart.current = { x: event.clientX, target: targetRef.current };
          event.currentTarget.setPointerCapture(event.pointerId);
          pauseAfterInteraction();
        }}
        onPointerMove={(event) => {
          if (!pointerStart.current || useStatic) return;
          const movement = event.clientX - pointerStart.current.x;
          if (Math.abs(movement) > 6) draggedRef.current = true;
          targetRef.current = pointerStart.current.target - movement / 210;
        }}
        onPointerUp={() => {
          pointerStart.current = null;
          targetRef.current = Math.round(targetRef.current);
          window.setTimeout(() => {
            draggedRef.current = false;
          }, 0);
        }}
        onClick={(event) => {
          if (!useStatic && (event.target as HTMLElement).tagName === 'CANVAS' && !draggedRef.current) {
            openImage(activeIndex);
          }
        }}
      >
        {useStatic ? (
          <StaticGallery images={images} onOpen={openImage} />
        ) : (
          <GalleryErrorBoundary
            fallback={<StaticGallery images={images} onOpen={openImage} />}
            onError={() => setWebGLFailed(true)}
          >
            <Suspense fallback={<div className="gallery-loading">Loading project gallery…</div>}>
              <Canvas
                dpr={isMobile ? [1, 1.35] : [1, 1.75]}
                camera={{ position: [0, 0.1, 8.8], fov: 44 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                onCreated={({ gl }) => {
                  gl.domElement.addEventListener(
                    'webglcontextlost',
                    (event) => {
                      event.preventDefault();
                      setWebGLFailed(true);
                    },
                    { once: true },
                  );
                }}
              >
                <GalleryScene
                  images={images}
                  positionRef={positionRef}
                  targetRef={targetRef}
                  speed={speed}
                  zSpacing={zSpacing}
                  visibleCount={actualVisibleCount}
                  falloff={falloff}
                  isRunningRef={isRunningRef}
                  draggedRef={draggedRef}
                  onActiveChange={setActiveIndex}
                  onOpen={openImage}
                />
              </Canvas>
            </Suspense>
          </GalleryErrorBoundary>
        )}
        {!useStatic && (
          <div className="gallery-instructions">
            <span className="gallery-instructions-desktop">Scroll, drag, or use arrow keys</span>
            <span className="gallery-instructions-mobile">Swipe or tap to explore</span>
            <small>Auto-play resumes after 3 seconds</small>
            <button type="button" onClick={() => openImage(activeIndex)}>
              View current photo
            </button>
          </div>
        )}
        <span className="sr-only" aria-live="polite">
          Photo {activeIndex + 1} of {images.length}: {images[activeIndex]?.alt}
        </span>
      </section>
      {lightboxIndex !== null && (
        <GalleryLightbox
          images={images}
          index={lightboxIndex}
          onChange={setLightboxIndex}
          onClose={closeImage}
        />
      )}
    </>
  );
}
