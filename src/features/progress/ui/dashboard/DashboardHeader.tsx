import { RefObject } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell, BookOpen, Brain, Crown, Edit3, Flame, History, LogOut, MoonStar, Star, User
} from "lucide-react";
import { AppNotification } from "../../../../entities/notification/notification.type";
import { SkillToggle, SkillType } from "../../../../shared/ui/SkillToggle";

const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

interface DashboardHeaderProps {
  userFullName: string;
  userEmail: string;
  displayLevel: string;
  streakDays: number;
  activeSkill: SkillType;
  currentTrack: string;
  notifications: AppNotification[];
  unreadCount: number;
  isNotifMenuOpen: boolean;
  isProfileMenuOpen: boolean;
  notifMenuRef: RefObject<HTMLDivElement | null>;
  profileMenuRef: RefObject<HTMLDivElement | null>;
  onToggleNotif: () => void;
  onToggleProfile: () => void;
  onSkillChange: (skill: SkillType) => void;
  onNotificationClick: (notif: AppNotification) => void;
  onMarkAllAsRead: () => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export function DashboardHeader({
  userFullName, userEmail, displayLevel, streakDays, activeSkill, currentTrack,
  notifications, unreadCount, isNotifMenuOpen, isProfileMenuOpen,
  notifMenuRef, profileMenuRef,
  onToggleNotif, onToggleProfile, onSkillChange,
  onNotificationClick, onMarkAllAsRead, onNavigate, onLogout,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900">AdaptEng</span>
          </div>

          {currentTrack === "TOEIC" && (
            <SkillToggle currentSkill={activeSkill} onChange={onSkillChange} />
          )}
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-50 border border-orange-200"
            title="Chuỗi ngày học liên tiếp"
          >
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-700">{streakDays} ngày</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200" title="Cấp độ hiện tại">
            {activeSkill === "WRITING" ? <Edit3 className="w-4 h-4 text-indigo-600" /> : <Star className="w-4 h-4 text-indigo-600" />}
            <span className="text-sm font-semibold text-indigo-700">{displayLevel}</span>
          </div>

          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={onToggleNotif}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all duration-300 focus:outline-none"
              title="Thông báo"
              aria-label="Thông báo"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
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
                  className="absolute right-0 mt-3 w-80 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-900">Thông báo</h3>
                    {unreadCount > 0 && (
                      <span
                        onClick={onMarkAllAsRead}
                        className="text-xs font-semibold text-indigo-600 cursor-pointer hover:underline"
                      >
                        Đánh dấu đọc tất cả
                      </span>
                    )}
                  </div>

                  <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-slate-500 flex flex-col items-center">
                        <Bell className="w-8 h-8 mb-2 opacity-20" />
                        Bạn chưa có thông báo nào
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => onNotificationClick(notif)}
                          className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors duration-300 flex gap-3 border-b border-slate-100 last:border-0 ${!notif.isRead ? 'bg-indigo-50/40' : ''}`}
                        >
                            <div className="mt-1 flex-shrink-0">
                              {notif.type === 'AI_DEEP_DIVE' ? <Brain className="w-5 h-5 text-indigo-600" /> : notif.type === 'VIP_ENTERTAINMENT_READY' ? <MoonStar className="w-5 h-5 text-amber-400" /> : <Bell className="w-5 h-5 text-slate-400" />}
                            </div>
                          <div>
                            <h4 className={`text-sm ${!notif.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-600'}`}>
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
              onClick={onToggleProfile}
              className="w-9 h-9 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none border-2 border-indigo-200"
              title="Tài khoản"
              aria-label="Tài khoản"
            >
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white bg-indigo-600">
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
                  className="absolute right-0 mt-3 w-60 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 truncate">{userFullName}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{userEmail}</p>
                  </div>

                  <div className="p-1.5">
                    <button
                      onClick={() => onNavigate("/profile")}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 flex items-center gap-3 transition-all duration-300"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Hồ sơ cá nhân
                    </button>
                    <button
                      onClick={() => onNavigate("/practice-history")}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 flex items-center gap-3 transition-all duration-300"
                    >
                      <History className="w-4 h-4 text-slate-400" />
                      Lịch sử luyện tập
                    </button>
                    <button
                      onClick={() => onNavigate("/transaction-history")}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 flex items-center gap-3 transition-all duration-300"
                    >
                      <History className="w-4 h-4 text-slate-400" />
                      Lịch sử giao dịch
                    </button>
                  </div>

                  <div className="p-1.5 border-t border-slate-100">
                    <button
                      onClick={() => onNavigate("/pricing")}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 flex items-center gap-3 transition-all duration-300"
                    >
                      <Crown className="w-4 h-4 text-indigo-600" />
                      Nâng cấp / Gia hạn VIP
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-3 transition-all duration-300"
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
    </header>
  );
}
