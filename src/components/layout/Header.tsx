'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export const Header = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false);
  const toggleCart = useCartStore((state) => state.toggleCart);

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-black/10 bg-background/80 backdrop-blur-md">
      <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Metadata HUD */}
        <div className="hidden lg:flex items-center gap-8 monospace text-[10px] text-muted">
          <div className="flex flex-col">
            <span>v.2025</span>
            <span className="text-primary font-bold">RELEASE.01</span>
          </div>
          <div className="w-[1px] h-8 bg-black/10" />
          <div className="flex flex-col">
            <span>LOC.STC</span>
            <span className="text-primary font-bold">NEURAL_SYS</span>
          </div>
        </div>

        {/* Center: LOGO */}
        <Link 
          href="/" 
          className="text-3xl font-black tracking-tighter text-primary hover:text-secondary transition-colors"
        >
          VEXO
        </Link>

        {/* Right: Navigation & Action HUD */}
        <nav className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 monospace font-bold">
            <button 
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              className="hover:text-secondary transition-colors"
            >
              /COLLECTIONS
            </button>
            <Link href="/accessories" className="hover:text-secondary transition-colors">/ACCESSORIES</Link>
            <Link href="/tech" className="hover:text-secondary transition-colors">/TECH</Link>
          </div>

          <div className="flex items-center gap-4 border-l border-black/10 pl-6">
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <Search size={18} />
            </button>
            <button 
              onClick={toggleCart}
              className="p-2 hover:bg-black/5 rounded-full transition-colors relative"
            >
              <ShoppingBag size={18} />
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>
            <button className="md:hidden p-2">
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mega Menu */}
      <AnimatePresence>
        {isMegaMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
            className="absolute top-full left-0 w-full bg-white border-b border-black/10 overflow-hidden z-40"
          >
            <div className="max-w-[1800px] mx-auto p-12 grid grid-cols-4 gap-12">
              {[
                { title: 'Neural Series', code: 'N.01', items: ['Neural Core', 'Echo Frame', 'Void Link'] },
                { title: 'Void Collection', code: 'V.02', items: ['Dark Matter', 'Singularity', 'Event Horizon'] },
                { title: 'Techwear', code: 'T.03', items: ['Pulse Jacket', 'Kinetic Vest', 'Reflex Pant'] },
                { title: 'Artifacts', code: 'A.04', items: ['Data Key', 'Neural Hub', 'Legacy Core'] }
              ].map((cat) => (
                <div key={cat.title} className="flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-black/10 pb-2">
                    <h3 className="text-xl font-bold font-sans italic">{cat.title}</h3>
                    <span className="monospace text-secondary">{cat.code}</span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {cat.items.map(item => (
                      <li key={item}>
                        <Link href="/" className="text-muted hover:text-primary transition-colors monospace text-[12px]">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
