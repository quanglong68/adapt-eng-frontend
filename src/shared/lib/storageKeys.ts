// Khóa localStorage tập trung — thay thế magic string phân tán khắp pages/services.
export const STORAGE_KEYS = {
  token: "token",
  email: "email",
  fullName: "fullName",
  learningTrack: "learningTrack",
  currentLevel: "currentLevel",
  writingCurrentLevel: "writingCurrentLevel",
} as const;
