import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronRight, CheckCircle2, Eye, Sprout, Target, AlertTriangle } from "lucide-react";
import confetti from "canvas-confetti";
import { useLocation, useNavigate } from "react-router-dom";

import { CircularProgress } from "../../../shared/ui";
import { DailyReviewResultResponse } from "../../../entities/legacy/practice.type";

export function PracticeResult() {
    const navigate = useNavigate();
    const location = useLocation();
    const fired = useRef(false);

    const practiceResult = location.state?.dataResult as DailyReviewResultResponse;
    const originalQuestions = location.state?.originalQuestions;

    useEffect(() => {
        if (!practiceResult || fired.current) return;
        fired.current = true;
        // Bắn pháo hoa ăn mừng hoàn thành mục tiêu ngày
        try {
            const end = Date.now() + 2000;
            const colors = ["#10B981", "#3B82F6", "#F59E0B"];
            const frame = () => {
                // @ts-ignore
                confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors });
                // @ts-ignore
                confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
        } catch (e) {
            // Bỏ qua nếu chưa cài thư viện confetti
        }
    }, [practiceResult]);

    if (!practiceResult) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-xl font-bold text-slate-700 mb-4">Không tìm thấy kết quả ôn tập!</h2>
                <button onClick={() => navigate("/")} className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition">
                    Quay lại trang chủ
                </button>
            </div>
        );
    }

    const wrongAnswersCount = practiceResult.totalQuestions - practiceResult.correctAnswers;
    const accuracyPercentage = practiceResult.totalQuestions > 0 ? (practiceResult.correctAnswers / practiceResult.totalQuestions) * 100 : 0;

    return (
        <div className="min-h-screen py-12 px-8 bg-slate-50">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="w-16 h-16 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200 flex items-center justify-center mx-auto mb-4"><Sprout className="w-8 h-8 text-white" /></div>
                    <h1 className="text-3xl font-bold mb-2 text-slate-800">Hoàn thành phiên ôn tập!</h1>
                    <p className="text-sm text-slate-500">Hệ thống Spaced Repetition đã ghi nhận tiến độ của bạn</p>
                </motion.div>

                {/* Score card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white rounded-3xl p-8 mb-6 text-center shadow-lg border border-slate-100"
                >
                    <div className="flex flex-col items-center justify-center gap-6">
                        <CircularProgress value={practiceResult.correctAnswers} max={practiceResult.totalQuestions} variant="practice" />
                        <div>
                            <div className="font-bold text-lg mb-1 text-slate-800">
                                Tỷ lệ chính xác: {accuracyPercentage.toFixed(1)}%
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Đã cập nhật lịch ôn tập kế tiếp
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Thống kê nhanh */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-4 text-center border border-slate-100">
                        <div className="flex justify-center mb-1"><Target className="w-6 h-6 text-emerald-500" /></div>
                        <div className="font-bold text-base text-slate-800">{practiceResult.correctAnswers}</div>
                        <div className="text-xs mt-0.5 text-slate-500">Vững kiến thức</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 text-center border border-slate-100">
                        <div className="flex justify-center mb-1"><AlertTriangle className="w-6 h-6 text-amber-500" /></div>
                        <div className="font-bold text-base text-slate-800">{wrongAnswersCount}</div>
                        <div className="text-xs mt-0.5 text-slate-500">Cần lưu ý lại</div>
                    </div>
                </motion.div>

                {/* NÚT ĐIỀU HƯỚNG KẾT NỐI */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col gap-3">

                    {/* Nối sang trang xem lại lỗi sai */}
                    <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/practice-review-mistakes", {
                            state: { dataResult: practiceResult, originalQuestions: originalQuestions }
                        })}
                        className="w-full py-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-slate-100/50"
                    >
                        <Eye className="w-4 h-4" />
                        Xem giải thích chi tiết câu đúng/sai
                    </motion.button>

                    {/* Điều hướng về Dashboard chính */}
                    <motion.button
                        whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-4 rounded-full text-white font-semibold flex items-center justify-center gap-2 bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:bg-emerald-500 hover:-translate-y-1 transition-all duration-300"
                    >
                        Quay về Dashboard học tập
                        <ChevronRight className="w-4 h-4" />
                    </motion.button>
                </motion.div>

            </div>
        </div>
    );
}