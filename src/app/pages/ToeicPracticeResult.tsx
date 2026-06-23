import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronRight, CheckCircle2, Eye } from "lucide-react";
import confetti from "canvas-confetti";
import { useLocation, useNavigate } from "react-router-dom";
import { ToeicPracticeSubmissionResponse } from "../types/toeic.type";

function CircularProgress({ value, max }: { value: number; max: number }) {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const pct = max > 0 ? (value / max) * 100 : 0;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <div className="relative w-52 h-52">
            <svg viewBox="0 0 200 200" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="100" cy="100" r={radius} fill="none" stroke="#E1F5FE" strokeWidth="14" />
                <motion.circle
                    cx="100" cy="100" r={radius} fill="none" stroke="url(#practiceGrad)" strokeWidth="14" strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.8, ease: "easeOut", delay: 0.5 }}
                />
                <defs>
                    <linearGradient id="practiceGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5, type: "spring" }}
                    className="text-5xl font-black"
                    style={{ color: "#10B981", letterSpacing: "-1px" }}
                >
                    {value}/{max}
                </motion.span>
                <span className="text-xs mt-1 font-bold" style={{ color: "#94A3B8" }}>câu đúng</span>
            </div>
        </div>
    );
}

export function ToeicPracticeResult() {
    const navigate = useNavigate();
    const location = useLocation();
    const fired = useRef(false);

    const practiceResult = location.state?.dataResult as ToeicPracticeSubmissionResponse;
    const originalBlocks = location.state?.originalBlocks;

    useEffect(() => {
        if (!practiceResult || fired.current) return;
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
    }, [practiceResult]);

    if (!practiceResult) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-xl font-bold text-slate-700 mb-4">Không tìm thấy kết quả ôn tập!</h2>
                <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold">
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
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="text-5xl mb-4">🌱</div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: "#1E293B" }}>Hoàn thành phiên ôn tập!</h1>
                    <p className="text-sm" style={{ color: "#64748B" }}>Hệ thống Spaced Repetition đã ghi nhận tiến độ của bạn</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white rounded-3xl p-8 mb-6 text-center shadow-xl border border-slate-100"
                >
                    <div className="flex flex-col items-center justify-center gap-6">
                        <CircularProgress value={practiceResult.correctAnswers} max={practiceResult.totalQuestions} />
                        <div>
                            <div className="font-bold text-lg mb-2" style={{ color: "#1E293B" }}>
                                Tỷ lệ chính xác: {accuracyPercentage.toFixed(1)}%
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Đã cập nhật lịch ôn tập kế tiếp
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-4 text-center border border-slate-100">
                        <div className="text-2xl mb-1">🎯</div>
                        <div className="font-bold text-base" style={{ color: "#1E293B" }}>{practiceResult.correctAnswers}</div>
                        <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>Vững kiến thức</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 text-center border border-slate-100">
                        <div className="text-2xl mb-1">⚠️</div>
                        <div className="font-bold text-base" style={{ color: "#1E293B" }}>{wrongAnswersCount}</div>
                        <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>Cần lưu ý lại</div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col gap-3">
                    <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/toeic/practice-review-mistakes", {
                            state: { dataResult: practiceResult, originalBlocks: originalBlocks }
                        })}
                        className="w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all bg-emerald-50 border border-emerald-200 text-emerald-700"
                    >
                        <Eye className="w-4 h-4" />
                        Xem giải thích chi tiết câu đúng/sai
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.015, boxShadow: "0 10px 32px rgba(16,185,129,0.3)" }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 bg-gradient-to-r from-emerald-500 to-emerald-600"
                    >
                        Quay về Dashboard học tập
                        <ChevronRight className="w-4 h-4" />
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}