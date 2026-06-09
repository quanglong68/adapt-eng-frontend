import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { practiceService } from "../services/practice.service";
import { QuestionResponse } from "../types/common.type";
import { PracticeUserAnswer, DailyReviewSubmissionRequest } from "../types/practice.type";

export function PracticeExecution() {
    const navigate = useNavigate();

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
    const answerTokens = selectedAnswerForCurrentQuestion ? selectedAnswerForCurrentQuestion.split("/").map(str => str.trim()) : [];

    useEffect(() => {
        practiceService.getDailyReviewTest().then((data) => {
            setQuestions(data);
            setIsLoading(false);
        }).catch(err => {
            console.error("Lỗi lấy câu hỏi ôn tập:", err);
            setIsLoading(false);
        });
    }, []);

    // Nếu người dùng quá chăm chỉ, không có câu nào cần ôn hôm nay
    if (!isLoading && questions.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
                <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md w-full border border-slate-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Tuyệt vời!</h2>
                    <p className="text-slate-500 mb-6">Bạn đã hoàn thành tất cả mục tiêu ôn tập của ngày hôm nay. Hãy quay lại vào ngày mai nhé!</p>
                    <button onClick={() => navigate("/")} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition">
                        Quay lại trang chủ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
            {/* ── EXIT DIALOG ── */}
            <AnimatePresence>
                {showExit && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)" }}
                    >
                        <motion.div
                            initial={{ scale: 0.88, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.88, opacity: 0 }}
                            transition={{ type: "spring", damping: 18 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center"
                            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
                        >
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#FEF2F2" }}>
                                <AlertCircle className="w-7 h-7" style={{ color: "#EF4444" }} />
                            </div>
                            <h3 className="font-bold text-lg mb-2" style={{ color: "#1E293B" }}>Dừng ôn tập?</h3>
                            <p className="text-sm mb-6" style={{ color: "#64748B" }}>
                                Tiến độ ôn tập hằng ngày sẽ không được lưu nếu bạn thoát bây giờ.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowExit(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: "#F1F5F9", color: "#64748B" }}>
                                    Tiếp tục ôn
                                </button>
                                <button
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
                            <span className="text-sm font-bold" style={{ color: "#1E293B" }}>Ôn tập: Câu {currentNumber}</span>
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
                            initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full relative overflow-hidden"
                            style={{ background: "linear-gradient(90deg, #10B981, #059669)" }} // Đổi màu xanh lá cho Review
                        />
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.08, background: "#FEF2F2" }} whileTap={{ scale: 0.94 }} onClick={() => setShowExit(true)}
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
                        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="bg-white rounded-3xl p-10 mb-6"
                        style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.08)", border: "1px solid #F1F5F9" }}
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "#10B981" }}>
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
                                                background: selectedAnswerForCurrentQuestion ? "#ECFDF5" : "#F8FAFC",
                                                borderBottomColor: selectedAnswerForCurrentQuestion ? "#10B981" : "#CBD5E1",
                                                color: selectedAnswerForCurrentQuestion ? "#10B981" : "#94A3B8",
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
                        {isLoading ? (
                            <div className="text-center text-gray-500 py-10">Đang tải câu hỏi...</div>
                        ) : currentQuestion ? (
                            currentQuestion.options.map((optionText, i) => {
                                const isSelected = selectedAnswerForCurrentQuestion === optionText;
                                const letter = String.fromCharCode(65 + i);

                                return (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                                        whileHover={{ scale: 1.01, boxShadow: "0 4px 20px rgba(16,185,129,0.12)" }} whileTap={{ scale: 0.99 }}
                                        onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.questionId]: optionText }))}
                                        className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all"
                                        style={{
                                            background: isSelected ? "#ECFDF5" : "#fff",
                                            border: `2px solid ${isSelected ? "#10B981" : "#E5E7EB"}`,
                                            boxShadow: isSelected ? "0 4px 20px rgba(16,185,129,0.15)" : "0 1px 4px rgba(0,0,0,0.04)",
                                        }}
                                    >
                                        <motion.div
                                            animate={{ background: isSelected ? "#10B981" : "#F1F5F9", scale: isSelected ? 1.08 : 1 }}
                                            transition={{ type: "spring", damping: 14 }}
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                            style={{ color: isSelected ? "#fff" : "#64748B" }}
                                        >
                                            {letter}
                                        </motion.div>
                                        <span className="text-base font-medium flex-1" style={{ color: "#1E293B" }}>{optionText}</span>
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                                                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                                                    style={{ background: "#10B981" }}
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
                        ) : null}
                    </div>
                </div>
            </div>

            {/* ── BOTTOM BAR ── */}
            <div className="bg-white border-t flex items-center px-8 py-5 relative" style={{ borderColor: "#E5E7EB", boxShadow: "0 -4px 20px rgba(0,0,0,0.05)" }}>
                <div className="flex-1 flex justify-start">
                    <motion.button
                        disabled={currentIndex === 0}
                        whileHover={{ scale: currentIndex === 0 ? 1 : 1.02 }} whileTap={{ scale: currentIndex === 0 ? 1 : 0.98 }}
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

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <div className="w-2 h-2 rounded-full" style={{ background: selectedAnswerForCurrentQuestion ? "#10B981" : "#E5E7EB" }} />
                    <span className="text-sm font-medium" style={{ color: selectedAnswerForCurrentQuestion ? "#10B981" : "#94A3B8" }}>
                        {selectedAnswerForCurrentQuestion ? `Đã chọn: ${selectedAnswerForCurrentQuestion}` : "Chưa chọn đáp án"}
                    </span>
                </div>

                <div className="flex-1 flex justify-end">
                    <motion.button
                        disabled={!selectedAnswerForCurrentQuestion}
                        whileHover={{ scale: selectedAnswerForCurrentQuestion ? 1.02 : 1 }} whileTap={{ scale: selectedAnswerForCurrentQuestion ? 0.98 : 1 }}
                        onClick={async () => {
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
                                    // Gọi qua trang kết quả ôn tập (bạn nhớ khai báo route này trong App.tsx nhé)
                                    navigate("/practice-result", {
                                        state: {
                                            dataResult: result,
                                            originalQuestions: questions
                                        }
                                    });
                                } catch (error) {
                                    console.error(error);
                                    alert("Lỗi nộp bài ôn tập!");
                                }
                            }
                        }}
                        className="flex items-center gap-2 px-10 py-3.5 rounded-xl font-semibold text-sm transition-all"
                        style={{
                            background: selectedAnswerForCurrentQuestion ? "linear-gradient(135deg, #10B981, #059669)" : "#E5E7EB",
                            color: selectedAnswerForCurrentQuestion ? "#fff" : "#94A3B8",
                            cursor: selectedAnswerForCurrentQuestion ? "pointer" : "not-allowed",
                            boxShadow: selectedAnswerForCurrentQuestion ? "0 4px 16px rgba(16,185,129,0.3)" : "none",
                        }}
                    >
                        {currentIndex === questions.length - 1 ? "Nộp bài ôn tập" : "Câu tiếp theo"}
                        <ChevronRight className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}