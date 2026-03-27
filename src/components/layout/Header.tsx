'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, User, LogOut, ChevronDown } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';
import { SignInModal } from '@/components/auth/SignInModal';
import { SearchTrigger } from '@/components/search/SearchBar';

export const Header = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false);
  const [isSignInOpen, setIsSignInOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const itemCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
  const { data: session } = useSession();

  return (
    <>
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
              <Link href="/accessories" className="hover:text-secondary transition-colors">
                /ACCESSORIES
              </Link>
              <Link href="/tech" className="hover:text-secondary transition-colors">
                /TECH
              </Link>
            </div>

            <div className="flex items-center gap-2 border-l border-black/10 pl-6">
              {/* ── Search ─────────────────────────────────── */}
              <SearchTrigger />

              {/* ── Cart ───────────────────────────────────── */}
              <button
                onClick={toggleCart}
                id="header-cart-btn"
                className="p-2 hover:bg-black/5 rounded-full transition-colors relative"
                aria-label="Open cart"
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-1 -right-1 bg-secondary text-white text-[8px] w-4 h-4 
                               rounded-full flex items-center justify-center font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              {/* ── Auth ────────────────────────────────────── */}
              {session?.user ? (
                <div className="relative">
                  <button
                    id="header-user-menu"
                    onClick={() => setIsUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 p-2 hover:bg-black/5 rounded-full transition-colors"
                    aria-label="User menu"
                  >
                    {session.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt={session.user.name ?? 'User'}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User size={18} />
                    )}
                    <ChevronDown size={12} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        onMouseLeave={() => setIsUserMenuOpen(false)}
                        className="absolute top-full right-0 mt-2 w-48 bg-background border border-black/10 shadow-lg z-50"
                      >
                        <div className="px-4 py-3 border-b border-black/5">
                          <p className="monospace text-[9px] text-secondary font-bold">LOGGED_IN</p>
                          <p className="text-sm font-bold truncate mt-0.5">{session.user.name}</p>
                          <p className="monospace text-[8px] text-muted truncate">{session.user.email}</p>
                        </div>
                        <Link
                          href="/account/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 monospace text-[10px] hover:bg-black/5 transition-colors"
                        >
                          MY_ORDERS
                        </Link>
                        <button
                          id="header-signout"
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="w-full flex items-center gap-3 px-4 py-3 monospace text-[10px] 
                                     text-secondary hover:bg-secondary/5 transition-colors border-t border-black/5"
                        >
                          <LogOut size={12} />
                          SIGN_OUT
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  id="header-signin-btn"
                  onClick={() => setIsSignInOpen(true)}
                  className="flex items-center gap-2 monospace text-[10px] font-bold px-3 py-2 
                             border border-black/15 hover:border-primary hover:bg-primary hover:text-background 
                             transition-all duration-200"
                >
                  <User size={14} />
                  SIGN_IN
                </button>
              )}

              <button className="md:hidden p-2" aria-label="Mobile menu">
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
                  { title: 'Artifacts', code: 'A.04', items: ['Data Key', 'Neural Hub', 'Legacy Core'] },
                ].map((cat) => (
                  <div key={cat.title} className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-black/10 pb-2">
                      <h3 className="text-xl font-bold font-sans italic">{cat.title}</h3>
                      <span className="monospace text-secondary">{cat.code}</span>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {cat.items.map((item) => (
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

      {/* Sign-In Modal (rendered outside header for proper stacking) */}
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </>
  );
};
