import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductById, getAllProducts } from '@/lib/products';
import { PDPClient } from './PDPClient';

// ── Static params for build-time generation ───────────────────────────
export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.slug }));
}

// ── SEO metadata ──────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: 'Not Found | VEXO' };
  return {
    title: `${product.title} — ${product.subtitle} | VEXO`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.subtitle,
    },
  };
}

// ── Page (Server Component) ───────────────────────────────────────────
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return <PDPClient product={product} />;
}
