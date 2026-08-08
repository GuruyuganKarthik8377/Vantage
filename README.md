# Vantage — Portfolio Intelligence Platform

> AI-powered portfolio analysis and narrative reporting for Indian mutual fund investors.

Vantage analyses a mutual fund portfolio across allocation, concentration, overlap, benchmark fit, and risk — then generates a personalised written narrative using Claude (Anthropic). The full report can be exported as a print-ready PDF.

---

## ✨ Features

- **Portfolio Analysis Engine** — allocation breakdown, fund overlap detection, concentration scoring, benchmark alignment, and health scoring
- **AI Narrative** — streaming, plain-English portfolio commentary powered by Claude claude-sonnet-4-5 with adaptive thinking
- **PDF Export** — pixel-perfect A4 report rendered by Puppeteer from the live report page
- **Demo Portfolios** — three built-in mock investor profiles (Aarav, Meera, Rohan) to explore immediately, no upload needed
- **Dark-mode UI** — glassmorphism design with Framer Motion animations and a full-bleed video hero

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, Framer Motion |
| AI | [Anthropic Claude](https://www.anthropic.com/) via `@anthropic-ai/sdk` |
| PDF | [Puppeteer](https://pptr.dev/) (headless Chromium) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.17
- **npm** ≥ 9
- An **Anthropic API key** — [get one here](https://console.anthropic.com/)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/vantage.git
cd vantage

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Then open .env and paste your Anthropic API key

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The AI narrative and PDF export require a valid `ANTHROPIC_API_KEY`. The portfolio analysis engine and all charts work without it.

---

## 📁 Project Structure

```
vantage/
├── app/                        # Next.js App Router
│   ├── api/                    # Backend API routes
│   │   ├── analyze/route.ts    # Portfolio analysis endpoint
│   │   ├── narrate/route.ts    # AI narrative streaming (Claude)
│   │   └── report/route.ts     # PDF generation via Puppeteer
│   ├── connect/                # Portfolio connection page
│   ├── dashboard/              # Main dashboard page
│   ├── report/                 # Printable report page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Landing page
│
├── components/                 # React components
│   ├── connect/                # Portfolio connection UI
│   ├── dashboard/              # Dashboard widgets & charts
│   ├── landing/                # Landing page sections
│   ├── report/                 # Report page sections
│   └── ui/                     # Primitives (Button, Badge, GlassPanel)
│
├── data/
│   └── mock/                   # Built-in demo portfolios & instruments
│       ├── portfolios.ts
│       ├── instruments.ts
│       └── fund-holdings.ts
│
├── docs/
│   └── METHODOLOGY.md          # Scoring & analytics methodology
│
├── lib/
│   ├── ai/                     # Anthropic prompt engineering
│   │   └── narrative-prompt.ts
│   └── analytics/              # Pure portfolio analysis functions
│       ├── allocation.ts
│       ├── benchmark.ts
│       ├── concentration.ts
│       ├── findings.ts
│       ├── health-score.ts
│       ├── overlap.ts
│       └── ...
│
├── public/
│   ├── vantage-logo.png
│   └── videos/
│       └── hero.mp4            # Landing page hero video
│
├── types/                      # Shared TypeScript types
│   ├── analysis.ts
│   └── portfolio.ts
│
├── .env.example                # Required environment variables template
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🔌 API Endpoints

All endpoints live under `/api/`.

### `GET /api/analyze?portfolio=<key>`
Returns a full `PortfolioAnalysis` JSON object for a built-in demo portfolio.
- **`portfolio`** — `aarav` | `meera` | `rohan` (default: `aarav`)

### `POST /api/analyze`
Accepts a custom `UnifiedPortfolio` JSON body and returns its analysis.

### `GET /api/narrate?portfolio=<key>`
Streams a plain-text AI narrative for a built-in portfolio via Claude.

### `POST /api/narrate`
Accepts `{ portfolio: string }` or `{ analysis: PortfolioAnalysis }` and streams the narrative.

### `GET /api/report?portfolio=<key>`
Returns a PDF download of the full report for the given portfolio.

---

## 📖 Analytics Methodology

See [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md) for a detailed explanation of how the health score, concentration index, overlap detection, and benchmark alignment are computed.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request

---

## 📄 License

MIT © Vantage
