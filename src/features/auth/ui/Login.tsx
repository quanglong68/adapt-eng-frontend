import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, BookOpen, Brain, Star, Zap, User, Target, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../entities/session/auth.service";
import { STORAGE_KEYS } from "../../../shared/lib/storageKeys";
import { loginSchema, registerSchema } from "../../../shared/lib/schemas/auth.schema";

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

        // Validate client-side bằng Zod (khớp luật jakarta.validation ở Backend)
        const schema = tab === "login" ? loginSchema : registerSchema;
        const parsed = schema.safeParse(tab === "login" ? { email, password } : { fullName, email, password });
        if (!parsed.success) {
            setErrorMsg(parsed.error.issues[0]?.message || "Dữ liệu nhập chưa hợp lệ.");
            return;
        }

        setIsLoading(true);

        try {
            if (tab === "login") {
                const response = await authService.login({ email, password });

                if (!response.learningTrack) {
                    navigate("/select-track");
                } else {
                    localStorage.setItem(STORAGE_KEYS.learningTrack, response.learningTrack);
                    navigate("/dashboard");
                }
            } else {
                await authService.register({ fullName, email, password });
                navigate("/select-track");
            }
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Tài khoản hoặc mật khẩu không chính xác.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Panel — Hero immersive */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center p-14 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700">
                {/* Glow blur */}
                <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-400/30 blur-3xl" />
                <div className="pointer-events-none absolute top-1/3 left-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />

                {/* Floating decorative cards */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="absolute top-16 right-16 flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md"
                >
                    <Target className="h-4 w-4 text-emerald-300" />
                    Level: B2 Unlocked!
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.65 }}
                    className="absolute bottom-32 left-12 flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md"
                >
                    <Flame className="h-4 w-4 text-amber-300" />
                    Streak: 7 ngày!
                </motion.div>

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3 mb-10"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/20 backdrop-blur-md">
                        <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold tracking-tight text-white">AdaptEng</span>
                </motion.div>

                {/* Illustration */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="h-72 w-72"
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
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center mt-2"
                >
                    <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">Học tiếng Anh thông minh</h2>
                    <p className="text-sm text-indigo-100">AI cá nhân hóa lộ trình học tập riêng cho bạn</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                    className="flex gap-6 mt-6"
                >
                    {features.map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2 text-indigo-100">
                            <Icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{text}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-8 sm:p-14">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-8 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600">
                            <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">AdaptEng</span>
                        <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">Beta</span>
                    </div>

                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">Chào mừng trở lại!</h1>
                    <p className="mb-8 text-sm text-slate-500">
                        Bắt đầu hành trình chinh phục tiếng Anh của bạn.
                    </p>

                    {/* Tab switcher */}
                    <div className="mb-7 flex gap-1 rounded-xl bg-slate-100 p-1">
                        {(["login", "register"] as const).map((t) => (
                            <motion.button
                                key={t}
                                type="button"
                                onClick={() => { setTab(t); setErrorMsg(""); }}
                                layout
                                className={`relative flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${tab === t ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"}`}
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
                            className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600"
                        >
                            {errorMsg}
                        </motion.div>
                    )}

                    {/* BỌC TRONG THẺ FORM */}
                    <form onSubmit={handleSubmit}>

                        {/* Trường Họ tên chỉ hiện khi Đăng ký */}
                        {tab === "register" && (
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mb-4"
                            >
                                <label className="mb-1.5 block text-sm font-semibold text-slate-900">Họ và tên</label>
                                <div className="relative">
                                    <User className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${focused === "name" ? "text-indigo-600" : "text-slate-400"}`} />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        onFocus={() => setFocused("name")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="Nguyễn Văn A"
                                        required={tab === "register"} // Bắt buộc nhập nếu ở tab đăng ký
                                        className={`w-full rounded-xl border-2 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${focused === "name" ? "border-indigo-600 ring-4 ring-indigo-600/10" : "border-slate-200 hover:border-slate-300"}`}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Email */}
                        <div className="mb-4">
                            <label className="mb-1.5 block text-sm font-semibold text-slate-900">Email</label>
                            <div className="relative">
                                <Mail className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${focused === "email" ? "text-indigo-600" : "text-slate-400"}`} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused(null)}
                                    placeholder="email@example.com"
                                    required
                                    className={`w-full rounded-xl border-2 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${focused === "email" ? "border-indigo-600 ring-4 ring-indigo-600/10" : "border-slate-200 hover:border-slate-300"}`}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <div className="mb-1.5 flex justify-between">
                                <label className="text-sm font-semibold text-slate-900">Mật khẩu</label>
                                {tab === "login" && (
                                    <button type="button" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Quên mật khẩu?</button>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${focused === "pass" ? "text-indigo-600" : "text-slate-400"}`} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocused("pass")}
                                    onBlur={() => setFocused(null)}
                                    placeholder="••••••••"
                                    required
                                    className={`w-full rounded-xl border-2 bg-white py-3 pl-10 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${focused === "pass" ? "border-indigo-600 ring-4 ring-indigo-600/10" : "border-slate-200 hover:border-slate-300"}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-900 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Primary button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            className="mb-3 flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 py-3.5 text-sm font-semibold text-white transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                tab === "login" ? "Đăng nhập" : "Tạo tài khoản"
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="my-4 flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-xs text-slate-400">hoặc</span>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    {/* Google button */}
                    <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                        </svg>
                        Đăng nhập bằng Google
                    </motion.button>

                    <p className="mt-5 text-center text-sm text-slate-500">
                        {tab === "login" ? (
                            <>Chưa có tài khoản?{" "}
                                <button type="button" onClick={() => { setTab("register"); setErrorMsg(""); }} className="font-semibold text-indigo-600 hover:text-indigo-700">
                                    Đăng ký ngay
                                </button>
                            </>
                        ) : (
                            <>Đã có tài khoản?{" "}
                                <button type="button" onClick={() => { setTab("login"); setErrorMsg(""); }} className="font-semibold text-indigo-600 hover:text-indigo-700">
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
