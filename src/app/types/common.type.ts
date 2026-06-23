
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type QuestionType = 'MULTIPLE_CHOICE' | 'FILL_IN_THE_BLANK';
export type LearningTrack = 'GENERAL' | 'TOEIC' | 'IELTS';
export interface QuestionResponse {
  questionId: number;
  content: string;
  options: string[];
  questionType: QuestionType;
}
export const getLevelDisplay = (level: Level, track: LearningTrack): string => {
  if (track === 'TOEIC') {
    switch (level) {
      case 'A1': return 'TOEIC 10 - 250 (Người mới bắt đầu)';
      case 'A2': return 'TOEIC 255 - 400 (Sơ cấp)';
      case 'B1': return 'TOEIC 405 - 600 (Trung cấp)';
      case 'B2': return 'TOEIC 605 - 780 (Trung cao cấp)';
      case 'C1': return 'TOEIC 785 - 900 (Cao cấp)';
      case 'C2': return 'TOEIC 905 - 990 (Chuyên gia)';
      default: return level;
    }
  } 
  
  if (track === 'IELTS') {
    switch (level) {
      case 'A1': return 'IELTS 1.0 - 2.5 (Cơ bản)';
      case 'A2': return 'IELTS 3.0 - 3.5 (Sơ cấp)';
      case 'B1': return 'IELTS 4.0 - 5.0 (Trung cấp)';
      case 'B2': return 'IELTS 5.5 - 6.5 (Trung cao cấp)';
      case 'C1': return 'IELTS 7.0 - 8.0 (Cao cấp)';
      case 'C2': return 'IELTS 8.5 - 9.0 (Thành thạo)';
      default: return level;
    }
  }

  // Nếu là GENERAL (Tiếng Anh tổng quát)
  switch (level) {
    case 'A1': return 'A1 (Mất gốc / Mới bắt đầu)';
    case 'A2': return 'A2 (Có nền tảng cơ bản)';
    case 'B1': return 'B1 (Giao tiếp trung bình)';
    case 'B2': return 'B2 (Giao tiếp tự tin)';
    case 'C1': return 'C1 (Sử dụng ngôn ngữ linh hoạt)';
    case 'C2': return 'C2 (Như người bản xứ)';
    default: return level;
  }
};