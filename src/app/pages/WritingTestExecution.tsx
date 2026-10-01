import { useEffect, useState } from "react";
// ĐÃ SỬA: Thêm Edit3 vào danh sách import
import { Loader2, Image as ImageIcon, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2, Edit3 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

import { writingService } from "../services/writing.service";
import { Level } from "../types/common.type";
import { WritingQuestion, SubmitWritingTestRequest } from "../types/writing.type";

export function WritingTestExecution() {
    const { level } = useParams<{ level: Level }>();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<WritingQuestion[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showExit, setShowExit] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    // 1. Gọi API bốc đề thi khi vào trang
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const data = await writingService.startPlacementTest(level!);
                setQuestions(data.questions);
                // Nạp câu trả lời đang làm dở (nếu có)
                if (data.savedAnswers) {
                    setAnswers(data.savedAnswers);
                }
            } catch (error) {
                console.error("Lỗi lấy đề thi Writing:", error);
                alert("Lỗi khi tạo đề thi, vui lòng thử lại sau!");
                navigate("/dashboard");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTest();
    }, [level, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-6" />
                <h2 className="text-2xl font-bold text-slate-800">Đang chuẩn bị đề thi Writing {level}...</h2>
                <p className="text-slate-500 mt-2">AI đang phân tích hình ảnh và từ vựng, vui lòng chờ giây lát.</p>
            </div>
        );
    }

    if (!questions || questions.length === 0) return null;

    const currentQuestion = questions[currentIdx];
    const totalQuestions = questions.length;
    const answeredCount = Object.values(answers).filter(val => val.trim().length > 0).length;
    const progress = (answeredCount / totalQuestions) * 100;

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.questionId]: e.target.value }));
    };

    const handleRequestSubmit = () => {
        if (answeredCount < totalQuestions) {
            setShowSubmitConfirm(true);
        } else {
            executeSubmit();
        }
    };

    // 2. Hàm Nộp bài và gọi AI chấm điểm
    const executeSubmit = async () => {
        setIsSubmitting(true);
        setShowSubmitConfirm(false);
        try {
            const formattedAnswers = questions.map(q => ({
                questionId: q.questionId,
                selectedAnswer: answers[q.questionId] || ""
            }));

            const submitData: SubmitWritingTestRequest = {
                testedLevel: level!,
                answers: formattedAnswers
            };

            const result = await writingService.submitPlacementTest(submitData);

            // Nộp xong, bay thẳng sang màn hình kết quả kèm data AI chấm
            navigate("/toeic/writing/test-result", {
                state: { dataResult: result, originalQuestions: questions }
            });
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Lỗi chấm bài. AI có thể đang bận, vui lòng thử nộp lại sau!";
            alert(msg);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "#F1F5F9", fontFamily: "'Poppins', sans-serif" }}>
            {/* --- HEADER TIẾN ĐỘ --- */}
            <div className="bg-white px-6 py-4 shadow-sm border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowExit(true)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-bold text-slate-800 text-lg">TOEIC Writing Part 1</h1>
                        <p className="text-xs font-medium text-slate-500">Trình độ mục tiêu: <span className="text-indigo-600">{level}</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-700">{answeredCount} / {totalQuestions} câu</span>
                        <div className="w-48 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <motion.div
                                className="h-full bg-indigo-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleRequestSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                        {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang chấm...</> : "Nộp bài"}
                    </button>
                </div>
            </div>

            {/* --- KHU VỰC LÀM BÀI CHÍNH --- */}
            <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">

                    {/* BÊN TRÁI: HIỂN THỊ ẢNH VÀ TỪ KHÓA */}
                    <div className="lg:w-1/2 p-6 md:p-8 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-bold text-sm rounded-lg">
                                Câu hỏi {currentIdx + 1}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                                Write a sentence based on a picture
                            </span>
                        </div>

                        {/* Box chứa ảnh */}
                        <div className="flex-1 bg-white rounded-2xl border-2 border-slate-100 flex items-center justify-center p-2 mb-6 shadow-sm overflow-hidden relative group">
                            {currentQuestion.imageUrl ? (
                                <img
                                    src={currentQuestion.imageUrl}
                                    alt="TOEIC Writing Question"
                                    className="max-w-full max-h-[350px] object-contain rounded-xl"
                                />
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center">
                                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                                    <span className="text-sm">Hình ảnh bị lỗi</span>
                                </div>
                            )}
                        </div>

                        {/* Yêu cầu đề bài */}
                        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                            <p className="text-sm font-semibold text-slate-600 mb-3">
                                Viết MỘT câu miêu tả bức tranh trên, bắt buộc sử dụng 2 từ khóa sau:
                            </p>
                            <div className="flex gap-3">
                                {currentQuestion.givenWords.split(',').map((word, wIdx) => (
                                    <span key={wIdx} className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-indigo-200 shadow-sm text-lg uppercase tracking-wide">
                                        {word.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BÊN PHẢI: KHU VỰC GÕ TEXT (TEXTAREA) */}
                    <div className="lg:w-1/2 p-6 md:p-8 flex flex-col">
                        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Edit3 className="w-5 h-5 text-indigo-600" />
                            Câu trả lời của bạn:
                        </div>

                        <textarea
                            value={answers[currentQuestion.questionId] || ""}
                            onChange={handleTextChange}
                            placeholder="Nhập câu tiếng Anh của bạn vào đây..."
                            className="flex-1 w-full p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all resize-none text-slate-800 text-lg leading-relaxed shadow-inner"
                            spellCheck="false"
                        />

                        {/* Thanh điều hướng câu hỏi */}
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                            <button
                                onClick={() => setCurrentIdx(prev => prev - 1)}
                                disabled={currentIdx === 0}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft className="w-4 h-4" /> Câu trước
                            </button>

                            <span className="text-sm font-bold text-slate-400">
                                {currentIdx + 1} / {totalQuestions}
                            </span>

                            {currentIdx < totalQuestions - 1 ? (
                                <button
                                    onClick={() => setCurrentIdx(prev => prev + 1)}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-100 shadow-sm"
                                >
                                    Câu tiếp <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleRequestSubmit}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                                >
                                    Hoàn tất <CheckCircle2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL CẢNH BÁO --- */}
            <AnimatePresence>
                {/* Modal Nộp bài khi chưa làm xong */}
                {showSubmitConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa hoàn thành hết</h3>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                Bạn mới làm <strong className="text-indigo-600">{answeredCount}/{totalQuestions}</strong> câu. Nếu nộp bây giờ, những câu trống sẽ bị tính <strong className="text-rose-500">0 điểm</strong>. Bạn chắc chứ?
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
                                    Quay lại làm tiếp
                                </button>
                                <button onClick={executeSubmit} disabled={isSubmitting} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex justify-center items-center gap-2">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Nộp luôn"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Modal Thoát ngang */}
                {showExit && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                            <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ArrowLeft className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Thoát bài thi?</h3>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                Dữ liệu bài làm của bạn sẽ không được AI chấm điểm. Bạn có chắc chắn muốn thoát?
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowExit(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
                                    Ở lại làm tiếp
                                </button>
                                <button onClick={() => navigate("/dashboard")} className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition">
                                    Thoát luôn
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}