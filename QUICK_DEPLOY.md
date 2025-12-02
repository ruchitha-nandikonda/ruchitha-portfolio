# 🚀 Quick Deploy to Vercel

## Easiest Method: Vercel Dashboard

### Step 1: Push to GitHub
```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Portfolio ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Visit: **https://vercel.com**
2. Click **"Sign Up"** → Use GitHub
3. Click **"New Project"**
4. Click **"Import Git Repository"**
5. Select your portfolio repo
6. Click **"Deploy"** (settings are auto-detected!)
7. Wait 1-2 minutes
8. **Done!** Your portfolio is live at `your-project.vercel.app`

### Step 3: Custom Subdomain (Optional)
1. Project Dashboard → **Settings** → **Domains**
2. Add domain: `portfolio.yourdomain.com`
3. Follow DNS instructions
4. SSL is automatic!

---

## Alternative: CLI Method

### First Time Setup:
```bash
# Login to Vercel
npx vercel login

# Deploy (first time - creates project)
npx vercel

# Deploy to production
npx vercel --prod
```

---

## ✅ Your Portfolio is Ready!

After deployment, share your URL:
- Default: `your-project.vercel.app`
- Custom: `portfolio.yourdomain.com`

**Automatic Updates**: Every push to GitHub = auto-deploy!

