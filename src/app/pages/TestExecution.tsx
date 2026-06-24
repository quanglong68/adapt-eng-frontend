import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";

import { StandardExecutionLayout } from "../components/layouts";
import { GeneralOptionButton, EXECUTION_THEMES } from "../components/shared";
import { testService } from "../services/test.service";
import { Level } from "../types/common.type";
import { QuestionResponse, SubmitTestRequest, UserAnswer } from "../types/test.type";

export function TestExecution() {
  const { level } = useParams<{ level: Level }>();
  const navigate = useNavigate();
  const theme = EXECUTION_THEMES.indigo;

  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showExit, setShowExit] = useState(false);

  const currentQuestion = questions[currentIndex] || null;
  const totalQuestions = questions.length || 30;
  const currentNumber = currentIndex + 1;
  const progress = (currentNumber / totalQuestions) * 100;
  const selectedAnswerForCurrentQuestion = currentQuestion ? answers[currentQuestion.questionId] : null;

  const parts = currentQuestion ? currentQuestion.content.split("_____") : [""];
  const answerTokens = selectedAnswerForCurrentQuestion
    ? selectedAnswerForCurrentQuestion.split("/").map((str) => str.trim())
    : [];

  useEffect(() => {
    if (level) {
      testService.generateTest(level).then((data) => {
        setQuestions(data);
      });
    }
  }, [level]);

  const handleNext = async () => {
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
            originalQuestions: questions,
          },
        });
      } catch (error) {
        console.error(error);
        alert("Lỗi nộp bài!");
      }
    }
  };

  return (
    <StandardExecutionLayout
      theme="indigo"
      questionLabel="Câu"
      currentNumber={currentNumber}
      totalQuestions={totalQuestions}
      progress={progress}
      showExit={showExit}
      onShowExit={() => setShowExit(true)}
      onExitCancel={() => setShowExit(false)}
      onExitConfirm={() => navigate("/")}
      exitTitle="Thoát bài test?"
      exitMessage="Tiến độ bài làm sẽ không được lưu nếu bạn thoát ngay bây giờ."
      exitCancelLabel="Tiếp tục làm bài"
      exitConfirmLabel="Vẫn thoát"
      selectedAnswer={selectedAnswerForCurrentQuestion}
      canGoBack={currentIndex > 0}
      onBack={() => setCurrentIndex(currentIndex - 1)}
      onNext={handleNext}
      nextDisabled={!selectedAnswerForCurrentQuestion}
      nextLabel={currentIndex === questions.length - 1 ? "Nộp bài test" : "Câu tiếp theo"}
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
        currentQuestion ? (
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
        ) : (
          <div className="text-center text-gray-500 py-10">Đang tải câu hỏi...</div>
        )
      }
    />
  );
}
