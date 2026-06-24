import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronRight, CheckCircle2, Eye } from "lucide-react";
import confetti from "canvas-confetti";
import { useLocation, useNavigate } from "react-router-dom";

import { CircularProgress } from "../components/shared";
import { DailyReviewResultResponse } from "../types/practice.type";

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
                <button onClick={() => navigate("/")} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold">
                    Quay lại trang chủ
                </button>
            </div>
        );
    }

    const wrongAnswersCount = practiceResult.totalQuestions - practiceResult.correctAnswers;
    const accuracyPercentage = practiceResult.totalQuestions > 0 ? (practiceResult.correctAnswers / practiceResult.totalQuestions) * 100 : 0;

    return (
        <div className="min-h-screen py-12 px-8" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="text-5xl mb-4">🌱</div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: "#1E293B" }}>Hoàn thành phiên ôn tập!</h1>
                    <p className="text-sm" style={{ color: "#64748B" }}>Hệ thống Spaced Repetition đã ghi nhận tiến độ của bạn</p>
                </motion.div>

                {/* Score card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white rounded-3xl p-8 mb-6 text-center"
                    style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: "1px solid #F1F5F9" }}
                >
                    <div className="flex flex-col items-center justify-center gap-6">
                        <CircularProgress value={practiceResult.correctAnswers} max={practiceResult.totalQuestions} variant="practice" />
                        <div>
                            <div className="font-bold text-lg mb-1" style={{ color: "#1E293B" }}>
                                Tỷ lệ chính xác: {accuracyPercentage.toFixed(1)}%
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#D1FAE5", color: "#059669" }}>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Đã cập nhật lịch ôn tập kế tiếp
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Thống kê nhanh */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-4 text-center" style={{ border: "1px solid #F1F5F9" }}>
                        <div className="text-2xl mb-1">🎯</div>
                        <div className="font-bold text-base" style={{ color: "#1E293B" }}>{practiceResult.correctAnswers}</div>
                        <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>Vững kiến thức</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 text-center" style={{ border: "1px solid #F1F5F9" }}>
                        <div className="text-2xl mb-1">⚠️</div>
                        <div className="font-bold text-base" style={{ color: "#1E293B" }}>{wrongAnswersCount}</div>
                        <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>Cần lưu ý lại</div>
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
                        className="w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                        style={{ background: "#E6F4EA", border: "1px solid #A7F3D0", color: "#059669" }}
                    >
                        <Eye className="w-4 h-4" />
                        Xem giải thích chi tiết câu đúng/sai
                    </motion.button>

                    {/* Điều hướng về Dashboard chính */}
                    <motion.button
                        whileHover={{ scale: 1.015, boxShadow: "0 10px 32px rgba(16,185,129,0.3)" }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
                        style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 6px 20px rgba(16,185,129,0.25)" }}
                    >
                        Quay về Dashboard học tập
                        <ChevronRight className="w-4 h-4" />
                    </motion.button>
                </motion.div>

            </div>
        </div>
    );
}