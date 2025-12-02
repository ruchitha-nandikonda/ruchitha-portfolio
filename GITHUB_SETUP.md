# GitHub Setup & Vercel Deployment

## ✅ Step 1: Git is Ready!
Your local git repository is initialized and committed.

## 📦 Step 2: Create GitHub Repository

1. Go to **https://github.com/new**
2. Repository name: `ruchitha-portfolio` (or any name you prefer)
3. Description: "Portfolio website - Ruchitha Nandikonda"
4. Choose: **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

## 🚀 Step 3: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ruchitha-portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Or if you prefer SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/ruchitha-portfolio.git
git branch -M main
git push -u origin main
```

## 🌐 Step 4: Deploy to Vercel

1. Go to **https://vercel.com**
2. Sign up/Login with **GitHub**
3. Click **"New Project"**
4. Click **"Import Git Repository"**
5. Select your `ruchitha-portfolio` repository
6. Vercel will auto-detect:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Click **"Deploy"**
8. Wait 1-2 minutes
9. **Done!** Your portfolio is live! 🎉

## 🔗 Step 5: Get Your Portfolio URL

After deployment:
- Default URL: `ruchitha-portfolio.vercel.app` (or similar)
- You can add a custom domain in Vercel Settings → Domains

## 📝 Quick Commands Reference

```bash
# Check git status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# After first push, Vercel will auto-deploy on every push!
```

---

**Need help?** Check `QUICK_DEPLOY.md` for more details.

