import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000 // Tăng thời gian chờ lên tối đa 60 giây (để đợi AI sinh đề)
}); 

// 1. TRẠM KIỂM SOÁT CHIỀU ĐI (Gắn Token)
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

// 2. TRẠM KIỂM SOÁT CHIỀU VỀ (Bắt lỗi từ Backend)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || "";
    
    // Bị Lính gác ở Backend chặn vì chưa có Level
    if (errorMessage === "REQUIRE_PLACEMENT_TEST") {
      // 1. Phát loa thông báo gọi cái Guard Modal hiện lên che màn hình
      window.dispatchEvent(new CustomEvent("REQUIRE_PLACEMENT_TEST"));
      
      // 2. Phép thuật đóng băng: Dừng tất cả mọi luồng code đang chờ API này
      return new Promise(() => {}); 
    }
    
    // Xử lý luôn lỗi hết hạn Token (401) để tự động văng ra ngoài màn hình Đăng nhập
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/'; 
      return new Promise(() => {}); 
    }

    return Promise.reject(error);
  }
);

export default apiClient;