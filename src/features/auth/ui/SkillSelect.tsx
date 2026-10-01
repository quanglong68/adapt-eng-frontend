import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Edit3, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SkillSelect() {
    const [selected, setSelected] = useState<"READING_LISTENING" | "WRITING" | null>(null);
    const navigate = useNavigate();

    const skills = [
        { id: "READING_LISTENING" as const, name: "Đọc & Nghe", desc: "Luyện Reading & Listening. Trọng tâm ngữ pháp và đọc hiểu.", icon: BookOpen },
        { id: "WRITING" as const, name: "Viết (Writing)", desc: "Luyện cấu trúc câu. AI chấm điểm và chỉ lỗi chi tiết.", icon: Edit3 },
    ];

    const handleContinue = () => {
        if (selected === "READING_LISTENING") {
            navigate("/select-level"); // Chuyển sang chọn level của bài cũ
        } else if (selected === "WRITING") {
            navigate("/toeic/writing/select-level"); // Chuyển sang chọn level bài mới
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-6">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-2xl">

                <motion.button
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => navigate("/select-track")}
                    className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" /> Quay lại
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="text-center mb-10"
                >
                    <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Bạn muốn bắt đầu với kỹ năng nào?
                    </h1>
                    <p className="text-base text-slate-500">
                        Mỗi kỹ năng sẽ có một bài đánh giá năng lực riêng biệt.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {skills.map((skill, i) => {
                        const isSelected = selected === skill.id;
                        return (
                            <motion.div
                                key={skill.id}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setSelected(skill.id)}
                                className={`relative cursor-pointer rounded-2xl border-2 bg-white p-6 transition-all duration-300 hover:scale-[1.02] ${isSelected ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-600/10" : "border-slate-200 hover:border-indigo-300"}`}
                            >
                                {isSelected && (
                                    <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-indigo-600" />
                                )}
                                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-indigo-600"}`}>
                                    <skill.icon className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-slate-900">{skill.name}</h3>
                                <p className="text-sm leading-relaxed text-slate-500">{skill.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex justify-center"
                >
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleContinue}
                        disabled={!selected}
                        className={`inline-flex items-center gap-3 rounded-full px-12 py-4 text-base font-semibold text-white transition-all duration-300 ${selected ? "bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1" : "cursor-not-allowed bg-slate-300"}`}
                    >
                        Tiếp tục
                        <ArrowRight className="h-5 w-5" />
                    </motion.button>
                </motion.div>

            </motion.div>
        </div>
    );
}
