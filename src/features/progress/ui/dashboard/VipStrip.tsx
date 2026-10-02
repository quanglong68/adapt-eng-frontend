import { motion } from "motion/react";
import { Crown, Sparkles } from "lucide-react";
import { PremiumGuard } from "../../../../shared/ui/PremiumGuard";

interface VipStripProps {
  isPremium: boolean;
  onExplore: () => void;
}

export function VipStrip({ isPremium, onExplore }: VipStripProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 }}
      className="relative w-full bg-slate-950 overflow-hidden border-y border-amber-500/40"
    >
      {/* Animated tech glow */}
      <motion.div
        aria-hidden
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute -top-32 left-1/4 w-[28rem] h-[28rem] rounded-full bg-amber-500/25 blur-[110px] pointer-events-none"
      />
      <motion.div
        aria-hidden
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1.1, 1, 1.1] }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
        className="absolute -bottom-32 right-1/4 w-[26rem] h-[26rem] rounded-full bg-violet-600/25 blur-[110px] pointer-events-none"
      />
      <div aria-hidden className="absolute top-0 left-1/2 w-96 h-40 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col lg:flex-row lg:items-center gap-8">
        <div className="w-14 h-14 bg-amber-500/10 backdrop-blur-md border border-amber-500/40 flex items-center justify-center shrink-0 rounded-2xl shadow-[0_0_24px_rgba(251,191,36,0.35)]">
          <Sparkles className="w-7 h-7 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-2">
            <Crown className="w-3.5 h-3.5" /> Premium • Dành riêng cho VIP
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
            Khu vực giải trí{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">VIP</span>
          </h2>
          <p className="text-sm md:text-base text-slate-400 mt-2 max-w-xl leading-relaxed">
            Thư giãn với câu chuyện và ôn lại các từ vựng đã lưu theo cách nhẹ nhàng nhất.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Truyện chữa lành", "Tarot mỗi ngày", "Ôn từ vựng thư giãn"].map((f) => (
              <span key={f} className="px-4 py-1.5 text-xs font-medium text-slate-300 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0">
          <PremiumGuard isPremium={isPremium}>
            <motion.button
              whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.98 }}
              onClick={onExplore}
              className="flex items-center gap-2 px-8 py-4 text-sm font-bold bg-amber-400 text-slate-900 hover:bg-amber-300 transition-all duration-300 ease-out rounded-full shadow-[0_0_24px_rgba(251,191,36,0.45)] hover:shadow-[0_0_36px_rgba(251,191,36,0.65)] hover:-translate-y-1"
            >
              <Crown className="w-4 h-4" />
              Khám phá ngay
            </motion.button>
          </PremiumGuard>
          <p className="mt-3 text-[11px] text-slate-500 text-center">Trải nghiệm không giới hạn cho VIP</p>
        </div>
      </div>
    </motion.section>
  );
}
