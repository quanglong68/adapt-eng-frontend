import { motion } from "motion/react";
import { Brain } from "lucide-react";

export function MissionStrip({ dailyMissionCount }: { dailyMissionCount: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="w-full bg-white border-t border-slate-200/60"
    >
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-12 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center shrink-0 rounded-2xl">
          <Brain className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-1">Nhiệm vụ hôm nay</p>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">Đã đến lúc ôn tập!</h2>
          <p className="text-sm text-slate-500 mt-1">
            <strong className="text-slate-900">{dailyMissionCount} chủ điểm</strong> đang chờ bạn xử lý bằng Spaced Repetition.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
