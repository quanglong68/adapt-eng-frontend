import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Crown, Loader2, Mail, Star, Trophy, ArrowLeft, Clock, History, ChevronRight } from "lucide-react";
import { userService } from "../../../entities/user/user.service";
import { UserProfileResponse } from "../../../entities/user/user.type";
import { getLevelDisplay, LearningTrack } from "../../../shared/types/common.type";
import { STORAGE_KEYS } from "../../../shared/lib/storageKeys";

export function UserProfile() {
  const navigate = useNavigate();
  const currentTrack = (localStorage.getItem(STORAGE_KEYS.learningTrack) || "GENERAL") as LearningTrack;
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
        <p className="font-semibold text-slate-500">Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-rose-600 font-bold">Không thể tải hồ sơ người dùng.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HERO strip full-width */}
      <section className="w-full bg-slate-50 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-[100px] bg-indigo-400/30" />
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[100px] bg-purple-400/30" />
        <div className="absolute -bottom-24 right-10 w-96 h-96 rounded-full blur-[100px] bg-cyan-400/30" />
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 hover:text-indigo-500 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Quay lại Dashboard
            </button>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Hồ sơ cá nhân
            </h1>
            <p className="text-slate-500 mt-2">Quản lý thông tin, XP, cấp độ và gói dịch vụ của bạn</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row sm:items-center gap-6"
          >
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-600/25 bg-gradient-to-br from-indigo-600 to-violet-600 shrink-0">
              {getInitials(profile.fullName)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">{profile.fullName}</h2>
                {profile.premium && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-950 text-amber-400 border border-amber-500/30"
                  >
                    <Crown className="w-3.5 h-3.5" /> VIP
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Mail className="w-4 h-4" /> {profile.email}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="w-full bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
              className="bg-white border border-slate-200/60 rounded-2xl p-6 flex items-center gap-5"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-50 shrink-0">
                <Trophy className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-0.5">Tổng XP</p>
                <p className="text-2xl font-bold text-slate-900">{profile.totalXp.toLocaleString()}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}
              className="bg-white border border-slate-200/60 rounded-2xl p-6 flex items-center gap-5"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-indigo-50 shrink-0">
                <Star className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-0.5">Cấp độ hiện tại</p>
                <p className="text-2xl font-bold text-slate-900">
                  {profile.currentLevel ? getLevelDisplay(profile.currentLevel, currentTrack) : "Chưa test"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Writing history strip - list phẳng */}
      <section className="w-full bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h3 className="font-bold text-slate-900 mb-4">Hoạt động học tập</h3>
            <div className="divide-y divide-slate-100 border-y border-slate-200/60">
              <button
                onClick={() => navigate("/toeic/writing/practice-history")}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-100/50 rounded-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-pink-50">
                  <History className="w-7 h-7 text-pink-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">Lịch sử luyện Writing</p>
                  <p className="text-sm text-slate-500">Xem lại các bài luyện Writing Part 1 hàng ngày của bạn</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium / VIP strip */}
      <section className="w-full bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}
          >
            {profile.premium ? (
              <div className="rounded-2xl p-8 text-white relative overflow-hidden bg-slate-950 border border-amber-500/30">
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl" />
                <Crown className="absolute right-6 bottom-6 w-32 h-32 text-white opacity-5" />
                <div className="relative z-10">
                  <h3 className="text-lg font-medium text-slate-400 mb-1">Gói dịch vụ đang kích hoạt</h3>
                  {/* Đã đổi tên hiển thị thành "GÓI VIP" */}
                  <p className="text-3xl font-bold text-amber-400 mb-6">GÓI VIP</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10">
                    <Clock className="w-4 h-4 text-slate-300" />
                    <span className="text-sm font-medium">Hết hạn vào: {formatDate(profile.premiumEndDate)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-slate-200/60 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-slate-100">
                  <Crown className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Bạn đang dùng bản Miễn phí</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                  Nâng cấp lên gói VIP để mở khóa toàn bộ sức mạnh của AI, sinh đề thi không giới hạn và thuật toán ôn tập Spaced Repetition.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/pricing")}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-bold inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1 transition-all duration-300"
                >
                  <Crown className="w-5 h-5" />
                  Khám phá các gói VIP
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
