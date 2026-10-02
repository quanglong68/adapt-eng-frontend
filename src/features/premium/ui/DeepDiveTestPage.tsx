import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Brain, X, CheckCircle2, ChevronLeft, ChevronRight, BookOpenText, ListChecks, Lightbulb } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { ToeicOptionButton, renderPassageContent, ProgressBar, ExitModal, SubmitConfirmModal } from "../../../shared/ui";
import { deepDiveService } from "../../../entities/deepdive/deepDive.service";
import { handleApiError } from "../../../shared/api/handleApiError";
import { ToeicPassageResponse } from "../../../entities/toeic/toeic.type";
import { WordCart } from "../../vocab/ui/WordCart";

export function DeepDiveTestPage() {
    const navigate = useNavigate();
    const { sessionId } = useParams<{ sessionId: string }>();

    const [blocks, setBlocks] = useState<ToeicPassageResponse[]>([]);
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const [showExit, setShowExit] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedText, setSelectedText] = useState("");
    const [selectionPos, setSelectionPos] = useState<{ x: number, y: number } | null>(null);

    const handleMouseUp = () => {
        const selection = window.getSelection();
        let text = selection?.toString().trim();

        if (!text) {
            setSelectedText("");
            return;
        }

        text = text.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
        const isValidCharacters = /^[a-zA-Z0-9\s\-']+$/.test(text);
        const wordCount = text.split(/\s+/).length;
        const isValidLength = text.length >= 2 && text.length <= 30;

        if (isValidCharacters && isValidLength && wordCount <= 3) {
            const range = selection?.getRangeAt(0).getBoundingClientRect();
            if (range && range.width > 0) {
                setSelectedText(text);
                setSelectionPos({ x: range.left + (range.width / 2) - 50, y: range.top });
            }
        } else {
            setSelectedText("");
        }
    };

    useEffect(() => {
        const fetchDeepDiveQuestions = async () => {
            if (!sessionId) return;

            try {
                setIsLoading(true);

                const rawData = await deepDiveService.getSessionQuestions(sessionId);

                // Nếu Backend không có PassageContent (Part 5), chèn thêm dòng chỉ dẫn để UI đẹp hơn
                const formattedData = rawData.map(block => {
                    if (!block.passageContent) {
                        return {
                            ...block,
                            passageContent: "Mục tiêu: Hãy chọn đáp án đúng nhất để hoàn thành các câu sau. Bộ đề AI thiết kế độc quyền cho bạn."
                        };
                    }
                    return block;
                });

                setBlocks(formattedData);
            } catch (error) {
                handleApiError(error, "Không thể tải đề thi chuyên sâu. Vui lòng thử lại!");
                navigate("/dashboard");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeepDiveQuestions();
    }, [sessionId, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5">
                    <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-600" /> Chuẩn bị bộ đề AI...
                </h2>
                <p className="text-slate-500 text-sm mt-2">Dữ liệu đang được đồng bộ, vui lòng đợi giây lát</p>
            </div>
        );
    }

    if (!blocks || blocks.length === 0) return null;

    const totalQuestions = blocks.reduce((sum, block) => sum + block.questions.length, 0);
    const answeredCount = Object.keys(answers).length;
    const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

    const currentBlock = blocks[currentBlockIndex];
    // Tự động nhận biết dạng câu hỏi để điều chỉnh Layout (Chia đôi hoặc Danh sách)
    const isSingleQuestions = currentBlock.toeicPart === "PART_5";

    const handleSelectAnswer = (questionId: number, option: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }));
    };

    const handleRequestSubmit = () => {
        if (answeredCount < totalQuestions) {
            setShowSubmitConfirm(true);
        } else {
            executeSubmit();
        }
    };

    const executeSubmit = async () => {
        setIsSubmitting(true);
        setShowSubmitConfirm(false);
        try {
            // Lấy toàn bộ đáp án từ TẤT CẢ các blocks
            const formattedAnswers: Record<number, string> = {};
            blocks.flatMap(b => b.questions).forEach((q) => {
                formattedAnswers[q.questionId] = answers[q.questionId] || "";
            });

            const result = await deepDiveService.submitSession(sessionId!, { answers: formattedAnswers });
            sessionStorage.removeItem(`deep_dive_${sessionId}`);

            const mappedResult = {
                ...result,
                correctAnswers: result.score,
                totalQuestions: result.total,
                validEffort: true,
                earnedXp: result.score * 5,
                reviewList: result.reviewList || []
            };

            navigate("/toeic/practice-result", {
                state: {
                    dataResult: mappedResult,
                    originalBlocks: blocks
                },
            });
        } catch (error) {
            handleApiError(error, "Lỗi nộp bài AI Deep Dive!");
            setIsSubmitting(false);
        }
    };

    return (
        <div onMouseUp={handleMouseUp} className="min-h-screen flex flex-col bg-slate-50">
            {/* Header sticky trắng */}
            <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        onClick={() => setShowExit(true)}
                        aria-label="Thoát phiên làm bài"
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="font-bold tracking-tight text-slate-900 flex items-center gap-2 truncate">
                        <Brain className="w-5 h-5 shrink-0 text-indigo-600" />
                        <span className="truncate">Khắc phục <span className="text-indigo-600">Điểm yếu VIP</span></span>
                    </div>
                </div>

                <ProgressBar
                    variant="toeic"
                    progress={progress}
                    barColor="#6366F1"
                    countLabel={`${answeredCount} / ${totalQuestions}`}
                />

                <div className="flex items-center gap-3 shrink-0">
                    <span className="md:hidden text-xs font-bold text-slate-500">{answeredCount}/{totalQuestions}</span>
                    <button
                        onClick={handleRequestSubmit}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_28px_rgba(99,102,241,0.55)] flex items-center gap-2 disabled:opacity-60"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Nộp bài
                    </button>
                </div>
            </header>

            {/* Nội dung clean edtech */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row"
                >
                    {!isSingleQuestions && (
                        <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/60 p-6 lg:p-8 overflow-y-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1 font-bold text-xs rounded-lg mb-6 bg-indigo-50 text-indigo-700">
                                <BookOpenText className="w-4 h-4" />
                                {isSingleQuestions ? "KIẾN THỨC CHUYÊN SÂU" : "ĐỌC HIỂU CHUYÊN SÂU"}
                            </div>
                            <div className="max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                                {renderPassageContent(currentBlock.passageContent || "", "indigo")}
                            </div>
                        </div>
                    )}

                    <div className={`${isSingleQuestions ? "w-full max-w-3xl mx-auto" : "lg:w-1/2"} p-6 lg:p-8 overflow-y-auto bg-white`}>
                        {isSingleQuestions && (
                            <div className="mb-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 font-bold text-xs rounded-lg bg-indigo-50 text-indigo-700">
                                    <ListChecks className="w-4 h-4" />
                                    PART 5 - INCOMPLETE SENTENCES
                                </div>
                                <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-indigo-500" />
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {renderPassageContent(currentBlock.passageContent || "", "indigo")}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="divide-y divide-slate-100">
                            {currentBlock.questions.map((q, idx) => (
                                <motion.div
                                    key={q.questionId}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(idx * 0.07, 0.5), duration: 0.4, ease: "easeOut" }}
                                    className="py-7 first:pt-0 last:pb-0"
                                >
                                    <h3 className="text-[15px] font-semibold text-slate-800 mb-5 flex gap-3 leading-relaxed">
                                        <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                                            {idx + 1}
                                        </span>
                                        <span>{q.content.replace("_____", "_______")}</span>
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-10">
                                        {q.options.map((opt, optIdx) => (
                                            <ToeicOptionButton
                                                key={optIdx}
                                                optionText={opt}
                                                index={optIdx}
                                                isSelected={answers[q.questionId] === opt}
                                                onSelect={() => handleSelectAnswer(q.questionId, opt)}
                                                theme="indigo"
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Footer điều hướng */}
            <footer className="bg-white border-t border-slate-200 px-4 md:px-8 lg:px-12 py-4 flex items-center justify-between gap-3 sticky bottom-0 z-10">
                <button
                    onClick={() => setCurrentBlockIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentBlockIndex === 0}
                    className="flex items-center gap-2 px-5 md:px-6 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Phần trước
                </button>

                <div className="text-sm font-bold text-slate-400 whitespace-nowrap">
                    Khối {currentBlockIndex + 1} / {blocks.length}
                </div>

                {currentBlockIndex === blocks.length - 1 ? (
                    <button
                        onClick={handleRequestSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 md:px-8 py-3 text-white rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_24px_rgba(99,102,241,0.45)] hover:shadow-[0_0_32px_rgba(99,102,241,0.6)] transition-all duration-300 disabled:opacity-60"
                    >
                        {isSubmitting ? "Đang chấm điểm..." : "Hoàn thành phân tích"}
                        {!isSubmitting && <CheckCircle2 className="w-5 h-5" />}
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentBlockIndex((prev) => Math.min(blocks.length - 1, prev + 1))}
                        className="flex items-center gap-2 px-5 md:px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition-all duration-300"
                    >
                        Phần tiếp theo
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </footer>

            <ExitModal
                isOpen={showExit}
                title="Thoát phiên chuyên sâu?"
                message="Bài làm của bạn chưa được nộp. Thoát bây giờ sẽ hủy toàn bộ kết quả phiên AI này."
                cancelLabel="Tiếp tục làm"
                confirmLabel="Thoát luôn"
                onCancel={() => setShowExit(false)}
                onConfirm={() => navigate("/dashboard")}
                variant="compact"
            />

            <SubmitConfirmModal
                isOpen={showSubmitConfirm}
                title="Chưa làm hết bài!"
                message={
                    <>
                        Bạn mới làm được{" "}
                        <strong className="text-indigo-600">
                            {answeredCount}/{totalQuestions}
                        </strong>{" "}
                        câu. Nộp bài với các câu bỏ trống chứ?
                    </>
                }
                cancelLabel="Làm tiếp"
                confirmLabel="Nộp bài luôn"
                onCancel={() => setShowSubmitConfirm(false)}
                onConfirm={executeSubmit}
            />

            <WordCart selectedText={selectedText} selectionPosition={selectionPos} />
        </div>
    );
}
