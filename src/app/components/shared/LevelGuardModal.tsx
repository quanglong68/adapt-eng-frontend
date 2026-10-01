import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Target, ArrowRight, BookOpen, Edit3, Layers } from "lucide-react";

export function LevelGuardModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [targetSkill, setTargetSkill] = useState<"READING_LISTENING" | "WRITING" | "ALL">("ALL");
    const navigate = useNavigate();

    useEffect(() => {
        const handleRequireTest = (event: any) => {
            let skill = event.detail?.skill || "ALL";

            // Kiểm tra xem trong máy đã có điểm level tổng (Reading) chưa
            const currentLevel = localStorage.getItem("currentLevel");

            // Nếu skill truyền vào là READING_LISTENING nhưng máy trắng bóc (user mới cứng) 
            // -> Ép nó thành ALL để bắt đi ra màn hình Chọn Kỹ Năng
            if (!currentLevel || currentLevel === "null" || currentLevel === "undefined") {
                skill = "ALL";
            }

            setTargetSkill(skill);
            setIsOpen(true);
        };

        window.addEventListener("REQUIRE_PLACEMENT_TEST", handleRequireTest);

        return () => {
            window.removeEventListener("REQUIRE_PLACEMENT_TEST", handleRequireTest);
        };
    }, []);

    const handleGoToTest = () => {
        setIsOpen(false);
        const track = localStorage.getItem('learningTrack');

        if (targetSkill === "WRITING") {
            // Cố tình chọn Writing
            navigate("/toeic/writing/select-level", { replace: true });
        } else if (targetSkill === "READING_LISTENING") {
            // Đã có level rồi nhưng vẫn bị gọi lại làm Reading
            navigate("/select-level", { replace: true });
        } else {
            // Mới tinh (ALL)
            if (track === "TOEIC") {
                navigate("/select-skill", { replace: true }); // <--- Đây chính là chìa khóa giải quyết lỗi của bạn
            } else {
                navigate("/select-level", { replace: true });
            }
        }
    };

    const isWriting = targetSkill === "WRITING";
    const isReading = targetSkill === "READING_LISTENING";
    const isAll = targetSkill === "ALL";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 opacity-60 pointer-events-none ${isWriting ? 'bg-indigo-100' : isReading ? 'bg-emerald-100' : 'bg-blue-100'}`} />

                        <div className="relative z-10">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg ${isWriting ? 'shadow-indigo-200' : isReading ? 'shadow-emerald-200' : 'shadow-blue-200'}`}
                                style={{ background: isWriting ? "linear-gradient(135deg, #4F46E5, #3730A3)" : isReading ? "linear-gradient(135deg, #10B981, #059669)" : "linear-gradient(135deg, #3B82F6, #1D4ED8)" }}>
                                {isWriting ? <Edit3 className="w-8 h-8 text-white" /> : isReading ? <BookOpen className="w-8 h-8 text-white" /> : <Layers className="w-8 h-8 text-white" />}
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                {isAll ? "Xác định trình độ" : `Xác định trình độ ${isWriting ? "Writing" : "Reading"}`}
                            </h2>
                            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                                {isAll
                                    ? "Để hệ thống AI có thể cá nhân hóa lộ trình học, vui lòng hoàn thành bài kiểm tra năng lực đầu vào trước khi tiếp tục nhé!"
                                    : `Để hệ thống AI có thể cá nhân hóa lộ trình học phù hợp nhất cho kỹ năng ${isWriting ? "Viết (Writing)" : "Đọc & Nghe"}, vui lòng hoàn thành bài kiểm tra trước!`
                                }
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleGoToTest}
                                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-colors flex items-center justify-center gap-2 ${isWriting ? 'shadow-indigo-200' : isReading ? 'shadow-emerald-200' : 'shadow-blue-200'}`}
                                style={{ background: isWriting ? "linear-gradient(135deg, #4F46E5, #3730A3)" : isReading ? "linear-gradient(135deg, #10B981, #059669)" : "linear-gradient(135deg, #3B82F6, #1D4ED8)" }}
                            >
                                <Target className="w-4 h-4" />
                                Bắt đầu làm bài
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}