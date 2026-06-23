import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Target, Globe, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LearningTrack } from "../types/common.type";
import { userService } from "../services/user.service";

export function TrackSelect() {
    const [selected, setSelected] = useState<LearningTrack | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const tracks = [
        { id: "GENERAL" as LearningTrack, name: "Tiếng Anh Tổng Quát", desc: "Luyện ngữ pháp, từ vựng và giao tiếp hàng ngày.", icon: Globe, color: "#10B981", bg: "#D1FAE5" },
        { id: "TOEIC" as LearningTrack, name: "Luyện thi TOEIC", desc: "Tập trung Part 5, 6, 7. Xóa mù chữ chốn công sở.", icon: Target, color: "#4F46E5", bg: "#EEF2FF" },
        { id: "IELTS" as LearningTrack, name: "Luyện thi IELTS", desc: "Học thuật chuyên sâu. Chuẩn bị cho du học, định cư.", icon: BookOpen, color: "#F97316", bg: "#FFF7ED" },
    ];

    const handleContinue = async () => {
        if (!selected) return;
        setIsSubmitting(true);
        try {
            // Gửi xuống Backend
            await userService.setLearningTrack(selected);
            // Chuyển sang trang chọn trình độ Level
            localStorage.setItem('learningTrack', selected); // Lưu vào localStorage để trang sau lấy ra
            navigate("/select-level");
        } catch (error) {
            console.error("Lỗi cập nhật lộ trình:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-8" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl w-full">

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-4" style={{ color: "#1E293B" }}>
                        Mục tiêu học tập của bạn là gì?
                    </h1>
                    <p className="text-base" style={{ color: "#64748B" }}>
                        AI của chúng tôi sẽ thiết kế lộ trình riêng biệt dựa trên lựa chọn này.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {tracks.map((track) => {
                        const isSelected = selected === track.id;
                        return (
                            <motion.div
                                key={track.id}
                                whileHover={{ y: -6 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setSelected(track.id)}
                                className="relative p-6 rounded-2xl cursor-pointer transition-all"
                                style={{
                                    background: isSelected ? track.bg : "#fff",
                                    border: `2px solid ${isSelected ? track.color : "#E5E7EB"}`,
                                    boxShadow: isSelected ? `0 8px 32px ${track.color}30` : "0 2px 12px rgba(0,0,0,0.05)",
                                }}
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: isSelected ? track.color : track.bg }}>
                                    <track.icon className="w-6 h-6" style={{ color: isSelected ? "#fff" : track.color }} />
                                </div>
                                <h3 className="font-bold mb-2 text-lg" style={{ color: "#1E293B" }}>{track.name}</h3>
                                <p className="text-sm" style={{ color: "#64748B" }}>{track.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="flex justify-center">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleContinue}
                        disabled={!selected || isSubmitting}
                        className="inline-flex items-center gap-3 px-12 py-4 rounded-2xl text-white font-semibold text-base transition-all"
                        style={{
                            background: selected ? "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" : "#D1D5DB",
                            opacity: isSubmitting ? 0.7 : 1
                        }}
                    >
                        {isSubmitting ? "Đang xử lý..." : "Tiếp tục"}
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </div>

            </motion.div>
        </div>
    );
}