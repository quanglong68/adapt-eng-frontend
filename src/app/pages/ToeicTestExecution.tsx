import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, ChevronLeft, AlertCircle, Loader2, CheckCircle2, HelpCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Level } from "../types/common.type";
import { toeicService } from "../services/toeic.service";
import { ToeicPassageResponse, SubmitToeicTestRequest } from "../types/toeic.type";

export function ToeicTestExecution() {
    const { level } = useParams<{ level: Level }>();
    const navigate = useNavigate();

    const [blocks, setBlocks] = useState<ToeicPassageResponse[]>([]);
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showExit, setShowExit] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false); // Modal nộp bài sớm
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const data = await toeicService.generateTest(level!);
                setBlocks(data);
            } catch (error) {
                console.error("Lỗi lấy đề thi TOEIC:", error);
                alert("Lỗi khi tạo đề thi, vui lòng thử lại!");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTest();
    }, [level]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                <h2 className="text-xl font-bold text-slate-700">Đang chuẩn bị đề thi TOEIC {level}...</h2>
                <p className="text-slate-500 text-sm mt-2">Đang phân tích cấu trúc 50 câu...</p>
            </div>
        );
    }

    if (!blocks || blocks.length === 0) return null;

    const totalQuestions = blocks.reduce((sum, block) => sum + block.questions.length, 0);
    const answeredCount = Object.keys(answers).length;
    const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

    const currentBlock = blocks[currentBlockIndex];
    const isPart5 = currentBlock.toeicPart === "PART_5";

    const renderPassageContent = (text: string) => {
        const parts = text.split(/(\[\d+\])/g);
        return parts.map((part, index) => {
            if (part.match(/\[\d+\]/)) {
                return <strong key={index} className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{part}</strong>;
            }
            return <span key={index}>{part}</span>;
        });
    };

    const handleSelectAnswer = (questionId: number, option: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }));
    };

    // Kiểm tra trước khi nộp
    const handleRequestSubmit = () => {
        if (answeredCount < totalQuestions) {
            setShowSubmitConfirm(true);
        } else {
            executeSubmit();
        }
    };

    // VÁ LỖI: Luôn gửi đủ 50 câu lên Server
    const executeSubmit = async () => {
        setIsSubmitting(true);
        setShowSubmitConfirm(false);
        try {
            // Lấy tất cả câu hỏi trong mảng
            const allOriginalQuestions = blocks.flatMap(b => b.questions);

            // Bắt buộc nhét đủ 50 câu. Câu nào chưa chọn thì gán chuỗi rỗng ""
            const formattedAnswers = allOriginalQuestions.map((q) => ({
                questionId: q.questionId,
                selectedAnswer: answers[q.questionId] || "",
            }));

            const submitData: SubmitToeicTestRequest = {
                testedLevel: level!,
                answers: formattedAnswers, // Gửi nguyên mảng 50 câu
            };

            const result = await toeicService.submitTest(submitData);

            // TRUYỀN TOÀN BỘ KHỐI BLOCKS ĐỂ TRANG REVIEW CÓ ĐOẠN VĂN MÀ ĐỌC
            navigate("/toeic/test-result", {
                state: { dataResult: result, originalBlocks: blocks }
            });
        } catch (error) {
            console.error(error);
            alert("Lỗi nộp bài!");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "#F8FAFC" }}>
            <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowExit(true)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                        Bài Test <span className="text-indigo-600">TOEIC {level}</span>
                    </div>
                </div>

                <div className="flex-1 max-w-xl mx-8 hidden md:flex items-center gap-4">
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-indigo-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
                    </div>
                    <span className="text-sm font-semibold text-slate-500">{answeredCount} / {totalQuestions}</span>
                </div>

                <button
                    onClick={handleRequestSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Nộp bài
                </button>
            </header>

            <main className="flex-1 overflow-hidden flex flex-col p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto w-full h-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
                    {!isPart5 && (
                        <div className="lg:w-1/2 h-1/3 lg:h-full border-b lg:border-b-0 lg:border-r border-slate-200 p-6 lg:p-10 overflow-y-auto" style={{ background: "#FDFDFD" }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg mb-6">
                                {currentBlock.toeicPart.replace("_", " ")}
                            </div>
                            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {renderPassageContent(currentBlock.passageContent || "")}
                            </div>
                        </div>
                    )}

                    <div className={`${isPart5 ? 'w-full max-w-3xl mx-auto' : 'lg:w-1/2'} h-2/3 lg:h-full p-6 lg:p-10 overflow-y-auto bg-white`}>
                        {isPart5 && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg mb-8">
                                PART 5 - INCOMPLETE SENTENCES
                            </div>
                        )}

                        <div className="space-y-12">
                            {currentBlock.questions.map((q, idx) => (
                                <div key={q.questionId} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-[15px] font-semibold text-slate-800 mb-5 flex gap-3 leading-relaxed">
                                        <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full text-xs">
                                            {idx + 1}
                                        </span>
                                        {q.content.replace("_____", "_______")}
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-10">
                                        {q.options.map((opt, optIdx) => {
                                            const isSelected = answers[q.questionId] === opt;
                                            const labels = ["A", "B", "C", "D"];
                                            return (
                                                <button
                                                    key={optIdx}
                                                    onClick={() => handleSelectAnswer(q.questionId, opt)}
                                                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${isSelected ? "border-indigo-600 bg-indigo-50" : "border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/50"}`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                                        {labels[optIdx]}
                                                    </div>
                                                    <span className={`flex-1 text-[14px] ${isSelected ? "text-indigo-900 font-semibold" : "text-slate-600"}`}>
                                                        {opt}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="h-20 bg-white border-t border-slate-200 px-6 lg:px-12 flex items-center justify-between shrink-0">
                <button
                    onClick={() => setCurrentBlockIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentBlockIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Trang trước
                </button>

                <div className="text-sm font-bold text-slate-400">
                    Khối {currentBlockIndex + 1} / {blocks.length}
                </div>

                {currentBlockIndex === blocks.length - 1 ? (
                    <button
                        onClick={handleRequestSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all"
                    >
                        {isSubmitting ? "Đang chấm điểm..." : "Hoàn thành"}
                        <CheckCircle2 className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentBlockIndex(prev => Math.min(blocks.length - 1, prev + 1))}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold transition-all"
                    >
                        Khối tiếp theo
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </footer>

            {/* MODAL THOÁT BÀI THI */}
            <AnimatePresence>
                {showExit && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Thoát bài thi?</h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                Bài làm của bạn sẽ không được lưu lại. Bạn có chắc chắn muốn quay về màn hình chọn độ khó?
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowExit(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition">
                                    Tiếp tục thi
                                </button>
                                <button onClick={() => navigate("/select-level")} className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition shadow-lg shadow-red-200">
                                    Thoát luôn
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL NỘP BÀI SỚM (GIAO DIỆN ĐẸP) */}
            <AnimatePresence>
                {showSubmitConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4 text-amber-500">
                                <HelpCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa làm hết bài!</h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                Bạn mới hoàn thành <strong className="text-indigo-600">{answeredCount}/{totalQuestions}</strong> câu hỏi. Những câu chưa chọn sẽ bị tính là <strong>Sai</strong>. Bạn có chắc chắn muốn nộp bài lúc này?
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition">
                                    Làm tiếp
                                </button>
                                <button onClick={executeSubmit} className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                                    Nộp bài luôn
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}