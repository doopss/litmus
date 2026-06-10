import {
  Activity,
  AppState,
  LeaderboardEntry,
  LeaderboardTab,
  Market,
  WalletProvider,
} from "./types";

export const WALLETS: WalletProvider[] = ["Phantom", "Solflare", "Backpack"];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "a1",
    kind: "verify",
    description: "Verified 3 clips",
    reward: 45,
    time: "2h ago",
  },
  {
    id: "a2",
    kind: "win",
    description: "Won prediction · Zuck AI",
    reward: 72,
    time: "5h ago",
  },
  {
    id: "a3",
    kind: "streak",
    description: "5-day streak bonus",
    reward: 50,
    time: "1d ago",
  },
];

export const INITIAL_STATE: AppState = {
  wallet: null,
  balance: 1245,
  rank: 47,
  percentile: 12,
  stats: { verified: 127, accuracy: 94, roi: 156, streak: 5 },
  activities: INITIAL_ACTIVITIES,
  positions: [],
  lastResult: null,
};

export const MARKETS: Market[] = [
  {
    id: "elon-mars",
    subject: "Elon Mars Address",
    claim: "Video of Elon Musk announcing a 2027 crewed Mars launch.",
    source: "x.com / 4.2M views",
    tag: "DEEPFAKE SUSPECTED",
    realPct: 28,
    pool: 50000,
    participants: 1247,
    endsIn: "2h 14m",
    hot: true,
    history: [41, 44, 39, 36, 33, 35, 31, 29, 30, 28],
  },
  {
    id: "zuck-ai",
    subject: "Zuckerberg AI Interview",
    claim: "Leaked clip of Mark Zuckerberg admitting AGI was reached internally.",
    source: "youtube / 1.1M views",
    tag: "VOICE CLONE",
    realPct: 15,
    pool: 38400,
    participants: 980,
    endsIn: "5h 02m",
    hot: true,
    history: [30, 27, 24, 22, 19, 21, 18, 16, 17, 15],
  },
  {
    id: "trump-rally",
    subject: "Trump Rally Clip",
    claim: "Footage purporting to show a teleprompter malfunction mid-rally.",
    source: "tiktok / 820K views",
    tag: "CONTESTED",
    realPct: 61,
    pool: 21200,
    participants: 540,
    endsIn: "11h 40m",
    hot: false,
    history: [48, 50, 53, 55, 52, 57, 59, 58, 60, 61],
  },
  {
    id: "pope-coat",
    subject: "Pope Designer Coat",
    claim: "Image of the Pope wearing a white luxury puffer jacket.",
    source: "instagram / 9.0M views",
    tag: "AI IMAGE",
    realPct: 8,
    pool: 64800,
    participants: 2110,
    endsIn: "1d 03h",
    hot: false,
    history: [22, 18, 16, 13, 12, 10, 11, 9, 9, 8],
  },
];

export const LMT_USD_RATE = 0.034;

export const LEADERBOARDS: Record<LeaderboardTab, LeaderboardEntry[]> = {
  weekly: [
    { rank: 1, name: "cryptohunter", score: 12450 },
    { rank: 2, name: "fakedetective", score: 9820 },
    { rank: 3, name: "truthseeker", score: 8150 },
    { rank: 4, name: "mediatruth", score: 7340 },
    { rank: 5, name: "deepwatch", score: 6890 },
    { rank: 6, name: "verifybot", score: 5420 },
    { rank: 7, name: "fakefinder", score: 4980 },
    { rank: 8, name: "litmustest", score: 4650 },
    { rank: 9, name: "chainproof", score: 4210 },
    { rank: 10, name: "signalcheck", score: 3890 },
  ],
  monthly: [
    { rank: 1, name: "fakedetective", score: 45200 },
    { rank: 2, name: "cryptohunter", score: 41800 },
    { rank: 3, name: "truthseeker", score: 38400 },
    { rank: 4, name: "deepwatch", score: 32100 },
    { rank: 5, name: "mediatruth", score: 29800 },
    { rank: 6, name: "verifybot", score: 26500 },
    { rank: 7, name: "fakefinder", score: 24200 },
    { rank: 8, name: "litmustest", score: 21800 },
    { rank: 9, name: "chainproof", score: 19400 },
    { rank: 10, name: "signalcheck", score: 17200 },
  ],
  alltime: [
    { rank: 1, name: "cryptohunter", score: 198400 },
    { rank: 2, name: "truthseeker", score: 176200 },
    { rank: 3, name: "fakedetective", score: 164800 },
    { rank: 4, name: "deepwatch", score: 142000 },
    { rank: 5, name: "mediatruth", score: 128600 },
    { rank: 6, name: "verifybot", score: 115200 },
    { rank: 7, name: "fakefinder", score: 98400 },
    { rank: 8, name: "chainproof", score: 87200 },
    { rank: 9, name: "signalcheck", score: 76800 },
    { rank: 10, name: "litmustest", score: 65400 },
  ],
};

export const ANALYSIS_TAGS = ["Facial", "Audio", "Lighting", "Artifacts", "Metadata"];

export function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export function fmtK(n: number) {
  return n >= 1000
    ? (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K"
    : String(n);
}

export function usd(lmt: number) {
  return "$" + (lmt * LMT_USD_RATE).toFixed(2);
}

export function runMockDetection(): {
  label: "FAKE" | "AUTHENTIC";
  confidence: number;
} {
  const isFake = Math.random() < 0.74;
  const confidence = 80 + Math.floor(Math.random() * 16);
  return { label: isFake ? "FAKE" : "AUTHENTIC", confidence };
}
