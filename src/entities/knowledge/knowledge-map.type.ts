export interface SkillRadarData {
  skillEnum: string;
  skillName: string;
  score: number;
}

export interface WeakPointItem {
  id: string;
  name: string;
  score: number;
  lastMistake: string;
}

export interface MasteredItem {
  id: string;
  name: string;
  score: number;
  lastReview: string;
}

export interface KnowledgeMapResponse {
  radarData: SkillRadarData[];
  weakPoints: WeakPointItem[];
  masteredItems: MasteredItem[];
}