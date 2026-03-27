/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck — db types generated lazily after `npx prisma generate`
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminClient, INDEX_NAME } from '@/lib/algolia';

// POST /api/algolia/sync
// Secured with CRON_SECRET header — call via Vercel Cron or curl
export async function POST(request: Request) {
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await db.product.findMany({ where: { inStock: true } });

    const records = products.map((p) => ({
      objectID: p.id,
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      price: Number(p.price),
      category: p.category,
      categoryCode: p.categoryCode,
      isNew: p.isNew,
    }));

    const client = getAdminClient();
    await client.saveObjects({ indexName: INDEX_NAME, objects: records });

    return NextResponse.json({ synced: records.length });
  } catch (error) {
    console.error('[POST /api/algolia/sync]', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
