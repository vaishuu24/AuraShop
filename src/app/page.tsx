import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/hero/HeroSection';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getAllProducts } from '@/lib/products'; // static fallback — swap for db.product.findMany() after prisma migrate

// Dynamically import R3F canvas — must be ssr:false for WebGL
const ProductViewer = dynamic(
  () => import('@/components/3d/ProductViewer').then((m) => m.ProductViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[70vh] my-4 border-t border-b border-black/10 flex items-center justify-center">
        <span className="monospace text-muted text-[11px] animate-pulse">LOADING_3D.VIEWER...</span>
      </div>
    ),
  }
);

// ── Async data fetching ─────────────────────────────────────────────────────
// Currently reads from static lib. Once .env.local + prisma migrate are done,
// swap getAllProducts() with:  await db.product.findMany({ orderBy: { createdAt: 'desc' } })
async function getProducts() {
  return getAllProducts();
}

// Convert static Product → ProductCardData shape expected by ProductGrid
function toCardData(p: ReturnType<typeof getAllProducts>[number]) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    price: p.price,
    priceRaw: p.priceRaw,
    images: p.images,
    category: p.category,
    categoryCode: p.categoryCode,
    isNew: p.isNew,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Page — Server Component (PPR: static shell streams instantly, products async)
// experimental.ppr = true in next.config.ts enables this
// ─────────────────────────────────────────────────────────────────────────────
export default async function Home() {
  const rawProducts = await getProducts();
  const products = rawProducts.map(toCardData);

  return (
    <div className="pt-24 pb-24 px-6 max-w-[1800px] mx-auto min-h-screen flex flex-col gap-16">

      {/* ── Phase 3.1: GSAP Hero ──────────────────────────────────────── */}
      <HeroSection />

      {/* ── Phase 3.2: R3F 3D Showcase ───────────────────────────────── */}
      <ProductViewer />

      {/* ── Phase 4.3: Dynamic Product Catalog (PPR Suspense boundary) ── */}
      <section className="border-t border-black/10 pt-16">
        <div className="flex justify-between items-end mb-12">
          <div className="flex flex-col gap-2">
            <span className="monospace text-secondary">PROJECT.ECHO</span>
            <h2 className="text-4xl font-black italic">NEURAL SERIES</h2>
          </div>
          <span className="monospace font-bold text-muted text-[11px]">
            [{String(products.length).padStart(2, '0')} PRODUCTS AVAILABLE]
          </span>
        </div>

        {/* Suspense boundary — static shell above, streamed grid below (PPR) */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-black/5 animate-pulse aspect-[3/4]" />
              ))}
            </div>
          }
        >
          <ProductGrid products={products} />
        </Suspense>
      </section>

      {/* ── Footer Tagline ────────────────────────────────────────────── */}
      <div className="border-t border-black/10 pt-12 flex justify-between items-center monospace text-[10px] text-muted">
        <span>VEXO © 2025</span>
        <span className="text-secondary font-bold">NEURAL_SYS.ONLINE</span>
        <span>v.2025.WINTER</span>
      </div>

    </div>
  );
}
