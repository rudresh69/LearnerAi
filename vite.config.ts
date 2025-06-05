import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Allow external access for Docker
      port: 3000,      // Must match Dockerfile and docker-compose
      strictPort: true,
      open: false,     // ✅ Prevent xdg-open error inside Docker
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL ,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    optimizeDeps: {
      include: ['mermaid'],
    },
  };
});
