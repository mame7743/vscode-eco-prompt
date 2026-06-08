import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: {} },
  build: {
    outDir: 'out/webview',
    rollupOptions: {
      input: path.resolve(__dirname, 'src/webview/main.tsx'),
      output: {
        // 単一ファイルにまとめる（Webview から読み込みやすくするため）
        entryFileNames: 'main.js',
        assetFileNames: 'main.css',
      },
    },
  },
});
