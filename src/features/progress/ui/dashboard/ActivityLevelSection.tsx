import { motion } from "motion/react";
import {
  BookOpen, CalendarCheck2, Flame, Play, Target, TrendingUp, Trophy
} from "lucide-react";
import { DashboardSummaryResponse } from "../../../../entities/dashboard/dashboard.type";

interface ActivityLevelSectionProps {
  recentActivities: DashboardSummaryResponse["recentActivities"];
  levelUpProgress: DashboardSummaryResponse["levelUpProgress"];
  streakDays: number;
  totalXP: number;
  onStartPractice: () => void;
  onLevelUp: () => void;
}

export function ActivityLevelSection({
  recentActivities, levelUpProgress,
  streakDays, totalXP, onStartPractice, onLevelUp,
}: ActivityLevelSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.34 }}
      className="w-full bg-white border-t border-slate-200/60"
    >
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 grid gap-12 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">Hoạt động gần đây</h2>
          </div>
          <p className="text-sm text-slate-500 mb-6">Kết quả các phiên luyện tập mới nhất của bạn.</p>
          {recentActivities.length === 0 ? (
            <p className="text-sm text-slate-500 py-6">Chưa có hoạt động nào. Hãy làm bài tập ngay!</p>
          ) : (
            <div className="divide-y divide-slate-200/60 border-y border-slate-200/60">
              {recentActivities.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut", delay: 0.3 + i * 0.06 }}
                  className="flex items-center gap-4 py-4 transition-all duration-300 ease-out hover:scale-[1.01]"
                >
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-slate-50" style={{ color: item.color }}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <span className="text-sm font-semibold text-slate-900 truncate">{item.label}</span>
                      <span className="text-xs text-slate-400 shrink-0">{item.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${(item.score / item.total) * 100}%` }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 + i * 0.06 }}
                          className="h-full rounded-full" style={{ background: item.color }}
                        />
                      </div>
                      <span className="text-xs font-semibold tabular-nums" style={{ color: item.color }}>{item.score}/{item.total}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          {levelUpProgress ? (
            <>
              <div className="flex items-center gap-3 mb-1">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">
                  Thăng cấp <span className="text-indigo-600">{levelUpProgress.targetLevel}</span>
                </h2>
              </div>
              <p className="text-sm text-slate-500 mb-6">Hoàn thành các chỉ tiêu để mở khóa bài thi Thăng Cấp.</p>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-600 flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-500" /> Tích lũy giờ học (XP)</span>
                    <span className="text-amber-600 tabular-nums">
                      {levelUpProgress.currentTotalXp.toLocaleString()} / {levelUpProgress.requiredTotalXp.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${Math.min(100, (levelUpProgress.currentTotalXp / levelUpProgress.requiredTotalXp) * 100)}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-amber-500 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-600 flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-blue-500" /> Phong độ (7 ngày qua)</span>
                    <span className="text-blue-600 tabular-nums">
                      {levelUpProgress.current7DayAccuracy}% / {levelUpProgress.required7DayAccuracy}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${Math.min(100, (levelUpProgress.current7DayAccuracy / levelUpProgress.required7DayAccuracy) * 100)}%` }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={onLevelUp}
                  disabled={!levelUpProgress.eligibleForBoss}
                  className={`px-6 py-3 font-semibold text-sm flex items-center justify-center transition-all duration-300 ease-out rounded-full disabled:opacity-50 ${levelUpProgress.eligibleForBoss
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_18px_rgba(16,185,129,0.4)] hover:shadow-[0_0_28px_rgba(16,185,129,0.6)] hover:-translate-y-0.5"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                >
                  {levelUpProgress.cooldownActive
                    ? `Khóa (Còn ${levelUpProgress.daysLeftToRetry} ngày)`
                    : "Thi Thăng Cấp"
                  }
                </motion.button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center shrink-0">
                <CalendarCheck2 className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Mục tiêu ngày</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Streak <strong className="text-slate-900">{streakDays} ngày</strong> · Tổng{" "}
                  <strong className="text-slate-900">{totalXP.toLocaleString()} XP</strong> — học hôm nay để giữ lửa!
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={onStartPractice}
                  className="mt-4 flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-out rounded-full"
                >
                  <Play className="w-4 h-4" /> Luyện tập ngay
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
