import apiClient from '../../shared/api/api';
import { STORAGE_KEYS } from '../../shared/lib/storageKeys';
import { LearningTrack } from '../../shared/types/common.type';
import { UserProfileResponse } from './user.type';

export const userService = {
  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get<UserProfileResponse>('/users/me');
    return response.data;
  },

  setLearningTrack: async (track: LearningTrack): Promise<void> => {
    await apiClient.post('/user/set-track', { learningTrack: track });
    localStorage.setItem(STORAGE_KEYS.learningTrack, track);
  },
};
