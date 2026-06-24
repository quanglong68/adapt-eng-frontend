import { motion } from "motion/react";
import { X, Check, Zap } from "lucide-react";
import type { MistakeCardProps } from "./types";

const EXPLANATION_STYLES = {
  indigo: {
    background: "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)",
    border: "1px solid #C7D2FE",
    iconColor: "#4F46E5",
    titleColor: "#4F46E5",
    textColor: "#3730A3",
  },
  green: {
    background: "linear-gradient(135deg, #F0FDF4 0%, #FDFFFA 100%)",
    border: "1px solid #A7F3D0",
    iconColor: "#059669",
    titleColor: "#047857",
    textColor: "#064E3B",
  },
};

export function MistakeCard({
  item,
  index,
  originalContent,
  originalContentPlacement = "after-header",
  options = [],
  correctLabel = "Trả lời đúng",
  wrongLabel = "Trả lời sai",
  correctBadgeText = "Đáp án đúng",
  wrongBadgeText = "Bạn chọn sai",
  explanationVariant = "indigo",
  showKnowledgeHeading = false,
}: MistakeCardProps) {
  const isCorrect = item.correct;
  const explanationStyle = EXPLANATION_STYLES[explanationVariant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="bg-white rounded-3xl overflow-hidden"
      style={{
        border: `2px solid ${isCorrect ? "#BBF7D0" : "#FCA5A5"}`,
        boxShadow: isCorrect
          ? "0 4px 20px rgba(16,185,129,0.08)"
          : "0 4px 20px rgba(239,68,68,0.08)",
      }}
    >
      <div
        className="flex items-center gap-3 px-6 py-3"
        style={{ background: isCorrect ? "#F0FDF4" : "#FEF2F2" }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: isCorrect ? "#10B981" : "#EF4444" }}
        >
          {isCorrect ? (
            <Check className="w-3.5 h-3.5 text-white" />
          ) : (
            <X className="w-3.5 h-3.5 text-white" />
          )}
        </div>
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: isCorrect ? "#10B981" : "#EF4444" }}
        >
          Câu {index + 1} – {isCorrect ? correctLabel : wrongLabel}
        </span>
        <div className="ml-auto flex gap-2">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: "#F1F5F9", color: "#64748B" }}
          >
            #{item.knowledgeName}
          </span>
        </div>
      </div>

      {originalContent && originalContentPlacement === "after-header" && (
        <div className="mb-6 p-4 rounded-2xl" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
          <p className="text-base font-medium leading-relaxed" style={{ color: "#1E293B" }}>
            {originalContent}
          </p>
        </div>
      )}

      <div className="p-6">
        {originalContent && originalContentPlacement === "in-body" && (
          <div className="mb-5 p-4 rounded-2xl" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <p className="text-base font-medium leading-relaxed" style={{ color: "#1E293B" }}>
              {originalContent}
            </p>
          </div>
        )}

        {showKnowledgeHeading && (
          <h3 className="text-lg font-semibold mb-5" style={{ color: "#1E293B" }}>
            Chủ điểm kiểm tra:{" "}
            <span className="text-indigo-600">{item.knowledgeName}</span>
          </h3>
        )}

        {options.length > 0 && (
          <div className="space-y-3 mb-5">
            {options.map((optText, optIndex) => {
              const letter = String.fromCharCode(65 + optIndex);
              const isCorrectOption = optText === item.correctAnswer;
              const isUserSelected = optText === item.userSelectedAnswer;

              let bgColor = "#fff";
              let borderColor = "#E5E7EB";
              let iconBg = "#F1F5F9";
              let textColor = "#1E293B";
              let badge: React.ReactNode = null;

              if (isCorrectOption) {
                bgColor = "#F0FDF4";
                borderColor = "#BBF7D0";
                iconBg = "#10B981";
                textColor = "#10B981";
                badge = (
                  <span
                    className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "#D1FAE5", color: "#10B981" }}
                  >
                    {correctBadgeText}
                  </span>
                );
              } else if (isUserSelected && !isCorrectOption) {
                bgColor = "#FEF2F2";
                borderColor = "#FECACA";
                iconBg = "#EF4444";
                textColor = "#EF4444";
                badge = (
                  <span
                    className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "#FEE2E2", color: "#EF4444" }}
                  >
                    {wrongBadgeText}
                  </span>
                );
              }

              return (
                <div
                  key={optIndex}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                  style={{ background: bgColor, border: `2px solid ${borderColor}` }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: iconBg,
                      color: isCorrectOption || (isUserSelected && !isCorrectOption) ? "#fff" : "#64748B",
                    }}
                  >
                    {isCorrectOption ? (
                      <Check className="w-4 h-4" />
                    ) : isUserSelected && !isCorrectOption ? (
                      <X className="w-4 h-4" />
                    ) : (
                      letter
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium flex-1 ${isUserSelected && !isCorrectOption ? "line-through opacity-70" : ""}`}
                    style={{ color: textColor }}
                  >
                    {optText}
                  </span>
                  {badge}
                </div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 + 0.4 }}
          className="rounded-2xl p-5"
          style={{
            background: explanationStyle.background,
            border: explanationStyle.border,
          }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: index * 0.5 }}
            >
              <Zap className="w-4 h-4" style={{ color: explanationStyle.iconColor }} />
            </motion.div>
            <span className="text-sm font-bold" style={{ color: explanationStyle.titleColor }}>
              AI Giải thích
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: explanationStyle.textColor, whiteSpace: "pre-wrap" }}>
            {item.explanation}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
