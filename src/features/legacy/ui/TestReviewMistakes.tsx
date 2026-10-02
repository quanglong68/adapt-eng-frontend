import { motion } from "motion/react";
import { ChevronRight, CheckCircle2, XCircle, FileText } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { MistakeCard } from "../../../shared/ui";
import { TestSubmissionResponse } from "../../../entities/legacy/test.type";
import { QuestionResponse } from "../../../shared/types/common.type";

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
        <button onClick={() => navigate("/")} className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Xem lại bài làm <FileText className="w-5 h-5 text-slate-400" /></h1>
            <p className="text-sm mt-1 text-slate-500">AI giải thích chi tiết từng câu để bạn học hỏi</p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-500 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> {testResult.totalQuestions - testResult.correctAnswers} câu sai
            </div>
            <div className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {testResult.correctAnswers} câu đúng
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              navigate("/test-result", {
                state: {
                  dataResult: testResult,
                  originalQuestions: originalQuestions,
                },
              })
            }
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-semibold bg-indigo-600 shadow-lg shadow-indigo-200 hover:bg-indigo-700"
          >
            Quay lại bảng kết quả chung
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
