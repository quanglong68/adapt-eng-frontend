import apiClient from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.type';


export const authService = {
  // 1. Gọi API Đăng ký
  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);
    // Đăng ký xong tự động lưu token vào trình duyệt
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('fullName', response.data.fullName);
    }
    return response.data;
  },

  // 2. Gọi API Đăng nhập
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    // Đăng nhập thành công -> Cất token vào két sắt LocalStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('fullName', response.data.fullName);
    }
    return response.data;
  },

  // 3. Đăng xuất (Chỉ cần vứt token đi là xong)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('fullName');
  },

  // Hàm tiện ích: Kiểm tra xem user đã đăng nhập chưa
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};