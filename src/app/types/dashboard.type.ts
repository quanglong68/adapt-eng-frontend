// file: types/dashboard.type.ts

export interface RecentActivity {
  label: string;
  score: number;
  total: number;
  color: string;
  time: string;
}

// 🚀 THÊM INTERFACE NÀY ĐỂ HỨNG DATA GAMIFICATION
export interface LevelUpProgress {
  targetLevel: string;
  eligibleForBoss: boolean; 
  currentTotalXp: number;
  requiredTotalXp: number;
  current7DayAccuracy: number;
  required7DayAccuracy: number;
  cooldownActive: boolean; 
  daysLeftToRetry: number;
}
export interface DashboardSummaryResponse {
  currentLevel: string;
  streakDays: number;
  totalXP: number;
  dailyMissionCount: number;
  recentActivities: RecentActivity[];
  levelUpProgress?: LevelUpProgress; // 🚀 BỔ SUNG FIELD NÀY
}