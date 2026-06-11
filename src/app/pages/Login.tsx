import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, BookOpen, Brain, Star, Zap, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

export function Login() {
    const navigate = useNavigate();

    // UI States
    const [showPassword, setShowPassword] = useState(false);
    const [tab, setTab] = useState<"login" | "register">("login");
    const [focused, setFocused] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Form Data States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const features = [
        { icon: Brain, text: "AI Thích ứng" },
        { icon: Star, text: "Cá nhân hóa" },
        { icon: Zap, text: "Hiệu quả cao" },
    ];

    // Xử lý submit form chung cho cả Đăng nhập & Đăng ký
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setIsLoading(true);

        try {
            if (tab === "login") {
                // Gọi API Login (authService đã tự lưu token vào localStorage rồi)
                await authService.login({ email, password });

                // Đăng nhập thành công -> Đá sang Dashboard
                navigate("/dashboard");
            } else {
                // Gọi API Register (authService đã tự lưu token vào localStorage rồi)
                await authService.register({ fullName, email, password });


                navigate("/dashboard");
            }
        } catch (error: any) {
            console.error("Lỗi xác thực:", error);
            // Hiển thị message lỗi từ Backend trả về, hoặc câu mặc định
            setErrorMsg(error.response?.data?.message || "Tài khoản hoặc mật khẩu không chính xác.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
            {/* Left Panel (Giữ nguyên giao diện đẹp của bạn) */}
            <div
                className="w-1/2 relative overflow-hidden flex flex-col items-center justify-center p-14"
                style={{ background: "linear-gradient(145deg, #4338CA 0%, #6D28D9 60%, #7C3AED 100%)" }}
            >
                {/* Decorative circles */}
                <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-10" style={{ background: "#fff" }} />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: "#fff" }} />
                <div className="absolute top-1/3 left-8 w-24 h-24 rounded-full opacity-10" style={{ background: "#fff" }} />

                {/* Floating decorative cards */}
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute top-16 right-16 px-4 py-2 rounded-xl text-xs font-semibold"
                    style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                    🎯 Level: B2 Unlocked!
                </motion.div>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                    className="absolute bottom-32 left-12 px-4 py-2 rounded-xl text-xs font-semibold"
                    style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                    🔥 Streak: 7 ngày!
                </motion.div>

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-3 mb-10"
                >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-white tracking-tight">AdaptEng</span>
                </motion.div>

                {/* Illustration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-72 h-72"
                >
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="60" y="80" width="180" height="130" rx="14" fill="rgba(255,255,255,0.15)" />
                        <rect x="70" y="90" width="160" height="110" rx="10" fill="rgba(255,255,255,0.1)" />
                        <rect x="80" y="100" width="140" height="90" rx="6" fill="rgba(165,180,252,0.35)" />
                        <rect x="90" y="115" width="80" height="5" rx="2.5" fill="rgba(255,255,255,0.7)" />
                        <rect x="90" y="128" width="55" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
                        <rect x="90" y="140" width="95" height="4" rx="2" fill="rgba(255,255,255,0.6)" />
                        <rect x="90" y="152" width="65" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
                        <rect x="90" y="165" width="120" height="8" rx="4" fill="rgba(255,255,255,0.2)" />
                        <rect x="90" y="165" width="75" height="8" rx="4" fill="rgba(167,243,208,0.7)" />
                        <rect x="135" y="210" width="30" height="20" rx="3" fill="rgba(255,255,255,0.2)" />
                        <rect x="110" y="228" width="80" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
                        <circle cx="240" cy="165" r="22" fill="rgba(255,255,255,0.25)" />
                        <path d="M228 185 L228 230 M252 185 L252 230" stroke="rgba(255,255,255,0.3)" strokeWidth="10" strokeLinecap="round" />
                        <path d="M218 200 L260 200" stroke="rgba(255,255,255,0.25)" strokeWidth="10" strokeLinecap="round" />
                        <circle cx="268" cy="140" r="18" fill="rgba(255,255,255,0.2)" />
                        <circle cx="255" cy="155" r="5" fill="rgba(255,255,255,0.15)" />
                        <circle cx="249" cy="162" r="3" fill="rgba(255,255,255,0.12)" />
                        <text x="268" y="146" textAnchor="middle" fontSize="14" fill="white">AI</text>
                        <circle cx="50" cy="100" r="4" fill="rgba(251,191,36,0.9)" />
                        <circle cx="38" cy="160" r="3" fill="rgba(167,243,208,0.9)" />
                        <circle cx="270" cy="80" r="5" fill="rgba(251,191,36,0.7)" />
                        <circle cx="55" cy="220" r="3" fill="rgba(196,181,253,0.8)" />
                        <path d="M45 75 L50 65 L55 75 L65 80 L55 85 L50 95 L45 85 L35 80 Z" fill="rgba(255,255,255,0.5)" />
                    </svg>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-2"
                >
                    <h2 className="text-2xl font-bold text-white mb-2">Học tiếng Anh thông minh</h2>
                    <p style={{ color: "rgba(199,210,254,0.9)" }} className="text-sm">AI cá nhân hóa lộ trình học tập riêng cho bạn</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex gap-6 mt-6"
                >
                    {features.map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2" style={{ color: "rgba(199,210,254,0.9)" }}>
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{text}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Right Panel - NƠI XỬ LÝ FORM */}
            <div className="w-1/2 flex items-center justify-center p-14" style={{ background: "#F9FAFB" }}>
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#4F46E5" }}>
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold" style={{ color: "#1E293B" }}>AdaptEng</span>
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#EEF2FF", color: "#4F46E5" }}>Beta</span>
                    </div>

                    <h1 className="text-3xl font-bold mb-2" style={{ color: "#1E293B" }}>Chào mừng trở lại! 👋</h1>
                    <p className="mb-8 text-sm" style={{ color: "#64748B" }}>
                        Bắt đầu hành trình chinh phục tiếng Anh của bạn.
                    </p>

                    {/* Tab switcher */}
                    <div className="flex gap-1 mb-7 p-1 rounded-xl" style={{ background: "#E5E7EB" }}>
                        {(["login", "register"] as const).map((t) => (
                            <motion.button
                                key={t}
                                type="button"
                                onClick={() => { setTab(t); setErrorMsg(""); }}
                                layout
                                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all relative"
                                style={{ color: tab === t ? "#4F46E5" : "#64748B" }}
                            >
                                {tab === t && (
                                    <motion.div
                                        layoutId="tab-bg"
                                        className="absolute inset-0 rounded-lg bg-white shadow-sm"
                                    />
                                )}
                                <span className="relative z-10">{t === "login" ? "Đăng nhập" : "Đăng ký"}</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Hiển thị lỗi API */}
                    {errorMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100"
                        >
                            {errorMsg}
                        </motion.div>
                    )}

                    {/* BỌC TRONG THẺ FORM */}
                    <form onSubmit={handleSubmit}>

                        {/* Trường Họ tên chỉ hiện khi Đăng ký */}
                        {tab === "register" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mb-4"
                            >
                                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1E293B" }}>Họ và tên</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: focused === "name" ? "#4F46E5" : "#94A3B8" }} />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        onFocus={() => setFocused("name")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="Nguyễn Văn A"
                                        required={tab === "register"} // Bắt buộc nhập nếu ở tab đăng ký
                                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                                        style={{
                                            background: "#fff",
                                            border: focused === "name" ? "2px solid #4F46E5" : "2px solid #E5E7EB",
                                            color: "#1E293B",
                                            boxShadow: focused === "name" ? "0 0 0 4px rgba(79,70,229,0.08)" : "none",
                                        }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1E293B" }}>Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: focused === "email" ? "#4F46E5" : "#94A3B8" }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused(null)}
                                    placeholder="email@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                                    style={{
                                        background: "#fff",
                                        border: focused === "email" ? "2px solid #4F46E5" : "2px solid #E5E7EB",
                                        color: "#1E293B",
                                        boxShadow: focused === "email" ? "0 0 0 4px rgba(79,70,229,0.08)" : "none",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <div className="flex justify-between mb-1.5">
                                <label className="text-sm font-semibold" style={{ color: "#1E293B" }}>Mật khẩu</label>
                                {tab === "login" && (
                                    <button type="button" className="text-xs font-semibold" style={{ color: "#4F46E5" }}>Quên mật khẩu?</button>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: focused === "pass" ? "#4F46E5" : "#94A3B8" }} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocused("pass")}
                                    onBlur={() => setFocused(null)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none transition-all"
                                    style={{
                                        background: "#fff",
                                        border: focused === "pass" ? "2px solid #4F46E5" : "2px solid #E5E7EB",
                                        color: "#1E293B",
                                        boxShadow: focused === "pass" ? "0 0 0 4px rgba(79,70,229,0.08)" : "none",
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors focus:outline-none"
                                    style={{ color: "#94A3B8" }}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Primary button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: isLoading ? 1 : 1.015, boxShadow: isLoading ? "none" : "0 8px 24px rgba(79,70,229,0.35)" }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm mb-3 transition-all flex justify-center items-center gap-2"
                            style={{
                                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                                boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
                                opacity: isLoading ? 0.7 : 1
                            }}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                tab === "login" ? "Đăng nhập" : "Tạo tài khoản"
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
                        <span className="text-xs" style={{ color: "#94A3B8" }}>hoặc</span>
                        <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
                    </div>

                    {/* Google button */}
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.015, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 transition-all"
                        style={{ background: "#fff", border: "2px solid #E5E7EB", color: "#1E293B" }}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                        </svg>
                        Đăng nhập bằng Google
                    </motion.button>

                    <p className="text-center mt-5 text-sm" style={{ color: "#64748B" }}>
                        {tab === "login" ? (
                            <>Chưa có tài khoản?{" "}
                                <button type="button" onClick={() => { setTab("register"); setErrorMsg(""); }} className="font-semibold" style={{ color: "#4F46E5" }}>
                                    Đăng ký ngay
                                </button>
                            </>
                        ) : (
                            <>Đã có tài khoản?{" "}
                                <button type="button" onClick={() => { setTab("login"); setErrorMsg(""); }} className="font-semibold" style={{ color: "#4F46E5" }}>
                                    Đăng nhập
                                </button>
                            </>
                        )}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}