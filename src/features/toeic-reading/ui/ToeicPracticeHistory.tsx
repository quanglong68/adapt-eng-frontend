import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, History, CheckCircle2, XCircle, Calendar, ChevronRight, X, BookOpen, Check, Zap, AlertTriangle } from "lucide-react";
import { toeicService } from "../../../entities/toeic/toeic.service";
import { DailyPracticeHistoryResponse, ToeicQuestionReview, ToeicPassageResponse } from "../../../entities/toeic/toeic.type";
import { renderPassageContent } from "../../../shared/ui";

interface DetailViewData {
    reviews: ToeicQuestionReview[];
    blocks: ToeicPassageResponse[];
    score: number;
    total: number;
}

export function ToeicPracticeHistory() {
    const navigate = useNavigate();
    const [histories, setHistories] = useState<DailyPracticeHistoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDetail, setSelectedDetail] = useState<DetailViewData | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await toeicService.getPracticeHistory();
                setHistories(data);
            } catch (error) {
                console.error("Lỗi lấy lịch sử:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const openDetail = (record: DailyPracticeHistoryResponse) => {
        try {
            const reviews = JSON.parse(record.reviewJson) as ToeicQuestionReview[];
            const blocks = JSON.parse(record.questionsJson) as ToeicPassageResponse[];
            setSelectedDetail({ reviews, blocks, score: record.score, total: record.totalQuestions });
        } catch (e) {
            console.error("Không thể đọc chi tiết:", e);
        }
    };

    let globalQuestionNumber = 1;

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* HERO strip full-width */}
            <div className="w-full bg-slate-50 relative overflow-hidden border-b border-slate-200/60">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -top-16 right-0 w-96 h-96 bg-violet-200/40 rounded-full blur-[100px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 py-10 relative">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="flex items-center gap-4">
                        <button onClick={() => navigate("/dashboard")} className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200/60 hover:bg-slate-100 transition-all duration-300 shrink-0">
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 mb-2">
                                <History className="w-3.5 h-3.5" />
                                TOEIC Reading
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Lịch sử Luyện tập Daily</h1>
                            <p className="text-slate-500 text-sm mt-1.5">Xem lại từng phiên ôn tập, điểm số và giải thích chi tiết từng câu.</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Danh sách các bài đã làm */}
            <div className="max-w-4xl mx-auto px-6 py-8 border-t border-slate-200/60 mt-0">
                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>
                ) : histories.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-center py-20 bg-white rounded-2xl border border-slate-200/60 transition-all duration-300"
                    >
                        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-2">Chưa có lịch sử</h2>
                        <p className="text-slate-500 text-sm">Bạn chưa hoàn thành bài luyện tập nào. Hãy bắt đầu ngay hôm nay!</p>
                    </motion.div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200/60 divide-y divide-slate-200/60 overflow-hidden transition-all duration-300">
                        {histories.map((record, idx) => {
                            const dateObj = new Date(record.testDate);
                            const percent = Math.round((record.score / record.totalQuestions) * 100);

                            return (
                                <motion.div
                                    key={record.recordId}
                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.05 }}
                                    onClick={() => openDetail(record)}
                                    className="px-5 py-4 hover:bg-slate-100/50 transition-all duration-300 cursor-pointer flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-50 flex flex-col items-center justify-center border border-slate-200/60 group-hover:bg-emerald-50 group-hover:border-emerald-200/60 transition-all duration-300 shrink-0">
                                            <Calendar className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 mb-0.5 transition-all duration-300" />
                                            <span className="text-xs font-bold text-slate-700">{dateObj.getDate()}/{dateObj.getMonth() + 1}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">Phiên ôn tập ngày {dateObj.toLocaleDateString('vi-VN')}</h3>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md border transition-all duration-300 ${percent >= 70 ? 'bg-emerald-50 border-emerald-200/60 text-emerald-700' : percent >= 50 ? 'bg-amber-50 border-amber-200/60 text-amber-700' : 'bg-red-50 border-red-200/60 text-red-700'}`}>
                                                    {percent >= 50 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                    Điểm: {record.score}/{record.totalQuestions}
                                                </span>
                                                <span className="text-xs font-medium text-slate-500 bg-slate-100/80 px-2 py-1 rounded-md">{record.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-100/80 flex items-center justify-center text-slate-500 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shrink-0">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Xem chi tiết (FULL MÀN HÌNH Y HỆT TRANG REVIEW MISTAKES) */}
            <AnimatePresence>
                {selectedDetail && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-50 overflow-y-auto bg-slate-50"
                    >
                        <div className="min-h-screen py-10 px-4 md:px-8">
                            <div className="max-w-4xl mx-auto">

                                {/* Header của Modal Full Screen */}
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Chi tiết kết quả ôn tập</h1>
                                        <p className="text-slate-500 text-sm mt-1">Bạn đã đúng {selectedDetail.score}/{selectedDetail.total} câu hỏi</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedDetail(null)}
                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200/60 hover:bg-slate-100/50 transition-all duration-300"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                {/* Nội dung chi tiết */}
                                <div className="space-y-6">
                                    {(() => {
                                        const reviewMap = Object.fromEntries(selectedDetail.reviews.map(r => [r.questionId, r]));
                                        globalQuestionNumber = 1;

                                        return selectedDetail.blocks.map((block, blockIdx) => {
                                            const isPart5 = block.toeicPart === "PART_5";

                                            return (
                                                <div key={blockIdx} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden transition-all duration-300">
                                                    {/* Hiển thị Đoạn văn (Passage) */}
                                                    {!isPart5 && (
                                                        <div className="p-6 md:p-8 border-b border-slate-200/60 bg-slate-50/80">
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <BookOpen className="w-5 h-5 text-emerald-600" />
                                                                <span className="font-bold text-sm text-emerald-700">{block.toeicPart.replace("_", " ")}</span>
                                                            </div>
                                                            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                                                                {renderPassageContent(block.passageContent || "", "emerald")}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="p-6 md:p-8 divide-y divide-slate-200/60 border-t border-slate-200/60">
                                                        {isPart5 && (
                                                            <div className="font-bold text-sm text-emerald-700 pb-4">
                                                                PART 5 - INCOMPLETE SENTENCES
                                                            </div>
                                                        )}

                                                        {/* Hiển thị Câu hỏi và Đáp án */}
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

                                                                        <div className="rounded-xl p-4 flex flex-col gap-2 bg-emerald-50/60 border border-dashed border-emerald-200/60 transition-all duration-300">
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
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>

                                {/* Nút Quay Lại ở cuối trang */}
                                <div className="text-center mt-10 pb-10">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedDetail(null)}
                                        className="inline-flex items-center gap-2 px-10 py-3.5 rounded-full text-white text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.45)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Quay lại danh sách lịch sử
                                    </motion.button>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}