# Ruchitha Nandikonda - Portfolio Website

A modern, responsive portfolio website showcasing projects, experience, and skills.

## 🚀 Quick Deploy

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Or use GitHub + Vercel Dashboard**:
   - Push code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import repository
   - Auto-deploys on every push!

### Deploy to Netlify

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
   - New site from Git
   - Build: `npm run build`, Publish: `dist`

## 📝 Setup Custom Subdomain

### Vercel:
1. Dashboard → Your Project → Settings → Domains
2. Add custom domain/subdomain
3. Follow DNS instructions
4. SSL certificate is automatic

### Netlify:
1. Site Settings → Domain Management
2. Add custom domain
3. Configure DNS (CNAME record)
4. SSL certificate is automatic

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
/
├── index.html          # Main page
├── about.html          # About page
├── contact.html        # Contact page
├── designs.html        # System design page
├── project-*.html      # Individual project pages
├── CSS/                # Stylesheets
├── JS/                 # JavaScript files
└── dist/               # Build output (generated)
```

## 🌐 Share Your Portfolio

Once deployed, your portfolio will be accessible at:
- **Vercel**: `your-portfolio.vercel.app`
- **Netlify**: `your-portfolio.netlify.app`
- **Custom**: `portfolio.yourdomain.com`

## 📚 Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

---

Built with ❤️ by Ruchitha Nandikonda

