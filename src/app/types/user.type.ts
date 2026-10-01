import { Level } from './common.type';

export interface UserProfileResponse {
  email: string;
  fullName: string;
  totalXp: number;
  currentLevel: Level; 
  writingCurrentLevel?: Level;
  premium: boolean;
  currentPackageName: string | null;
  premiumEndDate: string | null;
}