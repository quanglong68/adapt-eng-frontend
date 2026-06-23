import apiClient from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.type';
import { LearningTrack } from '../types/common.type';

  export const userService = {
  setLearningTrack: async (track: LearningTrack): Promise<void> => {
    await apiClient.post('/user/set-track', { learningTrack: track });
    localStorage.setItem('learningTrack', track); 
  }
};