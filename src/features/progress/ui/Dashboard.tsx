import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Lock, Target } from "lucide-react";
import { dashboardService } from "../../../entities/dashboard/dashboard.service";
import { userService } from "../../../entities/user/user.service";
import { DashboardSummaryResponse } from "../../../entities/dashboard/dashboard.type";
import { notificationService } from "../../../entities/notification/notification.service";
import { AppNotification } from "../../../entities/notification/notification.type";
import { deepDiveService } from "../../../entities/deepdive/deepDive.service";
import { handleApiError } from "../../../shared/api/handleApiError";
import toast from "react-hot-toast";
import { STORAGE_KEYS } from "../../../shared/lib/storageKeys";
import { DeepDiveRecommendation } from "../../../entities/deepdive/deepDive.type";
import { SkillType } from "../../../shared/ui/SkillToggle";
import { getUniqueKey } from "./dashboard/deepDiveKeys";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardHero } from "./dashboard/DashboardHero";
import { MissionStrip } from "./dashboard/MissionStrip";
import { VipStrip } from "./dashboard/VipStrip";
import { WeaknessList } from "./dashboard/WeaknessList";
import { ActivityLevelSection } from "./dashboard/ActivityLevelSection";
import { QuickAccessSection } from "./dashboard/QuickAccessSection";
import { DeepDiveModal } from "./dashboard/DeepDiveModal";
import { DashboardSkeleton } from "./dashboard/DashboardSkeleton";

type DeepDiveStatus = 'IDLE' | 'GENERATING' | 'READY';

export function Dashboard() {
  const navigate = useNavigate();

  const [activeSkill, setActiveSkill] = useState<SkillType>("READING_LISTENING");

  // Dùng state riêng chuẩn 100% từ Profile API
  const [readingLevel, setReadingLevel] = useState<string | null>(null);
  const [writingLevel, setWritingLevel] = useState<string | null>(null);

  const [dashboardData, setDashboardData] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  const [userFullName, setUserFullName] = useState(localStorage.getItem(STORAGE_KEYS.fullName) || "Học viên");
  const [userEmail, setUserEmail] = useState(localStorage.getItem(STORAGE_KEYS.email) || "hocvien@email.com");
  const currentTrack = localStorage.getItem(STORAGE_KEYS.learningTrack) || "GENERAL";

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const [weaknesses, setWeaknesses] = useState<DeepDiveRecommendation[]>([]);
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

    const token = localStorage.getItem(STORAGE_KEYS.token);
    if (!token) return;

    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';

    const eventSource = new EventSource(`${baseUrl}/notifications/stream?token=${token}`);

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
        const [dashData, profileData] = await Promise.all([
          dashboardService.getSummary(),
          userService.getProfile(),
        ]);

        setDashboardData(dashData);
        setIsPremium(profileData.premium);

        // CẬP NHẬT CẢ 2 LEVEL TỪ CHUẨN API PROFILE 
        setReadingLevel(profileData.currentLevel || null);
        setWritingLevel(profileData.writingCurrentLevel || null);

        const initialStates: Record<string, { status: DeepDiveStatus, sessionId?: string }> = {};
        setDeepDiveStates(initialStates);

        setUserFullName(profileData.fullName);
        setUserEmail(profileData.email);
        localStorage.setItem(STORAGE_KEYS.fullName, profileData.fullName);
        localStorage.setItem(STORAGE_KEYS.email, profileData.email);
        localStorage.setItem('premium', profileData.premium ? 'true' : 'false');

        // Cache lại level cũ cho hệ thống
        if (profileData.currentLevel) localStorage.setItem(STORAGE_KEYS.currentLevel, profileData.currentLevel);

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Điểm yếu tách theo tab kỹ năng: Writing lấy nhóm WRITING_PART_1/2/3, còn lại lấy nhóm Reading.
  useEffect(() => {
    const skill = activeSkill === "WRITING" ? "WRITING" : "READING";
    deepDiveService.getRecommendations(skill).then((weaknessData) => {
      setWeaknesses(weaknessData);
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
    }).catch(() => setWeaknesses([]));
  }, [activeSkill]);

  const handleConfirmGenerate = async () => {
    if (!modalState.item) return;
    const { knowledgeItemId, targetWord } = modalState.item;
    const uniqueKey = getUniqueKey(modalState.item);

    setDeepDiveStates(prev => ({ ...prev, [uniqueKey]: { status: 'GENERATING' } }));

    try {
      const res = await deepDiveService.initSession({ knowledgeItemId, targetWord });
      setDeepDiveStates(prev => ({
        ...prev,
        [uniqueKey]: { status: 'GENERATING', sessionId: res.sessionId }
      }));
    } catch (error: any) {
      setDeepDiveStates(prev => ({ ...prev, [uniqueKey]: { status: 'IDLE' } }));
      handleApiError(error, "Không thể khởi tạo AI lúc này. Vui lòng thử lại sau!");
    }
  };

  useEffect(() => {
    const generatingItems = Object.entries(deepDiveStates).filter(([_, state]) => state.status === 'GENERATING' && state.sessionId);
    if (generatingItems.length === 0) return;

    let retryCount = 0;
    const MAX_RETRIES = 15;

    const interval = setInterval(async () => {
      retryCount++;

      for (const [uniqueKey, state] of generatingItems) {
        if (retryCount >= MAX_RETRIES) {
          setDeepDiveStates(prev => ({ ...prev, [uniqueKey]: { status: 'IDLE' } }));
          toast.error("Thời gian tạo đề quá lâu. Vui lòng thử lại sau!");
          continue;
        }

        try {
          const responseData = await deepDiveService.getSessionQuestions(state.sessionId!);
          sessionStorage.setItem(`deep_dive_${state.sessionId}`, JSON.stringify(responseData));
          setDeepDiveStates(prev => ({ ...prev, [uniqueKey]: { status: 'READY', sessionId: state.sessionId } }));
        } catch (error: any) {
          if (error.response && error.response.status !== 404) {
            setDeepDiveStates(prev => ({ ...prev, [uniqueKey]: { status: 'IDLE' } }));
            handleApiError(error, "Lệch kết nối AI (Lỗi máy chủ). Vui lòng thử lại sau!");
          }
        }
      }

      const stillGenerating = Object.values(deepDiveStates).some(s => s.status === 'GENERATING');
      if (!stillGenerating) clearInterval(interval);

    }, 3000);

    return () => clearInterval(interval);
  }, [deepDiveStates]);

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

  const handleStartPractice = () => {
    if (currentTrack === "TOEIC") {
      // Skill Writing có lộ trình luyện tập riêng, không dùng chung với Reading & Nghe
      if (activeSkill === "WRITING") {
        // Session hỗn hợp (3 Part 1 + Part 2 Email + Part 3 Essay)
        navigate("/toeic/writing/combined-practice");
      } else {
        navigate("/toeic/practice");
      }
    } else {
      navigate("/practice-execution");
    }
  };

  const handlePlacementTestRoute = () => {
    if (activeSkill === "WRITING") {
      navigate("/toeic/writing/select-level");
    } else {
      navigate("/select-level");
    }
  };

  const handleNavigate = (path: string) => navigate(path);

  const handleLevelUp = () => {
    if (dashboardData?.levelUpProgress) {
      navigate(`/toeic/test/${dashboardData.levelUpProgress.targetLevel}?mode=level-up`);
    }
  };

  const handleStartDeepDiveSession = (sessionId: string) => {
    navigate(`/toeic/test/deep-dive/${sessionId}`);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500 font-semibold">Không thể kết nối đến máy chủ. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  // --- LOGIC HIỂN THỊ LEVEL VÀ KHÓA MÀN HÌNH SIÊU CHUẨN ---
  const displayLevel = activeSkill === "WRITING"
    ? (writingLevel || "Chưa có")
    : (readingLevel || "Chưa có");

  const isLocked =
    (activeSkill === "WRITING" && !writingLevel) ||
    (activeSkill === "READING_LISTENING" && !readingLevel);

  // Đã có level = đã làm bài test → ẩn nút "Bài đánh giá"
  const hasDoneLevel = activeSkill === "WRITING" ? !!writingLevel : !!readingLevel;

  // Số liệu nhiệm vụ tách theo tab: Writing dùng breakdown P1/P2/P3, Reading dùng số riêng.
  // BE cũ chưa trả field mới (undefined) → dùng tổng như trước và ẨN chips để khỏi hiện số 0 gây hiểu lầm.
  const isWritingTab = activeSkill === "WRITING";
  const hasBreakdown = dashboardData.writingMissionCount != null && dashboardData.readingMissionCount != null;
  const heroMissionCount = !hasBreakdown
    ? dashboardData.dailyMissionCount
    : isWritingTab
      ? dashboardData.writingMissionCount!
      : dashboardData.readingMissionCount!;
  const writingPartCounts = [
    { label: "Part 1 · Mô tả tranh", count: dashboardData.writingPart1Count ?? 0 },
    { label: "Part 2 · Email", count: dashboardData.writingPart2Count ?? 0 },
    { label: "Part 3 · Essay", count: dashboardData.writingPart3Count ?? 0 },
  ];

  const modalDeepDiveState = modalState.item ? deepDiveStates[getUniqueKey(modalState.item)] : undefined;

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>

      <AnimatePresence>
        {modalState.isOpen && modalState.item && (
          <DeepDiveModal
            item={modalState.item}
            status={modalDeepDiveState}
            onClose={() => setModalState({ isOpen: false, item: null })}
            onConfirm={handleConfirmGenerate}
            onStartSession={handleStartDeepDiveSession}
          />
        )}
      </AnimatePresence>

      <DashboardHeader
        userFullName={userFullName}
        userEmail={userEmail}
        displayLevel={displayLevel}
        streakDays={dashboardData.streakDays}
        activeSkill={activeSkill}
        currentTrack={currentTrack}
        notifications={notifications}
        unreadCount={unreadCount}
        isNotifMenuOpen={isNotifMenuOpen}
        isProfileMenuOpen={isProfileMenuOpen}
        notifMenuRef={notifMenuRef}
        profileMenuRef={profileMenuRef}
        onToggleNotif={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
        onToggleProfile={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        onSkillChange={setActiveSkill}
        onNotificationClick={handleNotificationClick}
        onMarkAllAsRead={handleMarkAllAsRead}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className="relative">

        {/* LỚP OVERLAY KHÓA */}
        <AnimatePresence>
          {isLocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 top-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center px-6 py-8 border-b border-slate-200 shadow-sm"
            >
              <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full text-center px-6 md:px-10 py-8 shadow-sm">
                <div className={`w-14 h-14 flex items-center justify-center mx-auto mb-5 rounded-2xl ${activeSkill === "WRITING" ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"}`}>
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">Tính năng bị khóa</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Để sử dụng các tính năng luyện tập, bạn cần hoàn thành bài Đánh giá Năng lực cho kỹ năng <strong>{activeSkill === "WRITING" ? "Viết (Writing)" : "Đọc & Nghe"}</strong> trước.
                </p>
                <button
                  onClick={handlePlacementTestRoute}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.02] ${activeSkill === "WRITING" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
                >
                  <Target className="w-4 h-4" /> Làm bài Đánh giá ngay
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NỘI DUNG CHÍNH (Sẽ bị blur nếu isLocked = true) */}
        <div className={`transition-all duration-500 ${isLocked ? "blur-md opacity-40 pointer-events-none select-none" : ""}`}>

          <DashboardHero
            userFullName={userFullName}
            activeSkill={activeSkill}
            dailyMissionCount={heroMissionCount}
            writingPartCounts={isWritingTab && hasBreakdown ? writingPartCounts : undefined}
            streakDays={dashboardData.streakDays}
            totalXP={dashboardData.totalXP}
            displayLevel={displayLevel}
            hasDoneLevel={hasDoneLevel}
            onStartPractice={handleStartPractice}
            onPlacementTest={handlePlacementTestRoute}
          />

          <MissionStrip dailyMissionCount={heroMissionCount} skillLabel={isWritingTab ? "Writing" : "Reading & Nghe"} />

          <VipStrip
            isPremium={isPremium}
            onExplore={() => navigate("/vip-entertainment")}
          />

          <WeaknessList
            weaknesses={weaknesses}
            deepDiveStates={deepDiveStates}
            isPremium={isPremium}
            activeSkill={activeSkill}
            onOpenModal={(item) => setModalState({ isOpen: true, item })}
            onStartSession={handleStartDeepDiveSession}
          />

          <ActivityLevelSection
            recentActivities={dashboardData.recentActivities}
            levelUpProgress={dashboardData.levelUpProgress}
            streakDays={dashboardData.streakDays}
            totalXP={dashboardData.totalXP}
            onStartPractice={handleStartPractice}
            onLevelUp={handleLevelUp}
          />

          <QuickAccessSection
            activeSkill={activeSkill}
            hasDoneLevel={hasDoneLevel}
            writingLevel={writingLevel}
            onNavigate={handleNavigate}
            onPlacementTest={handlePlacementTestRoute}
          />

        </div>
      </main>
    </div>
  );
}
