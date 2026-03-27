'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

// Re-usable type for product data coming from either static lib or DB
export interface ProductCardData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: string; // formatted, e.g. "$840.00"
  priceRaw: number;
  images: string[]; // colour hex or URLs
  category: string;
  categoryCode: string;
  isNew?: boolean;
}

interface ProductGridProps {
  products: ProductCardData[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleCart = useCartStore((s) => s.toggleCart);

  function quickAdd(id: string, name: string, price: number) {
    addItem({ id, name, price, quantity: 1 });
    toggleCart();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.07, duration: 0.5, ease: 'easeOut' }}
          whileHover={{ y: -8 }}
          className="bg-white/40 p-1 border border-black/5 flex flex-col gap-0 group cursor-pointer relative"
        >
          {/* New badge */}
          {item.isNew && (
            <span className="absolute top-3 left-3 z-10 bg-secondary text-white monospace text-[8px] px-2 py-0.5 font-bold">
              NEW
            </span>
          )}

          {/* Product image / colour swatch */}
          <Link
            href={`/product/${item.slug}`}
            id={`product-card-${item.id}`}
            className="block aspect-[3/4] relative overflow-hidden"
          >
            <div
              className="w-full h-full flex items-center justify-center relative transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundColor: item.images[0] ?? '#D1D5D8' }}
            >
              {/* HUD corners on hover */}
              <div className="absolute inset-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-secondary" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-secondary" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-secondary" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-secondary" />
              </div>

              {/* Category label */}
              <div className="absolute top-3 right-3 monospace text-[8px] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.categoryCode}
              </div>

              {/* Product title placeholder */}
              <span className="monospace text-[10px] text-white/50 group-hover:text-white/80 transition-colors">
                {item.title}
              </span>
            </div>
          </Link>

          {/* Card info */}
          <div className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="monospace text-[9px] text-muted italic">INDX.{item.id.slice(-2).toUpperCase()}</span>
              <span className="monospace text-[10px] font-bold text-secondary">{item.price}</span>
            </div>
            <h3 className="text-base font-bold italic tracking-tight">{item.title}</h3>
            <p className="text-[11px] text-muted leading-snug">{item.subtitle}</p>

            {/* Quick-add row */}
            <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <button
                id={`quick-add-${item.id}`}
                onClick={() => quickAdd(item.id, item.title, item.priceRaw)}
                className="flex-1 bg-primary text-background monospace text-[9px] font-bold py-2 hover:bg-secondary transition-colors"
              >
                QUICK_ADD +
              </button>
              <Link
                href={`/product/${item.slug}`}
                className="border border-black/20 monospace text-[9px] px-3 flex items-center hover:border-primary transition-colors"
              >
                →
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
