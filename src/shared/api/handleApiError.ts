import axios from "axios";
import toast from "react-hot-toast";

// Bóc message chuẩn từ Backend ApiErrorResponse {message, errors, errorId}.
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string>; errorId?: string }
      | undefined;
    if (data?.message) return data.message;
    if (!error.response) {
      if (error.code === "ECONNABORTED") return "Máy chủ phản hồi quá lâu. Vui lòng thử lại sau!";
      return "Không thể kết nối máy chủ. Vui lòng kiểm tra mạng!";
    }
  }
  return fallback;
}

// Xử lý lỗi API tập trung: log dev + toast cho user. Trả về message đã hiển thị.
export function handleApiError(error: unknown, fallback: string): string {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error(fallback, error);
  }
  const message = truncateMessage(getApiErrorMessage(error, fallback));
  toast.error(message);
  return message;
}

// Chặn toast tràn màn hình khi Backend trả tràng message dài (ví dụ lỗi validate lặp lại).
const MAX_MESSAGE_LENGTH = 200;
function truncateMessage(message: string): string {
  if (message.length <= MAX_MESSAGE_LENGTH) return message;
  return message.slice(0, MAX_MESSAGE_LENGTH).trimEnd() + "…";
}
