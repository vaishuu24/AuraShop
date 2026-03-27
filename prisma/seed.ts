import { PrismaClient } from '@prisma/client';
import { PRODUCTS } from '../src/lib/products';

// Prisma v7: must pass URL explicitly to constructor
const db = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL! },
  },
});

async function main() {
  console.log('🌱 Seeding VEXO products into the database…');

  await db.product.deleteMany();

  for (const p of PRODUCTS) {
    await db.product.create({
      data: {
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        price: p.priceRaw,
        category: p.category,
        categoryCode: p.categoryCode,
        description: p.description,
        details: p.details,
        sizes: p.sizes,
        images: p.images,
        version: p.version,
        isNew: p.isNew ?? false,
        inStock: true,
      },
    });
    console.log(`  ✓ ${p.title}`);
  }

  console.log(`\n✅ Seeded ${PRODUCTS.length} products successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
