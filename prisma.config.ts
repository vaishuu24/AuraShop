import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
    // Supabase: use the session-mode URL for migrations (port 5432, no pgbouncer)
    directUrl: process.env.DIRECT_URL!,
  },
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
});
