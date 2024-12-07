/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { UserConfigExport } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'build',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ["./src/tests/setupTests.ts"],
  },
} as UserConfigExport);

// Purpose: The proxy configuration allows you to redirect API requests made to your front end to a different server, thus avoiding CORS issues.
// '/api': Specifies the path that will be intercepted. Any request starting with /api will be proxied.
// target: Indicates where to forward the request, in this case to http://127.0.0.1:5555, assumed to be your backend server.
// changeOrigin: Modifies the Origin header of the request to match the target URL, which can help prevent access issues with some APIs.
// secure: Allows proxying requests over HTTP instead of HTTPS, useful for local development.
// rewrite: Modifies the request path, e.g., /api/users becomes /users before being sent to the backend.