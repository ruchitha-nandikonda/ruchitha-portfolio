import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

// Plugin to copy JS and CSS folders to dist
function copyStaticFolders() {
  return {
    name: 'copy-static-folders',
    closeBundle() {
      function copyRecursive(src, dest) {
        mkdirSync(dest, { recursive: true })
        const entries = readdirSync(src, { withFileTypes: true })
        
        for (const entry of entries) {
          const srcPath = join(src, entry.name)
          const destPath = join(dest, entry.name)
          
          if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath)
          } else {
            copyFileSync(srcPath, destPath)
          }
        }
      }
      
      // Copy JS folder
      try {
        const jsSrc = join(process.cwd(), 'JS')
        const jsDest = join(process.cwd(), 'dist', 'JS')
        copyRecursive(jsSrc, jsDest)
        console.log('✓ Copied JS folder to dist')
      } catch (error) {
        console.error('Error copying JS folder:', error)
      }
      
      // Copy CSS folder
      try {
        const cssSrc = join(process.cwd(), 'CSS')
        const cssDest = join(process.cwd(), 'dist', 'CSS')
        copyRecursive(cssSrc, cssDest)
        console.log('✓ Copied CSS folder to dist')
      } catch (error) {
        console.error('Error copying CSS folder:', error)
      }
    }
  }
}

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
  plugins: [copyStaticFolders()],
  base: './'
})