import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bot, ChevronRight, BarChart2, AlertTriangle, CheckCircle2, Eye, Home } from "lucide-react";
import confetti from "canvas-confetti";
import { useLocation, useNavigate } from "react-router-dom";

import { CircularProgress } from "../components/shared";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "../components/ui/alert-dialog";
import { ToeicTestSubmissionResponse } from "../types/toeic.type";
import { Level, getLevelDisplay } from "../types/common.type";
import { testService } from "../services/test.service";

export function ToeicTestResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const testResult = location.state?.dataResult as ToeicTestSubmissionResponse;
    const originalBlocks = location.state?.originalBlocks;

    // HỨNG BIẾN CHẾ ĐỘ THI TỪ TRANG LÀM BÀI
    const isLevelUpMode = location.state?.mode === "level-up";

    useEffect(() => {
        if (!testResult) {
            navigate("/");
            return;
        }

        // Nếu là Thăng cấp thành công hoặc Đánh giá năng lực đỗ -> Bắn pháo hoa
        if (testResult.passedThreshold || !isLevelUpMode) {
            const duration = 3 * 1000;
            const end = Date.now() + duration;
            const frame = () => {
                confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#4F46E5", "#7C3AED", "#10B981"] });
                confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#4F46E5", "#7C3AED", "#10B981"] });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
        }
    }, [testResult, navigate, isLevelUpMode]);

    if (!testResult) return null;

    const handleSetLevel = async (levelToSet: Level) => {
        setIsSubmitting(true);
        try {
            await testService.setLevel(levelToSet);
            localStorage.setItem('currentLevel', levelToSet);
            setShowSuccessDialog(true);
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi lưu mục tiêu!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-6 flex items-center justify-center relative overflow-hidden" style={{ background: "#F9FAFB" }}>
            <div className="max-w-xl w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl relative z-10 text-center" style={{ border: "1px solid #F1F5F9" }}>

                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }} className="flex justify-center mb-8">
                        <CircularProgress value={testResult.correctAnswers} max={testResult.totalQuestions} variant="toeic-test" />
                    </motion.div>

                    <h2 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">
                        {isLevelUpMode ? "Kết Quả Thăng Cấp" : "Đánh giá Năng lực TOEIC"}
                    </h2>

                    {/* KHÔNG DÙNG systemMessage NỮA, TỰ XỬ LÝ CHỮ Ở ĐÂY */}
                    <p className="text-slate-500 text-base mb-8 leading-relaxed px-4">
                        Độ chính xác: <strong style={{ color: "#4F46E5" }}>{testResult.scorePercentage.toFixed(1)}%</strong>.
                        {isLevelUpMode && testResult.passedThreshold && " Quá xuất sắc! Xin chúc mừng bạn."}
                        {isLevelUpMode && !testResult.passedThreshold && " Đừng nản lòng, hãy cố gắng ở lần sau nhé."}
                    </p>

                    <div className="p-5 rounded-2xl mb-8 flex items-start gap-4 text-left" style={{ background: testResult.passedThreshold ? "#EEF2FF" : "#FEF2F2", border: `1px solid ${testResult.passedThreshold ? "#C7D2FE" : "#FECACA"}` }}>
                        <div className="shrink-0 mt-1">
                            {testResult.passedThreshold ? <CheckCircle2 className="w-6 h-6 text-indigo-600" /> : <AlertTriangle className="w-6 h-6 text-red-500" />}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-1">
                                {isLevelUpMode
                                    ? (testResult.passedThreshold ? "🎉 Thăng cấp thành công!" : "⚠️ Chưa đạt yêu cầu")
                                    : (testResult.passedThreshold ? "Hoàn toàn phù hợp!" : "Cần củng cố thêm")
                                }
                            </h4>
                            <p className="text-sm" style={{ color: testResult.passedThreshold ? "#4338CA" : "#991B1B" }}>
                                {isLevelUpMode
                                    ? (testResult.passedThreshold
                                        ? `Tuyệt vời! Trình độ của bạn đã được nâng lên mức ${testResult.testedLevel}.`
                                        : `Bạn chưa đủ điểm để thăng cấp lên ${testResult.testedLevel}. Hãy ôn tập thêm và thử lại nhé.`)
                                    : <>AI khuyên bạn nên bắt đầu lộ trình học TOEIC ở mức: <br />
                                        <strong className="text-base mt-1 block">
                                            {testResult.recommendedLevel ? getLevelDisplay(testResult.recommendedLevel, "TOEIC") : ""}
                                        </strong></>
                                }
                            </p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/toeic/test-review-mistakes", {
                            // NHỚ TRUYỀN CỜ MODE ĐI TIẾP ĐỂ KHÔNG BỊ MẤT STATE
                            state: { dataResult: testResult, originalBlocks: originalBlocks, mode: isLevelUpMode ? "level-up" : "normal" }
                        })}
                        className="w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 mb-4 transition-all"
                        style={{ background: "#F1F5F9", color: "#475569" }}
                    >
                        <Eye className="w-4 h-4" />
                        Xem lại đáp án chi tiết
                    </motion.button>

                    {/* NẾU LÀ ĐÁNH BOSS, CHỈ HIỆN 1 NÚT VỀ DASHBOARD */}
                    {isLevelUpMode ? (
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 32px rgba(79,70,229,0.4)" }} whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                // Cập nhật level mới vào cache máy tính nếu pass
                                if (testResult.passedThreshold) localStorage.setItem('currentLevel', testResult.testedLevel);
                                navigate("/dashboard");
                            }}
                            className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 mb-4 transition-all"
                            style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
                        >
                            <Home className="w-5 h-5" />
                            Trở về Dashboard
                        </motion.button>
                    ) : (
                        // NẾU LÀ TEST THƯỜNG, HIỆN NÚT ĐỒNG Ý HỌC
                        <>
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 32px rgba(79,70,229,0.4)" }} whileTap={{ scale: 0.98 }}
                                onClick={() => handleSetLevel(testResult.recommendedLevel!)}
                                disabled={isSubmitting}
                                className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 mb-4 transition-all"
                                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                <Bot className="w-5 h-5" />
                                Đồng ý học mức {testResult.recommendedLevel}
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
                        </>
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
                            Mục tiêu TOEIC của bạn đã được cập nhật. Cùng cày cuốc thôi!
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