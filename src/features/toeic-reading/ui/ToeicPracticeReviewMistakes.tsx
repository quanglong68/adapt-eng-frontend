import { motion } from "motion/react";
import { X, Check, Zap, ArrowLeft, BookOpen, AlertTriangle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { renderPassageContent } from "../../../shared/ui";
import { ToeicPracticeSubmissionResponse, ToeicPassageResponse } from "../../../entities/toeic/toeic.type";

export function ToeicPracticeReviewMistakes() {
    const location = useLocation();
    const navigate = useNavigate();

    const practiceResult = location.state?.dataResult as ToeicPracticeSubmissionResponse;
    const originalBlocks = location.state?.originalBlocks as ToeicPassageResponse[];
    const reviews = practiceResult?.reviewList || [];

    const reviewMap = Object.fromEntries(reviews.map(r => [r.questionId, r]));

    if (!practiceResult || !originalBlocks) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-4">Không tìm thấy dữ liệu bài làm!</h2>
                <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-sm font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.45)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]">
                    Quay lại Dashboard
                </button>
            </div>
        );
    }

    const renderPassage = (text: string) => renderPassageContent(text, "emerald");

    let globalQuestionNumber = 1;

    return (
        <div className="min-h-screen py-10 px-4 md:px-8 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Chi tiết kết quả ôn tập</h1>
                        <p className="text-slate-500 text-sm mt-1">Bạn đã đúng {practiceResult.correctAnswers}/{practiceResult.totalQuestions} câu hỏi</p>
                    </div>
                    <button
                        onClick={() => navigate("/toeic/practice-result", {
                            state: { dataResult: practiceResult, originalBlocks: originalBlocks }
                        })}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200/60 hover:bg-slate-100/50 transition-all duration-300"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </motion.div>

                <div className="space-y-6">
                    {originalBlocks.map((block, blockIdx) => {
                        const isPart5 = block.toeicPart === "PART_5";

                        return (
                            <motion.div
                                key={blockIdx}
                                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut", delay: blockIdx * 0.08 }}
                                className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden transition-all duration-300"
                            >
                                {!isPart5 && (
                                    <div className="p-6 md:p-8 border-b border-slate-200/60 bg-slate-50/80">
                                        <div className="flex items-center gap-2 mb-4">
                                            <BookOpen className="w-5 h-5 text-emerald-600" />
                                            <span className="font-bold text-sm text-emerald-700">{block.toeicPart.replace("_", " ")}</span>
                                        </div>
                                        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                                            {renderPassage(block.passageContent || "")}
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 md:p-8 divide-y divide-slate-100">
                                    {isPart5 && (
                                        <div className="font-bold text-sm text-emerald-700 pb-4">
                                            PART 5 - INCOMPLETE SENTENCES
                                        </div>
                                    )}

                                    {block.questions.map((q) => {
                                        const item = reviewMap[q.questionId];
                                        const currentQNum = globalQuestionNumber++;

                                        if (!item) return null;

                                        return (
                                            <div key={q.questionId} className="relative py-8 first:pt-0 last:pb-0 transition-all duration-300">
                                                <div className="absolute left-0 top-8 first:top-0">
                                                    {item.correct ? (
                                                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200/60">
                                                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center border border-red-200/60">
                                                            <X className="w-3.5 h-3.5 text-red-600" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pl-8">
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md border transition-all duration-300 ${item.correct ? "bg-emerald-50 border-emerald-200/60 text-emerald-700" : "bg-red-50 border-red-200/60 text-red-700"}`}>
                                                            {item.correct ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                            Câu {currentQNum}
                                                        </span>
                                                        <span className="text-xs font-semibold text-slate-500 px-2 py-1 bg-slate-100/80 rounded-md">
                                                            {item.knowledgeName}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-[15px] font-semibold text-slate-900 mb-4 leading-relaxed">
                                                        {q.content.replace("_____", "_______")}
                                                    </h3>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                                                        {q.options.map((opt, optIdx) => {
                                                            const isUserChoice = opt === item.userSelectedAnswer;
                                                            const isCorrectAnswer = opt === item.correctAnswer;
                                                            const isBlankSubmission = item.userSelectedAnswer === "";

                                                            let borderClass = "border-slate-200/60 hover:bg-slate-100/50";
                                                            let bgClass = "bg-white";
                                                            let textClass = "text-slate-600";

                                                            if (isCorrectAnswer) {
                                                                borderClass = "border-emerald-500 bg-emerald-50/80";
                                                                textClass = "text-emerald-700 font-bold";
                                                            } else if (isUserChoice && !item.correct && !isBlankSubmission) {
                                                                borderClass = "border-red-400 bg-red-50/80";
                                                                textClass = "text-red-700 font-semibold";
                                                            }

                                                            return (
                                                                <div key={optIdx} className={`p-3.5 rounded-xl border-2 flex items-center gap-3 transition-all duration-300 ${borderClass} ${bgClass}`}>
                                                                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-400 shrink-0 shadow-sm border border-slate-200/60">
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
                                                        <div className="text-sm font-semibold text-amber-700 mb-3 bg-amber-50 border border-amber-200/60 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-300">
                                                            <AlertTriangle className="w-4 h-4" />
                                                            Bạn đã bỏ trống câu này.
                                                        </div>
                                                    )}

                                                    <div className="rounded-2xl p-4 flex flex-col gap-2 bg-emerald-50/60 border border-dashed border-emerald-200/60 transition-all duration-300">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                                                            <span className="text-sm font-bold text-emerald-700">AI Giải thích</span>
                                                        </div>
                                                        <p className="text-[14px] leading-relaxed text-emerald-900 whitespace-pre-wrap">
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

                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut", delay: 0.4 }} className="text-center mt-10">
                    <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/toeic/practice-result", {
                            state: { dataResult: practiceResult, originalBlocks: originalBlocks }
                        })}
                        className="inline-flex items-center gap-2 px-10 py-3.5 rounded-full text-white text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.45)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại bảng điểm
                    </motion.button>
                </motion.div>

            </div>
        </div>
    );
}