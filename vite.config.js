import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      fastRefresh: true,
      babel: {
        plugins: [],
        // Assurez-vous que le preset est correctement configuré
        presets: [
          ['@babel/preset-react', { runtime: 'automatic' }]
        ]
      }
    })
  ],
  root: path.join(__dirname, 'src/renderer'),
  base: './',
  build: {
    outDir: path.join(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: path.join(__dirname, 'src/renderer/index.html')
    }
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src/renderer')
    }
  }
});