import { motion } from "motion/react";
import { X, Check, Zap, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { WritingTestSubmissionResponse, WritingQuestion } from "../types/writing.type";

export function WritingTestReviewMistakes() {
    const location = useLocation();
    const navigate = useNavigate();

    const testResult = location.state?.dataResult as WritingTestSubmissionResponse;
    const originalQuestions = location.state?.originalQuestions as WritingQuestion[];

    if (!testResult || !originalQuestions) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-700 mb-4">Không tìm thấy dữ liệu review!</h2>
                <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold">
                    Quay lại Dashboard
                </button>
            </div>
        );
    }

    const reviews = testResult.reviewList || [];
    const reviewMap = Object.fromEntries(reviews.map(r => [r.questionId, r]));

    return (
        <div className="min-h-screen py-10 px-4 md:px-8" style={{ background: "#F1F5F9", fontFamily: "'Poppins', sans-serif" }}>
            <div className="max-w-5xl mx-auto">

                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">AI Feedback: TOEIC Writing Part 1</h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Chi tiết giải thích ngữ pháp và gợi ý sửa lỗi cho 5 bức ảnh.</p>
                    </div>
                    <button
                        onClick={() => navigate("/toeic/writing/test-result", {
                            state: { dataResult: testResult, originalQuestions: originalQuestions }
                        })}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 hover:bg-slate-50 transition shrink-0 self-end sm:self-auto"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </motion.div>

                <div className="space-y-8">
                    {originalQuestions.map((q, index) => {
                        const review = reviewMap[q.questionId];
                        if (!review) return null;

                        const isPerfect = review.correct; // Đạt 3/3 điểm

                        return (
                            <motion.div
                                key={q.questionId}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row"
                            >
                                {/* BÊN TRÁI: ẢNH ĐỀ BÀI */}
                                <div className="md:w-5/12 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 p-6 flex flex-col justify-center items-center">
                                    <div className="w-full flex justify-between items-center mb-4">
                                        <span className="text-xs font-bold px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg">
                                            Câu {index + 1}
                                        </span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-lg ${isPerfect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {review.correctAnswer}
                                        </span>
                                    </div>

                                    {q.imageUrl ? (
                                        <img src={q.imageUrl} alt={`Question ${index + 1}`} className="w-full max-h-[250px] object-cover rounded-xl shadow-sm border border-slate-200" />
                                    ) : (
                                        <div className="w-full h-[200px] bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                                            <ImageIcon className="w-10 h-10" />
                                        </div>
                                    )}

                                    <div className="w-full mt-4 flex justify-center gap-2">
                                        {q.givenWords.split(',').map((w, i) => (
                                            <span key={i} className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm uppercase">
                                                {w.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* BÊN PHẢI: FEEDBACK CỦA AI */}
                                <div className="md:w-7/12 p-6 md:p-8 flex flex-col">

                                    <div className="mb-6">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Câu trả lời của bạn</p>
                                        <div className="relative">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${isPerfect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            <p className={`pl-4 text-base font-medium ${review.userSelectedAnswer ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                                                {review.userSelectedAnswer || "Bạn đã bỏ trống câu này."}
                                            </p>
                                        </div>
                                    </div>

                                    {!isPerfect && review.knowledgeName && (
                                        <div className="mb-4 inline-flex items-center gap-2">
                                            <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md border border-amber-200">
                                                Lỗi ngữ pháp
                                            </span>
                                            <span className="text-sm font-semibold text-slate-600">
                                                {review.knowledgeName}
                                            </span>
                                        </div>
                                    )}

                                    <div className="rounded-2xl p-5 mt-auto flex flex-col gap-3" style={{ background: "#EEF2FF", border: "1px dashed #C7D2FE" }}>
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                                            <span className="text-sm font-bold" style={{ color: "#4F46E5" }}>Giáo viên AI nhận xét</span>
                                        </div>
                                        <p className="text-[14px] leading-relaxed" style={{ color: "#3730A3", whiteSpace: "pre-wrap" }}>
                                            {review.explanation}
                                        </p>
                                    </div>

                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center mt-10">
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 32px rgba(79,70,229,0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/toeic/writing/test-result", {
                            state: { dataResult: testResult, originalQuestions: originalQuestions }
                        })}
                        className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-white font-semibold"
                        style={{ background: "linear-gradient(135deg, #4F46E5, #3730A3)", boxShadow: "0 6px 20px rgba(79,70,229,0.3)" }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại bảng điểm
                    </motion.button>
                </motion.div>

            </div>
        </div>
    );
}