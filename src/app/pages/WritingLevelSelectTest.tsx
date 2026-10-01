import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Edit3, CheckCircle2 } from "lucide-react";
import { Level } from "../types/common.type";

export function WritingLevelSelectTest() {
    const navigate = useNavigate();
    const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

    // Các mốc trình độ để user tự đánh giá sơ bộ trước khi test
    const levels: { id: Level; title: string; desc: string }[] = [
        { id: "A1", title: "A1 - Mới bắt đầu", desc: "Mới học cách nối từ, chưa quen viết câu hoàn chỉnh." },
        { id: "A2", title: "A2 - Sơ cấp", desc: "Có thể viết các câu đơn giản, từ vựng còn hạn chế." },
        { id: "B1", title: "B1 - Trung cấp", desc: "Viết được câu ghép, đoạn văn ngắn mô tả sự việc." },
        { id: "B2", title: "B2 - Trung cao cấp", desc: "Viết mạch lạc, sử dụng từ vựng và ngữ pháp đa dạng." },
    ];

    const handleContinue = () => {
        if (selectedLevel) {
            // Chuyển sang màn hình làm bài Test thực sự
            navigate(`/toeic/writing/test/${selectedLevel}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-6" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full">

                {/* Nút quay lại */}
                <button
                    onClick={() => navigate("/dashboard")}
                    className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                    <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
                </button>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-200"
                        style={{ background: "linear-gradient(135deg, #4F46E5, #3730A3)" }}>
                        <Edit3 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-3 text-slate-800 tracking-tight">
                        Kiểm tra năng lực Writing
                    </h1>
                    <p className="text-slate-500 text-sm leading-relaxed px-4">
                        Chọn trình độ hiện tại (hoặc mục tiêu) của bạn. Hệ thống AI sẽ tự động sinh ra đề thi TOEIC Writing Part 1 phù hợp để đánh giá chính xác nhất.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {levels.map((lvl) => {
                        const isSelected = selectedLevel === lvl.id;
                        return (
                            <motion.div
                                key={lvl.id}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedLevel(lvl.id)}
                                className="relative p-5 rounded-2xl cursor-pointer transition-all border-2"
                                style={{
                                    background: isSelected ? "#EEF2FF" : "#ffffff",
                                    borderColor: isSelected ? "#4F46E5" : "#E5E7EB",
                                    boxShadow: isSelected ? "0 10px 25px rgba(79,70,229,0.15)" : "0 2px 10px rgba(0,0,0,0.02)",
                                }}
                            >
                                {isSelected && (
                                    <div className="absolute top-4 right-4">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                    </div>
                                )}
                                <h3 className="font-bold text-lg mb-1" style={{ color: isSelected ? "#3730A3" : "#1E293B" }}>
                                    {lvl.title}
                                </h3>
                                <p className="text-xs text-slate-500 pr-6 leading-relaxed">
                                    {lvl.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="flex justify-center">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleContinue}
                        disabled={!selectedLevel}
                        className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                        style={{ background: "linear-gradient(135deg, #4F46E5, #3730A3)" }}
                    >
                        Bắt đầu thi Writing <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </div>

            </motion.div>
        </div>
    );
}