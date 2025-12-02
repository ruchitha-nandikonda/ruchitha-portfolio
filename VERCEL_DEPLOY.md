# Deploy to Vercel - Quick Guide

## Method 1: Using Vercel Dashboard (Easiest - Recommended)

### Step 1: Push to GitHub (if not already done)
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Portfolio ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Click **"Import Git Repository"**
5. Select your portfolio repository
6. Vercel will auto-detect:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Click **"Deploy"**
8. Wait 1-2 minutes for deployment
9. Your portfolio will be live at: `your-portfolio.vercel.app`

### Step 3: Set Custom Subdomain
1. Go to your project dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain/subdomain
4. Follow DNS instructions
5. SSL certificate is automatic!

---

## Method 2: Using Vercel CLI (Alternative)

### Option A: Using npx (No Installation)
```bash
# Build first
npm run build

# Deploy
npx vercel --prod
```

### Option B: Using the deploy script
```bash
./deploy.sh
```

### First Time Setup:
1. Run `npx vercel` (without --prod for first time)
2. Login to Vercel when prompted
3. Follow the setup questions
4. Then run `npx vercel --prod` for production

---

## Your Portfolio URL

After deployment, your portfolio will be available at:
- **Default**: `your-project-name.vercel.app`
- **Custom**: `portfolio.yourdomain.com` (after domain setup)

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch = automatic deployment
- Preview deployments for pull requests
- Zero configuration needed!

---

## Troubleshooting

### Build Errors:
- Make sure all dependencies are installed: `npm install`
- Check that all file paths are correct
- Verify `vite.config.js` is properly configured

### 404 Errors:
- The `vercel.json` file handles routing automatically
- All routes redirect to `index.html` for SPA behavior

### Images Not Loading:
- Ensure image paths start with `/` for absolute paths
- Check that images are in the root directory

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Support: https://vercel.com/support

