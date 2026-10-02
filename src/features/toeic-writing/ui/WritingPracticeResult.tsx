import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronRight, CheckCircle2, Eye, AlertTriangle, Flame, History, PenLine, Sprout, Target, SquarePen } from "lucide-react";
import confetti from "canvas-confetti";
import { useLocation, useNavigate } from "react-router-dom";

import { CircularProgress } from "../../../shared/ui";
import { WritingPracticeSubmissionResponse, WritingQuestion } from "../../../entities/writing/writing.type";

export function WritingPracticeResult() {
    const navigate = useNavigate();
    const location = useLocation();
    const fired = useRef(false);

    const practiceResult = location.state?.dataResult as WritingPracticeSubmissionResponse | undefined;
    const originalQuestions = location.state?.originalQuestions as WritingQuestion[] | undefined;

    // Cờ hợp lệ và XP do backend quyết định. Dùng ?? để phòng khi response thiếu field.
    const isValid = practiceResult?.validEffort ?? false;
    const earnedXp = practiceResult?.earnedXp ?? 0;

    useEffect(() => {
        // CHỈ BẮN PHÁO HOA NẾU BÀI LÀM HỢP LỆ (validEffort = true) VÀ CÓ ĐIỂM
        if (!practiceResult || fired.current || !isValid || practiceResult.totalScore <= 0) return;

        fired.current = true;
        try {
            const end = Date.now() + 2000;
            const colors = ["#4F46E5", "#7C3AED", "#F59E0B"];
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
                <h2 className="text-lg font-bold text-slate-700 mb-4">Không tìm thấy kết quả luyện tập!</h2>
                <button onClick={() => navigate("/dashboard")} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1 transition-all duration-300">
                    Quay lại trang chủ
                </button>
            </div>
        );
    }

    // Thang điểm Writing là 0-3 mỗi câu, khác hẳn Reading (đúng/sai)
    const totalScore = practiceResult.totalScore;
    const maxScore = practiceResult.maxScore;
    const scorePercent = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const perfectQuestionCount = (practiceResult.reviewList || []).filter(r => r.correct).length;

    return (
        <div className="min-h-screen py-10 px-4 bg-slate-50">
            <div className="max-w-2xl mx-auto">
                {/* HEADER THAY ĐỔI THEO TRẠNG THÁI */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-center mb-8">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mx-auto mb-4 ${isValid ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"}`}>
                        {isValid ? <Sprout className="w-6 h-6 text-emerald-600" /> : <AlertTriangle className="w-6 h-6 text-rose-600" />}
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">
                        {isValid ? "Hoàn thành buổi luyện tập!" : "Buổi luyện tập không hợp lệ!"}
                    </h1>
                    <p className="text-sm text-slate-500">
                        {isValid
                            ? "Đã ghi nhận tiến độ Writing của bạn vào hệ thống Spaced Repetition"
                            : "Phát hiện hành vi bỏ trống đề. Bạn cần đạt tối thiểu 10% để được ghi nhận."}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 mb-4 text-center"
                >
                    <div className="flex flex-col items-center justify-center gap-5">
                        <CircularProgress value={totalScore} max={maxScore} variant="toeic-practice" />
                        <div>
                            <div className="font-bold text-base mb-1 text-slate-800">
                                Tỷ lệ hoàn thành:{" "}
                                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    {scorePercent.toFixed(1)}%
                                </span>
                            </div>
                            <div className="text-xs mb-3 text-slate-500">
                                AI chấm thang 0-3 điểm cho mỗi câu
                            </div>

                            {/* THÔNG BÁO TÍNH ĐIỂM / PHẠT SPAM */}
                            {isValid ? (
                                <div className="flex flex-col gap-2 items-center">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-100 text-emerald-700">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã cập nhật lịch ôn tập
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-amber-50 border border-amber-100 text-amber-700">
                                        <Flame className="w-4 h-4 text-amber-600" /> +{earnedXp} XP
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-medium flex items-start text-left gap-2 max-w-sm mx-auto">
                                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <span>
                                        Điểm của bạn dưới 10%. Hệ thống sẽ <strong>KHÔNG CỘNG XP</strong> và <strong>KHÔNG TÍNH STREAK</strong> cho hôm nay để chống spam!
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }} className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-2">
                            <Target className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="font-bold text-base text-slate-800">{perfectQuestionCount}/{practiceResult.totalQuestions}</div>
                        <div className="text-xs mt-0.5 text-slate-500">Câu đạt 3/3 điểm</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-2">
                            <SquarePen className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="font-bold text-base text-slate-800">{totalScore}/{maxScore}</div>
                        <div className="text-xs mt-0.5 text-slate-500">Tổng điểm bài làm</div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }} className="flex flex-col gap-3">
                    <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/toeic/writing/practice-review-mistakes", {
                            state: { dataResult: practiceResult, originalQuestions: originalQuestions }
                        })}
                        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100"
                    >
                        <Eye className="w-4 h-4" />
                        Xem phản hồi chi tiết của AI
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/toeic/writing/practice")}
                        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                        <PenLine className="w-4 h-4" />
                        Luyện tập thêm đề hôm nay
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/toeic/writing/practice-history")}
                        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                        <History className="w-4 h-4" />
                        Lịch sử luyện tập Writing
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1"
                    >
                        Quay về Dashboard học tập
                        <ChevronRight className="w-4 h-4" />
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
