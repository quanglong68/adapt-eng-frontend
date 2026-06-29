import { motion } from "motion/react";
import { X, Check, Zap, ArrowLeft, BookOpen } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { renderPassageContent } from "../components/shared";
import { ToeicTestSubmissionResponse, ToeicPassageResponse } from "../types/toeic.type";

export function ToeicTestReviewMistakes() {
    const location = useLocation();
    const navigate = useNavigate();

    const testResult = location.state?.dataResult as ToeicTestSubmissionResponse;
    const originalBlocks = location.state?.originalBlocks as ToeicPassageResponse[];
    // HỨNG LẠI CỜ TỪ TRANG RESULT ĐỂ LÁT TRẢ LẠI
    const mode = location.state?.mode;

    const reviews = testResult?.reviewList || [];

    const reviewMap = Object.fromEntries(reviews.map(r => [r.questionId, r]));

    if (!testResult || !originalBlocks) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-xl font-bold text-slate-700 mb-4">Không tìm thấy dữ liệu bài làm!</h2>
                <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold">
                    Quay lại Dashboard
                </button>
            </div>
        );
    }

    const renderPassage = (text: string) => renderPassageContent(text, "indigo");
    let globalQuestionNumber = 1;

    return (
        <div className="min-h-screen py-10 px-4 md:px-8" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
            <div className="max-w-4xl mx-auto">

                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Review Chi Tiết Đề Thi TOEIC</h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Bạn đã đúng {testResult.correctAnswers}/{testResult.totalQuestions} câu hỏi</p>
                    </div>
                    {/* NÚT THOÁT GÓC TRÊN */}
                    <button
                        onClick={() => navigate("/toeic/test-result", {
                            state: { dataResult: testResult, originalBlocks: originalBlocks, mode: mode }
                        })}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 hover:bg-slate-50 transition"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </motion.div>

                <div className="space-y-10">
                    {originalBlocks.map((block, blockIdx) => {
                        const isPart5 = block.toeicPart === "PART_5";

                        return (
                            <motion.div
                                key={blockIdx}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: blockIdx * 0.1 }}
                                className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
                            >
                                {!isPart5 && (
                                    <div className="p-6 md:p-8 border-b border-slate-200 bg-slate-50">
                                        <div className="flex items-center gap-2 mb-4">
                                            <BookOpen className="w-5 h-5 text-indigo-500" />
                                            <span className="font-bold text-sm text-indigo-700">{block.toeicPart.replace("_", " ")}</span>
                                        </div>
                                        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                                            {renderPassage(block.passageContent || "")}
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 md:p-8 space-y-12">
                                    {isPart5 && (
                                        <div className="font-bold text-sm text-indigo-700 mb-6 pb-4 border-b border-slate-100">
                                            PART 5 - INCOMPLETE SENTENCES
                                        </div>
                                    )}

                                    {block.questions.map((q) => {
                                        const item = reviewMap[q.questionId];
                                        const currentQNum = globalQuestionNumber++;

                                        if (!item) return null;

                                        return (
                                            <div key={q.questionId} className="relative">
                                                <div className="absolute -left-2 top-0 md:-left-4">
                                                    {item.correct ? (
                                                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                                                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
                                                            <X className="w-3.5 h-3.5 text-red-600" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pl-8">
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <span className="text-xs font-bold px-2 py-1 rounded-md" style={{ background: item.correct ? "#ECFDF5" : "#FEF2F2", color: item.correct ? "#059669" : "#DC2626" }}>
                                                            Câu {currentQNum}
                                                        </span>
                                                        <span className="text-xs font-semibold text-slate-500 px-2 py-1 bg-slate-100 rounded-md">
                                                            {item.knowledgeName}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-[15px] font-semibold text-slate-800 mb-4 leading-relaxed">
                                                        {q.content.replace("_____", "_______")}
                                                    </h3>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                                                        {q.options.map((opt, optIdx) => {
                                                            const isUserChoice = opt === item.userSelectedAnswer;
                                                            const isCorrectAnswer = opt === item.correctAnswer;
                                                            const isBlankSubmission = item.userSelectedAnswer === "";

                                                            let borderClass = "border-slate-100";
                                                            let bgClass = "bg-slate-50/50";
                                                            let textClass = "text-slate-600";

                                                            if (isCorrectAnswer) {
                                                                borderClass = "border-emerald-500 bg-emerald-50";
                                                                textClass = "text-emerald-700 font-bold";
                                                            } else if (isUserChoice && !item.correct && !isBlankSubmission) {
                                                                borderClass = "border-red-400 bg-red-50";
                                                                textClass = "text-red-700 font-semibold";
                                                            }

                                                            return (
                                                                <div key={optIdx} className={`p-3.5 rounded-xl border-2 flex items-center gap-3 ${borderClass} ${bgClass}`}>
                                                                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-400 shrink-0 shadow-sm border border-slate-100">
                                                                        {["A", "B", "C", "D"][optIdx]}
                                                                    </div>
                                                                    <span className={`text-[14px] flex-1 ${textClass}`}>{opt}</span>
                                                                    {isCorrectAnswer && <Check className="w-4 h-4 text-emerald-600" />}
                                                                    {isUserChoice && !item.correct && !isBlankSubmission && <X className="w-4 h-4 text-red-500" />}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {item.userSelectedAnswer === "" && (
                                                        <div className="text-sm font-semibold text-amber-600 mb-3 bg-amber-50 inline-block px-3 py-1 rounded-md border border-amber-200">
                                                            ⚠️ Bạn đã bỏ trống câu này.
                                                        </div>
                                                    )}

                                                    <div className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: "#EEF2FF", border: "1px dashed #C7D2FE" }}>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                                                            <span className="text-sm font-bold" style={{ color: "#4F46E5" }}>AI Giải thích</span>
                                                        </div>
                                                        <p className="text-[14px] leading-relaxed" style={{ color: "#3730A3", whiteSpace: "pre-wrap" }}>
                                                            {item.explanation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* NÚT QUAY LẠI Ở CUỐI TRANG */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center mt-10">
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 32px rgba(79,70,229,0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/toeic/test-result", {
                            state: { dataResult: testResult, originalBlocks: originalBlocks, mode: mode }
                        })}
                        className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-white font-semibold"
                        style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 6px 20px rgba(79,70,229,0.3)" }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại bảng điểm
                    </motion.button>
                </motion.div>

            </div>
        </div>
    );
}