import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://www.jeehalt.in',
  integrations: [tailwind()],
  output: 'static',
});
