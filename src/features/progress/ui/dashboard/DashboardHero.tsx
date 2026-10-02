import { motion } from "motion/react";
import { CalendarCheck2, Flame, Play, Sunrise, Target, Zap } from "lucide-react";
import { SkillType } from "../../../../shared/ui/SkillToggle";

interface DashboardHeroProps {
  userFullName: string;
  activeSkill: SkillType;
  dailyMissionCount: number;
  // Breakdown theo Part cho tab Writing (undefined = tab Reading, chỉ hiện tổng)
  writingPartCounts?: { label: string; count: number }[];
  streakDays: number;
  totalXP: number;
  displayLevel: string;
  hasDoneLevel: boolean;
  onStartPractice: () => void;
  onPlacementTest: () => void;
}

export function DashboardHero({
  userFullName, activeSkill, dailyMissionCount, writingPartCounts, streakDays, totalXP,
  displayLevel, hasDoneLevel, onStartPractice, onPlacementTest,
}: DashboardHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full bg-slate-50 overflow-hidden"
    >
      {/* Mesh Gradient Glow */}
      <div aria-hidden className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-400/30 blur-[100px] pointer-events-none" />
      <div aria-hidden className="absolute top-10 right-[-6rem] w-96 h-96 rounded-full bg-purple-400/30 blur-[100px] pointer-events-none" />
      <div aria-hidden className="absolute bottom-[-8rem] left-1/3 w-96 h-96 rounded-full bg-cyan-400/30 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50/80 backdrop-blur-md border border-indigo-200/60 rounded-full mb-5 shadow-[0_0_16px_rgba(79,70,229,0.25)]"
        >
          <Sunrise className="w-3.5 h-3.5" />
          {activeSkill === "WRITING" ? "Lộ trình Writing" : "Lộ trình Reading & Listening"}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut", delay: 0.16 }}
          className="text-4xl md:text-6xl font-bold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600"
        >
          Chào buổi sáng,<br className="hidden md:block" /> {userFullName}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut", delay: 0.24 }}
          className="mt-4 text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed"
        >
          AI phát hiện bạn có <strong className="text-slate-900">{dailyMissionCount} chủ điểm{writingPartCounts ? " Writing" : ""}</strong> cần
          ôn gấp hôm nay. Duy trì streak <strong className="text-slate-900">{streakDays} ngày</strong> để
          đưa kiến thức vào bộ nhớ dài hạn.
        </motion.p>
        {writingPartCounts && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut", delay: 0.28 }}
            className="mt-4 flex flex-wrap items-center gap-2"
          >
            {writingPartCounts.map((part) => (
              <span
                key={part.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white/70 backdrop-blur-md border border-indigo-200/60 rounded-full"
              >
                {part.label}: <strong className="tabular-nums">{part.count}</strong>
              </span>
            ))}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut", delay: 0.32 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
            onClick={onStartPractice}
            className="flex items-center gap-2 px-8 py-4 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1"
          >
            <Play className="w-4 h-4" />
            Bắt đầu ôn tập
          </motion.button>
          {!hasDoneLevel && (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={onPlacementTest}
              className="flex items-center gap-2 px-7 py-4 text-sm font-semibold text-slate-700 border border-slate-300 hover:bg-white transition-all duration-300 ease-out rounded-full"
            >
              <Target className="w-4 h-4" />
              Bài đánh giá {activeSkill === "WRITING" ? "Writing" : "Reading"}
            </motion.button>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Cấp độ", value: displayLevel, icon: Target, iconClass: "text-indigo-600" },
            { label: "Streak", value: `${streakDays} ngày`, icon: Flame, iconClass: "text-orange-500" },
            { label: "Nhiệm vụ hôm nay", value: `${dailyMissionCount}`, icon: CalendarCheck2, iconClass: "text-emerald-600" },
            { label: "Tổng XP", value: totalXP.toLocaleString(), icon: Zap, iconClass: "text-amber-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 + i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-2xl p-4 transition-all duration-300 ease-out"
            >
              <stat.icon className={`w-5 h-5 shrink-0 ${stat.iconClass}`} />
              <div>
                <div className="text-xl font-bold tracking-tight text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
