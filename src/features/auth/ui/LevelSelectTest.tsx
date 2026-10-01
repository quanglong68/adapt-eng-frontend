import { useState } from "react";
import { motion } from "motion/react";
import { Target, ArrowRight, BookOpen, Edit3 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Level } from "../../../shared/types/common.type";
import { STORAGE_KEYS } from "../../../shared/lib/storageKeys";

export function LevelSelectTest() {
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra xem người dùng đang đứng ở URL của Writing hay Reading
  // Nếu URL là /toeic/writing/select-level thì isWritingMode = true
  const isWritingMode = location.pathname.includes("/writing");
  const currentTrack = localStorage.getItem(STORAGE_KEYS.learningTrack) || "GENERAL";

  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  // Sử dụng chung 1 bộ Level đẹp (Giống hình 1 của bạn)
  const toeicLevels: { id: Level; title: string; score: string; desc: string; icon: string; color: string; bg: string }[] = [
    { id: "A1", title: "Người mới bắt đầu", score: "10 - 250", desc: "Làm quen với từ vựng cơ bản và các tình huống giao tiếp tiếng Anh đơn giản nhất.", icon: "🌱", color: "#10B981", bg: "#D1FAE5" },
    { id: "A2", title: "Sơ cấp", score: "255 - 400", desc: "Đủ khả năng giao tiếp cơ bản, hiểu các email và biển báo thông dụng.", icon: "📖", color: "#3B82F6", bg: "#DBEAFE" },
    { id: "B1", title: "Trung cấp", score: "405 - 600", desc: "Mức điểm yêu cầu của đa số công ty. Đủ để trao đổi công việc hằng ngày.", icon: "⚡", color: "#F59E0B", bg: "#FEF3C7" },
    { id: "B2", title: "Trung cao cấp", score: "605 - 780", desc: "Giao tiếp trôi chảy, đọc hiểu tài liệu chuyên ngành và viết email công việc.", icon: "🚀", color: "#EC4899", bg: "#FCE7F3" },
    { id: "C1", title: "Cao cấp", score: "785 - 900", desc: "Sử dụng tiếng Anh linh hoạt, chuyên nghiệp trong môi trường quốc tế.", icon: "💎", color: "#06B6D4", bg: "#CFFAFE" },
    { id: "C2", title: "Chuyên gia", score: "905 - 990", desc: "Thành thạo như người bản xứ, giải quyết mọi tình huống kinh doanh phức tạp.", icon: "👑", color: "#8B5CF6", bg: "#EDE9FE" },
  ];

  const generalLevels: { id: Level; title: string; score: string; desc: string; icon: string; color: string; bg: string }[] = [
    { id: "A1", title: "Người mới bắt đầu", score: "A1", desc: "Mới làm quen, cần học từ vựng và ngữ pháp cơ bản nhất.", icon: "🌱", color: "#10B981", bg: "#D1FAE5" },
    { id: "A2", title: "Sơ cấp", score: "A2", desc: "Hiểu và sử dụng được các cấu trúc câu đơn giản, quen thuộc.", icon: "📖", color: "#3B82F6", bg: "#DBEAFE" },
    { id: "B1", title: "Trung cấp", score: "B1", desc: "Đủ tự tin giao tiếp trong các tình huống hàng ngày và đi du lịch.", icon: "⚡", color: "#F59E0B", bg: "#FEF3C7" },
    { id: "B2", title: "Trung cao cấp", score: "B2", desc: "Giao tiếp trôi chảy, có thể làm việc và học tập bằng tiếng Anh.", icon: "🚀", color: "#EC4899", bg: "#FCE7F3" },
    { id: "C1", title: "Cao cấp", score: "C1", desc: "Sử dụng ngôn ngữ linh hoạt, tự nhiên trong công việc và xã hội.", icon: "💎", color: "#06B6D4", bg: "#CFFAFE" },
    { id: "C2", title: "Chuyên gia", score: "C2", desc: "Sử dụng tiếng Anh dễ dàng, tự nhiên như ngôn ngữ mẹ đẻ.", icon: "👑", color: "#8B5CF6", bg: "#EDE9FE" },
  ];

  const levelsToDisplay = currentTrack === "TOEIC" ? toeicLevels : generalLevels;

  const handleContinue = () => {
    if (!selectedLevel) return;

    // ĐIỀU HƯỚNG THÔNG MINH TÙY THUỘC VÀO MODE
    if (isWritingMode) {
      navigate(`/toeic/writing/test/${selectedLevel}`);
    } else {
      // Luồng Đọc/Nghe cũ của bạn
      if (currentTrack === "TOEIC") {
        navigate(`/toeic/test/${selectedLevel}`);
      } else {
        navigate(`/test/${selectedLevel}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-6 relative overflow-hidden" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-40 ${isWritingMode ? 'bg-indigo-200' : 'bg-blue-200'}`} />
        <div className={`absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-40 ${isWritingMode ? 'bg-purple-200' : 'bg-emerald-200'}`} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl w-full z-10 bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100">
        <div className="text-center mb-10">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 ${isWritingMode ? 'bg-indigo-100' : 'bg-blue-50'}`}>
            {isWritingMode ? (
              <Edit3 className="w-8 h-8 text-indigo-600" />
            ) : (
              <Target className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-3 text-slate-800 tracking-tight">
            Xác định mục tiêu của bạn
          </h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
            Chọn trình độ bạn muốn đạt được. AI của chúng tôi sẽ tự động thiết kế một bài kiểm tra {isWritingMode ? "Viết (Writing)" : "Đọc & Nghe"} ngắn để đánh giá năng lực hiện tại của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {levelsToDisplay.map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            return (
              <motion.div
                key={lvl.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedLevel(lvl.id)}
                className="relative p-6 rounded-2xl cursor-pointer transition-all border-2 flex flex-col h-full bg-white"
                style={{
                  borderColor: isSelected ? (isWritingMode ? "#4F46E5" : "#3B82F6") : "#F1F5F9",
                  boxShadow: isSelected ? `0 10px 25px ${isWritingMode ? 'rgba(79,70,229,0.15)' : 'rgba(59,130,246,0.15)'}` : "0 4px 15px rgba(0,0,0,0.03)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl drop-shadow-sm">{lvl.icon}</span>
                  <h3 className="font-bold text-xl text-slate-800">{lvl.score}</h3>
                </div>
                <h4 className="font-bold text-sm mb-2" style={{ color: isSelected ? (isWritingMode ? "#4F46E5" : "#3B82F6") : "#1E293B" }}>
                  {lvl.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed flex-1">
                  {lvl.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            disabled={!selectedLevel}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            style={{
              background: selectedLevel
                ? (isWritingMode ? "linear-gradient(135deg, #4F46E5, #3730A3)" : "linear-gradient(135deg, #3B82F6, #1D4ED8)")
                : "#CBD5E1",
            }}
          >
            Bắt đầu làm bài <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}