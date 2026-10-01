import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bot, ChevronRight, BarChart2, AlertTriangle, CheckCircle2, Eye } from "lucide-react";
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
        <div className="min-h-screen py-12 px-6 flex items-center justify-center relative overflow-hidden" style={{ background: "#F1F5F9", fontFamily: "'Poppins', sans-serif" }}>
            <div className="max-w-xl w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl relative z-10 text-center border border-slate-100">

                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }} className="flex justify-center mb-8">
                        <CircularProgress value={currentScore} max={maxScore} variant="toeic-test" />
                    </motion.div>

                    <h2 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">
                        Điểm bài thi Writing
                    </h2>

                    <p className="text-slate-500 text-base mb-8 leading-relaxed px-4">
                        Điểm số của bạn: <strong style={{ color: "#4F46E5" }}>{currentScore}/{maxScore}</strong> ({testResult.scorePercentage.toFixed(1)}%).
                        {testResult.passedThreshold ? " Rất xuất sắc, bạn có tư duy ngữ pháp cực tốt!" : " Cần luyện tập thêm cách cấu trúc câu nhé."}
                    </p>

                    <div className="p-5 rounded-2xl mb-8 flex items-start gap-4 text-left" style={{ background: testResult.passedThreshold ? "#EEF2FF" : "#FEF2F2", border: `1px solid ${testResult.passedThreshold ? "#C7D2FE" : "#FECACA"}` }}>
                        <div className="shrink-0 mt-1">
                            {testResult.passedThreshold ? <CheckCircle2 className="w-6 h-6 text-indigo-600" /> : <AlertTriangle className="w-6 h-6 text-red-500" />}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-1">
                                Kết luận từ AI
                            </h4>
                            <p className="text-sm" style={{ color: testResult.passedThreshold ? "#4338CA" : "#991B1B" }}>
                                AI khuyên bạn nên bắt đầu lộ trình học TOEIC Writing ở mức: <br />
                                <strong className="text-base mt-1 block">
                                    {testResult.recommendedLevel ? getLevelDisplay(testResult.recommendedLevel, "TOEIC") : ""}
                                </strong>
                            </p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/toeic/writing/test-review-mistakes", {
                            state: { dataResult: testResult, originalQuestions: originalQuestions }
                        })}
                        className="w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 mb-4 transition-all"
                        style={{ background: "#F1F5F9", color: "#475569" }}
                    >
                        <Eye className="w-5 h-5" />
                        Đọc Feedback của AI
                    </motion.button>

                    {/* SỬA: Ép chọn level theo logic giống hệt Reading, không có nút bỏ qua */}
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 32px rgba(79,70,229,0.4)" }} whileTap={{ scale: 0.98 }}
                        onClick={() => handleSetLevel(testResult.recommendedLevel!)}
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 mb-4 transition-all shadow-lg shadow-indigo-200"
                        style={{ background: "linear-gradient(135deg, #4F46E5, #3730A3)", opacity: isSubmitting ? 0.7 : 1 }}
                    >
                        <Bot className="w-5 h-5" />
                        Xác nhận học mức {testResult.recommendedLevel}
                        <ChevronRight className="w-5 h-5" />
                    </motion.button>

                    {!testResult.passedThreshold && (
                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => handleSetLevel(testResult.testedLevel)}
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                            style={{ background: "transparent", border: "2px solid #E5E7EB", color: "#64748B", opacity: isSubmitting ? 0.7 : 1 }}
                        >
                            <BarChart2 className="w-4 h-4" />
                            Không, tôi vẫn muốn học mức {testResult.testedLevel}
                        </motion.button>
                    )}

                </motion.div>
            </div>

            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent className="rounded-3xl p-6 bg-white border border-slate-100 shadow-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            🎉 Thiết lập thành công!
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-slate-500">
                            Mục tiêu Writing của bạn đã được cập nhật. Hệ thống đã lưu lại lỗi ngữ pháp để ôn tập.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogAction
                            onClick={() => navigate("/dashboard")}
                            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-md shadow-indigo-200"
                        >
                            Đi tới Dashboard
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}