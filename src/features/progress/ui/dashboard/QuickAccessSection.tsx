import { motion } from "motion/react";
import { ChevronRight, History, Lightbulb, Map, PenLine, Target, User, ClipboardList } from "lucide-react";
import { SkillType } from "../../../../shared/ui/SkillToggle";

interface QuickAccessSectionProps {
  activeSkill: SkillType;
  hasDoneLevel: boolean;
  writingLevel?: string | null;
  onNavigate: (path: string) => void;
  onPlacementTest: () => void;
}

export function QuickAccessSection({ activeSkill, hasDoneLevel, writingLevel, onNavigate, onPlacementTest }: QuickAccessSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.42 }}
      className="w-full bg-white border-t border-slate-200/60"
    >
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-12 grid gap-10 md:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-4">Truy cập nhanh</h2>
          <div className="divide-y divide-slate-200/60 border-y border-slate-200/60">
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={() => onNavigate("/knowledge-map")}
              className="w-full flex items-center gap-4 py-4 text-left transition-all duration-300 ease-out hover:bg-slate-100/50 rounded-xl px-4 -mx-4"
            >
              <Map className="w-5 h-5 text-indigo-600 shrink-0" />
              <span className="text-sm font-medium flex-1 text-slate-900">Bản đồ kiến thức</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </motion.button>
            {!hasDoneLevel && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={onPlacementTest}
                className="w-full flex items-center gap-4 py-4 text-left transition-all duration-300 ease-out hover:bg-slate-100/50 rounded-xl px-4 -mx-4"
              >
                <Target className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-medium flex-1 text-slate-900">Bài đánh giá {activeSkill === "WRITING" ? "Writing" : "Reading"}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={() => onNavigate("/practice-history")}
              className="w-full flex items-center gap-4 py-4 text-left transition-all duration-300 ease-out hover:bg-slate-100/50 rounded-xl px-4 -mx-4"
            >
              <History className="w-5 h-5 text-slate-500 shrink-0" />
              <span className="text-sm font-medium flex-1 text-slate-900">Lịch sử luyện tập</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </motion.button>
            {activeSkill === "WRITING" && (
              <>
                {!writingLevel ? (
                  <div
                    onClick={onPlacementTest}
                    className="relative w-full flex items-center gap-4 py-4 text-left rounded-xl px-4 -mx-4 cursor-pointer select-none bg-slate-50/80 border border-dashed border-slate-300"
                  >
                    <PenLine className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-600 block">Luyện Writing hỗn hợp (Part 1 + Email + Essay)</span>
                      <span className="text-xs text-slate-400 mt-0.5 block">Cần làm bài đánh giá Writing trước</span>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600">Làm bài test</span>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    onClick={() => onNavigate("/toeic/writing/combined-practice")}
                    className="w-full flex items-center gap-4 py-4 text-left transition-all duration-300 ease-out hover:bg-slate-100/50 rounded-xl px-4 -mx-4"
                  >
                    <PenLine className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span className="text-sm font-medium flex-1 text-slate-900">Luyện Writing hỗn hợp (Part 1 + Email + Essay)</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </motion.button>
                )}
                {writingLevel && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    onClick={() => onNavigate(`/toeic/writing/combined-test/${writingLevel}`)}
                    className="w-full flex items-center gap-4 py-4 text-left transition-all duration-300 ease-out hover:bg-slate-100/50 rounded-xl px-4 -mx-4"
                  >
                    <ClipboardList className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-sm font-medium flex-1 text-slate-900">Thi thử Writing hỗn hợp ({writingLevel})</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </motion.button>
                )}
                {!writingLevel ? (
                  <div
                    onClick={onPlacementTest}
                    className="relative w-full flex items-center gap-4 py-4 text-left rounded-xl px-4 -mx-4 cursor-pointer select-none bg-slate-50/80 border border-dashed border-slate-300"
                  >
                    <History className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-600 block">Lịch sử Writing hỗn hợp</span>
                      <span className="text-xs text-slate-400 mt-0.5 block">Cần làm bài đánh giá Writing trước</span>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600">Làm bài test</span>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    onClick={() => onNavigate("/toeic/writing/combined-history")}
                    className="w-full flex items-center gap-4 py-4 text-left transition-all duration-300 ease-out hover:bg-slate-100/50 rounded-xl px-4 -mx-4"
                  >
                    <History className="w-5 h-5 text-slate-500 shrink-0" />
                    <span className="text-sm font-medium flex-1 text-slate-900">Lịch sử Writing hỗn hợp</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </motion.button>
                )}
              </>
            )}
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={() => onNavigate("/profile")}
              className="w-full flex items-center gap-4 py-4 text-left transition-all duration-300 ease-out hover:bg-slate-100/50 rounded-xl px-4 -mx-4"
            >
              <User className="w-5 h-5 text-slate-500 shrink-0" />
              <span className="text-sm font-medium flex-1 text-slate-900">Hồ sơ cá nhân</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </motion.button>
          </div>
        </div>
        <div className="flex gap-3 md:pt-11">
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-slate-900 mb-1">Mẹo học tập</p>
            <p className="text-sm leading-relaxed text-slate-500">
              Ôn tập đều đặn 15 phút mỗi ngày hiệu quả hơn học dồn 2 giờ một lần nhờ thuật toán <strong className="text-slate-700">Spaced Repetition</strong>.
            </p>
            <button
              onClick={() => onNavigate("/knowledge-map")}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:gap-2 transition-all duration-300 ease-out"
            >
              Xem bản đồ kiến thức <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
