export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  streakDays: number;
  bestStreak: number;
  penaltyICP: number;
  donationAmount: number; // personal donation amount per missed day
  donationAddress: string; // ICP wallet address for donations
  challengeLevel: number; // 1-10
  missedToday: boolean;
  donatedToday: boolean;
  completedToday: boolean;
  activityHistory: boolean[]; // last 7 days, index 0 = oldest
}

export interface ChallengeLevel {
  level: number;
  reps: number;
  label: string;
}

export const CHALLENGE_LEVELS: ChallengeLevel[] = [
  { level: 1, reps: 5, label: "Lv1" },
  { level: 2, reps: 10, label: "Lv2 (recommended)" },
  { level: 3, reps: 15, label: "Lv3" },
  { level: 4, reps: 20, label: "Lv4" },
  { level: 5, reps: 25, label: "Lv5" },
  { level: 6, reps: 30, label: "Lv6" },
  { level: 7, reps: 40, label: "Lv7" },
  { level: 8, reps: 50, label: "Lv8" },
  { level: 9, reps: 75, label: "Lv9" },
  { level: 10, reps: 100, label: "Lv10" },
];

export const DEFAULT_DONATION_ADDRESS =
  "ddb07ef9695912bab108608a96efacb893f16409e8101d577d8a67b0268bbedc";
