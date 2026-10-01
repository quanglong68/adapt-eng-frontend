import { useState } from "react";
import { motion } from "motion/react";
import { Target, ArrowRight, Edit3, Sprout, BookOpen, Zap, Rocket, Gem, Crown, CheckCircle2 } from "lucide-react";
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

  // Phân biệt màu theo mode: Writing = indigo, Reading = blue
  const accent = isWritingMode
    ? {
        text: "text-indigo-600",
        bg: "bg-indigo-600",
        bgSoft: "bg-indigo-50",
        bgSoftHalf: "bg-indigo-50/50",
        border: "border-indigo-600",
        borderHover: "hover:border-indigo-300",
        ring: "ring-indigo-600/10",
        glowBg: "bg-indigo-200/60",
        glow: "shadow-[0_0_20px_rgba(79,70,229,0.4)]",
        glowHover: "hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]",
      }
    : {
        text: "text-blue-600",
        bg: "bg-blue-600",
        bgSoft: "bg-blue-50",
        bgSoftHalf: "bg-blue-50/50",
        border: "border-blue-600",
        borderHover: "hover:border-blue-300",
        ring: "ring-blue-600/10",
        glowBg: "bg-blue-200/60",
        glow: "shadow-[0_0_20px_rgba(37,99,235,0.4)]",
        glowHover: "hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]",
      };

  // Sử dụng chung 1 bộ Level đẹp (Giống hình 1 của bạn)
  const toeicLevels: { id: Level; title: string; score: string; desc: string; icon: typeof Sprout }[] = [
    { id: "A1", title: "Người mới bắt đầu", score: "10 - 250", desc: "Làm quen với từ vựng cơ bản và các tình huống giao tiếp tiếng Anh đơn giản nhất.", icon: Sprout },
    { id: "A2", title: "Sơ cấp", score: "255 - 400", desc: "Đủ khả năng giao tiếp cơ bản, hiểu các email và biển báo thông dụng.", icon: BookOpen },
    { id: "B1", title: "Trung cấp", score: "405 - 600", desc: "Mức điểm yêu cầu của đa số công ty. Đủ để trao đổi công việc hằng ngày.", icon: Zap },
    { id: "B2", title: "Trung cao cấp", score: "605 - 780", desc: "Giao tiếp trôi chảy, đọc hiểu tài liệu chuyên ngành và viết email công việc.", icon: Rocket },
    { id: "C1", title: "Cao cấp", score: "785 - 900", desc: "Sử dụng tiếng Anh linh hoạt, chuyên nghiệp trong môi trường quốc tế.", icon: Gem },
    { id: "C2", title: "Chuyên gia", score: "905 - 990", desc: "Thành thạo như người bản xứ, giải quyết mọi tình huống kinh doanh phức tạp.", icon: Crown },
  ];

  const generalLevels: { id: Level; title: string; score: string; desc: string; icon: typeof Sprout }[] = [
    { id: "A1", title: "Người mới bắt đầu", score: "A1", desc: "Mới làm quen, cần học từ vựng và ngữ pháp cơ bản nhất.", icon: Sprout },
    { id: "A2", title: "Sơ cấp", score: "A2", desc: "Hiểu và sử dụng được các cấu trúc câu đơn giản, quen thuộc.", icon: BookOpen },
    { id: "B1", title: "Trung cấp", score: "B1", desc: "Đủ tự tin giao tiếp trong các tình huống hàng ngày và đi du lịch.", icon: Zap },
    { id: "B2", title: "Trung cao cấp", score: "B2", desc: "Giao tiếp trôi chảy, có thể làm việc và học tập bằng tiếng Anh.", icon: Rocket },
    { id: "C1", title: "Cao cấp", score: "C1", desc: "Sử dụng ngôn ngữ linh hoạt, tự nhiên trong công việc và xã hội.", icon: Gem },
    { id: "C2", title: "Chuyên gia", score: "C2", desc: "Sử dụng tiếng Anh dễ dàng, tự nhiên như ngôn ngữ mẹ đẻ.", icon: Crown },
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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-50 py-12 px-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute -top-[10%] -left-[5%] h-[40%] w-[40%] rounded-full blur-[120px] ${accent.glowBg}`} />
        <div className="absolute -bottom-[10%] -right-[5%] h-[40%] w-[40%] rounded-full bg-purple-200/60 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 md:p-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-center mb-10"
        >
          <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${accent.bgSoft}`}>
            {isWritingMode ? (
              <Edit3 className={`h-8 w-8 ${accent.text}`} />
            ) : (
              <Target className={`h-8 w-8 ${accent.text}`} />
            )}
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
            Xác định mục tiêu của bạn
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-500">
            Chọn trình độ bạn muốn đạt được. AI của chúng tôi sẽ tự động thiết kế một bài kiểm tra {isWritingMode ? "Viết (Writing)" : "Đọc & Nghe"} ngắn để đánh giá năng lực hiện tại của bạn.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {levelsToDisplay.map((lvl, i) => {
            const isSelected = selectedLevel === lvl.id;
            const Icon = lvl.icon;
            return (
              <motion.div
                key={lvl.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`relative flex h-full cursor-pointer flex-col rounded-2xl border-2 bg-white p-6 transition-all duration-300 hover:scale-[1.02] ${isSelected ? `${accent.border} ${accent.bgSoftHalf} ring-4 ${accent.ring}` : `border-slate-200 ${accent.borderHover}`}`}
              >
                {isSelected && (
                  <CheckCircle2 className={`absolute right-4 top-4 h-5 w-5 ${accent.text}`} />
                )}
                <div className="mb-3 flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${isSelected ? `${accent.bg} text-white` : `bg-slate-100 ${accent.text}`}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">{lvl.score}</h3>
                </div>
                <h4 className={`mb-2 text-sm font-bold ${isSelected ? accent.text : "text-slate-900"}`}>
                  {lvl.title}
                </h4>
                <p className="flex-1 text-xs leading-relaxed text-slate-500">
                  {lvl.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            disabled={!selectedLevel}
            className={`inline-flex items-center gap-2 rounded-full px-10 py-4 text-sm font-bold text-white transition-all duration-300 ${selectedLevel ? `${accent.bg} ${accent.glow} ${accent.glowHover} hover:-translate-y-1` : "cursor-not-allowed bg-slate-300"}`}
          >
            Bắt đầu làm bài <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
