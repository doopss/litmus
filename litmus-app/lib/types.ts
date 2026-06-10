export type WalletProvider = "Phantom" | "Solflare" | "Backpack";

export type ActivityKind = "verify" | "win" | "bet" | "streak";

export interface Activity {
  id: string;
  kind: ActivityKind;
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

export interface Market {
  id: string;
  subject: string;
  claim: string;
  source: string;
  tag: string;
  realPct: number;
  pool: number;
  participants: number;
  endsIn: string;
  hot: boolean;
  history: number[];
}

export interface Position {
  id: string;
  marketId: string;
  subject: string;
  side: "REAL" | "FAKE";
  stake: number;
  payout: number;
  status: "open";
}

export interface AppState {
  wallet: { address: string; provider: WalletProvider } | null;
  balance: number;
  rank: number;
  percentile: number;
  stats: UserStats;
  activities: Activity[];
  positions: Position[];
  lastResult: VerificationResult | null;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
}

export type LeaderboardTab = "weekly" | "monthly" | "alltime";
