import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace 'quest-habits' with your GitHub repo name
export default defineConfig({
  plugins: [react()],
  base: '/quest-habits/',
});
