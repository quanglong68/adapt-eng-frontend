import { motion } from "motion/react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AlertTriangle, CheckCircle2, TrendingDown, Clock, Zap, BookOpen, ChevronRight, BarChart2 } from "lucide-react";

interface Props { onNavigate: (screen: number) => void; }

const radarData = [
  { skill: "Thì (Tenses)", score: 72, fullMark: 100 },
  { skill: "Cụm động từ", score: 28, fullMark: 100 },
  { skill: "Câu điều kiện", score: 55, fullMark: 100 },
  { skill: "Từ vựng", score: 40, fullMark: 100 },
  { skill: "Câu bị động", score: 88, fullMark: 100 },
  { skill: "Đọc hiểu", score: 60, fullMark: 100 },
];

const weakPoints = [
  {
    id: 1,
    name: "Cụm động từ",
    score: 28,
    status: "critical",
    label: "Cần ôn gấp",
    lastMistake: "Hôm qua",
    trend: -12,
    color: "#EF4444",
    bg: "#FEF2F2",
    border: "#FECACA",
  },
  {
    id: 2,
    name: "Từ vựng nâng cao",
    score: 40,
    status: "warning",
    label: "Đang quên dần",
    lastMistake: "3 ngày trước",
    trend: -5,
    color: "#F97316",
    bg: "#FFF7ED",
    border: "#FED7AA",
  },
  {
    id: 3,
    name: "Câu điều kiện",
    score: 55,
    status: "moderate",
    label: "Cần luyện thêm",
    lastMistake: "5 ngày trước",
    trend: 3,
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
];

const masteredItems = [
  {
    id: 1,
    name: "Câu bị động",
    score: 88,
    label: "Đã nhớ lâu dài",
    lastReview: "1 tuần trước",
    color: "#10B981",
    bg: "#F0FDF4",
    border: "#BBF7D0",
  },
  {
    id: 2,
    name: "Thì hiện tại hoàn thành",
    score: 85,
    label: "Thành thạo",
    lastReview: "1 tuần trước",
    color: "#10B981",
    bg: "#F0FDF4",
    border: "#BBF7D0",
  },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="px-3 py-2 rounded-xl text-xs font-semibold shadow-lg" style={{ background: "#1E293B", color: "#fff" }}>
        {d.skill}: <span style={{ color: "#A5B4FC" }}>{d.score}%</span>
      </div>
    );
  }
  return null;
};

export function Screen7KnowledgeMap({ onNavigate }: Props) {
  return (
    <div className="min-h-screen py-10 px-8" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1E293B" }}>Bản đồ Kiến thức 🗺️</h1>
            <p className="text-sm mt-1" style={{ color: "#64748B" }}>Trực quan hóa điểm mạnh và lỗ hổng kiến thức của bạn</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
            <BarChart2 className="w-4 h-4" style={{ color: "#4F46E5" }} />
            <span className="text-sm font-semibold" style={{ color: "#4F46E5" }}>Cấp độ: B2</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-5 gap-6">
          {/* Radar chart - left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-3 bg-white rounded-3xl p-6"
            style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5" style={{ color: "#4F46E5" }} />
              <h2 className="font-bold" style={{ color: "#1E293B" }}>Biểu đồ kỹ năng</h2>
              <div className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "#EEF2FF", color: "#4F46E5" }}>
                Cập nhật: hôm nay
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "#64748B", fontSize: 11, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
                />
                <Radar
                  name="Điểm"
                  dataKey="score"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {radarData.map((item) => {
                const color = item.score >= 70 ? "#10B981" : item.score >= 50 ? "#F59E0B" : "#EF4444";
                return (
                  <div key={item.skill} className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: "#F8FAFC" }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate" style={{ color: "#1E293B" }}>{item.skill}</div>
                      <div className="text-xs" style={{ color }}>{item.score}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right col */}
          <div className="col-span-2 space-y-6">
            {/* Overall score */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-5"
              style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
            >
              <h3 className="font-bold mb-4 text-sm" style={{ color: "#1E293B" }}>Tổng quan</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Điểm TB", value: "57%", icon: "📊", color: "#F97316" },
                  { label: "Đã thông thạo", value: "2/6", icon: "🏆", color: "#10B981" },
                  { label: "Cần ôn gấp", value: "2", icon: "🚨", color: "#EF4444" },
                  { label: "Đang ổn", value: "2", icon: "📈", color: "#F59E0B" },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-2xl text-center" style={{ background: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                    <div className="text-xl mb-1">{stat.icon}</div>
                    <div className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs" style={{ color: "#94A3B8" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Study suggestion */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl p-4"
              style={{ background: "linear-gradient(135deg, #EEF2FF, #F5F3FF)", border: "1px solid #C7D2FE" }}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">🤖</div>
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: "#4F46E5" }}>AI Gợi ý</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#3730A3" }}>
                    Tập trung ôn <strong>Cụm động từ</strong> trong 3-5 ngày tới. Đây là kỹ năng có điểm thấp nhất và ảnh hưởng lớn đến điểm tổng.
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => onNavigate(8)}
                className="w-full mt-3 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5"
                style={{ background: "#4F46E5" }}
              >
                Ôn ngay
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Weak Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5" style={{ color: "#EF4444" }} />
            <h2 className="font-bold" style={{ color: "#1E293B" }}>Lỗ hổng kiến thức cần ôn tập</h2>
          </div>

          <div className="space-y-3">
            {weakPoints.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.1 }}
                className="bg-white rounded-2xl p-5 flex items-center gap-5"
                style={{ border: `1.5px solid ${item.border}`, boxShadow: `0 2px 12px ${item.color}10` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                  <TrendingDown className="w-5 h-5" style={{ color: item.color }} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-sm" style={{ color: "#1E293B" }}>{item.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: item.bg, color: item.color }}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                        className="h-full rounded-full"
                        style={{ background: item.color }}
                      />
                    </div>
                    <span className="text-sm font-bold" style={{ color: item.color }}>{item.score}%</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-xs flex items-center gap-1" style={{ color: "#94A3B8" }}>
                    <Clock className="w-3 h-3" />
                    {item.lastMistake}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    onClick={() => onNavigate(8)}
                    className="mt-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                    style={{ background: item.color }}
                  >
                    Ôn ngay →
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mastered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5" style={{ color: "#10B981" }} />
            <h2 className="font-bold" style={{ color: "#1E293B" }}>Đã thông thạo 🎉</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {masteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.1 }}
                className="bg-white rounded-2xl p-5 flex items-center gap-4"
                style={{ border: `1.5px solid ${item.border}` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                  <CheckCircle2 className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm mb-1" style={{ color: "#1E293B" }}>{item.name}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                        className="h-full rounded-full"
                        style={{ background: item.color }}
                      />
                    </div>
                    <span className="text-xs font-bold" style={{ color: item.color }}>{item.score}%</span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: item.bg, color: item.color }}>
                  ✓ {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
