import { motion } from "motion/react";
import { X, Check, Zap, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom"; // NOTE 1: Thêm hook điều hướng
import { TestSubmissionResponse } from "../types/test.type"; // NOTE 2: Import interface

export function TestReviewMistakes() {
  // NOTE 3: Lấy dữ liệu và công cụ điều hướng
  const location = useLocation();
  const navigate = useNavigate();

  // Hứng trọn cục dataResult từ trang trước truyền qua
  const testResult = location.state?.dataResult as TestSubmissionResponse;
  const originalQuestions = location.state?.originalQuestions;
  // Rút mảng reviewList ra để dùng. Nếu không có thì để mảng rỗng tránh crash code
  const reviews = testResult?.reviewList || [];

  // NOTE 4: Bảo vệ trang - Nếu F5 mất data thì đá về trang chủ
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

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1E293B" }}>Xem lại bài làm 📝</h1>
            <p className="text-sm mt-1" style={{ color: "#64748B" }}>AI giải thích chi tiết từng câu để bạn học hỏi</p>
          </div>
          <div className="flex gap-3">
            {/* NOTE 5: Thay số cứng bằng dữ liệu tính toán thật từ testResult */}
            <div className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "#FEF2F2", color: "#EF4444" }}>
              ❌ {testResult.totalQuestions - testResult.correctAnswers} câu sai
            </div>
            <div className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "#F0FDF4", color: "#10B981" }}>
              ✅ {testResult.correctAnswers} câu đúng
            </div>
          </div>
        </motion.div>

        {/* Mistake cards */}
        <div className="space-y-6">
          {reviews.map((item, i) => {
            const isCorrect = item.correct;
            const originalQuestion = originalQuestions.find((q: any) => q.questionId === item.questionId);
            return (
              <motion.div
                key={item.questionId} // Dùng questionId làm key cho chuẩn React
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-3xl overflow-hidden"
                style={{
                  border: `2px solid ${isCorrect ? "#BBF7D0" : "#FCA5A5"}`,
                  boxShadow: isCorrect ? "0 4px 20px rgba(16,185,129,0.08)" : "0 4px 20px rgba(239,68,68,0.08)",
                }}
              >
                {/* Card header */}
                <div className="flex items-center gap-3 px-6 py-3" style={{ background: isCorrect ? "#F0FDF4" : "#FEF2F2" }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: isCorrect ? "#10B981" : "#EF4444" }}>
                    {isCorrect ? <Check className="w-3.5 h-3.5 text-white" /> : <X className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: isCorrect ? "#10B981" : "#EF4444" }}>
                    Câu {i + 1} – {isCorrect ? "Trả lời đúng" : "Trả lời sai"}
                  </span>
                  <div className="ml-auto flex gap-2">
                    {/* NOTE 6: Interface QuestionReview không có mảng tags, chỉ có knowledgeName nên mình hiển thị nó */}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#F1F5F9", color: "#64748B" }}>
                      #{item.knowledgeName}
                    </span>
                  </div>
                </div>
                {originalQuestion && (
                  <div className="mb-6 p-4 rounded-2xl" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <p className="text-base font-medium leading-relaxed" style={{ color: "#1E293B" }}>
                      {originalQuestion.content}
                    </p>
                  </div>
                )}
                <div className="p-6">
                  {/* NOTE 7: Vì interface QuestionReview KHÔNG trả về nội dung câu hỏi gốc (content), 
                      nên mình chuyển phần này thành hiển thị Chủ điểm kiến thức trọng tâm để giao diện không bị lỗi */}
                  <h3 className="text-lg font-semibold mb-5" style={{ color: "#1E293B" }}>
                    Chủ điểm kiểm tra: <span className="text-indigo-600">{item.knowledgeName}</span>
                  </h3>

                  {/* Answers */}
                  <div className="space-y-3 mb-5">
                    {originalQuestion && originalQuestion.options.map((optText: string, optIndex: number) => {
                      const letter = String.fromCharCode(65 + optIndex);
                      const isCorrectOption = optText === item.correctAnswer;
                      const isUserSelected = optText === item.userSelectedAnswer;

                      // Xác định màu sắc và style dựa trên trạng thái
                      let bgColor = "#fff";
                      let borderColor = "#E5E7EB";
                      let iconBg = "#F1F5F9";
                      let textColor = "#1E293B";
                      let badge = null;

                      if (isCorrectOption) {
                        // Đây là đáp án đúng
                        bgColor = "#F0FDF4";
                        borderColor = "#BBF7D0";
                        iconBg = "#10B981";
                        textColor = "#10B981";
                        badge = <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#D1FAE5", color: "#10B981" }}>Đáp án đúng</span>;
                      } else if (isUserSelected && !isCorrectOption) {
                        // User chọn sai ô này
                        bgColor = "#FEF2F2";
                        borderColor = "#FECACA";
                        iconBg = "#EF4444";
                        textColor = "#EF4444";
                        badge = <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#FEE2E2", color: "#EF4444" }}>Bạn chọn sai</span>;
                      }

                      return (
                        <div
                          key={optIndex}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                          style={{ background: bgColor, border: `2px solid ${borderColor}` }}
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                            style={{ background: iconBg, color: (isCorrectOption || (isUserSelected && !isCorrectOption)) ? "#fff" : "#64748B" }}
                          >
                            {isCorrectOption ? <Check className="w-4 h-4" /> : (isUserSelected && !isCorrectOption) ? <X className="w-4 h-4" /> : letter}
                          </div>

                          <span className={`text-sm font-medium flex-1 ${(isUserSelected && !isCorrectOption) ? "line-through opacity-70" : ""}`} style={{ color: textColor }}>
                            {optText}
                          </span>

                          {badge}
                        </div>
                      );
                    })}
                  </div>

                  {/* AI Explanation */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 + 0.4 }}
                    className="rounded-2xl p-5"
                    style={{ background: "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)", border: "1px solid #C7D2FE" }}
                  >
                    <div className="flex items-center gap-2 mb-2.5">
                      <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}>
                        <Zap className="w-4 h-4" style={{ color: "#4F46E5" }} />
                      </motion.div>
                      <span className="text-sm font-bold" style={{ color: "#4F46E5" }}>AI Giải thích</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#3730A3", whiteSpace: "pre-wrap" }}>
                      {item.explanation}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-center mt-10">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 32px rgba(79,70,229,0.4)" }}
            whileTap={{ scale: 0.98 }}
            // NOTE 8: Nút quay lại. Gọi hàm navigate về "/test-result" và GỬI TRẢ LẠI cục dataResult
            // Nhờ vậy trang TestResult nhận được dữ liệu, không bị văng lỗi.
            onClick={() => navigate("/test-result", {
              state: {
                dataResult: testResult,
                originalQuestions: originalQuestions
              }
            })}
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