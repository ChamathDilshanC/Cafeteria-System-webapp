import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: '0.0.0.0',
  },
});
