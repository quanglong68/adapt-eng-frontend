import { useEffect, useState } from "react";
import { Loader2, Brain } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { SplitScreenLayout } from "../components/layouts";
import { ToeicOptionButton, renderPassageContent } from "../components/shared";
import { deepDiveService } from "../services/deepDive.service";
import { ToeicPassageResponse } from "../types/toeic.type";
import { WordCart } from "../components/vip/WordCart";

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

                // 🚀 NHÀN HẠ VÀ ĐỒNG BỘ: Data từ Backend đã chuẩn 100% ToeicPassageResponse
                const rawData = await deepDiveService.getSessionQuestions(sessionId);

                // Nếu Backend không có PassageContent (Part 5), chèn thêm dòng chỉ dẫn để UI đẹp hơn
                const formattedData = rawData.map(block => {
                    if (!block.passageContent) {
                        return {
                            ...block,
                            passageContent: "💡 **Mục tiêu:** Hãy chọn đáp án đúng nhất để hoàn thành các câu sau. Bộ đề AI thiết kế độc quyền cho bạn."
                        };
                    }
                    return block;
                });

                setBlocks(formattedData);
            } catch (error) {
                console.error("Lỗi lấy đề Deep Dive:", error);
                alert("Không thể tải đề thi chuyên sâu. Vui lòng thử lại!");
                navigate("/dashboard");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeepDiveQuestions();
    }, [sessionId, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-50">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-indigo-500" /> Chuẩn bị bộ đề AI...
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
            console.error(error);
            alert("Lỗi nộp bài AI Deep Dive!");
            setIsSubmitting(false);
        }
    };

    return (
        <div onMouseUp={handleMouseUp} className="w-full h-full relative">
            <SplitScreenLayout
                theme="indigo"
                title={<>Khắc phục <span className="text-indigo-600">Điểm yếu VIP</span></>}
                progress={progress}
                answeredCount={answeredCount}
                totalQuestions={totalQuestions}
                onHeaderSubmit={handleRequestSubmit}
                isSubmitting={isSubmitting}

                isPart5={isSingleQuestions}
                partLabel={isSingleQuestions ? "KIẾN THỨC CHUYÊN SÂU" : "ĐỌC HIỂU CHUYÊN SÂU"}
                passageContent={renderPassageContent(currentBlock.passageContent || "", "indigo")}

                questionsContent={
                    <div className="space-y-12">
                        {currentBlock.questions.map((q, idx) => (
                            <div key={q.questionId} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-[15px] font-semibold text-slate-800 mb-5 flex gap-3 leading-relaxed">
                                    <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                                        {idx + 1}
                                    </span>
                                    {q.content.replace("_____", "_______")}
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
                            </div>
                        ))}
                    </div>
                }

                currentBlockIndex={currentBlockIndex}
                totalBlocks={blocks.length}
                onPrevBlock={() => setCurrentBlockIndex((prev) => Math.max(0, prev - 1))}
                onNextBlock={() => setCurrentBlockIndex((prev) => Math.min(blocks.length - 1, prev + 1))}
                isLastBlock={currentBlockIndex === blocks.length - 1}

                onComplete={handleRequestSubmit}
                completeLabel="Hoàn thành phân tích"
                submittingLabel="Đang chấm điểm..."
                prevBlockLabel="Phần trước"
                nextBlockLabel="Phần tiếp theo"

                showExit={showExit}
                onShowExit={() => setShowExit(true)}
                onExitCancel={() => setShowExit(false)}
                onExitConfirm={() => navigate("/dashboard")}
                exitTitle="Thoát phiên chuyên sâu?"
                exitMessage="Bài làm của bạn chưa được nộp. Thoát bây giờ sẽ hủy toàn bộ kết quả phiên AI này."
                exitCancelLabel="Tiếp tục làm"
                exitConfirmLabel="Thoát luôn"
                showSubmitConfirm={showSubmitConfirm}
                onSubmitConfirmCancel={() => setShowSubmitConfirm(false)}
                onSubmitConfirmConfirm={executeSubmit}
                submitConfirmMessage={
                    <>
                        Bạn mới làm được{" "}
                        <strong className="text-indigo-600">
                            {answeredCount}/{totalQuestions}
                        </strong>{" "}
                        câu. Nộp bài với các câu bỏ trống chứ?
                    </>
                }
            />

            <WordCart selectedText={selectedText} selectionPosition={selectionPos} />
        </div>
    );
}