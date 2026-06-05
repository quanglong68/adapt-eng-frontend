import { useState } from "react";
import { motion } from "motion/react";
import { Flame, Bell, Settings, BookOpen, Brain, Target, TrendingUp, ChevronRight, Zap, Clock, Star, Play, Map } from "lucide-react";

interface Props { onNavigate: (screen: number) => void; }

const skills = ["Từ vựng", "Ngữ pháp", "Đọc hiểu", "Cụm từ"];

const recentActivity = [
  { label: "Cụm động từ", score: 4, total: 10, color: "#EF4444", time: "Hôm qua" },
  { label: "Thì hoàn thành", score: 8, total: 10, color: "#10B981", time: "2 ngày trước" },
  { label: "Từ vựng học thuật", score: 5, total: 10, color: "#F97316", time: "3 ngày trước" },
];

export function Screen6Dashboard() {
  const [selectedSkill, setSelectedSkill] = useState("Từ vựng");

  return (
    <div className="min-h-screen" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
      {/* Top Navigation */}
      <div className="bg-white border-b px-8 py-4 flex items-center justify-between" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#4F46E5" }}>
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold" style={{ color: "#1E293B" }}>AdaptEng</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Streak */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🔥
            </motion.span>
            <span className="text-sm font-bold" style={{ color: "#EA580C" }}>5 ngày</span>
          </motion.div>

          {/* Level badge */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
            <Star className="w-4 h-4" style={{ color: "#4F46E5" }} />
            <span className="text-sm font-bold" style={{ color: "#4F46E5" }}>B2</span>
          </div>

          <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all" style={{ color: "#64748B" }}>
            <Bell className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-full overflow-hidden" style={{ border: "2px solid #C7D2FE" }}>
            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
              NH
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 max-w-6xl mx-auto">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold" style={{ color: "#1E293B" }}>
            Chào buổi sáng, Nguyễn Hải! 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>Hãy duy trì streak {" "}
            <span className="font-semibold" style={{ color: "#EA580C" }}>🔥 5 ngày</span>{" "}
            của bạn nhé!
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main content - left 2 cols */}
          <div className="col-span-2 space-y-6">
            {/* Daily Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl p-7 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #9333EA 100%)",
                boxShadow: "0 12px 40px rgba(79,70,229,0.35)",
              }}
            >
              {/* BG decoration */}
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
                      AI phát hiện bạn đang quên <strong style={{ color: "#fff" }}>3 chủ điểm ngữ pháp</strong>.
                      Hãy ôn lại ngay để đưa chúng vào bộ nhớ dài hạn.
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="text-4xl"
                  >
                    🧠
                  </motion.div>
                </div>

                {/* Progress */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: "rgba(199,210,254,0.8)" }}>Tiến độ hôm nay</span>
                    <span className="text-xs font-semibold" style={{ color: "#fff" }}>0 / 15 phút</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
                    <div className="h-full w-0 rounded-full" style={{ background: "rgba(167,243,208,0.8)" }} />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => alert("Bắt đầu ôn tập! (Tính năng đang phát triển)")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "#fff", color: "#4F46E5", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                >
                  <Play className="w-4 h-4" />
                  Bắt đầu ôn tập (15 phút)
                </motion.button>
              </div>
            </motion.div>

            {/* Generate Practice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6"
              style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#EEF2FF" }}>
                  <Zap className="w-4 h-4" style={{ color: "#4F46E5" }} />
                </div>
                <h3 className="font-bold" style={{ color: "#1E293B" }}>Sinh đề luyện tập bằng AI</h3>
              </div>

              <p className="text-sm mb-5" style={{ color: "#64748B" }}>
                Chọn kỹ năng muốn luyện tập. AI sẽ tạo bài tập phù hợp với trình độ và lỗ hổng kiến thức của bạn.
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {skills.map((skill) => (
                  <motion.button
                    key={skill}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedSkill(skill)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: selectedSkill === skill ? "#4F46E5" : "#F1F5F9",
                      color: selectedSkill === skill ? "#fff" : "#64748B",
                      border: `2px solid ${selectedSkill === skill ? "#4F46E5" : "transparent"}`,
                    }}
                  >
                    {skill}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.015, boxShadow: "0 8px 24px rgba(79,70,229,0.35)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 4px 16px rgba(79,70,229,0.3)" }}
              >
                <Brain className="w-4 h-4" />
                Sinh đề luyện tập: {selectedSkill}
              </motion.button>
            </motion.div>

            {/* Recent activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6"
              style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold" style={{ color: "#1E293B" }}>Hoạt động gần đây</h3>
                <button className="text-xs font-semibold" style={{ color: "#4F46E5" }}>Xem tất cả</button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}15` }}>
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
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* User stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-6"
              style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
            >
              <div className="text-center mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3"
                  style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                  NH
                </div>
                <div className="font-bold" style={{ color: "#1E293B" }}>Nguyễn Hải</div>
                <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>nguyenhai@email.com</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Cấp độ", value: "B2", icon: "🎯" },
                  { label: "Streak", value: "5 ngày", icon: "🔥" },
                  { label: "Tổng câu", value: "342", icon: "✅" },
                  { label: "Điểm XP", value: "1,280", icon: "⭐" },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-2xl text-center" style={{ background: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                    <div className="text-lg mb-0.5">{stat.icon}</div>
                    <div className="text-sm font-bold" style={{ color: "#1E293B" }}>{stat.value}</div>
                    <div className="text-xs" style={{ color: "#94A3B8" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-3xl p-6"
              style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
            >
              <h3 className="font-bold mb-4" style={{ color: "#1E293B" }}>Truy cập nhanh</h3>
              <div className="space-y-2">
                {[
                  { icon: Map, label: "Bản đồ kiến thức", screen: 7, color: "#4F46E5" },
                  { icon: Target, label: "Ôn tập cá nhân hóa", screen: 8, color: "#10B981" },
                  { icon: TrendingUp, label: "Xem tiến độ", screen: 7, color: "#F97316" },
                  { icon: Clock, label: "Xem lại sai sót", screen: 5, color: "#EF4444" },
                ].map((item) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ x: 4, background: "#F8FAFC" }}
                    onClick={() => alert(`Đang chuyển đến ${item.label}`)}
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

            {/* Tip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-2xl p-4"
              style={{ background: "linear-gradient(135deg, #FFF7ED, #FFFBEB)", border: "1px solid #FED7AA" }}
            >
              <div className="text-xl mb-2">💡</div>
              <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
                <strong>Mẹo học tập:</strong> Ôn tập đều đặn 15 phút mỗi ngày hiệu quả hơn học dồn 2 giờ một lần nhờ kỹ thuật <strong>Spaced Repetition</strong>.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
