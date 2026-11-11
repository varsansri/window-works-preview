import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: { input: { main: 'index.html', estimate: 'estimate.html', admin: 'admin.html', blinds: 'blinds.html', login: 'login.html', account: 'account.html', curtains: 'curtains.html', motorisation: 'motorisation.html', skylights: 'skylights.html' } },
  },
});
