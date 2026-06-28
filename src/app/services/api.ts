import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000 // Tăng thời gian chờ lên tối đa 60 giây (để đợi AI sinh đề)
}); 

apiClient.interceptors.request.use(
  (config) => {
    // Vào LocalStorage tìm xem có cất cái vòng tay (token) nào ở đây không
    const token = localStorage.getItem('token');
    
    // Nếu có, tự động gắn nó vào Header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;