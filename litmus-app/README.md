# Litmus Protocol — MVP

"Get paid to catch fakes" on Solana. Verify content authenticity, earn LMT tokens, bet on prediction markets, and climb the leaderboard.

## Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with custom Litmus theme
- Mock Solana wallet connection (Phantom, Solflare, Backpack)
- Mock AI detection (random confidence 80–95%)
- `localStorage` persistence for balance, activity, and results

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app is mobile-first (375px base, capped at 480px) — use your browser's device toolbar for the best preview.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing — hero, live stats, features, testimonial |
| `/dashboard` | Balance card, rank, wallet connect, activity feed, hot market |
| `/verify` | Upload (drag & drop or URL), analysis tags, progress simulation |
| `/market` | Odds bars, REAL/FAKE selection, stake input, dynamic payout |
| `/leaderboard` | Weekly/Monthly/All Time tabs, top 10, user stats grid |
| `/result` | Confetti, result circle, confidence count-up, earnings breakdown |

## Key Behaviors

- **Wallet** — tap "Connect Wallet" on the dashboard, pick a provider; tap the address to disconnect.
- **Verify flow** — upload a file or paste a URL, then submit. Progress runs uploading → analyzing → verifying (~4s), credits +30 LMT, and routes to `/result`.
- **Betting** — select REAL or FAKE (odds nudge in response), set a stake, and place the bet. Balance and activity feed update.
- **Persistence** — balance, activities, and last result survive page reloads via `localStorage`.

## Project Structure

```
app/            # Pages (App Router)
components/     # BottomNav, WalletButton, Toast, Confetti, CountUp
lib/            # store.tsx (state + persistence), mockData.ts, types.ts
```
