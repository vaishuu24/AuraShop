# NETLIFY_PRODUCTS_BUILD_FIX_REPORT

**Project:** AuraShop / VEXO
**Phase:** Netlify Build Fix — Next.js 16 Empty generateStaticParams
**Date:** Fri Nov 06 2026

---

## 1. Why the Empty-Array Implementation Failed

Next.js 16 with Cache Components (`cacheComponents: true` in `next.config.ts`) requires every `generateStaticParams()` function to return **at least one result**. Returning an empty array `[]` triggers:

```text
Error: When using Cache Components, all generateStaticParams functions must return at least one result.
Failed to collect page data for /collections/[category]
```

### Previous Code (Broken)

Both `generateStaticParams()` functions returned `[]` when `DATABASE_URL`/`DIRECT_URL` were unavailable:

```typescript
// src/app/collections/[category]/page.tsx:8-18
export async function generateStaticParams() {
  if (!process.env.DATABASE_URL && !process.env.DIRECT_URL) {
    return [];  // ❌ Violates Next.js 16 Cache Components requirement
  }
  const categories = await getCategories();
  return categories.map((category) => ({ category }));
}
```

```typescript
// src/app/product/[id]/page.tsx:8-18
export async function generateStaticParams() {
  if (!process.env.DATABASE_URL && !process.env.DIRECT_URL) {
    return [];  // ❌ Violates Next.js 16 Cache Components requirement
  }
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ id: slug }));
}
```

Additionally, `generateMetadata()` in the product page called `getProductBySlug(id)` unconditionally, which queries PostgreSQL at build time. Without a database connection, this also threw during page-data collection.

---

## 2. Static Data Source

The fix reuses the **canonical seed data** from `prisma/seed-data.ts` — the same file used by `prisma/seed.ts` to populate the database. This is the existing static data source referenced in the requirements; no duplicate catalogue was created.

### 8 Products with Stock > 0 (from `SEED_PRODUCTS`)

| # | Slug | Title | Category | Stock |
|---|------|-------|----------|-------|
| 1 | core-shell | CORE_SHELL | OUTERWEAR | 12, 20, 25, 25, 14, 6 |
| 2 | neural-unit | NEURAL_UNIT | TECH | 30, 11 |
| 3 | void-frame | VOID_FRAME | ACCESSORY | 40 |
| 4 | pulse-vest | PULSE_VEST | GEAR | 8, 15, 18, 18, 9 |
| 5 | echo-frame | ECHO_FRAME | OUTERWEAR | 10, 16, 22, 22, 12, 5 |
| 6 | singularity-bag | SINGULARITY | ACCESSORY | 35 |
| 7 | kinetic-vest | KINETIC_VEST | GEAR | 7, 13, 20, 20, 10 |
| 8 | legacy-core | LEGACY_CORE | ARTIFACT | 3 |

Products 9–21 in `SEED_PRODUCTS` use `zeroStockVariants()` (stock = 0) or have `inStock: false`. They are not statically generated; they render at request time when the database is available.

### 5 Distinct Collection Categories

| Category | Category Code |
|----------|--------------|
| OUTERWEAR | N.01 |
| TECH | T.02 |
| ACCESSORY | A.03 |
| GEAR | G.04 |
| ARTIFACT | A.08 |

---

## 3. Files Modified

| File | Change |
|------|--------|
| `src/app/product/[id]/page.tsx` | Imported `SEED_PRODUCTS` from `prisma/seed-data.ts`. `generateStaticParams()` returns 8 product slugs with stock > 0 when no DB credentials; otherwise queries the DB as before. `generateMetadata()` tries the DB first, falls back to seed data when unavailable. |
| `src/app/collections/[category]/page.tsx` | Imported `SEED_PRODUCTS` from `prisma/seed-data.ts`. `generateStaticParams()` returns 5 distinct categories when no DB credentials; otherwise queries the DB as before. |

No changes to `src/lib/db.ts`, `src/lib/products.ts`, `src/auth.ts`, `prisma/schema.prisma`, or `prisma.config.ts`.

---

## 4. Database Query Behavior During generateStaticParams()

| Scenario | DATABASE_URL/DIRECT_URL | DB Query in generateStaticParams()? | Source |
|----------|------------------------|-------------------------------------|--------|
| Build without credentials | Not set | **NO** | Static data from `prisma/seed-data.ts` |
| Build with credentials | Set | **YES** | `getAllProductSlugs()` / `getCategories()` → `db.product.findMany()` |
| Runtime | Set (at request time) | **YES** | `getProductBySlug()`, `getCategories()` — same as before |

When credentials are absent, **no PostgreSQL query occurs** during `generateStaticParams()`. The static data from `prisma/seed-data.ts` is used instead.

---

## 5. Build Results

### Scenario A: Build Without DATABASE_URL/DIRECT_URL

```bash
rm -rf .next
unset DATABASE_URL
unset DIRECT_URL
npm run build
```

| Check | Result |
|-------|--------|
| Next.js compilation | PASS |
| TypeScript type-checking | PASS |
| Page-data collection | PASS |
| Static collection routes | 5 generated (ACCESSORY, ARTIFACT, GEAR, OUTERWEAR, TECH) |
| Static product routes | 8 generated (core-shell, neural-unit, void-frame, pulse-vest, echo-frame, singularity-bag, kinetic-vest, legacy-core) |
| Build exit code | 0 |

### Scenario B: Build With Test Database Credentials

```bash
DATABASE_URL="postgresql://sarthak@localhost:5432/aurashop_checkout_test_cba2a23f"
DIRECT_URL="postgresql://sarthak@localhost:5432/aurashop_checkout_test_cba2a23f"
npm run build
```

| Check | Result |
|-------|--------|
| Next.js compilation | PASS |
| TypeScript type-checking | PASS |
| Page-data collection | PASS |
| Static collection routes | 5 generated (from DB) |
| Static product routes | 21 generated (from DB) |
| Build exit code | 0 |

---

## 6. Regression Test Results

| Check | Result | Details |
|-------|--------|---------|
| `npx tsc --noEmit` | PASS | 0 type errors |
| `npm run lint` | PASS | 0 errors, 18 pre-existing warnings |
| `npm test` | PASS | 86/86 unit tests pass |
| `npm run build` (no DB) | PASS | Credential-free build succeeds |
| `npm run build` (with DB) | PASS | All static routes generated from DB |
| `npm audit --omit=dev` | PASS | 0 vulnerabilities |
| Playwright E2E suite | PASS | 42/42 tests pass |
| `npx prisma validate` | PASS | Schema valid |
| `npx prisma generate` | PASS | Client generated |
| `npx prisma migrate status` | PASS | Schema up to date |

---

## 7. Runtime Database Behavior Verification

Against the isolated test database, all runtime behavior was verified through Playwright E2E tests:

| Test | Result |
|------|--------|
| Catalogue browsing (collections page) | PASS |
| Product detail pages (PDP) | PASS |
| Brand 404 for unknown product | PASS |
| Brand 404 for unknown collection | PASS |
| Category filtering | PASS |
| Paginated product listing | PASS |
| Wishlist link in header | PASS |
| Cart functionality | PASS |
| Security headers | PASS |

Unknown slugs (e.g., `/product/nonexistent`, `/collections/nonexistent`) correctly return 404 via `notFound()` in `ProductContent` and `CollectionView`.

---

## 8. Preservation of Full-Stack Functionality

| Requirement | Status |
|-------------|--------|
| Cache Components enabled | ✅ Preserved (`cacheComponents: true`, `partialPrefetching: true`) |
| Prisma 7 + PostgreSQL | ✅ Preserved — no ORM changes |
| Auth.js + PrismaAdapter | ✅ Preserved — no auth changes |
| Runtime database queries | ✅ Preserved — `getProducts()`, `getProductBySlug()`, `getCategories()` still query the DB when credentials are available |
| Product metadata & SEO | ✅ Preserved — `generateMetadata()` uses DB when available, seed data as fallback |
| Collection rendering | ✅ Preserved — `CatalogueContent` unchanged |
| Out-of-stock product pages | ✅ Render at request time when DB is available |
| Database availability guard | ✅ Preserved — runtime operations still check `DATABASE_URL`/`DIRECT_URL` |

---

## 9. Local vs Netlify Verification Distinction

| Verification Type | Status | Scope |
|-------------------|--------|-------|
| **Local build without DATABASE_URL** | VERIFIED | Build succeeds; `generateStaticParams()` returns 8 products + 5 categories from seed data; no DB queries during build |
| **Local build with test DATABASE_URL** | VERIFIED | Build succeeds; all static routes generated from DB |
| **Local runtime with test DATABASE_URL** | VERIFIED | 42/42 Playwright tests pass; all E2E journeys work |
| **Actual Netlify deployment** | NOT VERIFIED | Requires Netlify account, database provisioning, and environment variable configuration |

---

## Summary

The empty-array implementation failed because Next.js 16 Cache Components requires `generateStaticParams()` to return at least one result. The fix reuses the canonical seed data from `prisma/seed-data.ts` to provide non-empty static parameters when database credentials are unavailable, while preserving all database-backed runtime behavior when credentials are present.

**Working tree state:** Changes to `src/app/product/[id]/page.tsx` and `src/app/collections/[category]/page.tsx` remain uncommitted/untracked. `.env.local` was not modified. No commits or pushes occurred.
