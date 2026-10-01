import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Target, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LearningTrack } from "../../../shared/types/common.type";
import { userService } from "../../../entities/user/user.service";

export function TrackSelect() {
    const [selected, setSelected] = useState<LearningTrack | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const tracks = [
        { id: "GENERAL" as LearningTrack, name: "Tiếng Anh Tổng Quát", desc: "Luyện ngữ pháp, từ vựng và giao tiếp hàng ngày.", icon: Globe },
        { id: "TOEIC" as LearningTrack, name: "Luyện thi TOEIC", desc: "Tập trung Part 5, 6, 7. Xóa mù chữ chốn công sở.", icon: Target },
        { id: "IELTS" as LearningTrack, name: "Luyện thi IELTS", desc: "Học thuật chuyên sâu. Chuẩn bị cho du học, định cư.", icon: BookOpen },
    ];

    const handleContinue = async () => {
        if (!selected) return;
        setIsSubmitting(true);
        try {
            // Gửi xuống Backend
            await userService.setLearningTrack(selected);
            localStorage.setItem('learningTrack', selected);

            // ĐIỀU HƯỚNG THÔNG MINH
            if (selected === "TOEIC") {
                navigate("/select-skill"); // Nếu TOEIC -> Qua trang chọn Kỹ năng
            } else {
                navigate("/select-level"); // Nếu khác -> Qua thẳng trang chọn Level cũ
            }
        } catch (error) {
            console.error("Lỗi cập nhật lộ trình:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-6">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-3xl">

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="text-center mb-10"
                >
                    <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Mục tiêu học tập của bạn là gì?
                    </h1>
                    <p className="text-base text-slate-500">
                        AI của chúng tôi sẽ thiết kế lộ trình riêng biệt dựa trên lựa chọn này.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {tracks.map((track, i) => {
                        const isSelected = selected === track.id;
                        return (
                            <motion.div
                                key={track.id}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setSelected(track.id)}
                                className={`relative cursor-pointer rounded-2xl border-2 bg-white p-6 transition-all duration-300 hover:scale-[1.02] ${isSelected ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-600/10" : "border-slate-200 hover:border-indigo-300"}`}
                            >
                                {isSelected && (
                                    <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-indigo-600" />
                                )}
                                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-indigo-600"}`}>
                                    <track.icon className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-slate-900">{track.name}</h3>
                                <p className="text-sm leading-relaxed text-slate-500">{track.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="flex justify-center"
                >
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleContinue}
                        disabled={!selected || isSubmitting}
                        className={`inline-flex items-center gap-3 rounded-full px-12 py-4 text-base font-semibold text-white transition-all duration-300 ${selected ? "bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1" : "cursor-not-allowed bg-slate-300"} disabled:opacity-70`}
                    >
                        {isSubmitting ? "Đang xử lý..." : "Tiếp tục"}
                        <ArrowRight className="h-5 w-5" />
                    </motion.button>
                </motion.div>

            </motion.div>
        </div>
    );
}
