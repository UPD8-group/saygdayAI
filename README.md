# Say G'day — Marketing Website

Marketing website for [saygday.ai](https://saygday.ai) — the unified customer-messaging and reputation hub for Australian small businesses.

## Local setup

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

## Stack

- React 18 + Vite 5
- Tailwind CSS 3
- Lucide React (icons)
- React Router v6 (for `/thanks` page)
- Netlify Forms (waitlist capture)

## Project structure

```
src/
  components/
    Nav.jsx         # Sticky nav with CTA
    Hero.jsx        # Hero + inbox preview mockup
    Problem.jsx     # Three-card problem statement
    HowItWorks.jsx  # Three-step explainer
    Features.jsx    # Six feature cards
    Pricing.jsx     # Single pricing card
    FAQ.jsx         # Accordion FAQ
    Waitlist.jsx    # Email capture form (Netlify Form)
    Footer.jsx      # Links + inline signup
  pages/
    Thanks.jsx      # Post-submit thank-you page
  App.jsx
  main.jsx
  index.css
```

## Netlify deployment

1. Push to GitHub (main branch is auto-deployed via Netlify)
2. In Netlify dashboard → **Site settings → Forms** — forms will appear automatically after first deploy
3. Set up email notifications in Netlify for new form submissions

Build command: `npm run build`  
Publish directory: `dist`

The `netlify.toml` at the root handles this automatically.

## Colour palette

| Token     | Hex       | Use                  |
|-----------|-----------|----------------------|
| Teal      | `#0B6E78` | Primary, CTAs        |
| Cream     | `#FFF8EE` | Background           |
| Charcoal  | `#1A1A1A` | Body text            |
| Sunset    | `#F6A86B` | Accent, highlights   |

## To-do before launch

- [ ] Replace inbox preview mockup with real product screenshot
- [ ] Add real OG image at `public/og-image.png`
- [ ] Wire up About / Privacy / Terms / Contact pages
- [ ] Set up Netlify form notifications → Slack / email
- [ ] Add Google Analytics or Plausible
