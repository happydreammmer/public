import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/public/gemini-js-sdk-doc/',
      build: {
        outDir: './build',
        target: 'es2022',
        rollupOptions: {
          output: {
            format: 'es'
          }
        },
        assetsInlineLimit: 0
      },
      publicDir: 'public',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
