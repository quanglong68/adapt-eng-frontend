import { motion } from "motion/react";
import { X, Check, Zap, ArrowLeft, Image as ImageIcon, Bot } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { WritingTestSubmissionResponse, WritingQuestion } from "../../../entities/writing/writing.type";

export function WritingTestReviewMistakes() {
    const location = useLocation();
    const navigate = useNavigate();

    const testResult = location.state?.dataResult as WritingTestSubmissionResponse;
    const originalQuestions = location.state?.originalQuestions as WritingQuestion[];

    if (!testResult || !originalQuestions) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
                <h2 className="text-lg font-bold text-slate-700 mb-4">Không tìm thấy dữ liệu review!</h2>
                <button onClick={() => navigate("/dashboard")} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 transition-all duration-300">
                    Quay lại Dashboard
                </button>
            </div>
        );
    }

    const reviews = testResult.reviewList || [];
    const reviewMap = Object.fromEntries(reviews.map(r => [r.questionId, r]));

    return (
        <div className="min-h-screen py-8 px-4 md:px-6 bg-slate-50">
            <div className="max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-start justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">AI Feedback: TOEIC Writing Part 1</h1>
                        <p className="text-slate-500 text-sm mt-1">Chi tiết giải thích ngữ pháp và gợi ý sửa lỗi cho 5 bức ảnh.</p>
                    </div>
                    <button
                        onClick={() => navigate("/toeic/writing/test-result", {
                            state: { dataResult: testResult, originalQuestions: originalQuestions }
                        })}
                        className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-all duration-300 shrink-0"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </motion.div>

                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                    {originalQuestions.map((q, index) => {
                        const review = reviewMap[q.questionId];
                        if (!review) return null;

                        const isPerfect = review.correct; // Đạt 3/3 điểm

                        return (
                            <motion.div
                                key={q.questionId}
                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.08, 0.4), duration: 0.3 }}
                                className="flex flex-col md:flex-row"
                            >
                                {/* BÊN TRÁI: ẢNH ĐỀ BÀI */}
                                <div className="md:w-5/12 bg-slate-50/60 border-b md:border-b-0 md:border-r border-slate-100 p-5 flex flex-col justify-center items-center">
                                    <div className="w-full flex justify-between items-center mb-3">
                                        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full">
                                            Câu {index + 1}
                                        </span>
                                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${isPerfect ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
                                            {isPerfect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                            {review.correctAnswer}
                                        </span>
                                    </div>

                                    {q.imageUrl ? (
                                        <img src={q.imageUrl} alt={`Question ${index + 1}`} className="w-full max-h-[240px] object-cover rounded-xl border border-slate-200" />
                                    ) : (
                                        <div className="w-full h-[180px] bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                    )}

                                    <div className="w-full mt-3 flex flex-wrap justify-center gap-2">
                                        {q.givenWords.split(',').map((w, i) => (
                                            <span key={i} className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full uppercase">
                                                {w.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* BÊN PHẢI: FEEDBACK CỦA AI */}
                                <div className="md:w-7/12 p-5 md:p-6 flex flex-col">
                                    <div className="mb-5">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Câu trả lời của bạn</p>
                                        <div className="relative">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${isPerfect ? "bg-emerald-500" : "bg-rose-500"}`} />
                                            <p className={`pl-4 text-[15px] font-medium ${review.userSelectedAnswer ? "text-slate-800" : "text-slate-400 italic"}`}>
                                                {review.userSelectedAnswer || "Bạn đã bỏ trống câu này."}
                                            </p>
                                        </div>
                                    </div>

                                    {!isPerfect && review.knowledgeName && (
                                        <div className="mb-4 inline-flex items-center gap-2 self-start">
                                            <span className="inline-flex items-center text-xs font-semibold px-2 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-100">
                                                Lỗi ngữ pháp
                                            </span>
                                            <span className="text-sm font-medium text-slate-600">
                                                {review.knowledgeName}
                                            </span>
                                        </div>
                                    )}

                                    <div className="rounded-xl p-4 mt-auto flex flex-col gap-2 bg-indigo-50/60 border border-indigo-100">
                                        <div className="flex items-center gap-2">
                                            <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                                                <Bot className="w-4 h-4 text-white" />
                                            </span>
                                            <span className="text-sm font-bold text-indigo-700">Giáo viên AI nhận xét</span>
                                        </div>
                                        <p className="text-sm leading-relaxed text-indigo-900 whitespace-pre-wrap">
                                            {review.explanation}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.3 }} className="text-center mt-8">
                    <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/toeic/writing/test-result", {
                            state: { dataResult: testResult, originalQuestions: originalQuestions }
                        })}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm text-white font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all duration-300"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại bảng điểm
                    </motion.button>
                </motion.div>
                <div className="flex items-center gap-2 justify-center mt-4 text-xs text-slate-400">
                    <Zap className="w-3.5 h-3.5" />
                    AI chấm theo thang 0-3 điểm mỗi câu hỏi TOEIC Writing Part 1
                </div>
            </div>
        </div>
    );
}
