'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/products';
import { ImageGallery } from '@/components/product/ImageGallery';
import { RiveButton } from '@/components/ui/RiveButton';
import { useCartStore } from '@/store/cartStore';

interface PDPClientProps {
  product: Product;
}

export function PDPClient({ product }: PDPClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] ?? '');
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toggleCart = useCartStore((s) => s.toggleCart);

  function handleAddToCart() {
    addItem({ id: product.id, name: product.title, price: product.priceRaw, quantity: qty });
    setAddedFeedback(true);
    toggleCart();
    setTimeout(() => setAddedFeedback(false), 2000);
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center gap-3 monospace text-[10px] text-muted border-b border-black/10">
        <Link href="/" className="hover:text-secondary transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-secondary">{product.categoryCode}</span>
        <span>/</span>
        <span className="text-primary">{product.title}</span>
        {product.isNew && (
          <span className="ml-auto bg-secondary text-white px-2 py-0.5 text-[8px] font-bold">
            NEW_ARRIVAL
          </span>
        )}
      </div>

      {/* Main grid */}
      <div className="max-w-[1800px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-0 min-h-[85vh]">
        {/* ── Left: Image Gallery (7 cols) ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="lg:col-span-7 border-r border-black/10 p-6"
        >
          <ImageGallery
            images={product.images}
            productTitle={product.title}
            productSlug={product.slug}
          />
        </motion.div>

        {/* ── Right: Info Panel (5 cols, sticky) ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="lg:col-span-5 lg:sticky lg:top-20 lg:self-start p-8 flex flex-col gap-8"
        >
          {/* Category tag */}
          <div className="flex items-center gap-4">
            <span className="monospace text-secondary font-bold text-[10px]">
              {product.categoryCode}
            </span>
            <div className="flex-1 h-[1px] bg-black/10" />
            <span className="monospace text-muted text-[9px]">{product.version}</span>
          </div>

          {/* Title block */}
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-black italic tracking-tighter leading-[0.9]">
              {product.title}
            </h1>
            <p className="text-muted text-sm monospace">{product.subtitle}</p>
          </div>

          {/* Price */}
          <div className="flex items-end gap-4 pb-6 border-b border-black/10">
            <span className="text-4xl font-black italic text-primary">{product.price}</span>
            <span className="monospace text-[9px] text-muted mb-1">EXCL. TAX</span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted leading-relaxed">{product.description}</p>

          {/* Size selector */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="monospace text-[10px] font-bold">SELECT_SIZE</span>
              <button className="monospace text-[9px] text-secondary hover:underline">
                SIZE_GUIDE →
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  id={`size-${size}`}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 monospace text-[10px] font-bold border transition-all duration-150
                    ${selectedSize === size
                      ? 'bg-primary text-background border-primary'
                      : 'border-black/20 text-muted hover:border-primary hover:text-primary'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity stepper */}
          <div className="flex items-center gap-4">
            <span className="monospace text-[10px] font-bold">QTY</span>
            <div className="flex items-center border border-black/20">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-2 monospace text-sm hover:bg-black/5 transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-4 py-2 monospace text-sm font-bold min-w-[2rem] text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-4 py-2 monospace text-sm hover:bg-black/5 transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA row */}
          <div className="flex flex-col gap-3 pt-2">
            <RiveButton
              id="pdp-add-to-cart"
              label={addedFeedback ? 'ADDED ✓' : 'ADD_TO_CART'}
              variant="primary"
              className={`w-full justify-center ${addedFeedback ? '!bg-secondary' : ''}`}
              onClick={handleAddToCart}
            />
            <RiveButton
              id="pdp-wishlist"
              label="SAVE_TO_WISHLIST"
              variant="ghost"
              className="w-full justify-center"
            />
          </div>

          {/* Product details accordion */}
          <div className="border-t border-black/10 pt-6">
            <p className="monospace text-[10px] font-bold mb-4">TECH_DETAILS</p>
            <ul className="flex flex-col gap-2">
              {product.details.map((detail) => (
                <li key={detail} className="flex items-start gap-3 text-sm text-muted">
                  <span className="text-secondary mt-1 text-[10px]">▸</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          {/* Trust HUD */}
          <div className="grid grid-cols-3 gap-3 border-t border-black/10 pt-6">
            {[
              { code: 'AUTH', label: 'VERIFIED' },
              { code: 'SHIP', label: '48H DELIVERY' },
              { code: 'RTN', label: '30D RETURN' },
            ].map((badge) => (
              <div key={badge.code} className="flex flex-col gap-1 p-3 border border-black/10 items-center text-center">
                <span className="monospace text-secondary font-bold text-[9px]">{badge.code}</span>
                <span className="monospace text-[8px] text-muted">{badge.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
