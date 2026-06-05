import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ArrowRight, Target, Clock } from "lucide-react";
import { Level } from "../types/common.type";
import { testService } from "../services/test.service";
import { useNavigate } from "react-router-dom";
interface Props { onNavigate: (screen: number) => void; }
export type LevelInfo = {
  level: Level;
  name: string;
  desc: string;
  emoji: string;
  color: string;
  bg: string;
  questions: number;
};


// Danh sách dữ liệu đã đồng nhất
export const LEVEL_LIST: LevelInfo[] = [
  { level: "A1", name: "Beginner", desc: "Người mới bắt đầu", emoji: "🌱", color: "#10B981", bg: "#D1FAE5", questions: 30 },
  { level: "A2", name: "Elementary", desc: "Kiến thức cơ bản", emoji: "📖", color: "#34D399", bg: "#ECFDF5", questions: 30 },
  { level: "B1", name: "Intermediate", desc: "Trung cấp", emoji: "⚡", color: "#3B82F6", bg: "#EFF6FF", questions: 30 },
  { level: "B2", name: "Upper-Int.", desc: "Trên trung cấp", emoji: "🚀", color: "#6366F1", bg: "#EEF2FF", questions: 30 },
  { level: "C1", name: "Advanced", desc: "Nâng cao", emoji: "💎", color: "#8B5CF6", bg: "#F5F3FF", questions: 30 },
  { level: "C2", name: "Mastery", desc: "Thành thạo", emoji: "👑", color: "#A855F7", bg: "#FDF4FF", questions: 30 },
];
export function LevelSelectTest() {
  const [selected, setSelected] = useState<Level | null>(null);
  const navigate = useNavigate();

  const selectedLevel = LEVEL_LIST.find((l) => l.level === selected);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-8" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background: "#EEF2FF", color: "#4F46E5" }}
          >
            <Target className="w-4 h-4" />
            <span className="text-sm font-semibold">Bài kiểm tra đầu vào AI</span>
          </motion.div>

          <h1 className="text-4xl font-bold mb-4" style={{ color: "#1E293B", lineHeight: 1.2 }}>
            Hãy để AI xác định trình độ
            <br />
            <span style={{ color: "#4F46E5" }}>thực sự của bạn</span>
          </h1>

          <p className="text-base" style={{ color: "#64748B" }}>
            Chọn một cấp độ mục tiêu để bắt đầu bài kiểm tra{" "}
            <strong style={{ color: "#1E293B" }}>30 câu hỏi</strong>.
          </p>
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {LEVEL_LIST.map((level, i) => {
            const isSelected = selected === level.level;
            return (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                whileHover={{ y: -6, boxShadow: `0 20px 48px ${level.color}28` }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelected(level.level)}
                className="relative p-6 rounded-2xl cursor-pointer transition-all select-none"
                style={{
                  background: isSelected ? level.bg : "#fff",
                  border: `2px solid ${isSelected ? level.color : "#E5E7EB"}`,
                  boxShadow: isSelected ? `0 8px 32px ${level.color}30` : "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                {/* Selected badge */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-3 right-3"
                    >
                      <CheckCircle2 className="w-5 h-5" style={{ color: level.color }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Level badge */}
                <motion.div
                  animate={{ scale: isSelected ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center mb-4"
                  style={{ background: isSelected ? level.color : level.bg }}
                >
                  <span className="text-xl leading-none mb-0.5">{level.emoji}</span>
                  <span className="text-xs font-bold" style={{ color: isSelected ? "#fff" : level.color }}>
                    {level.level}
                  </span>
                </motion.div>

                <h3 className="font-bold mb-1 text-sm" style={{ color: "#1E293B" }}>{level.name}</h3>
                <p className="text-xs mb-3" style={{ color: "#64748B" }}>{level.desc}</p>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" style={{ color: "#94A3B8" }} />
                  <span className="text-xs" style={{ color: "#94A3B8" }}>~20 phút</span>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-xs font-semibold px-2.5 py-1 rounded-full inline-block"
                    style={{ background: level.color, color: "#fff" }}
                  >
                    Đã chọn ✓
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Info row */}
        <AnimatePresence>
          {selectedLevel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 rounded-2xl flex items-center gap-4"
              style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: selectedLevel.color }}>
                {selectedLevel.emoji}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: "#4F46E5" }}>
                  Bài kiểm tra {selectedLevel.level} – {selectedLevel.name}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#6366F1" }}>
                  30 câu hỏi • Khoảng 20 phút • AI chấm điểm tức thì
                </div>
              </div>
              <div className="text-2xl">{selectedLevel.emoji}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 32px rgba(79,70,229,0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/test/${selected!}`)}
            disabled={!selected}
            className="inline-flex items-center gap-3 px-12 py-4 rounded-2xl text-white font-semibold text-base transition-all"
            style={{
              background: selected ? "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" : "#D1D5DB",
              boxShadow: selected ? "0 6px 20px rgba(79,70,229,0.35)" : "none",
            }}
          >
            Bắt đầu làm bài
            <motion.div animate={{ x: selected ? [0, 4, 0] : 0 }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
