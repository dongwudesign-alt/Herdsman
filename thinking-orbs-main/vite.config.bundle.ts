import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build a self-contained IIFE bundle (React inlined) for use in plain HTML.
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    outDir: 'bundled',
    emptyOutDir: true,
    lib: {
      entry: 'orb-entry.jsx',
      formats: ['iife'],
      name: 'ThinkingOrbs',
      fileName: () => 'thinking-orbs.bundle.js'
    },
    rollupOptions: {
      external: () => false
    },
    sourcemap: false,
    minify: 'esbuild'
  }
});
