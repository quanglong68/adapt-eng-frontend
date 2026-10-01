import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Edit3, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SkillSelect() {
    const [selected, setSelected] = useState<"READING_LISTENING" | "WRITING" | null>(null);
    const navigate = useNavigate();

    const skills = [
        { id: "READING_LISTENING" as const, name: "Đọc & Nghe", desc: "Luyện Reading & Listening. Trọng tâm ngữ pháp và đọc hiểu.", icon: BookOpen, color: "#10B981", bg: "#D1FAE5" },
        { id: "WRITING" as const, name: "Viết (Writing)", desc: "Luyện cấu trúc câu. AI chấm điểm và chỉ lỗi chi tiết.", icon: Edit3, color: "#4F46E5", bg: "#EEF2FF" },
    ];

    const handleContinue = () => {
        if (selected === "READING_LISTENING") {
            navigate("/select-level"); // Chuyển sang chọn level của bài cũ
        } else if (selected === "WRITING") {
            navigate("/toeic/writing/select-level"); // Chuyển sang chọn level bài mới
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-8" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl w-full">

                <button
                    onClick={() => navigate("/select-track")}
                    className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                    <ArrowLeft className="w-4 h-4" /> Quay lại
                </button>

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-4" style={{ color: "#1E293B" }}>
                        Bạn muốn bắt đầu với kỹ năng nào?
                    </h1>
                    <p className="text-base" style={{ color: "#64748B" }}>
                        Mỗi kỹ năng sẽ có một bài đánh giá năng lực riêng biệt.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {skills.map((skill) => {
                        const isSelected = selected === skill.id;
                        return (
                            <motion.div
                                key={skill.id}
                                whileHover={{ y: -6 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setSelected(skill.id)}
                                className="relative p-6 rounded-2xl cursor-pointer transition-all"
                                style={{
                                    background: isSelected ? skill.bg : "#fff",
                                    border: `2px solid ${isSelected ? skill.color : "#E5E7EB"}`,
                                    boxShadow: isSelected ? `0 8px 32px ${skill.color}30` : "0 2px 12px rgba(0,0,0,0.05)",
                                }}
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: isSelected ? skill.color : skill.bg }}>
                                    <skill.icon className="w-6 h-6" style={{ color: isSelected ? "#fff" : skill.color }} />
                                </div>
                                <h3 className="font-bold mb-2 text-lg" style={{ color: "#1E293B" }}>{skill.name}</h3>
                                <p className="text-sm" style={{ color: "#64748B" }}>{skill.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="flex justify-center">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleContinue}
                        disabled={!selected}
                        className="inline-flex items-center gap-3 px-12 py-4 rounded-2xl text-white font-semibold text-base transition-all"
                        style={{
                            background: selected ? "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" : "#D1D5DB",
                        }}
                    >
                        Tiếp tục
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </div>

            </motion.div>
        </div>
    );
}