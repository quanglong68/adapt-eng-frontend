import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, History, Calendar, ChevronRight, X, BookOpen, AlertTriangle, Zap, Image as ImageIcon, PenLine } from "lucide-react";
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
        <div className="min-h-screen bg-slate-50 font-['Poppins'] relative">
            {/* Header Danh sách */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/dashboard")} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <History className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h1 className="text-xl font-bold text-slate-800">Lịch sử Luyện tập Writing</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách các bài đã làm */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                ) : histories.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-700 mb-2">Chưa có lịch sử</h2>
                        <p className="text-slate-500 mb-6">Bạn chưa hoàn thành bài luyện tập Writing nào. Hãy bắt đầu ngay hôm nay!</p>
                        <button
                            onClick={() => navigate("/toeic/writing/practice")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                        >
                            <PenLine className="w-4 h-4" />
                            Luyện tập ngay
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {histories.map((record) => {
                            // Thang điểm Writing là 0-3 mỗi câu
                            const score = record.score ?? 0;
                            const maxScore = record.totalQuestions * 3;
                            const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
                            const dateObj = new Date(record.testDate);

                            return (
                                <motion.div
                                    key={record.recordId}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    onClick={() => openDetail(record)}
                                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-full bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                                            <Calendar className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 mb-0.5" />
                                            <span className="text-xs font-bold text-slate-700">{dateObj.getDate()}/{dateObj.getMonth() + 1}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg mb-1">Phiên luyện tập ngày {dateObj.toLocaleDateString('vi-VN')}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm font-semibold px-2 py-0.5 rounded-md ${percent >= 70 ? 'bg-emerald-100 text-emerald-700' : percent >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                    Điểm: {score}/{maxScore}
                                                </span>
                                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{record.totalQuestions} câu</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                        <ChevronRight className="w-5 h-5" />
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
                                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Chi tiết buổi luyện tập</h1>
                                        <p className="text-slate-500 text-sm mt-1 font-medium">Bạn đạt {selectedDetail.score}/{selectedDetail.maxScore} điểm</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedDetail(null)}
                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 hover:bg-slate-50 transition"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                {/* Nội dung chi tiết */}
                                <div className="space-y-8">
                                    {selectedDetail.questions.map((q, index) => {
                                        const review = selectedDetail.reviews.find(r => r.questionId === q.questionId);
                                        if (!review) return null;

                                        const isPerfect = review.correct; // Đạt 3/3 điểm

                                        return (
                                            <motion.div
                                                key={q.questionId}
                                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                                                className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row"
                                            >
                                                {/* ẢNH ĐỀ BÀI */}
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
                                                        <img src={q.imageUrl} alt={`Câu hỏi ${index + 1}`} className="w-full max-h-[250px] object-cover rounded-xl shadow-sm border border-slate-200" />
                                                    ) : (
                                                        <div className="w-full h-[200px] bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                                                            <ImageIcon className="w-10 h-10" />
                                                        </div>
                                                    )}

                                                    <div className="w-full mt-4 flex flex-wrap justify-center gap-2">
                                                        {(q.givenWords || "").split(',').filter(w => w.trim().length > 0).map((w, i) => (
                                                            <span key={i} className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm uppercase">
                                                                {w.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* FEEDBACK CỦA AI */}
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

                                                    {q.requiredGrammar && (
                                                        <div className="mb-4 inline-flex items-center gap-2 self-start">
                                                            <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md border border-amber-200 flex items-center gap-1">
                                                                <AlertTriangle className="w-3 h-3" /> Ngữ pháp bắt buộc
                                                            </span>
                                                            <span className="text-sm font-semibold text-slate-600">{q.requiredGrammar}</span>
                                                        </div>
                                                    )}

                                                    {!isPerfect && review.knowledgeName && (
                                                        <div className="mb-4 inline-flex items-center gap-2 self-start">
                                                            <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md border border-amber-200">
                                                                Lỗi ngữ pháp
                                                            </span>
                                                            <span className="text-sm font-semibold text-slate-600">{review.knowledgeName}</span>
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

                                {/* Nút Quay Lại ở cuối trang */}
                                <div className="text-center mt-10 pb-10">
                                    <motion.button
                                        whileHover={{ scale: 1.02, boxShadow: "0 10px 32px rgba(79,70,229,0.3)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedDetail(null)}
                                        className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-200"
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
