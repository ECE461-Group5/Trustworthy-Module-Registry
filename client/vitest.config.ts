import { defineConfig, UserConfigExport } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ["./src/tests/setupTests.ts"],
  },
} as UserConfigExport );
