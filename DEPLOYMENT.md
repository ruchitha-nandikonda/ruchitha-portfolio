# Deployment Guide - Ruchitha Portfolio

This guide will help you deploy your portfolio to make it shareable and accessible via a subdomain.

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from your project directory**:
   ```bash
   vercel
   ```

3. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm project settings
   - Deploy!

4. **Set up custom subdomain**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to Settings → Domains
   - Add your custom subdomain (e.g., `portfolio.yourdomain.com`)

**Or use Vercel Dashboard:**
- Push your code to GitHub
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Vercel will auto-detect Vite and deploy

### Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   npm run build
   netlify deploy --prod
   ```

3. **Or use Netlify Dashboard**:
   - Push code to GitHub
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect GitHub and select repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Deploy!

4. **Set up custom subdomain**:
   - Go to Site settings → Domain management
   - Add custom domain or subdomain

### Option 3: GitHub Pages

1. **Update vite.config.js base path** (already configured)

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages**:
   - Push your code to GitHub
   - Go to repository Settings → Pages
   - Select source: GitHub Actions
   - Or use `gh-pages` branch method

## Build Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Make sure all file paths use relative paths (already configured):
- CSS files: `CSS/` (not `../CSS/`)
- JS files: `JS/` (not `../JS/`)
- Images: `/image.png` (absolute from root)

## Custom Domain/Subdomain Setup

### For Vercel:
1. Add domain in Vercel dashboard
2. Update DNS records as instructed
3. Wait for SSL certificate (automatic)

### For Netlify:
1. Add custom domain in Netlify dashboard
2. Configure DNS records:
   - Type: CNAME
   - Name: portfolio (or your subdomain)
   - Value: your-site.netlify.app
3. SSL certificate is automatic

## Troubleshooting

### Images not loading:
- Ensure image paths start with `/` for absolute paths
- Check that images are in the root directory or `dist/` after build

### 404 errors on refresh:
- Vercel: `vercel.json` handles this automatically
- Netlify: `netlify.toml` handles this automatically

### Build errors:
- Run `npm install` to ensure dependencies are installed
- Check that all file paths are correct

## Share Your Portfolio

Once deployed, you'll get a URL like:
- Vercel: `your-portfolio.vercel.app`
- Netlify: `your-portfolio.netlify.app`
- Custom: `portfolio.yourdomain.com`

Share this URL to make your portfolio accessible worldwide!

