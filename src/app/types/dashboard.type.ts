// file: types/dashboard.type.ts

export interface RecentActivity {
  label: string;
  score: number;
  total: number;
  color: string;
  time: string;
}

export interface DashboardSummaryResponse {
  currentLevel: string;
  streakDays: number;
  totalXP: number;
  dailyMissionCount: number;
  recentActivities: RecentActivity[];
}