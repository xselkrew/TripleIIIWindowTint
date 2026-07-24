import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server',
  integrations: [react()],
  adapter: cloudflare({
    imageService: 'compile'
  }),
  vite: {
    ssr: {
      external: ['node:async_hooks']
    }
  }
});
