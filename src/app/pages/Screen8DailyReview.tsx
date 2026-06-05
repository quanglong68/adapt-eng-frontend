import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, AlertCircle, Zap, ChevronRight, Flame } from "lucide-react";

interface Props { onNavigate: (screen: number) => void; }

type AnswerState = "idle" | "correct" | "incorrect";

const QUESTION = {
  topic: "Cụm động từ (Phrasal Verbs)",
  topicIcon: "🎯",
  text: "It took him a while to _____ the implications of what she had just told him.",
  options: [
    { id: "A", text: "sink in" },
    { id: "B", text: "come up" },
    { id: "C", text: "take off" },
    { id: "D", text: "get through" },
  ],
  correct: "A",
  aiExplanation: "Cụm 'sink in' mang nghĩa là hiểu thấu đáo vấn đề (thường sau một khoảng thời gian). 'Take off' bạn vừa chọn nghĩa là cất cánh hoặc cởi ra nhé! 'Come up' = nảy ra/xuất hiện. 'Get through' = vượt qua/liên lạc được.",
};

const TOTAL = 10;
const CURRENT = 3;

function playTing() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
}

function playBuzz() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch {}
}

export function Screen8DailyReview({ onNavigate }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [combo, setCombo] = useState(3);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [comboAnimation, setComboAnimation] = useState(false);

  const handleCheck = () => {
    if (!selected) return;
    if (selected === QUESTION.correct) {
      setAnswerState("correct");
      setCombo((c) => c + 1);
      setComboAnimation(true);
      playTing();
      setTimeout(() => setComboAnimation(false), 600);
    } else {
      setAnswerState("incorrect");
      setCombo(0);
      playBuzz();
    }
  };

  const handleContinue = () => {
    setAnswerState("idle");
    setSelected(null);
  };

  const progressPct = (CURRENT / TOTAL) * 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
      {/* Exit warning overlay */}
      <AnimatePresence>
        {showExitWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)" }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 18, stiffness: 300 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm mx-4 text-center"
              style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
            >
              <motion.div
                animate={{ rotate: [0, -8, 8, -8, 0] }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "#FEF2F2" }}
              >
                <AlertCircle className="w-8 h-8" style={{ color: "#EF4444" }} />
              </motion.div>
              <h3 className="font-bold text-xl mb-2" style={{ color: "#1E293B" }}>Thoát bài ôn tập?</h3>
              <p className="text-sm mb-7 leading-relaxed" style={{ color: "#64748B" }}>
                Tiến độ bài ôn tập sẽ{" "}
                <span className="font-semibold" style={{ color: "#EF4444" }}>không được lưu</span>{" "}
                nếu bạn thoát ngay bây giờ.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitWarning(false)}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:bg-gray-100"
                  style={{ background: "#F1F5F9", color: "#64748B" }}
                >
                  Tiếp tục học
                </button>
                <button
                  onClick={() => onNavigate(6)}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #EF4444, #F43F5E)" }}
                >
                  Vẫn thoát
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP BAR ── */}
      <div
        className="bg-white border-b flex items-center gap-4 px-8 py-4"
        style={{ borderColor: "#E5E7EB", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}
      >
        {/* X button */}
        <motion.button
          whileHover={{ scale: 1.08, background: "#FEF2F2" }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setShowExitWarning(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{ color: "#94A3B8", background: "#F8FAFC" }}
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Progress bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold" style={{ color: "#64748B" }}>
              Câu {CURRENT} / {TOTAL}
            </span>
            <span className="text-xs font-bold" style={{ color: "#10B981" }}>{Math.round(progressPct)}% hoàn thành</span>
          </div>
          <div className="h-3.5 rounded-full overflow-hidden" style={{ background: "#E5E7EB" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full relative overflow-hidden"
              style={{ background: "linear-gradient(90deg, #10B981, #34D399)" }}
            >
              {/* Shimmer */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                className="absolute inset-0 w-1/2"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Combo streak */}
        <AnimatePresence>
          {combo > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: comboAnimation ? [1, 1.3, 1] : 1,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #FFF7ED, #FEF3C7)",
                border: "1.5px solid #FED7AA",
                boxShadow: comboAnimation ? "0 0 20px rgba(251,146,60,0.4)" : "none",
              }}
            >
              <motion.span
                animate={{ scale: comboAnimation ? [1, 1.5, 1] : [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1, repeatType: "loop" }}
                className="text-lg leading-none"
              >
                🔥
              </motion.span>
              <div>
                <div className="text-xs font-bold leading-none" style={{ color: "#EA580C" }}>{combo} Combo!</div>
                <div className="text-xs leading-none mt-0.5" style={{ color: "#FB923C" }}>Xuất sắc!</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── QUESTION AREA ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-8">
        <div className="w-full max-w-2xl">
          {/* Topic badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex items-center gap-3 mb-5"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: "#EEF2FF",
                border: "1.5px solid #C7D2FE",
              }}
            >
              <span className="text-base leading-none">{QUESTION.topicIcon}</span>
              <span className="text-sm font-semibold" style={{ color: "#4F46E5" }}>
                Đang ôn tập: {QUESTION.topic}
              </span>
            </motion.div>
          </motion.div>

          {/* Question card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white rounded-3xl p-10 mb-5"
            style={{
              boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
              border: "1px solid #F1F5F9",
            }}
          >
            <p className="text-xl leading-relaxed" style={{ color: "#1E293B" }}>
              {QUESTION.text.split("_____").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <motion.span
                      animate={{
                        background:
                          answerState === "correct" ? "#D1FAE5" :
                          answerState === "incorrect" ? "#FEE2E2" :
                          selected ? "#EEF2FF" : "#F8FAFC",
                        borderBottomColor:
                          answerState === "correct" ? "#10B981" :
                          answerState === "incorrect" ? "#EF4444" :
                          selected ? "#4F46E5" : "#CBD5E1",
                        color:
                          answerState === "correct" ? "#10B981" :
                          answerState === "incorrect" ? "#EF4444" :
                          selected ? "#4F46E5" : "#94A3B8",
                      }}
                      className="inline-block px-4 py-1 mx-1 rounded-lg border-b-2 align-baseline"
                      style={{ fontWeight: 700, minWidth: "100px", textAlign: "center" }}
                    >
                      {answerState !== "idle"
                        ? QUESTION.options.find((o) => o.id === QUESTION.correct)?.text
                        : selected
                          ? QUESTION.options.find((o) => o.id === selected)?.text
                          : "________"}
                    </motion.span>
                  )}
                </span>
              ))}
            </p>
          </motion.div>

          {/* Options */}
          <div className="space-y-3">
            {QUESTION.options.map((option, i) => {
              const isSelected = selected === option.id;
              const isCorrectOption = option.id === QUESTION.correct;
              const isRevealed = answerState !== "idle";

              let borderColor = "#E5E7EB";
              let bg = "#fff";
              let textColor = "#1E293B";
              let badgeBg = "";
              let badgeColor = "";
              let badgeLabel = "";

              if (isRevealed) {
                if (isCorrectOption) {
                  borderColor = "#10B981";
                  bg = "#F0FDF4";
                  badgeBg = "#D1FAE5";
                  badgeColor = "#10B981";
                  badgeLabel = "Đáp án đúng ✓";
                } else if (isSelected) {
                  borderColor = "#EF4444";
                  bg = "#FEF2F2";
                  textColor = "#B91C1C";
                  badgeBg = "#FEE2E2";
                  badgeColor = "#EF4444";
                  badgeLabel = "Bạn chọn ✗";
                }
              } else if (isSelected) {
                borderColor = "#4F46E5";
                bg = "#EEF2FF";
              }

              const showBadge = isRevealed && (isCorrectOption || isSelected);

              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 + i * 0.08 }}
                  whileHover={!isRevealed ? { scale: 1.01, boxShadow: "0 4px 20px rgba(79,70,229,0.10)" } : {}}
                  whileTap={!isRevealed ? { scale: 0.99 } : {}}
                  onClick={() => !isRevealed && setSelected(option.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                  style={{
                    background: bg,
                    border: `2px solid ${borderColor}`,
                    cursor: isRevealed ? "default" : "pointer",
                    boxShadow: isSelected && !isRevealed ? "0 4px 16px rgba(79,70,229,0.15)" : "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Option letter bubble */}
                  <motion.div
                    animate={{
                      background: isRevealed && isCorrectOption ? "#10B981"
                        : isRevealed && isSelected ? "#EF4444"
                        : isSelected ? "#4F46E5" : "#F1F5F9",
                      scale: (isRevealed && isCorrectOption) ? 1.1 : 1,
                    }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      color: isSelected || (isRevealed && isCorrectOption) || (isRevealed && isSelected) ? "#fff" : "#64748B",
                    }}
                  >
                    {isRevealed && isCorrectOption ? <Check className="w-5 h-5" strokeWidth={3} /> :
                      isRevealed && isSelected && !isCorrectOption ? <X className="w-5 h-5" strokeWidth={3} /> :
                      option.id}
                  </motion.div>

                  <span className="text-base font-medium flex-1" style={{ color: textColor }}>
                    {option.text}
                  </span>

                  {/* Status badge */}
                  <AnimatePresence>
                    {showBadge && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
                        style={{ background: badgeBg, color: badgeColor }}
                      >
                        {badgeLabel}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR — 3 states ── */}
      <AnimatePresence mode="wait">

        {/* ─ IDLE ─ */}
        {answerState === "idle" && (
          <motion.div
            key="idle"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border-t flex justify-center items-center px-8 py-5"
            style={{ borderColor: "#E5E7EB", boxShadow: "0 -4px 20px rgba(0,0,0,0.05)" }}
          >
            <motion.button
              whileHover={{ scale: selected ? 1.015 : 1, boxShadow: selected ? "0 10px 32px rgba(79,70,229,0.4)" : "none" }}
              whileTap={{ scale: selected ? 0.98 : 1 }}
              onClick={handleCheck}
              className="py-4 rounded-2xl font-bold text-base transition-all"
              style={{
                width: "80%",
                background: selected ? "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" : "#E5E7EB",
                color: selected ? "#fff" : "#94A3B8",
                cursor: selected ? "pointer" : "not-allowed",
                boxShadow: selected ? "0 6px 20px rgba(79,70,229,0.35)" : "none",
              }}
            >
              {selected ? "Kiểm tra →" : "Chọn một đáp án"}
            </motion.button>
          </motion.div>
        )}

        {/* ─ CORRECT ─ */}
        {answerState === "correct" && (
          <motion.div
            key="correct"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring", damping: 18, stiffness: 280 }}
            className="relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)",
              borderTop: "3px solid #10B981",
            }}
          >
            {/* Shimmer sweep */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0 w-1/3"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", pointerEvents: "none" }}
            />

            <div className="px-10 py-6 max-w-3xl mx-auto flex items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* Big check icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 10, stiffness: 250, delay: 0.05 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.18)", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
                >
                  <Check className="w-9 h-9 text-white" strokeWidth={3} />
                </motion.div>

                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-bold text-xl text-white"
                  >
                    Tuyệt vời! Chính xác. 🎉
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 }}
                    className="flex items-center gap-3 mt-1.5"
                  >
                    <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.18)", color: "#A7F3D0" }}>
                      +10 XP
                    </span>
                    <span className="text-sm" style={{ color: "#6EE7B7" }}>
                      🔥 Combo {combo}x liên tiếp!
                    </span>
                  </motion.div>
                </div>
              </div>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.04, boxShadow: "0 10px 32px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleContinue}
                className="flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-base flex-shrink-0"
                style={{ background: "#fff", color: "#065F46", boxShadow: "0 6px 20px rgba(0,0,0,0.2)" }}
              >
                Tiếp tục
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ─ INCORRECT ─ */}
        {answerState === "incorrect" && (
          <motion.div
            key="incorrect"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring", damping: 18, stiffness: 280 }}
            style={{
              background: "linear-gradient(135deg, #7F1D1D 0%, #991B1B 50%, #B91C1C 100%)",
              borderTop: "3px solid #EF4444",
            }}
          >
            <div className="px-10 py-5 max-w-3xl mx-auto">
              {/* Row 1: Icon + status + button */}
              <div className="flex items-center justify-between gap-5 mb-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0, rotate: 30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 10, stiffness: 250, delay: 0.05 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  >
                    <X className="w-8 h-8 text-white" strokeWidth={3} />
                  </motion.div>
                  <div>
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-bold text-lg text-white"
                    >
                      Chưa chính xác rồi! 😅
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 }}
                      className="text-sm mt-0.5"
                      style={{ color: "#FCA5A5" }}
                    >
                      Đáp án đúng:{" "}
                      <strong className="text-white">
                        {QUESTION.correct}. {QUESTION.options.find((o) => o.id === QUESTION.correct)?.text}
                      </strong>
                    </motion.div>
                  </div>
                </div>

                <motion.button
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.25)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleContinue}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-base flex-shrink-0 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Đã hiểu
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>

              {/* AI Explanation bubble */}
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.22, type: "spring", damping: 20 }}
                className="rounded-2xl p-4 flex gap-3"
                style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.18)" }}
              >
                <motion.div
                  animate={{ rotate: [0, 12, -12, 8, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="text-2xl flex-shrink-0 mt-0.5"
                >
                  🤖
                </motion.div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <Zap className="w-4 h-4" style={{ color: "#FCA5A5" }} />
                    </motion.div>
                    <span className="text-sm font-bold" style={{ color: "#FCA5A5" }}>AI Giải thích</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.92)" }}>
                    {QUESTION.aiExplanation}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
