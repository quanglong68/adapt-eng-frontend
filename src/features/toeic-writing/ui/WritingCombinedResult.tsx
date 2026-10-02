import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bot, ChevronRight, ChevronDown, BarChart2, AlertTriangle, CheckCircle2, PartyPopper, Target, Trophy, Repeat, LayoutDashboard } from "lucide-react";
import confetti from "canvas-confetti";
import { useLocation, useNavigate } from "react-router-dom";
import { WritingPart23ResultResponse, WritingPart23Question } from "../../../entities/writing/writing.type";
import { Level, getLevelDisplay } from "../../../shared/types/common.type";
import { writingService } from "../../../entities/writing/writing.service";
import { handleApiError } from "../../../shared/api/handleApiError";
import { STORAGE_KEYS } from "../../../shared/lib/storageKeys";
import { CircularProgress } from "../../../shared/ui";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "../../../shared/ui/alert-dialog";

interface LocationState {
  result: WritingPart23ResultResponse;
  questions: WritingPart23Question[];
  mode?: "daily" | "test";
  testedLevel?: Level;
}

/**
 * Kết quả session hỗn hợp: P1 x/9 + P2 x/4 + P3 x/5, tổng x/18.
 * - Test: bắt buộc chọn level (gợi ý recommended) mới được đi tiếp, mirror flow Reading.
 * - Daily: luyện tiếp / dashboard như cũ.
 * - Chi tiết câu sai Part 1 hiển thị kèm ảnh + từ khóa.
 */
export function WritingCombinedResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) || null;
  const [openId, setOpenId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const result = state?.result ?? null;
  const questions = state?.questions ?? [];
  const isTest = state?.mode === "test";
  const questionMap = new Map(questions.map((q) => [q.questionId, q]));

  useEffect(() => {
    if (!result) {
      navigate("/dashboard");
      return;
    }
    const passed = isTest ? !!result.passedThreshold : true;
    if (passed) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#4F46E5", "#7C3AED", "#10B981"] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#4F46E5", "#7C3AED", "#10B981"] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [result, navigate, isTest]);

  if (!result) return null;

  const percent = result.maxScore > 0 ? (result.totalScore / result.maxScore) * 100 : 0;
  const recommended = result.recommendedLevel ?? state?.testedLevel ?? "B1";
  const passed = !!result.passedThreshold;

  const handleSetLevel = async (levelToSet: Level) => {
    setIsSubmitting(true);
    try {
      await writingService.setWritingLevel(levelToSet);
      localStorage.setItem(STORAGE_KEYS.writingCurrentLevel, levelToSet);
      setShowSuccessDialog(true);
    } catch (error) {
      handleApiError(error, "Có lỗi xảy ra khi lưu mục tiêu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const parts = [
    { name: "Part 1 · Mô tả tranh", score: result.part1Score, max: 9 },
    { name: "Part 2 · Email", score: result.part2Score, max: 4 },
    { name: "Part 3 · Essay", score: result.part3Score, max: 5 },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200/60 text-center"
        >
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }} className="flex justify-center mb-6">
            <CircularProgress value={result.totalScore} max={result.maxScore} variant="toeic-test" />
          </motion.div>

          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 mb-3">
            {isTest ? "Đánh giá năng lực Writing" : "Kết quả luyện tập"}
          </h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Tổng điểm: <strong className="text-indigo-600">{result.totalScore}/{result.maxScore} ({percent.toFixed(1)}%)</strong>.
            {!isTest && <> +{result.earnedXp} XP{!result.validEffort && " (bài chưa đạt chuẩn nên không tính XP)"}.</>}
          </p>

          {/* Điểm từng Part */}
          <div className="grid sm:grid-cols-3 gap-3 mb-6 text-left">
            {parts.map((p) => (
              <div key={p.name} className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-500">{p.name}</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{p.score}<span className="text-sm text-slate-400">/{p.max}</span></p>
                <div className="mt-2 h-2 rounded-full bg-slate-200/70 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500" style={{ width: `${p.max > 0 ? (p.score / p.max) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* TEST: bắt buộc chọn level theo flow Reading */}
          {isTest && (
            <div className={`p-5 rounded-2xl mb-6 flex items-start gap-4 text-left ${passed ? "bg-indigo-50/80 border border-indigo-200/60" : "bg-red-50/80 border border-red-200/60"}`}>
              <div className="shrink-0 mt-0.5">
                {passed ? <CheckCircle2 className="w-6 h-6 text-indigo-600" /> : <AlertTriangle className="w-6 h-6 text-red-500" />}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  {passed ? <PartyPopper className="w-4 h-4 text-indigo-600" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
                  {passed ? "Hoàn toàn phù hợp!" : "Cần củng cố thêm"}
                </h4>
                <p className={`text-sm leading-relaxed ${passed ? "text-indigo-700" : "text-red-700"}`}>
                  AI khuyên bạn nên bắt đầu lộ trình học Writing ở mức: <br />
                  <strong className="text-base mt-1 block text-slate-900">{getLevelDisplay(recommended as Level, "TOEIC")}</strong>
                </p>
              </div>
            </div>
          )}

          {isTest ? (
            <>
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={() => handleSetLevel(recommended as Level)}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 mb-3 bg-indigo-600 hover:bg-indigo-700 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-70"
              >
                <Bot className="w-4 h-4" />
                Đồng ý học mức {recommended}
                <ChevronRight className="w-4 h-4" />
              </motion.button>
              {!passed && state?.testedLevel && (
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleSetLevel(state.testedLevel!)}
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 text-slate-700 border border-slate-300 hover:bg-white transition-all disabled:opacity-70"
                >
                  <BarChart2 className="w-4 h-4" />
                  Không, tôi vẫn muốn học mức {state.testedLevel}
                </motion.button>
              )}
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/toeic/writing/combined-practice")}
                className="w-full py-3.5 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 mb-3 bg-emerald-600 hover:bg-emerald-700 transition-all"
              >
                <Repeat className="w-4 h-4" />
                Luyện tiếp
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/dashboard")}
                className="w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 text-slate-700 border border-slate-300 hover:bg-white transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                Về Dashboard
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Chi tiết từng câu — Part 1 kèm ảnh */}
        <h3 className="text-lg font-bold text-slate-800 mt-8 mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" /> Nhận xét chi tiết từng câu
        </h3>
        <div className="space-y-3">
          {result.reviewList.map((r) => {
            const expanded = openId === r.questionId;
            const q = questionMap.get(r.questionId);
            const isP1 = q?.toeicPart === "WRITING_PART_1";
            return (
              <div key={r.questionId} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <button onClick={() => setOpenId(expanded ? null : r.questionId)} className="w-full flex items-center justify-between gap-3 p-5 text-left">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${r.correct ? "bg-emerald-500" : "bg-amber-500"}`} />
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {q?.toeicPart === "WRITING_PART_1" ? "Part 1" : q?.toeicPart === "WRITING_PART_2" ? "Part 2 · Email" : "Part 3 · Essay"}
                      {" · "}{r.correctAnswer}{r.knowledgeName ? ` — ${r.knowledgeName}` : ""}
                    </p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
                </button>
                {expanded && (
                  <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                    {isP1 && q?.imageUrl && (
                      <img src={q.imageUrl} alt="Đề Part 1" className="w-full max-h-64 object-cover rounded-xl border" />
                    )}
                    {isP1 && q?.givenWords && (
                      <p className="text-sm text-slate-500">Từ khóa bắt buộc: <strong className="text-slate-800">{q.givenWords}</strong></p>
                    )}
                    {!isP1 && q?.toeicPart === "WRITING_PART_2" && (
                      <div className="text-sm text-slate-500 bg-slate-50 rounded-xl p-3">
                        <p><strong>Subject:</strong> {q.emailSubject}</p>
                        <p className="mt-1 line-clamp-3">{q.emailBody}</p>
                        <p className="mt-1 text-indigo-700">{q.directions}</p>
                      </div>
                    )}
                    {!isP1 && q?.toeicPart === "WRITING_PART_3" && (
                      <div className="text-sm text-slate-500 bg-slate-50 rounded-xl p-3">
                        <p><strong>{q.essayType}:</strong> {q.essayQuestion}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><Target className="w-3.5 h-3.5" /> Bài làm của bạn</p>
                      <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap max-h-48 overflow-y-auto">{r.userSelectedAnswer || "(bỏ trống)"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Nhận xét của AI</p>
                      <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{r.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dialog sau khi chốt level (chỉ luồng Test) */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="rounded-3xl p-6 bg-white border border-slate-200/60 shadow-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-indigo-600" />
              Thiết lập thành công!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500">
              Mục tiêu Writing của bạn đã được cập nhật. Cùng cày cuốc thôi!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-semibold shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              Đi tới Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
