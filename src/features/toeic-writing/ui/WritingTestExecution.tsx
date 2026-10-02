import { useEffect, useState } from "react";
import { Loader2, Image as ImageIcon, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2, Edit3, PenLine } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

import { writingService } from "../../../entities/writing/writing.service";
import { handleApiError } from "../../../shared/api/handleApiError";
import { Level } from "../../../shared/types/common.type";
import { WritingQuestion, SubmitWritingTestRequest } from "../../../entities/writing/writing.type";

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
                handleApiError(error, "Lỗi khi tạo đề thi, vui lòng thử lại sau!");
                navigate("/dashboard");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTest();
    }, [level, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-5" />
                <h2 className="text-xl font-bold text-slate-800">Đang chuẩn bị đề thi Writing {level}...</h2>
                <p className="text-sm text-slate-500 mt-2">AI đang phân tích hình ảnh và từ vựng, vui lòng chờ giây lát.</p>
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
            handleApiError(error, "Lỗi chấm bài. AI có thể đang bận, vui lòng thử nộp lại sau!");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* --- HEADER TIẾN ĐỘ --- */}
            <div className="bg-white px-4 md:px-6 py-4 border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowExit(true)} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-300">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="font-bold text-slate-800 text-base flex items-center gap-2">
                                <PenLine className="w-4 h-4 text-indigo-600" />
                                TOEIC Writing Part 1
                            </h1>
                            <p className="text-xs font-medium text-slate-500">Trình độ mục tiêu: <span className="text-indigo-600 font-semibold">{level}</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-bold text-slate-700">{answeredCount} / {totalQuestions} câu</span>
                            <div className="w-44 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                <motion.div
                                    className="h-full bg-indigo-600 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleRequestSubmit}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all duration-300 flex items-center gap-2 disabled:opacity-60"
                        >
                            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang chấm...</> : "Nộp bài"}
                        </button>
                    </div>
                </div>
                <div className="md:hidden max-w-7xl mx-auto mt-3">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-indigo-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </div>

            {/* --- KHU VỰC LÀM BÀI CHÍNH --- */}
            <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[560px]"
                >
                    {/* BÊN TRÁI: HIỂN THỊ ẢNH VÀ TỪ KHÓA */}
                    <div className="lg:w-1/2 p-5 md:p-6 bg-slate-50/60 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
                        <div className="flex items-center justify-between mb-4 gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-xs rounded-full">
                                Câu hỏi {currentIdx + 1}
                            </span>
                            <span className="text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                                Write a sentence based on a picture
                            </span>
                        </div>

                        {/* Box chứa ảnh */}
                        <div className="flex-1 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-2 mb-5 overflow-hidden">
                            {currentQuestion.imageUrl ? (
                                <img
                                    src={currentQuestion.imageUrl}
                                    alt="TOEIC Writing Question"
                                    className="max-w-full max-h-[340px] object-contain rounded-lg"
                                />
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center py-10">
                                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                                    <span className="text-sm">Hình ảnh bị lỗi</span>
                                </div>
                            )}
                        </div>

                        {/* Yêu cầu đề bài */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <p className="text-sm font-medium text-slate-600 mb-3">
                                Viết MỘT câu miêu tả bức tranh trên, bắt buộc sử dụng 2 từ khóa sau:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {currentQuestion.givenWords.split(',').map((word, wIdx) => (
                                    <span key={wIdx} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-semibold rounded-lg border border-indigo-100 text-sm uppercase tracking-wide">
                                        {word.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BÊN PHẢI: KHU VỰC GÕ TEXT (TEXTAREA) */}
                    <div className="lg:w-1/2 p-5 md:p-6 flex flex-col">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Edit3 className="w-4 h-4 text-indigo-600" />
                            Câu trả lời của bạn:
                        </div>

                        <textarea
                            value={answers[currentQuestion.questionId] || ""}
                            onChange={handleTextChange}
                            placeholder="Nhập câu tiếng Anh của bạn vào đây..."
                            className="flex-1 w-full min-h-[220px] p-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-300 resize-none text-slate-800 text-[15px] leading-relaxed placeholder:text-slate-400"
                            spellCheck="false"
                        />

                        {/* Thanh điều hướng câu hỏi */}
                        <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
                            <button
                                onClick={() => setCurrentIdx(prev => prev - 1)}
                                disabled={currentIdx === 0}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft className="w-4 h-4" /> Câu trước
                            </button>

                            <span className="text-sm font-semibold text-slate-400">
                                {currentIdx + 1} / {totalQuestions}
                            </span>

                            {currentIdx < totalQuestions - 1 ? (
                                <button
                                    onClick={() => setCurrentIdx(prev => prev + 1)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all duration-300"
                                >
                                    Câu tiếp <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleRequestSubmit}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-200"
                                >
                                    Hoàn tất <CheckCircle2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* --- MODAL CẢNH BÁO --- */}
            <AnimatePresence>
                {/* Modal Nộp bài khi chưa làm xong */}
                {showSubmitConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full text-center shadow-xl">
                            <div className="w-12 h-12 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa hoàn thành hết</h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                Bạn mới làm <strong className="text-indigo-600">{answeredCount}/{totalQuestions}</strong> câu. Nếu nộp bây giờ, những câu trống sẽ bị tính <strong className="text-rose-600">0 điểm</strong>. Bạn chắc chứ?
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all duration-300">
                                    Quay lại làm tiếp
                                </button>
                                <button onClick={executeSubmit} disabled={isSubmitting} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200 flex justify-center items-center gap-2 disabled:opacity-60">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Nộp luôn"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Modal Thoát ngang */}
                {showExit && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full text-center shadow-xl">
                            <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <ArrowLeft className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Thoát bài thi?</h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                Dữ liệu bài làm của bạn sẽ không được AI chấm điểm. Bạn có chắc chắn muốn thoát?
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowExit(false)} className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all duration-300">
                                    Ở lại làm tiếp
                                </button>
                                <button onClick={() => navigate("/dashboard")} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-all duration-300">
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
