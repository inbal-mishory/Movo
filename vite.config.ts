import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pxtorem from 'postcss-pxtorem';

// Styles are written in px against the 1920px design and converted to rem, so the whole UI scales with the root font-size.
export default defineConfig({
  base: '/Movo/',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [pxtorem({ rootValue: 16, propList: ['*'], unitPrecision: 4, minPixelValue: 2, mediaQuery: false })],
    },
  },
  test: {
    environment: 'node',
  },
});
