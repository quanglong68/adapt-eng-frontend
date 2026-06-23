import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ArrowRight, Target, Clock } from "lucide-react";
import { Level } from "../types/common.type";
import { useNavigate } from "react-router-dom";

interface Props { onNavigate?: (screen: number) => void; }

export type LevelInfo = {
  level: Level;
  emoji: string;
  color: string;
  bg: string;
  questions: number;
};

// Danh sách dữ liệu cơ bản (màu sắc, icon, số câu)
export const LEVEL_LIST: LevelInfo[] = [
  { level: "A1", emoji: "🌱", color: "#10B981", bg: "#D1FAE5", questions: 30 },
  { level: "A2", emoji: "📖", color: "#34D399", bg: "#ECFDF5", questions: 30 },
  { level: "B1", emoji: "⚡", color: "#3B82F6", bg: "#EFF6FF", questions: 30 },
  { level: "B2", emoji: "🚀", color: "#6366F1", bg: "#EEF2FF", questions: 30 },
  { level: "C1", emoji: "💎", color: "#8B5CF6", bg: "#F5F3FF", questions: 30 },
  { level: "C2", emoji: "👑", color: "#A855F7", bg: "#FDF4FF", questions: 30 },
];

// NỘI DUNG HIỂN THỊ DÀNH RIÊNG CHO TOEIC
export const TOEIC_LEVEL_INFO: Record<Level, { title: string; subtitle: string; desc: string }> = {
  A1: { title: "10 - 250", subtitle: "Người mới bắt đầu", desc: "Làm quen với từ vựng cơ bản và các tình huống giao tiếp tiếng Anh đơn giản nhất." },
  A2: { title: "255 - 400", subtitle: "Sơ cấp", desc: "Đủ khả năng giao tiếp cơ bản, hiểu các email và biển báo thông dụng." },
  B1: { title: "405 - 600", subtitle: "Trung cấp", desc: "Mức điểm yêu cầu của đa số công ty. Đủ để trao đổi công việc hằng ngày." },
  B2: { title: "605 - 780", subtitle: "Trung cao cấp", desc: "Giao tiếp trôi chảy, đọc hiểu tài liệu chuyên ngành và viết email công việc." },
  C1: { title: "785 - 900", subtitle: "Cao cấp", desc: "Sử dụng tiếng Anh linh hoạt, chuyên nghiệp trong môi trường quốc tế." },
  C2: { title: "905 - 990", subtitle: "Chuyên gia", desc: "Thành thạo như người bản xứ, giải quyết mọi tình huống kinh doanh phức tạp." },
};

// NỘI DUNG HIỂN THỊ DÀNH RIÊNG CHO TIẾNG ANH TỔNG QUÁT (GENERAL)
export const GENERAL_LEVEL_INFO: Record<Level, { title: string; subtitle: string; desc: string }> = {
  A1: { title: "A1", subtitle: "Beginner", desc: "Hiểu và sử dụng các cụm từ quen thuộc, giao tiếp cơ bản trong đời sống." },
  A2: { title: "A2", subtitle: "Elementary", desc: "Giao tiếp được các chủ đề quen thuộc (gia đình, bản thân, mua sắm...)." },
  B1: { title: "B1", subtitle: "Intermediate", desc: "Xử lý tốt các tình huống khi đi du lịch, viết email và kể chuyện đơn giản." },
  B2: { title: "B2", subtitle: "Upper-Intermediate", desc: "Giao tiếp trôi chảy với người bản xứ, hiểu ý chính các văn bản phức tạp." },
  C1: { title: "C1", subtitle: "Advanced", desc: "Diễn đạt linh hoạt, dùng tiếng Anh hiệu quả trong công việc và học thuật." },
  C2: { title: "C2", subtitle: "Proficient", desc: "Thành thạo gần như người bản xứ, tóm tắt và phân tích mọi loại văn bản." },
};

export function LevelSelectTest() {
  const [selected, setSelected] = useState<Level | null>(null);
  const navigate = useNavigate();

  // Lấy Track hiện tại từ LocalStorage
  const currentTrack = localStorage.getItem("learningTrack") || "GENERAL";

  // Tùy theo Track mà dùng bộ dữ liệu hiển thị khác nhau
  const displayInfoMap = currentTrack === "TOEIC" ? TOEIC_LEVEL_INFO : GENERAL_LEVEL_INFO;

  const selectedDisplayInfo = selected ? displayInfoMap[selected] : null;
  const selectedLevel = LEVEL_LIST.find((l) => l.level === selected);

  return (
    <div className="min-h-screen py-12 px-6 flex items-center justify-center relative overflow-hidden" style={{ background: "#F9FAFB" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-2xl relative z-10"
        style={{ border: "1px solid #F1F5F9" }}
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner"
          >
            <Target className="w-8 h-8" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">Xác định mục tiêu của bạn</h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto leading-relaxed">
            Chọn trình độ bạn muốn đạt được. AI của chúng tôi sẽ tự động thiết kế một bài kiểm tra ngắn để đánh giá năng lực hiện tại của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {LEVEL_LIST.map((item, index) => {
            const isSelected = selected === item.level;
            const info = displayInfoMap[item.level]; // Dùng dữ liệu linh hoạt theo Track

            return (
              <motion.button
                key={item.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(item.level)}
                className="relative text-left p-5 rounded-2xl border-2 transition-all duration-300 group overflow-hidden"
                style={{
                  background: isSelected ? "#EEF2FF" : "#fff",
                  borderColor: isSelected ? "#6366F1" : "#F1F5F9",
                  boxShadow: isSelected ? "0 10px 25px -5px rgba(99, 102, 241, 0.15)" : "none",
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl filter drop-shadow-sm">{item.emoji}</span>
                    <span className="font-black text-xl tracking-tight" style={{ color: isSelected ? "#4F46E5" : "#1E293B" }}>
                      {info.title} {/* Hiển thị Điểm TOEIC hoặc A1, B1 */}
                    </span>
                  </div>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-indigo-600">
                      <CheckCircle2 className="w-6 h-6 fill-indigo-100" />
                    </motion.div>
                  )}
                </div>

                <div className="font-bold mb-1" style={{ color: isSelected ? "#4338CA" : "#334155" }}>
                  {info.subtitle} {/* Subtitle tùy biến */}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: isSelected ? "#6366F1" : "#94A3B8" }}>
                  {info.desc}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Info Banner */}
        <AnimatePresence mode="wait">
          {selected && selectedDisplayInfo && selectedLevel && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-8 p-4 rounded-2xl flex flex-wrap sm:flex-nowrap items-center gap-4 border"
              style={{ background: "#EEF2FF", borderColor: "#C7D2FE" }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm shrink-0">
                <Clock className="w-5 h-5" style={{ color: "#4F46E5" }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: "#4F46E5" }}>
                  Bài kiểm tra {currentTrack === "TOEIC" ? "TOEIC " : ""}{selectedDisplayInfo.title} – {selectedDisplayInfo.subtitle}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#6366F1" }}>
                  Khoảng 20 phút • AI chấm điểm tức thì
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
            onClick={() => {
              // RẼ NHÁNH ĐIỀU HƯỚNG BẰNG CURRENT TRACK - BỎ DẤU CHẤM THAN GÂY LỖI
              if (currentTrack === "TOEIC") {
                navigate(`/toeic/test/${selected}`);
              } else {
                navigate(`/test/${selected}`);
              }
            }}
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