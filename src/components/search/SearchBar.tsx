'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InstantSearch, SearchBox, Hits, useInstantSearch } from 'react-instantsearch';
import { searchClient, INDEX_NAME } from '@/lib/algolia';
import { Search, X } from 'lucide-react';
import Link from 'next/link';

// ── Individual hit ──────────────────────────────────────────────────────
function Hit({ hit }: { hit: any }) {
  return (
    <Link
      href={`/product/${hit.slug}`}
      className="flex items-center justify-between gap-4 px-4 py-3 border-b border-black/5 
                 hover:bg-black/3 transition-colors group"
    >
      <div className="flex flex-col gap-0.5">
        <span className="font-bold italic text-sm group-hover:text-secondary transition-colors">
          {hit.title}
        </span>
        <span className="monospace text-[9px] text-muted">{hit.subtitle}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {hit.isNew && (
          <span className="bg-secondary text-white monospace text-[8px] px-1.5 py-0.5 font-bold">
            NEW
          </span>
        )}
        <span className="monospace text-[10px] font-bold text-secondary">
          ${hit.price?.toFixed(2)}
        </span>
        <span className="text-muted text-xs group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
}

// ── Empty state ─────────────────────────────────────────────────────────
function EmptyState() {
  const { results } = useInstantSearch();
  if (!results.query || results.nbHits > 0) return null;
  return (
    <div className="px-4 py-6 text-center">
      <p className="monospace text-[10px] text-muted">NO_RESULTS FOR "{results.query}"</p>
    </div>
  );
}

// ── Loading skeleton ────────────────────────────────────────────────────
function SearchSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between animate-pulse">
          <div className="h-4 bg-black/10 w-1/3 rounded" />
          <div className="h-4 bg-black/10 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

// ── Public API ──────────────────────────────────────────────────────────
export function SearchTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        id="header-search-trigger"
        onClick={() => setOpen(true)}
        className="p-2 hover:bg-black/5 rounded-full transition-colors"
        aria-label="Open search"
      >
        <Search size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="search-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
            />

            {/* Search panel */}
            <motion.div
              key="search-panel"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-16 left-0 right-0 z-[101] bg-background border-b border-black/10 shadow-xl"
            >
              <div className="max-w-[800px] mx-auto">
                <InstantSearch
                  searchClient={searchClient}
                  indexName={INDEX_NAME}
                  future={{ preserveSharedStateOnUnmount: true }}
                >
                  {/* Search input */}
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-black/10">
                    <Search size={16} className="text-muted shrink-0" />
                    <SearchBox
                      placeholder="SEARCH NEURAL SERIES..."
                      classNames={{
                        root: 'flex-1',
                        form: 'flex-1',
                        input: 'w-full bg-transparent monospace text-[13px] font-bold outline-none placeholder:text-muted/50 placeholder:font-normal uppercase',
                        reset: 'hidden',
                        submit: 'hidden',
                        loadingIcon: 'hidden',
                      }}
                      autoFocus
                    />
                    <button
                      onClick={() => setOpen(false)}
                      className="p-1 hover:bg-black/5 transition-colors"
                      aria-label="Close search"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Results */}
                  <div className="max-h-[60vh] overflow-y-auto" onClick={() => setOpen(false)}>
                    <EmptyState />
                    <Hits
                      hitComponent={Hit}
                      classNames={{ root: 'flex flex-col', list: 'flex flex-col', item: '' }}
                    />
                  </div>

                  {/* Footer hint */}
                  <div className="flex items-center justify-between px-6 py-2 border-t border-black/5 monospace text-[8px] text-muted">
                    <span>POWERED BY ALGOLIA</span>
                    <span>↑↓ NAVIGATE · ENTER SELECT · ESC CLOSE</span>
                  </div>
                </InstantSearch>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
