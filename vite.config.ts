import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The site is served behind the /bunny route on alexyoon.com, so every
// generated asset URL must be prefixed with /bunny. Using a base path keeps
// hashed JS/CSS imports working no matter where the project is mounted.
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/bunny/',
});
