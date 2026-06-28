import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, History, CheckCircle2, XCircle, Calendar, ChevronRight, X, BookOpen, Check, Zap } from "lucide-react";
import { toeicService } from "../services/toeic.service";
import { DailyPracticeHistoryResponse, ToeicQuestionReview, ToeicPassageResponse } from "../types/toeic.type";
import { renderPassageContent } from "../components/shared";

interface DetailViewData {
    reviews: ToeicQuestionReview[];
    blocks: ToeicPassageResponse[];
    score: number;
    total: number;
}

export function PracticeHistory() {
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
        <div className="min-h-screen bg-slate-50 font-['Poppins'] relative">
            {/* Header Danh sách */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/dashboard")} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <History className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h1 className="text-xl font-bold text-slate-800">Lịch sử Luyện tập Daily</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách các bài đã làm */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
                ) : histories.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-700 mb-2">Chưa có lịch sử</h2>
                        <p className="text-slate-500">Bạn chưa hoàn thành bài luyện tập nào. Hãy bắt đầu ngay hôm nay!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {histories.map((record) => {
                            const dateObj = new Date(record.testDate);
                            const percent = Math.round((record.score / record.totalQuestions) * 100);

                            return (
                                <motion.div
                                    key={record.recordId}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    onClick={() => openDetail(record)}
                                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-full bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-emerald-50 transition-colors">
                                            <Calendar className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 mb-0.5" />
                                            <span className="text-xs font-bold text-slate-700">{dateObj.getDate()}/{dateObj.getMonth() + 1}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg mb-1">Phiên ôn tập ngày {dateObj.toLocaleDateString('vi-VN')}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm font-semibold px-2 py-0.5 rounded-md ${percent >= 70 ? 'bg-emerald-100 text-emerald-700' : percent >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                    Điểm: {record.score}/{record.totalQuestions}
                                                </span>
                                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Status: {record.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
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
                        className="fixed inset-0 z-50 overflow-y-auto"
                        style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}
                    >
                        <div className="min-h-screen py-10 px-4 md:px-8">
                            <div className="max-w-4xl mx-auto">

                                {/* Header của Modal Full Screen */}
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Chi tiết kết quả ôn tập</h1>
                                        <p className="text-slate-500 text-sm mt-1 font-medium">Bạn đã đúng {selectedDetail.score}/{selectedDetail.total} câu hỏi</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedDetail(null)}
                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 hover:bg-slate-50 transition"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                {/* Nội dung chi tiết */}
                                <div className="space-y-10">
                                    {(() => {
                                        const reviewMap = Object.fromEntries(selectedDetail.reviews.map(r => [r.questionId, r]));
                                        globalQuestionNumber = 1;

                                        return selectedDetail.blocks.map((block, blockIdx) => {
                                            const isPart5 = block.toeicPart === "PART_5";

                                            return (
                                                <div key={blockIdx} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                                    {/* Hiển thị Đoạn văn (Passage) */}
                                                    {!isPart5 && (
                                                        <div className="p-6 md:p-8 border-b border-slate-200 bg-slate-50">
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <BookOpen className="w-5 h-5 text-emerald-500" />
                                                                <span className="font-bold text-sm text-emerald-700">{block.toeicPart.replace("_", " ")}</span>
                                                            </div>
                                                            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                                                                {renderPassageContent(block.passageContent || "", "emerald")}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="p-6 md:p-8 space-y-12">
                                                        {isPart5 && (
                                                            <div className="font-bold text-sm text-emerald-700 mb-6 pb-4 border-b border-slate-100">
                                                                PART 5 - INCOMPLETE SENTENCES
                                                            </div>
                                                        )}

                                                        {/* Hiển thị Câu hỏi và Đáp án */}
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

                                                                        <div className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: "#F0FDF4", border: "1px dashed #A7F3D0" }}>
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                                                                                <span className="text-sm font-bold" style={{ color: "#059669" }}>AI Giải thích</span>
                                                                            </div>
                                                                            <p className="text-[14px] leading-relaxed" style={{ color: "#064E3B", whiteSpace: "pre-wrap" }}>
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
                                        whileHover={{ scale: 1.02, boxShadow: "0 10px 32px rgba(16,185,129,0.3)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedDetail(null)}
                                        className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-200"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
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