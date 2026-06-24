import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { MistakeCard } from "../components/shared";
import { TestSubmissionResponse } from "../types/test.type";
import { QuestionResponse } from "../types/common.type";

export function TestReviewMistakes() {
  const location = useLocation();
  const navigate = useNavigate();

  const testResult = location.state?.dataResult as TestSubmissionResponse;
  const originalQuestions = location.state?.originalQuestions as QuestionResponse[] | undefined;
  const reviews = testResult?.reviewList || [];

  if (!testResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-xl font-bold text-slate-700 mb-4">Không tìm thấy dữ liệu bài làm!</h2>
        <button onClick={() => navigate("/")} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-8" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1E293B" }}>Xem lại bài làm 📝</h1>
            <p className="text-sm mt-1" style={{ color: "#64748B" }}>AI giải thích chi tiết từng câu để bạn học hỏi</p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "#FEF2F2", color: "#EF4444" }}>
              ❌ {testResult.totalQuestions - testResult.correctAnswers} câu sai
            </div>
            <div className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "#F0FDF4", color: "#10B981" }}>
              ✅ {testResult.correctAnswers} câu đúng
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {reviews.map((item, i) => {
            const originalQuestion = originalQuestions?.find((q) => q.questionId === item.questionId);
            return (
              <MistakeCard
                key={item.questionId}
                item={item}
                index={i}
                originalContent={originalQuestion?.content}
                originalContentPlacement="after-header"
                options={originalQuestion?.options}
                showKnowledgeHeading
                explanationVariant="indigo"
              />
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-center mt-10">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 32px rgba(79,70,229,0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              navigate("/test-result", {
                state: {
                  dataResult: testResult,
                  originalQuestions: originalQuestions,
                },
              })
            }
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 6px 20px rgba(79,70,229,0.35)" }}
          >
            Quay lại bảng kết quả chung
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
