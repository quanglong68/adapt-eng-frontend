import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bot, ChevronRight, BarChart2, AlertTriangle, CheckCircle2, Eye, Home, PartyPopper, Trophy, Target } from "lucide-react";
import confetti from "canvas-confetti";
import { useLocation, useNavigate } from "react-router-dom";

import { CircularProgress } from "../../../shared/ui";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "../../../shared/ui/alert-dialog";
import { ToeicTestSubmissionResponse } from "../../../entities/toeic/toeic.type";
import { Level, getLevelDisplay } from "../../../shared/types/common.type";
import { testService } from "../../../entities/legacy/test.service";
import { handleApiError } from "../../../shared/api/handleApiError";
import { STORAGE_KEYS } from "../../../shared/lib/storageKeys";

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
            localStorage.setItem(STORAGE_KEYS.currentLevel, levelToSet);
            setShowSuccessDialog(true);
        } catch (error) {
            handleApiError(error, "Có lỗi xảy ra khi lưu mục tiêu!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-6 flex items-center justify-center relative overflow-hidden bg-slate-50">
            <div className="max-w-xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200/60 relative z-10 text-center transition-all duration-300"
                >

                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }} className="flex justify-center mb-6">
                        <CircularProgress value={testResult.correctAnswers} max={testResult.totalQuestions} variant="toeic-test" />
                    </motion.div>

                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 mb-3">
                        {isLevelUpMode ? "Kết Quả Thăng Cấp" : "Đánh giá Năng lực TOEIC"}
                    </h2>

                    {/* KHÔNG DÙNG systemMessage NỮA, TỰ XỬ LÝ CHỮ Ở ĐÂY */}
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed px-4">
                        Độ chính xác: <strong className="text-indigo-600">{testResult.scorePercentage.toFixed(1)}%</strong>.
                        {isLevelUpMode && testResult.passedThreshold && " Quá xuất sắc! Xin chúc mừng bạn."}
                        {isLevelUpMode && !testResult.passedThreshold && " Đừng nản lòng, hãy cố gắng ở lần sau nhé."}
                    </p>

                    <div className={`p-5 rounded-2xl mb-6 flex items-start gap-4 text-left transition-all duration-300 ${testResult.passedThreshold ? "bg-indigo-50/80 border border-indigo-200/60" : "bg-red-50/80 border border-red-200/60"}`}>
                        <div className="shrink-0 mt-0.5">
                            {testResult.passedThreshold ? <CheckCircle2 className="w-6 h-6 text-indigo-600" /> : <AlertTriangle className="w-6 h-6 text-red-500" />}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                                {testResult.passedThreshold ? <PartyPopper className="w-4 h-4 text-indigo-600" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
                                {isLevelUpMode
                                    ? (testResult.passedThreshold ? "Thăng cấp thành công!" : "Chưa đạt yêu cầu")
                                    : (testResult.passedThreshold ? "Hoàn toàn phù hợp!" : "Cần củng cố thêm")
                                }
                            </h4>
                            <p className={`text-sm leading-relaxed ${testResult.passedThreshold ? "text-indigo-700" : "text-red-700"}`}>
                                {isLevelUpMode
                                    ? (testResult.passedThreshold
                                        ? `Tuyệt vời! Trình độ của bạn đã được nâng lên mức ${testResult.testedLevel}.`
                                        : `Bạn chưa đủ điểm để thăng cấp lên ${testResult.testedLevel}. Hãy ôn tập thêm và thử lại nhé.`)
                                    : <>AI khuyên bạn nên bắt đầu lộ trình học TOEIC ở mức: <br />
                                        <strong className="text-base mt-1 block text-slate-900">
                                            {testResult.recommendedLevel ? getLevelDisplay(testResult.recommendedLevel, "TOEIC") : ""}
                                        </strong></>
                                }
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/60 rounded-2xl divide-y divide-slate-100 mb-6 text-left transition-all duration-300">
                        <div className="flex items-center gap-3 px-5 py-3.5">
                            <Trophy className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span className="text-sm text-slate-500 flex-1">Số câu đúng</span>
                            <span className="text-sm font-bold text-slate-900">{testResult.correctAnswers}/{testResult.totalQuestions}</span>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-3.5">
                            <Target className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span className="text-sm text-slate-500 flex-1">Độ chính xác</span>
                            <span className="text-sm font-bold text-slate-900">{testResult.scorePercentage.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-3.5">
                            <Bot className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span className="text-sm text-slate-500 flex-1">Mức được gợi ý</span>
                            <span className="text-sm font-bold text-slate-900">{isLevelUpMode ? testResult.testedLevel : (testResult.recommendedLevel ?? testResult.testedLevel)}</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/toeic/test-review-mistakes", {
                            // NHỚ TRUYỀN CỜ MODE ĐI TIẾP ĐỂ KHÔNG BỊ MẤT STATE
                            state: { dataResult: testResult, originalBlocks: originalBlocks, mode: isLevelUpMode ? "level-up" : "normal" }
                        })}
                        className="w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 mb-3 text-slate-700 border border-slate-300 hover:bg-white transition-all duration-300"
                    >
                        <Eye className="w-4 h-4" />
                        Xem lại đáp án chi tiết
                    </motion.button>

                    {/* NẾU LÀ ĐÁNH BOSS, CHỈ HIỆN 1 NÚT VỀ DASHBOARD */}
                    {isLevelUpMode ? (
                        <motion.button
                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                // Cập nhật level mới vào cache máy tính nếu pass
                                if (testResult.passedThreshold) localStorage.setItem('currentLevel', testResult.testedLevel);
                                navigate("/dashboard");
                            }}
                            className="w-full py-3.5 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 mb-3 bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:-translate-y-1"
                        >
                            <Home className="w-4 h-4" />
                            Trở về Dashboard
                        </motion.button>
                    ) : (
                        // NẾU LÀ TEST THƯỜNG, HIỆN NÚT ĐỒNG Ý HỌC
                        <>
                            <motion.button
                                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                onClick={() => handleSetLevel(testResult.recommendedLevel!)}
                                disabled={isSubmitting}
                                className="w-full py-3.5 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 mb-3 bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:-translate-y-1 disabled:opacity-70"
                            >
                                <Bot className="w-4 h-4" />
                                Đồng ý học mức {testResult.recommendedLevel}
                                <ChevronRight className="w-4 h-4" />
                            </motion.button>

                            {!testResult.passedThreshold && (
                                <motion.button
                                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSetLevel(testResult.testedLevel)}
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 text-slate-700 border border-slate-300 hover:bg-white transition-all duration-300 disabled:opacity-70"
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
                <AlertDialogContent className="rounded-3xl p-6 bg-white border border-slate-200/60 shadow-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                            <PartyPopper className="w-5 h-5 text-indigo-600" />
                            Thiết lập thành công!
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-slate-500">
                            Mục tiêu TOEIC của bạn đã được cập nhật. Cùng cày cuốc thôi!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogAction
                            onClick={() => navigate("/dashboard")}
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                        >
                            Đi tới Dashboard
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}