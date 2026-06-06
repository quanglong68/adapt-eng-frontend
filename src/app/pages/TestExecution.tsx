import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Level } from "../types/common.type";
import { testService } from "../services/test.service";
import { QuestionResponse, SubmitTestRequest, UserAnswer, TestSubmissionResponse } from "../types/test.type";

export function TestExecution() {
  const { level } = useParams<{ level: Level }>();
  const navigate = useNavigate();


  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showExit, setShowExit] = useState(false);

  const currentQuestion = questions[currentIndex] || null;
  const totalQuestions = questions.length || 30;
  const currentNumber = currentIndex + 1;
  const progress = (currentNumber / totalQuestions) * 100;

  // Lấy đáp án đã chọn cho câu hiện tại từ giỏ hàng
  const selectedAnswerForCurrentQuestion = currentQuestion ? answers[currentQuestion.questionId] : null;

  // --- LOGIC XỬ LÝ NHIỀU KHOẢNG TRỐNG ---
  // Cắt câu hỏi thành nhiều phần dựa trên chuỗi "_____"
  const parts = currentQuestion ? currentQuestion.content.split("_____") : [""];

  // Cắt đáp án đã chọn thành nhiều mảnh dựa trên dấu "/" (và xóa khoảng trắng thừa)
  const answerTokens = selectedAnswerForCurrentQuestion
    ? selectedAnswerForCurrentQuestion.split("/").map(str => str.trim())
    : [];

  useEffect(() => {
    if (level) {
      testService.generateTest(level).then((data) => {
        setQuestions(data);
      });
    }
  }, [level]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
      {/* ── EXIT DIALOG ── */}
      <AnimatePresence>
        {showExit && (
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
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", damping: 18 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center"
              style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#FEF2F2" }}>
                <AlertCircle className="w-7 h-7" style={{ color: "#EF4444" }} />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#1E293B" }}>Thoát bài test?</h3>
              <p className="text-sm mb-6" style={{ color: "#64748B" }}>
                Tiến độ bài làm sẽ không được lưu nếu bạn thoát ngay bây giờ.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowExit(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: "#F1F5F9", color: "#64748B" }}>
                  Tiếp tục làm bài
                </button>
                <button
                  // Thay onNavigate thành navigate để về trang chủ hoặc trang chọn level
                  onClick={() => navigate("/")}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "#EF4444" }}
                >
                  Vẫn thoát
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP BAR ── */}
      <div className="bg-white border-b flex items-center gap-5 px-8 py-4" style={{ borderColor: "#E5E7EB", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: "#1E293B" }}>
                Câu {currentNumber}
              </span>
              <span className="text-sm" style={{ color: "#94A3B8" }}>/ {totalQuestions}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: "#EEF2FF", color: "#4F46E5" }}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#E5E7EB" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full relative overflow-hidden"
              style={{ background: "linear-gradient(90deg, #4F46E5, #7C3AED)" }}
            />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.08, background: "#FEF2F2" }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setShowExit(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
          style={{ background: "#F8FAFC", color: "#94A3B8" }}
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      {/* ── QUESTION AREA ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-10">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-10 mb-6"
            style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.08)", border: "1px solid #F1F5F9" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "#4F46E5" }}>
                {currentNumber}
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#94A3B8" }}>
                Điền vào chỗ trống
              </span>
            </div>

            <p className="text-xl leading-relaxed" style={{ color: "#1E293B" }}>
              {/* Vòng lặp rải đều các khoảng trống */}
              {parts.map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {/* Chỉ chèn ô trống nếu chưa phải là đoạn text cuối cùng */}
                  {index < parts.length - 1 && (
                    <motion.span
                      animate={{
                        background: selectedAnswerForCurrentQuestion ? "#EEF2FF" : "#F8FAFC",
                        borderBottomColor: selectedAnswerForCurrentQuestion ? "#4F46E5" : "#CBD5E1",
                        color: selectedAnswerForCurrentQuestion ? "#4F46E5" : "#94A3B8",
                      }}
                      className="inline-block px-4 py-1 mx-1 rounded-lg border-b-2 align-baseline"
                      style={{ fontWeight: 700, minWidth: "80px", textAlign: "center" }}
                    >
                      {answerTokens[index] ? answerTokens[index] : "________"}
                    </motion.span>
                  )}
                </React.Fragment>
              ))}
            </p>
          </motion.div>

          {/* ── ANSWER OPTIONS ── */}
          <div className="space-y-3">
            {currentQuestion ? (
              currentQuestion.options.map((optionText, i) => {
                const isSelected = selectedAnswerForCurrentQuestion === optionText;
                const letter = String.fromCharCode(65 + i); // Chuyển 0, 1, 2 thành A, B, C

                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                    whileHover={{ scale: 1.01, boxShadow: "0 4px 20px rgba(79,70,229,0.12)" }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setAnswers(prev => ({ ...prev, [currentQuestion.questionId]: optionText }));
                    }}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all"
                    style={{
                      background: isSelected ? "#EEF2FF" : "#fff",
                      border: `2px solid ${isSelected ? "#4F46E5" : "#E5E7EB"}`,
                      boxShadow: isSelected ? "0 4px 20px rgba(79,70,229,0.15)" : "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <motion.div
                      animate={{
                        background: isSelected ? "#4F46E5" : "#F1F5F9",
                        scale: isSelected ? 1.08 : 1,
                      }}
                      transition={{ type: "spring", damping: 14 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ color: isSelected ? "#fff" : "#64748B" }}
                    >
                      {letter}
                    </motion.div>
                    <span className="text-base font-medium flex-1" style={{ color: "#1E293B" }}>
                      {optionText}
                    </span>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "#4F46E5" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7l3 3 5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-10">Đang tải câu hỏi...</div>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div
        className="bg-white border-t flex items-center px-8 py-5 relative"
        style={{ borderColor: "#E5E7EB", boxShadow: "0 -4px 20px rgba(0,0,0,0.05)" }}
      >
        {/* KHỐI 1: NÚT QUAY LẠI (Nằm ngoài cùng bên trái) */}
        <div className="flex-1 flex justify-start">
          <motion.button
            disabled={currentIndex === 0}
            whileHover={{ scale: currentIndex === 0 ? 1 : 1.02 }}
            whileTap={{ scale: currentIndex === 0 ? 1 : 0.98 }}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className="flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: currentIndex === 0 ? "#F8FAFC" : "#F1F5F9",
              color: currentIndex === 0 ? "#CBD5E1" : "#64748B",
              cursor: currentIndex === 0 ? "not-allowed" : "pointer",
              border: "1px solid #E5E7EB"
            }}
          >
            Quay lại
          </motion.button>
        </div>

        {/* KHỐI 2: TRẠNG THÁI CHỌN ĐÁP ÁN (Căn chuẩn chính giữa tuyệt đối) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          <div className="w-2 h-2 rounded-full" style={{ background: selectedAnswerForCurrentQuestion ? "#10B981" : "#E5E7EB" }} />
          <span className="text-sm font-medium" style={{ color: selectedAnswerForCurrentQuestion ? "#10B981" : "#94A3B8" }}>
            {selectedAnswerForCurrentQuestion ? `Đã chọn: ${selectedAnswerForCurrentQuestion}` : "Chưa chọn đáp án"}
          </span>
        </div>

        {/* KHỐI 3: NÚT TIẾP THEO / NỘP BÀI (Nằm ngoài cùng bên phải) */}
        <div className="flex-1 flex justify-end">
          <motion.button
            disabled={!selectedAnswerForCurrentQuestion}
            whileHover={{ scale: selectedAnswerForCurrentQuestion ? 1.02 : 1 }}
            whileTap={{ scale: selectedAnswerForCurrentQuestion ? 0.98 : 1 }}
            onClick={async () => {
              if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
              } else {
                try {
                  const formattedAnswers: UserAnswer[] = Object.entries(answers).map(([qId, selectedAns]) => ({
                    questionId: Number(qId),
                    selectedAnswer: selectedAns,
                  }));

                  const submitData: SubmitTestRequest = {
                    testedLevel: level!,
                    answers: formattedAnswers,
                  };

                  const result = await testService.submitTest(submitData);
                  navigate("/test-result", {
                    state: {
                      dataResult: result,
                      originalQuestions: questions
                    }
                  });
                } catch (error) {
                  console.error(error);
                  alert("Lỗi nộp bài!");
                }
              }
            }}
            className="flex items-center gap-2 px-10 py-3.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: selectedAnswerForCurrentQuestion ? "linear-gradient(135deg, #4F46E5, #7C3AED)" : "#E5E7EB",
              color: selectedAnswerForCurrentQuestion ? "#fff" : "#94A3B8",
              cursor: selectedAnswerForCurrentQuestion ? "pointer" : "not-allowed",
              boxShadow: selectedAnswerForCurrentQuestion ? "0 4px 16px rgba(79,70,229,0.3)" : "none",
            }}
          >
            {currentIndex === questions.length - 1 ? "Nộp bài test" : "Câu tiếp theo"}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}