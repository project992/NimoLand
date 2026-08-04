// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// SSR is required: rate limiting and HTTP-only session cookies need a server.
// The previous static build had no place to put /api/auth/* at all.
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: { plugins: [tailwindcss()] },
});
