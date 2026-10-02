import { motion } from "motion/react";
import { X, Check, Zap } from "lucide-react";
import type { MistakeCardProps } from "./types";

const EXPLANATION_STYLES = {
  indigo: {
    container: "bg-indigo-50 border-indigo-200",
    iconColor: "text-indigo-600",
    titleColor: "text-indigo-600",
    textColor: "text-indigo-900",
  },
  green: {
    container: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    titleColor: "text-emerald-700",
    textColor: "text-emerald-900",
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
      className={`bg-white rounded-3xl overflow-hidden border-2 shadow-lg ${isCorrect ? "border-emerald-200 shadow-emerald-100" : "border-red-200 shadow-red-100"}`}
    >
      <div
        className={`flex items-center gap-3 px-6 py-3 ${isCorrect ? "bg-emerald-50" : "bg-red-50"}`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? "bg-emerald-500" : "bg-red-500"}`}
        >
          {isCorrect ? (
            <Check className="w-3.5 h-3.5 text-white" />
          ) : (
            <X className="w-3.5 h-3.5 text-white" />
          )}
        </div>
        <span
          className={`text-xs font-bold uppercase tracking-wider ${isCorrect ? "text-emerald-600" : "text-red-500"}`}
        >
          Câu {index + 1} – {isCorrect ? correctLabel : wrongLabel}
        </span>
        <div className="ml-auto flex gap-2">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500"
          >
            #{item.knowledgeName}
          </span>
        </div>
      </div>

      {originalContent && originalContentPlacement === "after-header" && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-base font-medium leading-relaxed text-slate-800">
            {originalContent}
          </p>
        </div>
      )}

      <div className="p-6">
        {originalContent && originalContentPlacement === "in-body" && (
          <div className="mb-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-base font-medium leading-relaxed text-slate-800">
              {originalContent}
            </p>
          </div>
        )}

        {showKnowledgeHeading && (
          <h3 className="text-lg font-semibold mb-5 text-slate-800">
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

              let rowClasses = "bg-white border-slate-200 hover:bg-slate-100/50";
              let iconClasses = "bg-slate-100 text-slate-500";
              let textClasses = "text-slate-800";
              let badge: React.ReactNode = null;

              if (isCorrectOption) {
                rowClasses = "bg-emerald-50 border-emerald-200";
                iconClasses = "bg-emerald-500 text-white";
                textClasses = "text-emerald-600";
                badge = (
                  <span
                    className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600"
                  >
                    {correctBadgeText}
                  </span>
                );
              } else if (isUserSelected && !isCorrectOption) {
                rowClasses = "bg-red-50 border-red-200";
                iconClasses = "bg-red-500 text-white";
                textClasses = "text-red-500 line-through opacity-70";
                badge = (
                  <span
                    className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-500"
                  >
                    {wrongBadgeText}
                  </span>
                );
              }

              return (
                <div
                  key={optIndex}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all border-2 ${rowClasses}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${iconClasses}`}
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
                    className={`text-sm font-medium flex-1 ${textClasses}`}
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
          className={`rounded-2xl p-5 border ${explanationStyle.container}`}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: index * 0.5 }}
            >
              <Zap className={`w-4 h-4 ${explanationStyle.iconColor}`} />
            </motion.div>
            <span className={`text-sm font-bold ${explanationStyle.titleColor}`}>
              AI Giải thích
            </span>
          </div>
          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${explanationStyle.textColor}`}>
            {item.explanation}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
