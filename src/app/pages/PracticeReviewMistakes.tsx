import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { MistakeCard } from "../components/shared";
import { DailyReviewResultResponse } from "../types/practice.type";
import { QuestionResponse } from "../types/common.type";

export function PracticeReviewMistakes() {
  const location = useLocation();
  const navigate = useNavigate();

  const practiceResult = location.state?.dataResult as DailyReviewResultResponse;
  const originalQuestions = location.state?.originalQuestions as QuestionResponse[] | undefined;
  const reviews = practiceResult?.reviewList || [];

  if (!practiceResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-xl font-bold text-slate-700 mb-4">Không tìm thấy dữ liệu xem lại!</h2>
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
            <h1 className="text-2xl font-bold" style={{ color: "#1E293B" }}>Chi tiết kết quả ôn tập 📝</h1>
            <p className="text-sm mt-1" style={{ color: "#64748B" }}>Phân tích sâu từ AI giúp bạn nhớ từ vựng lâu hơn</p>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "#F0FDF4", color: "#10B981" }}>
              ✅ Khớp: {practiceResult.correctAnswers} câu
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
                originalContentPlacement="in-body"
                options={originalQuestion?.options}
                correctLabel="Chính xác"
                wrongLabel="Cần sửa sai"
                correctBadgeText="Đáp án chuẩn"
                wrongBadgeText="Lựa chọn của bạn"
                explanationVariant="green"
              />
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-8">
          <button
            onClick={() =>
              navigate("/practice-result", {
                state: { dataResult: practiceResult, originalQuestions: originalQuestions },
              })
            }
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-800 text-white font-semibold rounded-2xl hover:bg-slate-900 transition shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại bảng điểm ôn tập
          </button>
        </motion.div>
      </div>
    </div>
  );
}
