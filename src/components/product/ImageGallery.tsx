'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  /** Array of colour strings or image URLs */
  images: string[];
  productTitle: string;
  productSlug: string;
}

function isUrl(str: string): boolean {
  return str.startsWith('http') || str.startsWith('/');
}

export function ImageGallery({ images, productTitle, productSlug }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = images[activeIndex] ?? '#1a1a1a';

  return (
    <div className="flex flex-col gap-4 h-full" ref={containerRef}>
      {/* ── Main image / colour swatch ─────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden" style={{ minHeight: '60vh' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
            // View Transition API: morphing from product card
            style={{
              ['--view-transition-name' as string]: `product-image-${productSlug}`,
            }}
          >
            {isUrl(active) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active}
                alt={productTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              /* Colour placeholder with VEXO product grid overlay */
              <div
                className="w-full h-full flex items-center justify-center relative"
                style={{ backgroundColor: active }}
              >
                {/* Corner HUD brackets */}
                <div className="absolute inset-8 pointer-events-none">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-secondary/60" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-secondary/60" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-secondary/60" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-secondary/60" />
                </div>

                {/* Centre product label */}
                <div className="flex flex-col items-center gap-3 opacity-60">
                  <div className="w-16 h-[1px] bg-white/40" />
                  <span className="monospace text-white/80 text-[11px]">
                    {productTitle}
                  </span>
                  <div className="w-16 h-[1px] bg-white/40" />
                </div>

                {/* Scanline overlay */}
                <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Slide counter */}
        <div className="absolute bottom-4 right-4 monospace text-[9px] text-white/60 pointer-events-none">
          {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </div>
      </div>

      {/* ── Thumbnail strip ────────────────────────────────────────────── */}
      <div className="flex gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            id={`gallery-thumb-${i}`}
            onClick={() => setActiveIndex(i)}
            className={`relative flex-1 aspect-square overflow-hidden transition-all duration-300
              ${i === activeIndex
                ? 'ring-2 ring-secondary ring-offset-1 ring-offset-background'
                : 'opacity-50 hover:opacity-80'
              }`}
            aria-label={`View image ${i + 1}`}
          >
            {isUrl(img) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ backgroundColor: img }} />
            )}
            {i === activeIndex && (
              <motion.div
                layoutId="thumb-indicator"
                className="absolute inset-0 ring-inset ring-2 ring-secondary"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
