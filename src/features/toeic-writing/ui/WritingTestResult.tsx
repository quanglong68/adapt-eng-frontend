import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bot, ChevronRight, BarChart2, AlertTriangle, CheckCircle2, Eye, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import { useLocation, useNavigate } from "react-router-dom";

import { CircularProgress } from "../../../shared/ui";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "../../../shared/ui/alert-dialog";
import { WritingTestSubmissionResponse, WritingQuestion } from "../../../entities/writing/writing.type";
import { Level, getLevelDisplay } from "../../../shared/types/common.type";
import { writingService } from "../../../entities/writing/writing.service";
import { handleApiError } from "../../../shared/api/handleApiError";
import { STORAGE_KEYS } from "../../../shared/lib/storageKeys";

export function WritingTestResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const testResult = location.state?.dataResult as WritingTestSubmissionResponse;
    const originalQuestions = location.state?.originalQuestions as WritingQuestion[];

    useEffect(() => {
        if (!testResult) {
            navigate("/dashboard");
            return;
        }

        if (testResult.passedThreshold) {
            const duration = 3 * 1000;
            const end = Date.now() + duration;
            const frame = () => {
                confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#4F46E5", "#7C3AED", "#10B981"] });
                confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#4F46E5", "#7C3AED", "#10B981"] });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
        }
    }, [testResult, navigate]);

    if (!testResult) return null;

    const maxScore = testResult.totalQuestions * 3;
    const currentScore = testResult.correctAnswers;

    const handleSetLevel = async (levelToSet: Level) => {
        setIsSubmitting(true);
        try {
            // SỬA: Gọi đúng API cập nhật Writing Level
            await writingService.setWritingLevel(levelToSet);
            localStorage.setItem(STORAGE_KEYS.writingCurrentLevel, levelToSet);
            setShowSuccessDialog(true);
        } catch (error) {
            handleApiError(error, "Có lỗi xảy ra khi lưu mục tiêu!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 flex items-center justify-center bg-slate-50">
            <div className="max-w-xl w-full">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 text-center">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }} className="flex justify-center mb-6">
                        <CircularProgress value={currentScore} max={maxScore} variant="toeic-test" />
                    </motion.div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">
                        Điểm bài thi Writing
                    </h2>

                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Điểm số của bạn:{" "}
                        <span className="font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            {currentScore}/{maxScore}
                        </span>{" "}
                        ({testResult.scorePercentage.toFixed(1)}%).
                        {testResult.passedThreshold ? " Rất xuất sắc, bạn có tư duy ngữ pháp cực tốt!" : " Cần luyện tập thêm cách cấu trúc câu nhé."}
                    </p>

                    <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-left border ${testResult.passedThreshold ? "bg-indigo-50/60 border-indigo-100" : "bg-rose-50/60 border-rose-100"}`}>
                        <div className="shrink-0 mt-0.5">
                            {testResult.passedThreshold ? <CheckCircle2 className="w-5 h-5 text-indigo-600" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800 mb-1">
                                Kết luận từ AI
                            </h4>
                            <p className={`text-sm ${testResult.passedThreshold ? "text-indigo-700" : "text-rose-700"}`}>
                                AI khuyên bạn nên bắt đầu lộ trình học TOEIC Writing ở mức: <br />
                                <strong className="text-base mt-1 block">
                                    {testResult.recommendedLevel ? getLevelDisplay(testResult.recommendedLevel, "TOEIC") : ""}
                                </strong>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <motion.button
                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/toeic/writing/test-review-mistakes", {
                                state: { dataResult: testResult, originalQuestions: originalQuestions }
                            })}
                            className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            <Eye className="w-4 h-4" />
                            Đọc Feedback của AI
                        </motion.button>

                        {/* SỬA: Ép chọn level theo logic giống hệt Reading, không có nút bỏ qua */}
                        <motion.button
                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                            onClick={() => handleSetLevel(testResult.recommendedLevel!)}
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-60"
                        >
                            <Bot className="w-4 h-4" />
                            Xác nhận học mức {testResult.recommendedLevel}
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>

                        {!testResult.passedThreshold && (
                            <motion.button
                                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                onClick={() => handleSetLevel(testResult.testedLevel)}
                                disabled={isSubmitting}
                                className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                            >
                                <BarChart2 className="w-4 h-4" />
                                Không, tôi vẫn muốn học mức {testResult.testedLevel}
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </div>

            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent className="rounded-2xl p-6 bg-white border border-slate-200 shadow-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <PartyPopper className="w-5 h-5 text-indigo-600" />
                            Thiết lập thành công!
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-slate-500">
                            Mục tiêu Writing của bạn đã được cập nhật. Hệ thống đã lưu lại lỗi ngữ pháp để ôn tập.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogAction
                            onClick={() => navigate("/dashboard")}
                            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 transition-all duration-300"
                        >
                            Đi tới Dashboard
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
