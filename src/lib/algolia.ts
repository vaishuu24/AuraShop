import { algoliasearch } from 'algoliasearch';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!;
const adminKey = process.env.ALGOLIA_ADMIN_KEY!;

/**
 * Public search client — safe to use in client components.
 * Only has read access (Search-Only API Key).
 */
export const searchClient = algoliasearch(appId, searchKey);

/**
 * Admin client — SERVER SIDE ONLY.
 * Used only in API routes for indexing / syncing products.
 */
export function getAdminClient() {
  return algoliasearch(appId, adminKey);
}

export const INDEX_NAME = process.env.ALGOLIA_INDEX_NAME ?? 'vexo_products';
