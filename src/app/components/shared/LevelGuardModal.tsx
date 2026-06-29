import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Target, ArrowRight } from "lucide-react";

export function LevelGuardModal() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Hàm lắng nghe tiếng "loa thông báo" từ api.ts hoặc Dashboard
        const handleRequireTest = () => setIsOpen(true);

        window.addEventListener("REQUIRE_PLACEMENT_TEST", handleRequireTest);

        return () => {
            window.removeEventListener("REQUIRE_PLACEMENT_TEST", handleRequireTest);
        };
    }, []);

    const handleGoToTest = () => {
        setIsOpen(false);
        navigate("/select-level", { replace: true });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Lớp nền mờ */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Nội dung Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center overflow-hidden"
                    >
                        {/* Hiệu ứng trang trí góc */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-60 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200"
                                style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
                                <Target className="w-8 h-8 text-white" />
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Xác định trình độ</h2>
                            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                                Để hệ thống AI có thể cá nhân hóa lộ trình học phù hợp nhất, vui lòng hoàn thành bài kiểm tra năng lực đầu vào trước khi tiếp tục nhé!
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleGoToTest}
                                className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-emerald-200 transition-colors flex items-center justify-center gap-2"
                                style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
                            >
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