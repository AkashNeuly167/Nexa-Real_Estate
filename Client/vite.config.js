import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss'



export default defineConfig({
  plugins: [
    tailwindcss(),
    react()],
  });
