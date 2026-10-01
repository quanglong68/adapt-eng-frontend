import { z } from "zod";

// Khớp với jakarta.validation ở Backend: RegisterRequestDto / LoginRequestDto.
export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email không được để trống").email("Email không đúng định dạng"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().trim().min(1, "Họ tên không được để trống"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
