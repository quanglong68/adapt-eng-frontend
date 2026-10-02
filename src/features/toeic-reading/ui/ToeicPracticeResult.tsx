import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronRight, CheckCircle2, Eye, AlertTriangle, Flame, Sprout, Target, CircleAlert, Home } from "lucide-react";
import confetti from "canvas-confetti";
import { useLocation, useNavigate } from "react-router-dom";

import { CircularProgress } from "../../../shared/ui";
import { ToeicPracticeSubmissionResponse } from "../../../entities/toeic/toeic.type";

export function ToeicPracticeResult() {
    const navigate = useNavigate();
    const location = useLocation();
    const fired = useRef(false);

    const practiceResult = location.state?.dataResult as ToeicPracticeSubmissionResponse & { validEffort: boolean; earnedXp: number };
    const originalBlocks = location.state?.originalBlocks;

    // Lấy cờ hợp lệ và XP từ API trả về
    const isValid = practiceResult?.validEffort ?? true;
    const earnedXp = practiceResult?.earnedXp ?? 0;

    useEffect(() => {
        // 🚨 CHỈ BẮN PHÁO HOA NẾU BÀI LÀM HỢP LỆ (validEffort = true)
        if (!practiceResult || fired.current || !isValid) return;

        fired.current = true;
        try {
            const end = Date.now() + 2000;
            const colors = ["#10B981", "#3B82F6", "#F59E0B"];
            const frame = () => {
                confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors });
                confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
        } catch (e) { }
    }, [practiceResult, isValid]);

    if (!practiceResult) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-4">Không tìm thấy kết quả ôn tập!</h2>
                <button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-sm font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.45)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]">
                    <Home className="w-4 h-4" />
                    Quay lại trang chủ
                </button>
            </div>
        );
    }

    const wrongAnswersCount = practiceResult.totalQuestions - practiceResult.correctAnswers;
    const accuracyPercentage = practiceResult.totalQuestions > 0 ? (practiceResult.correctAnswers / practiceResult.totalQuestions) * 100 : 0;

    return (
        <div className="min-h-screen py-12 px-6 bg-slate-50">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center mb-8"
                >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border transition-all duration-300 ${isValid ? "bg-emerald-50 border-emerald-200/60" : "bg-red-50 border-red-200/60"}`}>
                        {isValid ? <Sprout className="w-7 h-7 text-emerald-600" /> : <AlertTriangle className="w-7 h-7 text-red-500" />}
                    </div>
                    <h1 className={`text-3xl font-bold tracking-tight mb-2 ${isValid ? "bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600" : "text-red-700"}`}>
                        {isValid ? "Hoàn thành phiên ôn tập!" : "Phiên ôn tập không hợp lệ!"}
                    </h1>
                    <p className="text-sm text-slate-500">
                        {isValid
                            ? "Hệ thống Spaced Repetition đã ghi nhận tiến độ của bạn"
                            : "Phát hiện hành vi bỏ trống đề. Bạn cần đạt tối thiểu 10% để được ghi nhận."}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
                    className="bg-white rounded-3xl p-8 mb-6 text-center shadow-sm border border-slate-200/60 transition-all duration-300"
                >
                    <div className="flex flex-col items-center justify-center gap-6">
                        <CircularProgress value={practiceResult.correctAnswers} max={practiceResult.totalQuestions} variant="toeic-practice" />
                        <div>
                            <div className="font-bold tracking-tight text-lg text-slate-900 mb-3">
                                Tỷ lệ chính xác: {accuracyPercentage.toFixed(1)}%
                            </div>

                            {isValid ? (
                                <div className="flex flex-col gap-2 items-center">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200/60 text-emerald-700 transition-all duration-300">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã cập nhật lịch ôn tập
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-orange-50 border border-orange-200/60 text-orange-700 transition-all duration-300">
                                        <Flame className="w-4 h-4 text-orange-500" /> +{earnedXp} XP
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-2 p-3 bg-red-50/80 border border-red-200/60 rounded-2xl text-red-700 text-sm font-semibold flex items-start text-left gap-2 max-w-sm mx-auto transition-all duration-300">
                                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <span>
                                        Điểm của bạn dưới 10%. Hệ thống sẽ <strong>KHÔNG CỘNG XP</strong> và <strong>KHÔNG TÍNH STREAK</strong> cho hôm nay để chống spam!
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.45, ease: "easeOut" }}
                    className="bg-white border border-slate-200/60 rounded-2xl divide-y divide-slate-100 mb-6 transition-all duration-300"
                >
                    <div className="flex items-center gap-3 px-5 py-3.5">
                        <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-sm text-slate-500 flex-1">Vững kiến thức</span>
                        <span className="text-sm font-bold text-slate-900">{practiceResult.correctAnswers} câu</span>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-3.5">
                        <CircleAlert className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="text-sm text-slate-500 flex-1">Cần lưu ý lại</span>
                        <span className="text-sm font-bold text-slate-900">{wrongAnswersCount} câu</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45, ease: "easeOut" }} className="flex flex-col gap-3">
                    <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/toeic/practice-review-mistakes", {
                            state: { dataResult: practiceResult, originalBlocks: originalBlocks }
                        })}
                        className="w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 text-slate-700 border border-slate-300 hover:bg-white transition-all duration-300"
                    >
                        <Eye className="w-4 h-4" />
                        Xem giải thích chi tiết câu đúng/sai
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-3.5 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.45)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
                    >
                        Quay về Dashboard học tập
                        <ChevronRight className="w-4 h-4" />
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}