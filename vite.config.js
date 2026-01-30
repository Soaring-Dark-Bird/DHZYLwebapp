import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Ensure JSON files are handled correctly
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name;
          if (name && name.endsWith('.json')) {
            return 'assets/data/[name][extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  // Enable JSON import support
  assetsInclude: ['**/*.json'],
  optimizeDeps: {
    include: []
  }
});
