import { Level } from './common.type';

export interface UserProfileResponse {
  email: string;
  fullName: string;
  totalXp: number;
  currentLevel: Level;
  premium: boolean;
  currentPackageName: string | null;
  premiumEndDate: string | null;
}
