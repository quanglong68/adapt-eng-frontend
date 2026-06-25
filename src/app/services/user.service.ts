import apiClient from './api';
import { LearningTrack } from '../types/common.type';
import { UserProfileResponse } from '../types/user.type';

export const userService = {
  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get<UserProfileResponse>('/users/me');
    return response.data;
  },

  setLearningTrack: async (track: LearningTrack): Promise<void> => {
    await apiClient.post('/user/set-track', { learningTrack: track });
    localStorage.setItem('learningTrack', track);
  },
};
