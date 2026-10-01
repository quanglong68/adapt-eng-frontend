import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, History, Calendar, ChevronRight, X, BookOpen, AlertTriangle, Image as ImageIcon, PenLine, Bot, Check } from "lucide-react";
import { toast } from "react-hot-toast";

import { writingService } from "../../../entities/writing/writing.service";
import { DailyWritingPracticeHistoryResponse, WritingQuestionReview, WritingQuestion } from "../../../entities/writing/writing.type";

interface DetailViewData {
    reviews: WritingQuestionReview[];
    questions: WritingQuestion[];
    score: number;
    maxScore: number;
}

export function WritingPracticeHistory() {
    const navigate = useNavigate();
    const [histories, setHistories] = useState<DailyWritingPracticeHistoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDetail, setSelectedDetail] = useState<DetailViewData | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await writingService.getPracticeHistory();
                // Bản ghi IN_PROGRESS chưa có điểm nên không hiển thị được
                setHistories((data || []).filter(record => record.status === "COMPLETED"));
            } catch (error: any) {
                console.error("Lỗi lấy lịch sử luyện tập Writing:", error);
                toast.error(error.response?.data?.message || "Lỗi khi tải lịch sử, vui lòng thử lại!");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const openDetail = (record: DailyWritingPracticeHistoryResponse) => {
        // reviewJson / questionsJson là STRING JSON thô do backend lưu, hỏng thì phải chặn
        // thay vì để trang sập xuống
        try {
            const reviews = JSON.parse(record.reviewJson) as WritingQuestionReview[];
            const questions = JSON.parse(record.questionsJson) as WritingQuestion[];
            if (!Array.isArray(reviews) || !Array.isArray(questions)) {
                throw new Error("Dữ liệu chi tiết không đúng định dạng mảng");
            }
            setSelectedDetail({
                reviews,
                questions,
                score: record.score ?? 0,
                maxScore: record.totalQuestions * 3
            });
        } catch (e) {
            console.error("Không thể đọc chi tiết bài luyện tập:", e);
            toast.error("Không đọc được chi tiết bài luyện tập này. Bản ghi có thể đã bị hỏng.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* HERO strip full-width */}
            <div className="w-full bg-slate-50 relative overflow-hidden border-b border-slate-200/60">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-200/40 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -top-16 right-0 w-96 h-96 bg-teal-200/40 rounded-full blur-[100px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 py-10 relative">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="flex items-center gap-4">
                        <button onClick={() => navigate("/dashboard")} className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200/60 hover:bg-slate-100 transition-all duration-300 shrink-0">
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 mb-2">
                                <History className="w-3.5 h-3.5" />
                                TOEIC Writing
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Lịch sử Luyện tập Writing</h1>
                            <p className="text-slate-500 text-sm mt-1.5">Theo dõi điểm số từng phiên và nhận xét chi tiết từ giáo viên AI.</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Danh sách các bài đã làm */}
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 border-t border-slate-200/60 mt-0">
                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>
                ) : histories.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-6 h-6 text-slate-400" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-700 mb-2">Chưa có lịch sử</h2>
                        <p className="text-sm text-slate-500 mb-6">Bạn chưa hoàn thành bài luyện tập Writing nào. Hãy bắt đầu ngay hôm nay!</p>
                        <button
                            onClick={() => navigate("/toeic/writing/practice")}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1"
                        >
                            <PenLine className="w-4 h-4" />
                            Luyện tập ngay
                        </button>
                    </motion.div>
                ) : (
                                <div className="bg-white rounded-2xl border border-slate-200/60 divide-y divide-slate-200/60 overflow-hidden">
                        {histories.map((record, idx) => {
                            // Thang điểm Writing là 0-3 mỗi câu
                            const score = record.score ?? 0;
                            const maxScore = record.totalQuestions * 3;
                            const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
                            const dateObj = new Date(record.testDate);

                            return (
                                <motion.div
                                    key={record.recordId}
                                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(idx * 0.05, 0.3), duration: 0.3 }}
                                    onClick={() => openDetail(record)}
                                    className="p-4 md:p-5 hover:bg-slate-50/70 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 group"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center shrink-0 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all duration-300">
                                            <Calendar className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 mb-0.5" />
                                            <span className="text-xs font-bold text-slate-700">{dateObj.getDate()}/{dateObj.getMonth() + 1}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-800 text-[15px] mb-1.5 truncate">Phiên luyện tập ngày {dateObj.toLocaleDateString('vi-VN')}</h3>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${percent >= 70 ? "bg-emerald-50 border-emerald-100 text-emerald-700" : percent >= 50 ? "bg-amber-50 border-amber-100 text-amber-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
                                                    Điểm: {score}/{maxScore}
                                                </span>
                                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{record.totalQuestions} câu</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white text-slate-400 transition-all duration-300">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Xem chi tiết (FULL MÀN HÌNH) */}
            <AnimatePresence>
                {selectedDetail && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 24 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 overflow-y-auto bg-slate-50"
                    >
                        <div className="min-h-screen py-8 px-4 md:px-6">
                            <div className="max-w-4xl mx-auto">
                                {/* Header của Modal Full Screen */}
                                <div className="flex items-center justify-between mb-6 gap-4">
                                    <div>
                                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Chi tiết buổi luyện tập</h1>
                                        <p className="text-slate-500 text-sm mt-1">
                                            Bạn đạt{" "}
                                            <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                                {selectedDetail.score}/{selectedDetail.maxScore}
                                            </span>{" "}
                                            điểm
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedDetail(null)}
                                        className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-all duration-300 shrink-0"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                {/* Nội dung chi tiết */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 divide-y divide-slate-200/60 overflow-hidden">
                                    {selectedDetail.questions.map((q, index) => {
                                        const review = selectedDetail.reviews.find(r => r.questionId === q.questionId);
                                        if (!review) return null;

                                        const isPerfect = review.correct; // Đạt 3/3 điểm

                                        return (
                                            <motion.div
                                                key={q.questionId}
                                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.3 }}
                                                className="flex flex-col md:flex-row"
                                            >
                                                {/* ẢNH ĐỀ BÀI */}
                                                <div className="md:w-5/12 bg-slate-50/60 border-b md:border-b-0 md:border-r border-slate-200/60 p-5 flex flex-col justify-center items-center">
                                                    <div className="w-full flex justify-between items-center mb-3">
                                                        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full">
                                                            Câu {index + 1}
                                                        </span>
                                                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${isPerfect ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
                                                            {isPerfect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                            {review.correctAnswer}
                                                        </span>
                                                    </div>

                                                    {q.imageUrl ? (
                                                        <img src={q.imageUrl} alt={`Câu hỏi ${index + 1}`} className="w-full max-h-[240px] object-cover rounded-xl border border-slate-200" />
                                                    ) : (
                                                        <div className="w-full h-[180px] bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                                            <ImageIcon className="w-8 h-8" />
                                                        </div>
                                                    )}

                                                    <div className="w-full mt-3 flex flex-wrap justify-center gap-2">
                                                        {(q.givenWords || "").split(',').filter(w => w.trim().length > 0).map((w, i) => (
                                                            <span key={i} className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full uppercase">
                                                                {w.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* FEEDBACK CỦA AI */}
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

                                                    {q.requiredGrammar && (
                                                        <div className="mb-3 inline-flex items-center gap-2 self-start">
                                                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-100">
                                                                <AlertTriangle className="w-3 h-3" /> Ngữ pháp bắt buộc
                                                            </span>
                                                            <span className="text-sm font-medium text-slate-600">{q.requiredGrammar}</span>
                                                        </div>
                                                    )}

                                                    {!isPerfect && review.knowledgeName && (
                                                        <div className="mb-4 inline-flex items-center gap-2 self-start">
                                                            <span className="inline-flex items-center text-xs font-semibold px-2 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-100">
                                                                Lỗi ngữ pháp
                                                            </span>
                                                            <span className="text-sm font-medium text-slate-600">{review.knowledgeName}</span>
                                                        </div>
                                                    )}

                                                    <div className="rounded-xl p-4 mt-auto flex flex-col gap-2 bg-emerald-50/60 border border-emerald-100">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                                                                <Bot className="w-4 h-4 text-white" />
                                                            </span>
                                                            <span className="text-sm font-bold text-emerald-700">Giáo viên AI nhận xét</span>
                                                        </div>
                                                        <p className="text-sm leading-relaxed text-emerald-900 whitespace-pre-wrap">
                                                            {review.explanation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Nút Quay Lại ở cuối trang */}
                                <div className="text-center mt-8 pb-10">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedDetail(null)}
                                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm text-white font-semibold bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1 transition-all duration-300"
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
