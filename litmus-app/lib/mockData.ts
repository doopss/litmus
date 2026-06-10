import { Activity, AppState, LeaderboardEntry, LeaderboardTab } from "./types";

export const INITIAL_ACTIVITIES: Activity[] = [
  { id: "a1", icon: "🔍", description: "Verified 3 videos", reward: 45, time: "2h ago" },
  { id: "a2", icon: "🎲", description: "Won prediction", reward: 72, time: "5h ago" },
  { id: "a3", icon: "🔥", description: "5-day streak bonus", reward: 50, time: "1d ago" },
];

export const INITIAL_STATE: AppState = {
  wallet: null,
  balance: 1245,
  rank: 47,
  percentile: 12,
  stats: { verified: 127, accuracy: 94, roi: 156, streak: 5 },
  activities: INITIAL_ACTIVITIES,
  lastResult: null,
};

export const MARKET = {
  id: 1,
  title: "Elon Mars Video",
  realPercent: 28,
  fakePercent: 72,
  pool: 50000,
  crowdFakePercent: 89,
  participants: 1247,
  endsIn: "2h 14m",
};

export const LMT_USD_RATE = 0.034;

export const LEADERBOARDS: Record<LeaderboardTab, LeaderboardEntry[]> = {
  weekly: [
    { rank: 1, name: "@cryptohunter", score: 12450, medal: "🥇" },
    { rank: 2, name: "@fakedetective", score: 9820, medal: "🥈" },
    { rank: 3, name: "@truthseeker", score: 8150, medal: "🥉" },
    { rank: 4, name: "@mediatruth", score: 7340 },
    { rank: 5, name: "@deepwatch", score: 6890 },
    { rank: 6, name: "@verifybot", score: 5420 },
    { rank: 7, name: "@fakefinder", score: 4980 },
    { rank: 8, name: "@litmustest", score: 4650 },
    { rank: 9, name: "@chainproof", score: 4210 },
    { rank: 10, name: "@signalcheck", score: 3890 },
  ],
  monthly: [
    { rank: 1, name: "@fakedetective", score: 45200, medal: "🥇" },
    { rank: 2, name: "@cryptohunter", score: 41800, medal: "🥈" },
    { rank: 3, name: "@truthseeker", score: 38400, medal: "🥉" },
    { rank: 4, name: "@deepwatch", score: 32100 },
    { rank: 5, name: "@mediatruth", score: 29800 },
    { rank: 6, name: "@verifybot", score: 26500 },
    { rank: 7, name: "@fakefinder", score: 24200 },
    { rank: 8, name: "@litmustest", score: 21800 },
    { rank: 9, name: "@chainproof", score: 19400 },
    { rank: 10, name: "@signalcheck", score: 17200 },
  ],
  alltime: [
    { rank: 1, name: "@cryptohunter", score: 198400, medal: "🥇" },
    { rank: 2, name: "@truthseeker", score: 176200, medal: "🥈" },
    { rank: 3, name: "@fakedetective", score: 164800, medal: "🥉" },
    { rank: 4, name: "@deepwatch", score: 142000 },
    { rank: 5, name: "@mediatruth", score: 128600 },
    { rank: 6, name: "@verifybot", score: 115200 },
    { rank: 7, name: "@fakefinder", score: 98400 },
    { rank: 8, name: "@chainproof", score: 87200 },
    { rank: 9, name: "@signalcheck", score: 76800 },
    { rank: 10, name: "@litmustest", score: 65400 },
  ],
};

export const ANALYSIS_TAGS = ["Audio", "Visual", "Lighting", "Face", "Other"];

export const RELATED_MARKETS = [
  { title: "Zuckerberg AI Interview", fakePct: 85 },
  { title: "Trump Rally Clip", fakePct: 39 },
];

/**
 * Mock AI detection: most uploads are flagged FAKE with high confidence,
 * occasionally AUTHENTIC. Confidence 80-95%.
 */
export function runMockDetection(): { label: "FAKE" | "AUTHENTIC"; confidence: number } {
  const isFake = Math.random() < 0.75;
  const confidence = 80 + Math.floor(Math.random() * 16);
  return { label: isFake ? "FAKE" : "AUTHENTIC", confidence };
}
