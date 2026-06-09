import apiClient from './api';
import { Level,  } from '../types/common.type';
import { SubmitTestRequest, TestSubmissionResponse } from '../types/test.type';
import { QuestionResponse } from '../types/common.type'; 



export const testService = {
    generateTest: async (level: Level): Promise<QuestionResponse[]> => {
        const response = await apiClient.get<QuestionResponse[]>(`/test/generate/${level}`);
        return response.data;
    },

    submitTest: async (submissionData: SubmitTestRequest): Promise<TestSubmissionResponse> => {
        const response = await apiClient.post<TestSubmissionResponse>('/test/submit', submissionData);
        return response.data;
    },
    
    setLevel: async (level: Level): Promise<String> => {
        const response = await apiClient.post<String>('/test/set-level', { 
        selectedLevel: level });
        return response.data;
    },



};