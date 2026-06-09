import { motion } from "motion/react";
import { X, Check, Zap, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { DailyReviewResultResponse } from "../types/practice.type";

export function PracticeReviewMistakes() {
    const location = useLocation();
    const navigate = useNavigate();

    const practiceResult = location.state?.dataResult as DailyReviewResultResponse;
    const originalQuestions = location.state?.originalQuestions;
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

                {/* Header */}
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

                {/* Danh sách câu hỏi */}
                <div className="space-y-6">
                    {reviews.map((item, i) => {
                        const isCorrect = item.correct;
                        const originalQuestion = originalQuestions?.find((q: any) => q.questionId === item.questionId);

                        return (
                            <motion.div
                                key={item.questionId} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden border-2"
                                style={{
                                    borderColor: isCorrect ? "#A7F3D0" : "#FCA5A5",
                                    boxShadow: isCorrect ? "0 4px 20px rgba(16,185,129,0.05)" : "0 4px 20px rgba(239,68,68,0.05)",
                                }}
                            >
                                {/* Header Card */}
                                <div className="flex items-center gap-3 px-6 py-3" style={{ background: isCorrect ? "#F0FDF4" : "#FEF2F2" }}>
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: isCorrect ? "#10B981" : "#EF4444" }}>
                                        {isCorrect ? <Check className="w-3.5 h-3.5 text-white" /> : <X className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: isCorrect ? "#10B981" : "#EF4444" }}>
                                        Câu {i + 1} – {isCorrect ? "Chính xác" : "Cần sửa sai"}
                                    </span>
                                    <div className="ml-auto">
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#EEF2FF", color: "#4F46E5" }}>
                                            #{item.knowledgeName}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Nội dung câu hỏi gốc */}
                                    {originalQuestion && (
                                        <div className="mb-5 p-4 rounded-2xl" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                                            <p className="text-base font-medium leading-relaxed" style={{ color: "#1E293B" }}>
                                                {originalQuestion.content}
                                            </p>
                                        </div>
                                    )}

                                    {/* Danh sách các đáp án lựa chọn */}
                                    <div className="space-y-2.5 mb-5">
                                        {originalQuestion?.options.map((optText: string, optIndex: number) => {
                                            const letter = String.fromCharCode(65 + optIndex);
                                            const isCorrectOption = optText === item.correctAnswer;
                                            const isUserSelected = optText === item.userSelectedAnswer;

                                            let bgColor = "#fff";
                                            let borderColor = "#E5E7EB";
                                            let iconBg = "#F1F5F9";
                                            let textColor = "#1E293B";
                                            let tagBadge = null;

                                            if (isCorrectOption) {
                                                bgColor = "#F0FDF4"; borderColor = "#A7F3D0"; iconBg = "#10B981"; textColor = "#047857";
                                                tagBadge = <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Đáp án chuẩn</span>;
                                            } else if (isUserSelected && !isCorrectOption) {
                                                bgColor = "#FEF2F2"; borderColor = "#FCA5A5"; iconBg = "#EF4444"; textColor = "#B91C1C";
                                                tagBadge = <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Lựa chọn của bạn</span>;
                                            }

                                            return (
                                                <div key={optIndex} className="w-full flex items-center gap-4 p-4 rounded-xl text-left border" style={{ background: bgColor, borderColor: borderColor }}>
                                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: (isCorrectOption || isUserSelected) ? iconBg : "#64748B" }}>
                                                        {isCorrectOption ? <Check className="w-4 h-4" /> : isUserSelected ? <X className="w-4 h-4" /> : letter}
                                                    </div>
                                                    <span className="text-sm font-medium flex-1" style={{ color: textColor }}>{optText}</span>
                                                    {tagBadge}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Khối AI Giải thích */}
                                    <div className="rounded-2xl p-5 border" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #FDFFFA 100%)", borderColor: "#A7F3D0" }}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="w-4 h-4 text-green-600 animate-pulse" />
                                            <span className="text-sm font-bold text-green-700">AI Giải thích chi tiết</span>
                                        </div>
                                        <p className="text-sm leading-relaxed text-emerald-900" style={{ whiteSpace: "pre-wrap" }}>
                                            {item.explanation}
                                        </p>
                                    </div>

                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Nút quay lại, nhét ngược state để trang PracticeResult không bị trắng tinh dữ liệu */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-8">
                    <button
                        onClick={() => navigate("/practice-result", {
                            state: { dataResult: practiceResult, originalQuestions: originalQuestions }
                        })}
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