// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// SSR is required: rate limiting and HTTP-only session cookies need a server.
// Vercel deployment uses the @astrojs/vercel adapter.
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: { plugins: [tailwindcss()] },
});
