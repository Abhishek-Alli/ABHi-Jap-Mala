<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ABHi Jap Mala

A React + TypeScript app built with Vite and Tailwind CSS. Includes Gemini API integration for AI-powered features.

## 🌐 Live App

**View online:** https://abhishek-alli.github.io/ABHi-Jap-Mala/

## 🚀 Quick Start – Run Locally

### Prerequisites
- **Node.js** (v16+)
- **npm** or **yarn**

### Steps

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Abhishek-Alli/ABHi-Jap-Mala.git
   cd ABHi-Jap-Mala
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env.local` file in the root directory
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and go to `http://localhost:3000`

## 🏗️ Build for Production

### Build the app:
```bash
npm run build:docs
```

This generates a production build in the `docs/` folder, optimized for GitHub Pages.

### Preview the production build locally:
```bash
npm run preview
```

## 📦 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server on `http://localhost:3000` |
| `npm run build` | Build to `dist/` folder for production |
| `npm run build:docs` | Build to `docs/` folder for GitHub Pages deployment |
| `npm run preview` | Preview production build locally |
| `npm run deploy:gh-pages` | Publish to GitHub Pages using `gh-pages` branch |

## 🎨 Tech Stack

- **React** 19.2.1
- **TypeScript** 5.8.2
- **Vite** 6.4.1 (Fast build tool)
- **Tailwind CSS** (via CDN)
- **Lucide React** (Icons)
- **Gemini API** (AI features)

## 📂 Project Structure

```
├── components/          # React components
│   ├── CircularProgress.tsx
│   ├── FloatingText.tsx
├── utils/              # Utility functions
│   └── storage.ts
├── App.tsx             # Main app component
├── index.tsx           # Entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies & scripts
```

## 🔧 Configuration

### Vite Config (`vite.config.ts`)
- **Development base:** `/`
- **Production base:** `/ABHi-Jap-Mala/` (for GitHub Pages)
- **Dev server port:** `3000`

### Fonts
- Tiro Devanagari Hindi (for Devanagari text)
- Playfair Display (for decorative text)
- Inter (for body text)

## 🚀 Deployment – GitHub Pages

The app is automatically deployed to GitHub Pages from the `docs/` folder on the `main` branch.

**How it works:**
1. Run `npm run build:docs` to generate production files in `docs/`
2. Push to GitHub: `git push origin main`
3. The app is live at: https://abhishek-alli.github.io/ABHi-Jap-Mala/

**Manual setup (if needed):**
1. Go to **Repository Settings** → **Pages**
2. Select **Deploy from a branch**
3. Choose `main` branch and `/docs` folder
4. Save and wait 1–2 minutes for deployment

## 🛠️ Development Tips

- **Hot Module Reload (HMR):** Changes auto-refresh in dev mode
- **Environment Variables:** Use `process.env.GEMINI_API_KEY` in code
- **Responsive Design:** App is mobile-first with Tailwind utilities
- **Dark Mode:** Built-in dark theme (zinc-900 background)

## 📝 Notes

- The app uses custom Devanagari fonts for authentic Indian text rendering
- API calls use Gemini API for AI-powered features
- All assets are optimized for fast loading on GitHub Pages

## 📄 License

Created by Abhishek-Alli

---

For issues or questions, check the [GitHub Issues](https://github.com/Abhishek-Alli/ABHi-Jap-Mala/issues) page.
