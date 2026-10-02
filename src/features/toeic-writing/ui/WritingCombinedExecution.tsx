import { useEffect, useState, useRef } from "react";
import { Loader2, AlertTriangle, ArrowRight, ArrowLeft, Crown, Check, Send, FileText, Mail, Image as ImageIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { writingService } from "../../../entities/writing/writing.service";
import { WritingPart23Question, SubmitWritingPracticeRequest } from "../../../entities/writing/writing.type";
import { Level } from "../../../shared/types/common.type";
import { VipUpgradeModal } from "../../../shared/ui/VipUpgradeModal";

/**
 * Màn hình làm bài hỗn hợp 3xP1 + P2 + P3 (dùng chung cho Daily và Test).
 * P2/P3 hiển thị thẻ Constraint Alert khi có requiredConstraints từ SM-2 (chỉ Daily mới có).
 */
export function WritingCombinedExecution({ mode }: { mode: "daily" | "test" }) {
  const navigate = useNavigate();
  const { level } = useParams<{ level: string }>();
  const allowedLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const testLevel = (allowedLevels.includes(level || "") ? level : "B1") as Level;
  const [questions, setQuestions] = useState<WritingPart23Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVipLimit, setIsVipLimit] = useState(false);
  const [isMaxLimit, setIsMaxLimit] = useState(false);
  // Thiếu level Writing → khóa màn hình, hiện nút đi làm bài test
  const [isLevelLocked, setIsLevelLocked] = useState(false);
  const [vipModal, setVipModal] = useState<{ open: boolean; type: "require_vip" | "max_limit" | null }>({ open: false, type: null });
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = mode === "test"
          ? await writingService.startCombinedTest(testLevel)
          : await writingService.getCombinedDailyPractice();
        setQuestions(data.questions || []);
        if (data.savedAnswers) {
          const formatted: Record<number, string> = {};
          Object.keys(data.savedAnswers).forEach((key) => {
            formatted[Number(key)] = (data.savedAnswers as any)[key];
          });
          setAnswers(formatted);
        }
      } catch (error: any) {
        const msg = error.response?.data?.message || error.message || "";
        const m = msg.toLowerCase();
        if (m.includes("require_placement_test") || m.includes("require_writing_placement_test")) {
          setIsLevelLocked(true);
          return;
        }
        // Ưu tiên lỗi QUOTA/VIP trước tất cả các lỗi khác (kể cả "chưa đủ câu hỏi")
        if (mode === "daily" && (
          m.includes("require_vip") ||
          m.includes("max_limit_reached") ||
          m.includes("vip") ||
          m.includes("giới hạn") ||
          m.includes("lượt") ||
          m.includes("quota") ||
          m.includes("hết lượt")
        )) {
          if (m.includes("require_vip") || m.includes("vip")) {
            setVipModal({ open: true, type: "require_vip" });
          } else {
            setVipModal({ open: true, type: "max_limit" });
          }
          setQuestions([]);
          setIsLoading(false);
          return;
        }
        if (m.includes("chưa đủ câu hỏi") || m.includes("insufficient") || m.includes("not enough") || m.includes("thiếu câu")) {
          toast.error("Hệ thống chưa đủ câu hỏi Writing (3×P1 + P2 + P3) cho trình độ của bạn. Vui lòng thử lại sau!");
          navigate("/dashboard");
          return;
        }
        toast.error(msg || (mode === "test" ? "Lỗi khi tải đề thi, vui lòng thử lại!" : "Lỗi khi tải bài luyện tập, vui lòng thử lại!"));
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [navigate, mode, testLevel]);

  // Chỉ Daily mới auto-save nháp (Test không có API nháp)
  useEffect(() => {
    if (mode !== "daily") return;
    if (Object.keys(answers).length === 0 || isLoading) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await writingService.saveCombinedDraft({ answers });
      } catch {
        /* bỏ qua lỗi auto-save */
      }
    }, 1000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [answers, isLoading, mode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-6">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-5" />
        <h2 className="text-2xl font-bold text-slate-800">
          {mode === "test" ? `Đang chuẩn bị bài thi Writing hỗn hợp (${testLevel})...` : "Đang chuẩn bị bài luyện tập Writing hỗn hợp..."}
        </h2>
        <p className="text-base text-slate-500 mt-2">3 câu Part 1 + 1 Email Part 2 + 1 Essay Part 3.</p>
      </div>
    );
  }

  if (isLevelLocked) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SkillLockOverlay
          skillLabel="Viết (Writing)"
          onAction={() => navigate("/toeic/writing/select-level")}
        />
      </div>
    );
  }

  if (isVipLimit || isMaxLimit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md w-full">
          <Crown className="w-8 h-8 text-amber-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800">Hết lượt luyện tập hôm nay</h2>
          <p className="text-sm text-slate-500 mt-2">
            {isVipLimit ? "Bạn đã hết 1 lượt miễn phí. Nâng cấp Premium để làm tối đa 3 đề/ngày." : "Bạn đã làm tối đa 3 đề hôm nay."}
          </p>
          <button onClick={() => navigate("/dashboard")} className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
            Về Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        {/* Hết quota VIP: chỉ hiện popup VIP trên nền trống, không hiện chữ gây hiểu lầm */}
        {!vipModal.open && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md w-full">
            <h2 className="text-lg font-bold text-slate-800">Chưa thể tải bài luyện tập lúc này</h2>
            <p className="text-sm text-slate-500 mt-2">Vui lòng quay lại sau hoặc về Dashboard để tiếp tục.</p>
            <button onClick={() => navigate("/dashboard")} className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
              Về Dashboard
            </button>
          </div>
        )}
        <VipUpgradeModal
          open={vipModal.open}
          type={vipModal.type}
          onClose={() => setVipModal({ open: false, type: null })}
        />
      </div>
    );
  }

  const q = questions[currentIdx];
  const constraints = q.requiredConstraints || [];
  const isPart23 = q.toeicPart === "WRITING_PART_2" || q.toeicPart === "WRITING_PART_3";
  const currentAnswer = answers[q.questionId] || "";
  const wordCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0;
  const answeredCount = Object.values(answers).filter((v) => (v || "").trim().length > 0).length;
  const progress = (answeredCount / questions.length) * 100;

  const partMeta =
    q.toeicPart === "WRITING_PART_1"
      ? { label: "Part 1 · Mô tả tranh", icon: ImageIcon, chip: "bg-sky-100 text-sky-700" }
      : q.toeicPart === "WRITING_PART_2"
        ? { label: "Part 2 · Viết Email", icon: Mail, chip: "bg-indigo-100 text-indigo-700" }
        : { label: "Part 3 · Viết luận", icon: FileText, chip: "bg-emerald-100 text-emerald-700" };
  const PartIcon = partMeta.icon;

  const handleSubmit = async () => {
    const answersList = questions.map((item) => ({ questionId: item.questionId, selectedAnswer: answers[item.questionId] || "" }));
    setIsSubmitting(true);
    try {
      const result = mode === "test"
        ? await writingService.submitCombinedTest({ testedLevel: testLevel, answers: answersList })
        : await writingService.submitCombinedPractice({ answers: answersList } as SubmitWritingPracticeRequest);
      navigate("/toeic/writing/combined-result", { state: { result, questions, mode, testedLevel: mode === "test" ? testLevel : undefined } });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Nộp bài thất bại, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50">
      {/* Thanh header sticky full-width */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/85 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm font-extrabold tracking-tight text-slate-900 truncate">
                {mode === "test" ? `Bài thi Writing hỗn hợp · ${testLevel}` : "Luyện Writing hỗn hợp"}
              </span>
              <span className="hidden sm:inline text-xs font-semibold text-slate-400 whitespace-nowrap">{answeredCount}/{questions.length} đã làm</span>
            </div>
            <div className="flex items-center gap-2">
              {questions.map((item, i) => {
                const done = (answers[item.questionId] || "").trim().length > 0;
                return (
                  <button
                    key={item.questionId}
                    onClick={() => setCurrentIdx(i)}
                    title={item.toeicPart === "WRITING_PART_1" ? "Part 1" : item.toeicPart === "WRITING_PART_2" ? "Part 2" : "Part 3"}
                    className={`w-9 h-9 rounded-xl text-sm font-bold border transition-all ${
                      i === currentIdx
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200"
                        : done
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400"
                          : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    {done && i !== currentIdx ? <Check className="w-4 h-4 mx-auto" /> : i + 1}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      {/* Nội dung full-width: đề bên trái, khung viết bên phải */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3 space-y-5">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${partMeta.chip}`}>
              <PartIcon className="w-4 h-4" /> {partMeta.label} · Câu {currentIdx + 1}/{questions.length}
            </span>
          </div>

          {isPart23 && constraints.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex gap-3 shadow-sm">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-base text-amber-900">
                <strong>⚠️ Mục tiêu bắt buộc hôm nay:</strong> trong bài này, bạn phải sử dụng đúng {constraints.map((c) => `[${c}]`).join(", ")}. Mỗi chủ điểm bỏ qua/dùng sai bị trừ 1 điểm.
              </p>
            </div>
          )}

          {q.toeicPart === "WRITING_PART_1" && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {q.imageUrl && <img src={q.imageUrl} alt="TOEIC Writing" className="w-full max-h-[420px] object-cover" />}
              <div className="p-5">
                <p className="text-base text-slate-600">Từ khóa bắt buộc:</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{q.givenWords}</p>
              </div>
            </div>
          )}

          {q.toeicPart === "WRITING_PART_2" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-slate-800">
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-base border-b border-slate-100 pb-4">
                <p><span className="text-slate-400 font-semibold">From:</span> <strong>{q.emailFrom}</strong></p>
                <p><span className="text-slate-400 font-semibold">To:</span> <strong>{q.emailTo}</strong></p>
                <p><span className="text-slate-400 font-semibold">Date:</span> <strong>{q.emailDate}</strong></p>
                <p><span className="text-slate-400 font-semibold">Subject:</span> <strong>{q.emailSubject}</strong></p>
              </div>
              <p className="mt-4 text-lg leading-relaxed whitespace-pre-wrap">{q.emailBody}</p>
              <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                <p className="text-base text-indigo-900"><strong>Directions:</strong> {q.directions}</p>
              </div>
            </div>
          )}

          {q.toeicPart === "WRITING_PART_3" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-slate-800">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">{q.essayType}</span>
              <p className="mt-3 text-xl font-semibold leading-relaxed whitespace-pre-wrap">{q.essayQuestion}</p>
              <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                <p className="text-base text-indigo-900"><strong>Directions:</strong> {q.directions}</p>
              </div>
            </div>
          )}
        </section>

        {/* Khung soạn thảo sticky */}
        <aside className="lg:col-span-2">
          <div className="lg:sticky lg:top-32 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-800">Bài làm của bạn</h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${q.toeicPart === "WRITING_PART_3" && wordCount < 300 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                {wordCount} từ{q.toeicPart === "WRITING_PART_3" ? " / tối thiểu 300" : ""}
              </span>
            </div>
            <textarea
              value={currentAnswer}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [q.questionId]: e.target.value }))}
              placeholder={q.toeicPart === "WRITING_PART_3" ? "Viết bài luận tối thiểu 300 từ..." : "Viết bài của bạn tại đây..."}
              className="w-full min-h-[420px] rounded-xl border-2 border-slate-200 p-4 text-base leading-relaxed outline-none focus:border-indigo-500 focus:ring-4 ring-indigo-500/10 resize-y"
            />
            <div className="flex items-center justify-between mt-4 gap-3">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-40 hover:bg-slate-200"
              >
                <ArrowLeft className="w-4 h-4" /> Trước
              </button>
              {currentIdx < questions.length - 1 ? (
                <button onClick={() => setCurrentIdx((i) => i + 1)} className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700">
                  Câu tiếp <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-60">
                  <Send className="w-4 h-4" /> {isSubmitting ? "Đang chấm..." : "Nộp bài"}
                </button>
              )}
            </div>
          </div>
        </aside>
      </main>
      <VipUpgradeModal
        open={vipModal.open}
        type={vipModal.type}
        onClose={() => setVipModal({ open: false, type: null })}
      />
    </div>
  );
}
