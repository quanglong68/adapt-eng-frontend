import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Crown, Loader2, Mail, Star, Trophy, ArrowLeft, Clock } from "lucide-react";
import { userService } from "../services/user.service";
import { UserProfileResponse } from "../types/user.type";
import { getLevelDisplay, LearningTrack } from "../types/common.type";

export function UserProfile() {
  const navigate = useNavigate();
  const currentTrack = (localStorage.getItem("learningTrack") || "GENERAL") as LearningTrack;
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
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#F9FAFB" }}>
        <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: "#4F46E5" }} />
        <p className="font-semibold text-gray-500">Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F9FAFB" }}>
        <p className="text-red-500 font-bold">Không thể tải hồ sơ người dùng.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
      <div className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, background: "#F1F5F9" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-xl font-bold" style={{ color: "#1E293B" }}>Hồ sơ cá nhân</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-8 px-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 relative overflow-hidden"
          style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-bold text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
              {getInitials(profile.fullName)}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold" style={{ color: "#1E293B" }}>{profile.fullName}</h2>
                {profile.premium && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                    style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}
                  >
                    <Crown className="w-3.5 h-3.5" /> VIP
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <Mail className="w-4 h-4" /> {profile.email}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 flex items-center gap-5"
            style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "#FEF3C7" }}>
              <Trophy className="w-7 h-7 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-0.5">Tổng XP</p>
              <p className="text-2xl font-bold" style={{ color: "#1E293B" }}>{profile.totalXp.toLocaleString()}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 flex items-center gap-5"
            style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "#EEF2FF" }}>
              <Star className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-0.5">Cấp độ hiện tại</p>
              <p className="text-2xl font-bold" style={{ color: "#1E293B" }}>
                {profile.currentLevel ? getLevelDisplay(profile.currentLevel, currentTrack) : "Chưa test"}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        >
          {profile.premium ? (
            <div className="rounded-3xl p-8 text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1E293B, #0F172A)", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-yellow-500 rounded-full opacity-10 blur-2xl" />
              <Crown className="absolute right-6 bottom-6 w-32 h-32 text-white opacity-5" />

              <div className="relative z-10">
                <h3 className="text-lg font-medium text-gray-400 mb-1">Gói dịch vụ đang kích hoạt</h3>
                {/* Đã đổi tên hiển thị thành "GÓI VIP" */}
                <p className="text-3xl font-bold text-yellow-500 mb-6">GÓI VIP</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <Clock className="w-4 h-4 text-gray-300" />
                  <span className="text-sm font-medium">Hết hạn vào: {formatDate(profile.premiumEndDate)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border text-center" style={{ borderColor: "#E5E7EB", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#F3F4F6" }}>
                <Crown className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "#1E293B" }}>Bạn đang dùng bản Miễn phí</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                Nâng cấp lên gói VIP để mở khóa toàn bộ sức mạnh của AI, sinh đề thi không giới hạn và thuật toán ôn tập Spaced Repetition.
              </p>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(79,70,229,0.3)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/pricing")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-bold inline-flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
              >
                <Crown className="w-5 h-5" />
                Khám phá các gói VIP
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}