import { useEffect, useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { writingService } from "../../../entities/writing/writing.service";
import { DailyWritingPracticeHistoryResponse, WritingQuestionReview } from "../../../entities/writing/writing.type";
import { SkillLockOverlay } from "../../../shared/ui/SkillLockOverlay";

function parseReviews(json: string | null): WritingQuestionReview[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Lịch sử các phiên Daily hỗn hợp (3xP1 + P2 + P3, tổng 18 điểm).
 */
export function WritingCombinedHistory() {
  const navigate = useNavigate();
  const [items, setItems] = useState<DailyWritingPracticeHistoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isLevelLocked, setIsLevelLocked] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await writingService.getCombinedHistory();
        setItems(data || []);
      } catch (error: any) {
        const msg = error.response?.data?.message || error.message || "";
        if (msg.includes("REQUIRE_PLACEMENT_TEST") || msg.includes("REQUIRE_WRITING_PLACEMENT_TEST")) {
          setIsLevelLocked(true);
        } else {
          toast.error(msg || "Lỗi khi tải lịch sử, vui lòng thử lại!");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
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

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Lịch sử Writing hỗn hợp</h2>
          <button onClick={() => navigate("/toeic/writing/combined-practice")} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold">
            Luyện tiếp
          </button>
        </div>
        {items.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
            Chưa có phiên luyện tập nào. Hãy làm bài đầu tiên!
          </div>
        )}
        <div className="space-y-3">
          {items.map((item) => {
            const reviews = parseReviews(item.reviewJson);
            const expanded = expandedId === item.recordId;
            return (
              <div key={item.recordId} className="bg-white rounded-2xl border border-slate-200 p-4">
                <button
                  onClick={() => setExpandedId(expanded ? null : item.recordId)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {item.testDate} — {item.score ?? "—"}{item.totalQuestions === 5 ? "/18" : ""} điểm
                      <span className="ml-2 text-xs font-medium text-slate-400">({item.status})</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.totalQuestions} câu (3 Part 1 + Part 2 + Part 3)</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
                </button>
                {expanded && (
                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                    {reviews.map((r) => (
                      <div key={r.questionId} className="text-sm bg-slate-50 rounded-xl p-3">
                        <p className="font-bold text-slate-700">{r.correctAnswer}{r.knowledgeName ? ` — ${r.knowledgeName}` : ""}</p>
                        <p className="text-slate-600 mt-1 whitespace-pre-wrap">{r.explanation}</p>
                      </div>
                    ))}
                    {reviews.length === 0 && <p className="text-xs text-slate-400">Chưa có chi tiết chấm.</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
