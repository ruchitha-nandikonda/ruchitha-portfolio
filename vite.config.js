import { defineConfig } from 'vite'

export default defineConfig({
  // Simple static site configuration
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        about: './about.html',
        contact: './contact.html',
        designs: './designs.html',
        'project-smartcart': './project-smartcart.html',
        'project-lucid-loom': './project-lucid-loom.html',
        'project-it-incidents': './project-it-incidents.html',
        'project-agile-hrms': './project-agile-hrms.html',
        'project-crave-ai': './project-crave-ai.html',
        'project-quick-mic-drop': './project-quick-mic-drop.html'
      }
    }
  },
  base: './'
})