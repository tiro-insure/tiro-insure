import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  adapter: vercel(),
  output: 'server',
  vite: { plugins: [tailwindcss()] },
});
