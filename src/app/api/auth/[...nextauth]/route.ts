import { handlers } from '@/auth';

export const { GET, POST } = handlers;

// Edge-compatible — no Node.js runtime needed for Auth.js handlers
export const runtime = 'edge';
