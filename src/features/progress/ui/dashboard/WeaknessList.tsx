import { motion } from "motion/react";
import { AlertTriangle, Brain, CheckCircle2, Loader2, Play } from "lucide-react";
import { DeepDiveRecommendation } from "../../../../entities/deepdive/deepDive.type";
import { PremiumGuard } from "../../../../shared/ui/PremiumGuard";
import { SkillType } from "../../../../shared/ui/SkillToggle";
import { getUniqueKey } from "./deepDiveKeys";
import { KnowledgeBadge } from "./KnowledgeBadge";

type DeepDiveStatus = 'IDLE' | 'GENERATING' | 'READY';

interface WeaknessListProps {
  weaknesses: DeepDiveRecommendation[];
  deepDiveStates: Record<string, { status: DeepDiveStatus; sessionId?: string }>;
  isPremium: boolean;
  activeSkill: SkillType;
  onOpenModal: (item: DeepDiveRecommendation) => void;
  onStartSession: (sessionId: string) => void;
}

// Nhãn Part cho từng điểm yếu (record cũ chưa có toeicPart thì không hiện chip)
function getPartChip(toeicPart?: string | null): { label: string; className: string } | null {
  switch (toeicPart) {
    case "WRITING_PART_1":
      return { label: "Part 1", className: "text-sky-700 bg-sky-50 border-sky-200" };
    case "WRITING_PART_2":
      return { label: "Part 2 · Email", className: "text-indigo-700 bg-indigo-50 border-indigo-200" };
    case "WRITING_PART_3":
      return { label: "Part 3 · Essay", className: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    case "PART_5":
      return { label: "Part 5", className: "text-slate-600 bg-slate-50 border-slate-200" };
    case "PART_6":
      return { label: "Part 6", className: "text-slate-600 bg-slate-50 border-slate-200" };
    case "PART_7_SINGLE":
    case "PART_7_MULTIPLE":
      return { label: "Part 7", className: "text-slate-600 bg-slate-50 border-slate-200" };
    default:
      return null;
  }
}

export function WeaknessList({ weaknesses, deepDiveStates, isPremium, activeSkill, onOpenModal, onStartSession }: WeaknessListProps) {
  const isWritingTab = activeSkill === "WRITING";
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.26 }}
      className="w-full bg-white border-t border-slate-200/60"
    >
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">
            Top điểm yếu {isWritingTab ? "Writing " : ""}cần khắc phục
          </h2>
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded uppercase tracking-widest text-amber-700 bg-amber-100">VIP</span>
        </div>
        <p className="text-sm text-slate-500 mb-8">Dựa trên thuật toán AI Spaced Repetition — ôn chuyên sâu từng điểm hổng{isWritingTab ? " của kỹ năng Viết" : ""}.</p>

        {weaknesses.length === 0 ? (
          <div className="flex items-center gap-2 py-10 text-sm text-slate-500">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Tuyệt vời! Bạn không có điểm yếu nào ở mức báo động{isWritingTab ? " ở kỹ năng Viết" : ""}.
          </div>
        ) : (
          <div className="divide-y divide-slate-200/60 border-y border-slate-200/60">
            {weaknesses.map((item, index) => {
              const state = deepDiveStates[getUniqueKey(item)];
              const partChip = getPartChip(item.toeicPart);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 + index * 0.06 }}
                  className="flex items-center justify-between gap-4 py-5 px-4 -mx-4 rounded-xl transition-all duration-300 ease-out hover:bg-slate-100/50 hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className={`text-2xl font-bold tabular-nums w-10 shrink-0 ${index < 3 ? 'text-rose-500' : 'text-slate-300'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-900 truncate">
                        <KnowledgeBadge item={item} />
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                        {partChip && (
                          <span className={`font-semibold px-1.5 py-0.5 rounded text-[11px] uppercase border ${partChip.className}`}>
                            {partChip.label}
                          </span>
                        )}
                        <span>
                          Mức độ hổng kiến thức:{" "}
                          <span className={`font-semibold ${item.difficultyLevel === 'Rất cao' ? 'text-rose-600' : 'text-orange-600'}`}>
                            {item.difficultyLevel}
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>

                  <PremiumGuard isPremium={isPremium}>
                    {state?.status === 'GENERATING' ? (
                      <button disabled className="px-5 py-2.5 text-xs font-semibold text-slate-400 bg-slate-200 cursor-not-allowed flex items-center gap-2 rounded-full shrink-0">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tạo...
                      </button>
                    ) : state?.status === 'READY' ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => state.sessionId && onStartSession(state.sessionId)}
                        className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all duration-300 ease-out flex items-center gap-2 rounded-full shrink-0 shadow-[0_0_16px_rgba(16,185,129,0.4)] hover:shadow-[0_0_24px_rgba(16,185,129,0.6)]"
                      >
                        <Play className="w-3.5 h-3.5" /> Làm bài ngay
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => onOpenModal(item)}
                        className="px-5 py-2.5 text-xs font-semibold text-indigo-700 hover:text-white bg-indigo-50/80 backdrop-blur-md hover:bg-indigo-600 transition-all duration-300 ease-out flex items-center gap-2 rounded-full shrink-0 shadow-[0_0_16px_rgba(79,70,229,0.3)] hover:shadow-[0_0_24px_rgba(79,70,229,0.55)]"
                      >
                        <Brain className="w-3.5 h-3.5" /> Ôn chuyên sâu
                      </motion.button>
                    )}
                  </PremiumGuard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
}
