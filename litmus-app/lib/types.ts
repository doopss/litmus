export type WalletProvider = "Phantom" | "Solflare" | "Backpack";

export interface Activity {
  id: string;
  icon: string;
  description: string;
  reward: number;
  time: string;
}

export interface UserStats {
  verified: number;
  accuracy: number;
  roi: number;
  streak: number;
}

export interface VerificationResult {
  label: "FAKE" | "AUTHENTIC";
  confidence: number;
  earnings: {
    base: number;
    speed: number;
    streak: number;
    total: number;
  };
  fileName: string;
}

export interface AppState {
  wallet: { address: string; provider: WalletProvider } | null;
  balance: number;
  rank: number;
  percentile: number;
  stats: UserStats;
  activities: Activity[];
  lastResult: VerificationResult | null;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  medal?: string;
}

export type LeaderboardTab = "weekly" | "monthly" | "alltime";
