import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  adapter: vercel(),
  integrations: [react()],
  output: 'server',
  vite: { plugins: [tailwindcss()] },
});
