import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  Flame, Bell, BookOpen, Brain, Target, ChevronRight, Zap, Star,
  Play, Map, Loader2, LogOut, User, Crown, Sparkles, CreditCard,
  History, AlertTriangle, X, CheckCircle2
} from "lucide-react";
import { dashboardService } from "../services/dashboard.service";
import { userService } from "../services/user.service";
import { DashboardSummaryResponse } from "../types/dashboard.type";
import { PremiumGuard } from "../components/shared/PremiumGuard";
import { notificationService } from "../services/notification.service";
import { AppNotification } from "../types/notification.type";
import { deepDiveService } from "../services/deepDive.service";
import { DeepDiveRecommendation } from "../types/deepDive.type";

type DeepDiveStatus = 'IDLE' | 'GENERATING' | 'READY';

// 🚀 HÀM HELPER: Tạo Key duy nhất (Kết hợp ID và từ vựng) để chống lỗi lây lan state giữa các nút
const getUniqueKey = (item: DeepDiveRecommendation) => `${item.knowledgeItemId}_${item.targetWord || 'no_word'}`;

export function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  const [userFullName, setUserFullName] = useState(localStorage.getItem('fullName') || "Học viên");
  const [userEmail, setUserEmail] = useState(localStorage.getItem('email') || "hocvien@email.com");
  const currentTrack = localStorage.getItem('learningTrack') || "GENERAL";

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const [weaknesses, setWeaknesses] = useState<DeepDiveRecommendation[]>([]);
  // 🚀 Đổi từ Record<knowledgeItemId> sang Record<UniqueKey>
  const [deepDiveStates, setDeepDiveStates] = useState<Record<string, { status: DeepDiveStatus, sessionId?: string }>>({});
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    item: DeepDiveRecommendation | null;
  }>({ isOpen: false, item: null });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotifMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    notificationService.getNotifications().then(data => {
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    }).catch(err => console.error("Lỗi tải thông báo:", err));

    const token = localStorage.getItem('token');
    if (!token) return;

    // 🚀 SỬA LỖI TYPESCRIPT: Trích xuất `env` thông qua kiểu ép tĩnh (Type Assertion)
    const env = (import.meta as any).env;
    const baseUrl = env?.VITE_API_URL || 'http://localhost:8080';

    const eventSource = new EventSource(`${baseUrl}/api/v1/notifications/stream?token=${token}`);

    eventSource.addEventListener("NEW_NOTIFICATION", (event) => {
      const newNotif: AppNotification = JSON.parse(event.data);
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashData, profileData, weaknessData] = await Promise.all([
          dashboardService.getSummary(),
          userService.getProfile(),
          deepDiveService.getRecommendations().catch(() => [])
        ]);

        if (!dashData.currentLevel) {
          window.dispatchEvent(new CustomEvent("REQUIRE_PLACEMENT_TEST"));
          return;
        }

        setDashboardData(dashData);
        setIsPremium(profileData.premium);
        setWeaknesses(weaknessData);

        // 🚀 CẬP NHẬT STATE TỪ BACKEND ĐỂ CHỐNG MẤT NÚT KHI F5
        const initialStates: Record<string, { status: DeepDiveStatus, sessionId?: string }> = {};
        weaknessData.forEach((item) => {
          if (item.activeSessionId && item.activeSessionStatus) {
            initialStates[getUniqueKey(item)] = {
              status: item.activeSessionStatus as DeepDiveStatus,
              sessionId: item.activeSessionId
            };
          }
        });
        setDeepDiveStates(initialStates);

        setUserFullName(profileData.fullName);
        setUserEmail(profileData.email);
        localStorage.setItem('fullName', profileData.fullName);
        localStorage.setItem('email', profileData.email);
        localStorage.setItem('premium', profileData.premium ? 'true' : 'false');
        localStorage.setItem('currentLevel', dashData.currentLevel);

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleConfirmGenerate = async () => {
    if (!modalState.item) return;
    const { knowledgeItemId, targetWord } = modalState.item;
    const uniqueKey = getUniqueKey(modalState.item); // 🚀 Dùng Unique Key

    setDeepDiveStates(prev => ({ ...prev, [uniqueKey]: { status: 'GENERATING' } }));

    try {
      const res = await deepDiveService.initSession({ knowledgeItemId, targetWord });
      setDeepDiveStates(prev => ({
        ...prev,
        [uniqueKey]: { status: 'GENERATING', sessionId: res.sessionId }
      }));
    } catch (error: any) {
      setDeepDiveStates(prev => ({ ...prev, [uniqueKey]: { status: 'IDLE' } }));
      console.error(error.response?.data?.message || "Lỗi tạo đề");
      alert("Không thể khởi tạo AI lúc này. Vui lòng thử lại sau!");
    }
  };

  useEffect(() => {
    const generatingItems = Object.entries(deepDiveStates).filter(([_, state]) => state.status === 'GENERATING' && state.sessionId);
    if (generatingItems.length === 0) return;

    let retryCount = 0;
    const MAX_RETRIES = 15;

    const interval = setInterval(async () => {
      retryCount++;

      for (const [uniqueKey, state] of generatingItems) { // 🚀 Dùng Unique Key
        if (retryCount >= MAX_RETRIES) {
          setDeepDiveStates(prev => ({ ...prev, [uniqueKey]: { status: 'IDLE' } }));
          alert("Thời gian tạo đề quá lâu. Vui lòng thử lại sau!");
          continue;
        }

        try {
          const responseData = await deepDiveService.getSessionQuestions(state.sessionId!);
          sessionStorage.setItem(`deep_dive_${state.sessionId}`, JSON.stringify(responseData));

          setDeepDiveStates(prev => ({ ...prev, [uniqueKey]: { status: 'READY', sessionId: state.sessionId } }));
        } catch (error: any) {
          if (error.response && error.response.status !== 404) {
            setDeepDiveStates(prev => ({ ...prev, [uniqueKey]: { status: 'IDLE' } }));
            alert("Lệch kết nối AI (Lỗi máy chủ). Vui lòng thử lại sau!");
          }
        }
      }

      const stillGenerating = Object.values(deepDiveStates).some(s => s.status === 'GENERATING');
      if (!stillGenerating) clearInterval(interval);

    }, 3000);

    return () => clearInterval(interval);
  }, [deepDiveStates]);

  const formatItemName = (item: DeepDiveRecommendation) => {
    if (item.targetWord) {
      return (
        <span><span className="text-indigo-600 font-semibold border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 rounded mr-2 text-[11px] uppercase">Từ vựng</span>{item.targetWord}</span>
      );
    }
    return (
      <span><span className="text-purple-600 font-semibold border border-purple-200 bg-purple-50 px-1.5 py-0.5 rounded mr-2 text-[11px] uppercase">Ngữ pháp</span>{item.knowledgeName}</span>
    );
  };

  const handleNotificationClick = async (notif: AppNotification) => {
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif.id);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      } catch (error) {
        console.error("Lỗi đánh dấu đã đọc", error);
      }
    }
    setIsNotifMenuOpen(false);
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Lỗi đánh dấu đọc tất cả", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleStartPractice = () => {
    if (currentTrack === "TOEIC") {
      navigate("/toeic/practice");
    } else {
      navigate("/practice-execution");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#F9FAFB" }}>
        <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: "#4F46E5" }} />
        <p className="font-semibold text-gray-500">Đang đồng bộ dữ liệu học tập...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F9FAFB" }}>
        <p className="text-red-500 font-bold">Không thể kết nối đến máy chủ. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>

      <AnimatePresence>
        {modalState.isOpen && modalState.item && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setModalState({ isOpen: false, item: null })} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 transition">
                <X className="w-5 h-5" />
              </button>

              {deepDiveStates[getUniqueKey(modalState.item)]?.status === 'GENERATING' ? (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">AI đang thiết kế đề thi...</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    Quá trình này mất khoảng <strong>10 - 15 giây</strong>. Bạn có thể giữ nguyên màn hình này hoặc đóng lại, hệ thống sẽ tiếp tục chạy ngầm.
                  </p>
                  <button onClick={() => setModalState({ isOpen: false, item: null })} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition">
                    Ẩn chạy ngầm
                  </button>
                </div>
              ) : deepDiveStates[getUniqueKey(modalState.item)]?.status === 'READY' ? (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Đề thi đã sẵn sàng!</h3>
                  <p className="text-sm text-slate-500 mb-6">Đề thi chuyên biệt 10 câu dành riêng cho bạn đã được tạo thành công.</p>
                  <button
                    onClick={() => navigate(`/toeic/test/deep-dive/${deepDiveStates[getUniqueKey(modalState.item!)].sessionId}`)}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/30"
                  >
                    <Play className="w-4 h-4" /> Làm bài ngay
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Khởi động AI Chuyên Sâu</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    Bạn sắp gọi hệ thống AI (Gemini) để phân tích và tạo ra một bộ đề thi độc quyền dựa trên điểm yếu:
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 font-semibold text-slate-800">
                    {formatItemName(modalState.item)}
                  </div>
                  <button onClick={handleConfirmGenerate} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-500/30">
                    <Sparkles className="w-4 h-4" /> Xác nhận tạo đề
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white border-b px-8 py-4 flex items-center justify-between" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#4F46E5" }}>
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold" style={{ color: "#1E293B" }}>AdaptEng</span>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}
          >
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>🔥</motion.span>
            <span className="text-sm font-bold" style={{ color: "#EA580C" }}>{dashboardData.streakDays} ngày</span>
          </motion.div>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
            <Star className="w-4 h-4" style={{ color: "#4F46E5" }} />
            <span className="text-sm font-bold" style={{ color: "#4F46E5" }}>{dashboardData.currentLevel}</span>
          </div>

          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all focus:outline-none"
              style={{ color: "#64748B" }}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotifMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  <div className="px-4 py-3 border-b flex justify-between items-center" style={{ borderColor: "#F1F5F9" }}>
                    <h3 className="text-sm font-bold text-gray-800">Thông báo</h3>
                    {unreadCount > 0 && (
                      <span
                        onClick={handleMarkAllAsRead}
                        className="text-xs font-semibold text-indigo-600 cursor-pointer hover:underline"
                      >
                        Đánh dấu đọc tất cả
                      </span>
                    )}
                  </div>

                  <div className="max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-gray-500 flex flex-col items-center">
                        <Bell className="w-8 h-8 mb-2 opacity-20" />
                        Bạn chưa có thông báo nào
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors flex gap-3 border-b border-slate-50 last:border-0 ${!notif.isRead ? 'bg-indigo-50/40' : ''}`}
                        >
                          <div className="mt-1 flex-shrink-0">
                            {notif.type === 'AI_DEEP_DIVE' ? <Brain className="w-5 h-5 text-indigo-600" /> : <Bell className="w-5 h-5 text-gray-400" />}
                          </div>
                          <div>
                            <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-slate-800' : 'font-semibold text-slate-600'}`}>
                              {notif.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                              {new Date(notif.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(notif.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          {!notif.isRead && <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-9 h-9 rounded-full overflow-hidden transition-transform hover:scale-105 focus:outline-none"
              style={{ border: "2px solid #C7D2FE" }}
            >
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                {getInitials(userFullName)}
              </div>
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: "#F1F5F9" }}>
                    <p className="text-sm font-bold text-gray-800 truncate">{userFullName}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{userEmail}</p>
                  </div>

                  <div className="p-1.5 space-y-1">
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 flex items-center gap-3 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      Hồ sơ cá nhân
                    </button>
                    <button
                      onClick={() => navigate("/practice-history")}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 flex items-center gap-3 transition-colors"
                    >
                      <History className="w-4 h-4 text-emerald-600" />
                      Lịch sử luyện tập
                    </button>

                    <button
                      onClick={() => navigate("/pricing")}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 rounded-xl hover:bg-amber-100 flex items-center gap-3 transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-amber-600" />
                      Nâng cấp / Gia hạn VIP
                    </button>

                    <button
                      onClick={() => navigate("/transaction-history")}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 flex items-center gap-3 transition-colors"
                    >
                      <History className="w-4 h-4 text-gray-500" />
                      Lịch sử giao dịch
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Đăng xuất
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: "#1E293B" }}>
            Chào buổi sáng, {userFullName}! 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>Hãy duy trì streak {" "}
            <span className="font-semibold" style={{ color: "#EA580C" }}>🔥 {dashboardData.streakDays} ngày</span>{" "}
            của bạn nhé!
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-3xl p-7 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #9333EA 100%)",
                boxShadow: "0 12px 40px rgba(79,70,229,0.35)",
              }}
            >
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-15" style={{ background: "#fff" }} />
              <div className="absolute bottom-0 right-12 w-20 h-20 rounded-full opacity-10" style={{ background: "#fff" }} />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                      style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
                      <Flame className="w-3.5 h-3.5" /> Nhiệm vụ hôm nay
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Đã đến lúc ôn tập! ⏰</h2>
                    <p className="text-sm" style={{ color: "rgba(199,210,254,0.9)" }}>
                      AI phát hiện bạn đang có <strong style={{ color: "#fff" }}>{dashboardData.dailyMissionCount} chủ điểm</strong> cần ôn gấp.
                      Hãy luyện tập ngay để đưa chúng vào bộ nhớ dài hạn.
                    </p>
                  </div>
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="text-4xl">
                    🧠
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartPractice}
                  className="mt-4 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "#fff", color: "#4F46E5", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                >
                  <Play className="w-4 h-4" />
                  Bắt đầu ôn tập
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-50">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      Top điểm yếu cần khắc phục <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] rounded uppercase">VIP</span>
                    </h3>
                    <p className="text-xs text-slate-500">Dựa trên thuật toán AI Spaced Repetition</p>
                  </div>
                </div>
              </div>

              {weaknesses.length === 0 ? (
                <div className="text-center py-6 text-sm text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  🎉 Tuyệt vời! Bạn không có điểm yếu nào ở mức báo động đỏ.
                </div>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                  {weaknesses.map((item, index) => {
                    const state = deepDiveStates[getUniqueKey(item)];

                    return (
                      <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${index < 3 ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-800 mb-1">
                              {formatItemName(item)}
                            </h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              Mức độ hổng kiến thức:
                              <span className={`font-semibold ${item.difficultyLevel === 'Rất cao' ? 'text-rose-500' : 'text-orange-500'}`}>
                                {item.difficultyLevel}
                              </span>
                            </p>
                          </div>
                        </div>

                        <PremiumGuard isPremium={isPremium}>
                          {state?.status === 'GENERATING' ? (
                            <button disabled className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-200 cursor-not-allowed flex items-center gap-2 w-[140px] justify-center">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tạo...
                            </button>
                          ) : state?.status === 'READY' ? (
                            <button onClick={() => navigate(`/toeic/test/deep-dive/${state.sessionId}`)} className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20 w-[140px] justify-center">
                              <Play className="w-3.5 h-3.5" /> Làm bài ngay
                            </button>
                          ) : (
                            <button onClick={() => setModalState({ isOpen: true, item })} className="px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 border border-indigo-100 w-[140px] justify-center">
                              <Brain className="w-3.5 h-3.5" /> Ôn chuyên sâu
                            </button>
                          )}
                        </PremiumGuard>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6"
              style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold" style={{ color: "#1E293B" }}>Hoạt động gần đây</h3>
              </div>

              <div className="space-y-4">
                {dashboardData.recentActivities.length === 0 ? (
                  <p className="text-sm text-center text-gray-500 py-4">Chưa có hoạt động nào. Hãy làm bài tập ngay!</p>
                ) : (
                  dashboardData.recentActivities.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15` }}>
                        <BookOpen className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold" style={{ color: "#1E293B" }}>{item.label}</span>
                          <span className="text-xs" style={{ color: "#94A3B8" }}>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full" style={{ background: "#F1F5F9" }}>
                            <div className="h-full rounded-full" style={{ width: `${(item.score / item.total) * 100}%`, background: item.color }} />
                          </div>
                          <span className="text-xs font-semibold" style={{ color: item.color }}>{item.score}/{item.total}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {dashboardData.levelUpProgress && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="bg-white rounded-3xl p-6 relative overflow-hidden"
                style={{ border: "2px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: "#1E293B" }}>
                        Hành trình thăng cấp <span className="text-indigo-600 font-black">{dashboardData.levelUpProgress.targetLevel}</span> 👑
                      </h3>
                      <p className="text-sm mt-1" style={{ color: "#64748B" }}>Hoàn thành các chỉ tiêu để mở khóa bài thi Thăng Cấp.</p>
                    </div>

                    <button
                      onClick={() => navigate(`/toeic/test/${dashboardData.levelUpProgress?.targetLevel}?mode=level-up`)}
                      disabled={!dashboardData.levelUpProgress.eligibleForBoss}
                      className="px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center transition-all disabled:opacity-50 shrink-0"
                      style={{
                        background: dashboardData.levelUpProgress.eligibleForBoss
                          ? "linear-gradient(135deg, #10B981, #059669)"
                          : "#F1F5F9",
                        color: dashboardData.levelUpProgress.eligibleForBoss ? "#fff" : "#94A3B8",
                        boxShadow: dashboardData.levelUpProgress.eligibleForBoss ? "0 4px 15px rgba(16, 185, 129, 0.4)" : "none",
                        cursor: dashboardData.levelUpProgress.eligibleForBoss ? "pointer" : "not-allowed"
                      }}
                    >
                      {dashboardData.levelUpProgress.cooldownActive
                        ? `Khóa (Còn ${dashboardData.levelUpProgress.daysLeftToRetry} ngày)`
                        : "Thi Thăng Cấp"
                      }
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span style={{ color: "#475569" }}>🔥 Tích lũy giờ học (XP)</span>
                        <span style={{ color: "#F59E0B" }}>
                          {dashboardData.levelUpProgress.currentTotalXp.toLocaleString()} / {dashboardData.levelUpProgress.requiredTotalXp.toLocaleString()} XP
                        </span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, (dashboardData.levelUpProgress.currentTotalXp / dashboardData.levelUpProgress.requiredTotalXp) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span style={{ color: "#475569" }}>🎯 Phong độ (7 ngày qua)</span>
                        <span style={{ color: "#3B82F6" }}>
                          {dashboardData.levelUpProgress.current7DayAccuracy}% / {dashboardData.levelUpProgress.required7DayAccuracy}%
                        </span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, (dashboardData.levelUpProgress.current7DayAccuracy / dashboardData.levelUpProgress.required7DayAccuracy) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="rounded-3xl p-1 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #F59E0B, #EA580C)" }}
            >
              <div className="bg-white rounded-[22px] p-6 h-full flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <h3 className="font-bold text-lg" style={{ color: "#1E293B" }}>Vũ Trụ Giải Trí VIP</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-amber-500 uppercase tracking-wide">Premium</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-5 max-w-md">
                      Khám phá câu chuyện chữa lành và dự đoán vận mệnh hôm nay. Ôn lại các từ vựng đã lưu một cách thư giãn nhất!
                    </p>

                    <PremiumGuard isPremium={isPremium}>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate("/vip-entertainment")}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg flex items-center gap-2"
                        style={{ background: "linear-gradient(135deg, #F59E0B, #EA580C)" }}
                      >
                        <Crown className="w-4 h-4" />
                        Khám phá ngay
                      </motion.button>
                    </PremiumGuard>

                  </div>
                  <div className="hidden sm:flex w-24 h-24 rounded-full bg-amber-50 items-center justify-center">
                    <Sparkles className="w-10 h-10 text-amber-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-6" style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
            >
              <div className="text-center mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3"
                  style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                  {getInitials(userFullName)}
                </div>
                <div className="font-bold" style={{ color: "#1E293B" }}>{userFullName}</div>
                <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>{userEmail}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Cấp độ", value: dashboardData.currentLevel, icon: "🎯" },
                  { label: "Streak", value: `${dashboardData.streakDays} ngày`, icon: "🔥" },
                  { label: "Số nhiệm vụ", value: `${dashboardData.dailyMissionCount}`, icon: "✅" },
                  { label: "Điểm XP", value: dashboardData.totalXP.toLocaleString(), icon: "⭐" },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-2xl text-center" style={{ background: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                    <div className="text-lg mb-0.5">{stat.icon}</div>
                    <div className="text-sm font-bold" style={{ color: "#1E293B" }}>{stat.value}</div>
                    <div className="text-xs" style={{ color: "#94A3B8" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
              className="bg-white rounded-3xl p-6" style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
            >
              <h3 className="font-bold mb-4" style={{ color: "#1E293B" }}>Truy cập nhanh</h3>
              <div className="space-y-2">
                {[
                  { icon: Map, label: "Bản đồ kiến thức", path: "/knowledge-map", color: "#4F46E5" },
                  { icon: Target, label: "Bài đánh giá năng lực", path: "/select-level", color: "#10B981" },
                ].map((item) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ x: 4, background: "#F8FAFC" }}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15` }}>
                      <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <span className="text-sm font-medium flex-1" style={{ color: "#1E293B" }}>{item.label}</span>
                    <ChevronRight className="w-4 h-4" style={{ color: "#94A3B8" }} />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
              className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #FFF7ED, #FFFBEB)", border: "1px solid #FED7AA" }}
            >
              <div className="text-xl mb-2">💡</div>
              <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
                <strong>Mẹo học tập:</strong> Ôn tập đều đặn 15 phút mỗi ngày hiệu quả hơn học dồn 2 giờ một lần nhờ thuật toán <strong>Spaced Repetition</strong>.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}