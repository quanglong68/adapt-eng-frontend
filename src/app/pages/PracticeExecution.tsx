import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { StandardExecutionLayout } from "../components/layouts";
import { GeneralOptionButton, EXECUTION_THEMES } from "../components/shared";
import { practiceService } from "../services/practice.service";
import { QuestionResponse } from "../types/common.type";
import { PracticeUserAnswer, DailyReviewSubmissionRequest } from "../types/practice.type";

export function PracticeExecution() {
  const navigate = useNavigate();
  const theme = EXECUTION_THEMES.green;

  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showExit, setShowExit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentQuestion = questions[currentIndex] || null;
  const totalQuestions = questions.length || 0;
  const currentNumber = currentIndex + 1;
  const progress = totalQuestions > 0 ? (currentNumber / totalQuestions) * 100 : 0;
  const selectedAnswerForCurrentQuestion = currentQuestion ? answers[currentQuestion.questionId] : null;

  const parts = currentQuestion ? currentQuestion.content.split("_____") : [""];
  const answerTokens = selectedAnswerForCurrentQuestion
    ? selectedAnswerForCurrentQuestion.split("/").map((str) => str.trim())
    : [];

  useEffect(() => {
    practiceService
      .getDailyReviewTest()
      .then((data) => {
        setQuestions(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy câu hỏi ôn tập:", err);
        setIsLoading(false);
      });
  }, []);

  if (!isLoading && questions.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md w-full border border-slate-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Tuyệt vời!</h2>
          <p className="text-slate-500 mb-6">
            Bạn đã hoàn thành tất cả mục tiêu ôn tập của ngày hôm nay. Hãy quay lại vào ngày mai nhé!
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      try {
        const formattedAnswers: PracticeUserAnswer[] = Object.entries(answers).map(([qId, selectedAns]) => ({
          questionId: Number(qId),
          selectedAnswer: selectedAns,
        }));

        const submitData: DailyReviewSubmissionRequest = {
          answers: formattedAnswers,
        };

        const result = await practiceService.submitDailyReview(submitData);
        navigate("/practice-result", {
          state: {
            dataResult: result,
            originalQuestions: questions,
          },
        });
      } catch (error) {
        console.error(error);
        alert("Lỗi nộp bài ôn tập!");
      }
    }
  };

  return (
    <StandardExecutionLayout
      theme="green"
      questionLabel="Ôn tập: Câu"
      currentNumber={currentNumber}
      totalQuestions={totalQuestions}
      progress={progress}
      showExit={showExit}
      onShowExit={() => setShowExit(true)}
      onExitCancel={() => setShowExit(false)}
      onExitConfirm={() => navigate("/")}
      exitTitle="Dừng ôn tập?"
      exitMessage="Tiến độ ôn tập hằng ngày sẽ không được lưu nếu bạn thoát bây giờ."
      exitCancelLabel="Tiếp tục ôn"
      exitConfirmLabel="Vẫn thoát"
      selectedAnswer={selectedAnswerForCurrentQuestion}
      canGoBack={currentIndex > 0}
      onBack={() => setCurrentIndex(currentIndex - 1)}
      onNext={handleNext}
      nextDisabled={!selectedAnswerForCurrentQuestion}
      nextLabel={currentIndex === questions.length - 1 ? "Nộp bài ôn tập" : "Câu tiếp theo"}
      questionContent={
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-10 mb-6"
          style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.08)", border: "1px solid #F1F5F9" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: theme.primary }}
            >
              {currentNumber}
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#94A3B8" }}>
              Điền vào chỗ trống
            </span>
          </div>

          <p className="text-xl leading-relaxed" style={{ color: "#1E293B" }}>
            {parts.map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index < parts.length - 1 && (
                  <motion.span
                    animate={{
                      background: selectedAnswerForCurrentQuestion ? theme.blankBg : "#F8FAFC",
                      borderBottomColor: selectedAnswerForCurrentQuestion ? theme.blankBorder : "#CBD5E1",
                      color: selectedAnswerForCurrentQuestion ? theme.blankColor : "#94A3B8",
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
      }
      optionsContent={
        isLoading ? (
          <div className="text-center text-gray-500 py-10">Đang tải câu hỏi...</div>
        ) : currentQuestion ? (
          currentQuestion.options.map((optionText, i) => (
            <GeneralOptionButton
              key={i}
              optionText={optionText}
              index={i}
              isSelected={selectedAnswerForCurrentQuestion === optionText}
              onSelect={() =>
                setAnswers((prev) => ({ ...prev, [currentQuestion.questionId]: optionText }))
              }
              theme={theme}
            />
          ))
        ) : null
      }
    />
  );
}
