import { useEffect, useState, useRef } from "react";
import { Loader2, Image as ImageIcon, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2, Edit3, Crown, Coffee, Check, PenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-hot-toast";

import { writingService } from "../../../entities/writing/writing.service";
import { WritingQuestion, SubmitWritingPracticeRequest } from "../../../entities/writing/writing.type";

export function WritingPracticeExecution() {
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<WritingQuestion[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showExit, setShowExit] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    // Trạng thái giới hạn lượt luyện tập hàng ngày
    const [isVipLimit, setIsVipLimit] = useState(false);
    const [isMaxLimit, setIsMaxLimit] = useState(false);

    // Trạng thái auto-save nháp
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 1. Gọi API bốc đề luyện tập hôm nay khi vào trang
    useEffect(() => {
        const fetchPractice = async () => {
            try {
                const data = await writingService.getDailyPractice();

                setQuestions(data.questions || []);

                // Nạp câu trả lời đang làm dở (nếu có). Backend trả key dạng chuỗi
                // nên phải ép về number cho khớp với Record<number, string>.
                if (data.savedAnswers) {
                    const formattedAnswers: Record<number, string> = {};
                    Object.keys(data.savedAnswers).forEach(key => {
                        formattedAnswers[Number(key)] = data.savedAnswers[key as any];
                    });
                    setAnswers(formattedAnswers);
                }
            } catch (error: any) {
                // Bắt lỗi từ Backend theo mã quy ước (xem mục "Mã lỗi" trong AIRule)
                const errorMessage = error.response?.data?.message || error.message || "";

                if (errorMessage.includes("REQUIRE_VIP")) {
                    setIsVipLimit(true);
                } else if (errorMessage.includes("MAX_LIMIT_REACHED")) {
                    setIsMaxLimit(true);
                } else {
                    console.error("Lỗi lấy bài luyện tập Writing:", error);
                    toast.error(errorMessage || "Lỗi khi tải bài luyện tập, vui lòng thử lại!");
                    navigate("/dashboard");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchPractice();
    }, [navigate]);

    // 2. Auto-save nháp: chờ ngừng gõ 1 giây mới gọi API
    useEffect(() => {
        if (Object.keys(answers).length === 0 || isLoading) return;

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        setSaveStatus("saving");

        saveTimeoutRef.current = setTimeout(async () => {
            try {
                await writingService.savePracticeDraft({ answers });
                setSaveStatus("saved");
            } catch (error) {
                console.error("Lỗi lưu nháp Writing:", error);
                setSaveStatus("idle");
            }
        }, 1000);

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [answers, isLoading]);

    // Tính sẵn ở đây vì hook không được đặt sau các câu lệnh return sớm
    const totalQuestions = questions.length;
    const answeredCount = Object.values(answers).filter(val => val.trim().length > 0).length;
    const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

    // 3. Không cảnh báo khi đóng tab: auto-save đã lưu mọi thay đổi sau 1 giây,
    //    nên cảnh báo chỉ gây phiền mà không ngăn được mất dữ liệu.
    //    Thoát giữa chừng dùng nút "Thoát" + popup xác nhận riêng bên dưới.

    // --- MÀN HÌNH ĐANG TẢI ĐỀ ---
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-5" />
                <h2 className="text-xl font-bold text-slate-800">Đang chuẩn bị bài luyện tập Writing...</h2>
                <p className="text-sm text-slate-500 mt-2">Hệ thống đang tải câu hỏi theo lịch ôn tập Spaced Repetition của bạn.</p>
            </div>
        );
    }

    // --- MÀN HÌNH ĐÒI VIP (hết lượt miễn phí trong ngày) ---
    if (isVipLimit) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md w-full">
                    <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center mx-auto mb-5 relative">
                        <Crown className="w-6 h-6 text-amber-600" />
                        <div className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Giới hạn luyện tập Writing</h2>
                    <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                        Bạn đã hoàn thành 1 phiên luyện tập Writing miễn phí hôm nay. Nâng cấp <strong>Premium</strong> để được luyện tập tối đa 3 đề mỗi ngày!
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate("/pricing")}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1 transition-all duration-300"
                        >
                            Nâng cấp VIP ngay
                        </button>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="w-full py-2.5 text-slate-500 text-sm font-semibold rounded-xl hover:bg-slate-50 border border-slate-200 bg-white transition-all duration-300"
                        >
                            Quay lại trang chủ
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- MÀN HÌNH CHẶN QUOTA VIP (đã đủ 3 đề/ngày) ---
    if (isMaxLimit) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md w-full">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-5">
                        <Coffee className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Não bộ cần nghỉ ngơi!</h2>
                    <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                        Tuyệt vời! Bạn đã hoàn thành tối đa <strong>3 đề luyện tập Writing</strong> trong hôm nay.
                        Theo nguyên tắc Spaced Repetition, nhồi nhét thêm sẽ không hiệu quả. Hãy thư giãn và quay lại vào ngày mai nhé!
                    </p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1"
                    >
                        Về trang chủ nghỉ ngơi
                    </button>
                </motion.div>
            </div>
        );
    }

    // --- KHÔNG CÓ CÂU HỎI NÀO ĐỂ LÀM ---
    if (totalQuestions === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md w-full">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Chưa có bài luyện tập</h2>
                    <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                        Hệ thống chưa lấy được câu hỏi Writing cho trình độ của bạn. Bạn quay lại sau nhé!
                    </p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1"
                    >
                        Quay lại trang chủ
                    </button>
                </motion.div>
            </div>
        );
    }

    const currentQuestion = questions[currentIdx];
    const givenWordList = (currentQuestion.givenWords || "").split(",").map(w => w.trim()).filter(Boolean);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.questionId]: e.target.value }));
    };

    const handleRequestSubmit = () => {
        if (answeredCount === 0) {
            toast.error("Bạn chưa trả lời câu nào. Viết ít nhất 1 câu rồi hãy nộp nhé!");
            return;
        }
        if (answeredCount < totalQuestions) {
            setShowSubmitConfirm(true);
        } else {
            executeSubmit();
        }
    };

    // 4. Nộp bài và chờ AI chấm điểm 0-3 mỗi câu
    const executeSubmit = async () => {
        setIsSubmitting(true);
        setShowSubmitConfirm(false);

        // Huỷ timer lưu nháp để khỏi ghi đè bản ghi sau khi backend đã chấm xong
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        try {
            // Chỉ gửi những câu đã có nội dung, câu bỏ trống sẽ bị tính 0 điểm
            const formattedAnswers = questions
                .filter(q => (answers[q.questionId] || "").trim().length > 0)
                .map(q => ({
                    questionId: q.questionId,
                    selectedAnswer: (answers[q.questionId] || "").trim()
                }));

            const submitData: SubmitWritingPracticeRequest = {
                answers: formattedAnswers
            };

            const result = await writingService.submitDailyPractice(submitData);

            // Nộp xong, bay thẳng sang màn hình kết quả kèm data AI chấm.
            // Truyền câu hỏi gốc qua state giống WritingTestResult để trang review
            // lấy được ảnh và từ khóa (reviewList của backend không chứa 2 thứ này).
            navigate("/toeic/writing/practice-result", {
                state: { dataResult: result, originalQuestions: questions }
            });
        } catch (error: any) {
            console.error("Lỗi nộp bài luyện tập Writing:", error);
            const msg = error.response?.data?.message || "Lỗi chấm bài. AI có thể đang bận, vui lòng thử nộp lại sau!";
            toast.error(msg);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* --- HEADER TIẾN ĐỘ --- */}
            <div className="bg-white px-4 md:px-6 py-4 border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowExit(true)} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-300">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="font-bold text-slate-800 text-base flex items-center gap-2">
                                <PenLine className="w-4 h-4 text-emerald-600" />
                                Luyện tập <span className="text-emerald-600">Writing Part 1</span>
                            </h1>
                            <p className="text-xs font-medium text-slate-500">Bài ôn tập hàng ngày · {totalQuestions} câu</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Trạng thái lưu nháp tự động */}
                        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold">
                            {saveStatus === "saving" && (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                                    <span className="text-slate-400">Đang lưu nháp...</span>
                                </>
                            )}
                            {saveStatus === "saved" && (
                                <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-600">Đã lưu nháp</span>
                                </>
                            )}
                        </div>

                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-bold text-slate-700">{answeredCount} / {totalQuestions} câu</span>
                            <div className="w-44 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                <motion.div
                                    className="h-full bg-emerald-600 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleRequestSubmit}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 disabled:opacity-60"
                        >
                            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang chấm...</> : "Nộp bài"}
                        </button>
                    </div>
                </div>
                <div className="md:hidden max-w-7xl mx-auto mt-3">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-emerald-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </div>

            {/* --- KHU VỰC LÀM BÀI CHÍNH --- */}
            <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[560px]"
                >
                    {/* BÊN TRÁI: HIỂN THỊ ẢNH VÀ TỪ KHÓA */}
                    <div className="lg:w-1/2 p-5 md:p-6 bg-slate-50/60 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
                        <div className="flex items-center justify-between mb-4 gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 font-semibold text-xs rounded-full">
                                Câu hỏi {currentIdx + 1}
                            </span>
                            <span className="text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                                Write a sentence based on a picture
                            </span>
                        </div>

                        {/* Box chứa ảnh */}
                        <div className="flex-1 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-2 mb-5 overflow-hidden">
                            {currentQuestion.imageUrl ? (
                                <img
                                    src={currentQuestion.imageUrl}
                                    alt="TOEIC Writing Question"
                                    className="max-w-full max-h-[340px] object-contain rounded-lg"
                                />
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center py-10">
                                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                                    <span className="text-sm">Hình ảnh bị lỗi</span>
                                </div>
                            )}
                        </div>

                        {/* Yêu cầu đề bài */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <p className="text-sm font-medium text-slate-600 mb-3">
                                Viết MỘT câu miêu tả bức tranh trên, bắt buộc sử dụng 2 từ khóa sau:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {givenWordList.map((word, wIdx) => (
                                    <span key={wIdx} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-semibold rounded-lg border border-emerald-100 text-sm uppercase tracking-wide">
                                        {word}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BÊN PHẢI: KHU VỰC GÕ TEXT (TEXTAREA) */}
                    <div className="lg:w-1/2 p-5 md:p-6 flex flex-col">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Edit3 className="w-4 h-4 text-emerald-600" />
                            Câu trả lời của bạn:
                        </div>

                        {/* Câu bốc từ SM-2 sẽ có ngữ pháp bắt buộc, AI cho 0 điểm nếu không dùng đúng */}
                        {currentQuestion.requiredGrammar ? (
                            <div className="mb-4 p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                                        Ngữ pháp bắt buộc
                                    </p>
                                    <p className="text-sm font-bold text-amber-800">
                                        {currentQuestion.requiredGrammar}
                                    </p>
                                    <p className="text-xs text-amber-700 mt-1">
                                        Bắt buộc dùng đúng cấu trúc này, nếu không AI sẽ chấm 0 điểm cho câu này.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="text-xs font-medium text-slate-500">
                                    Câu luyện tập tự do, không áp ràng buộc ngữ pháp. Hãy dùng cấu trúc câu tự nhiên nhất.
                                </p>
                            </div>
                        )}

                        <textarea
                            value={answers[currentQuestion.questionId] || ""}
                            onChange={handleTextChange}
                            placeholder="Nhập câu tiếng Anh của bạn vào đây..."
                            className="flex-1 w-full min-h-[180px] p-4 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all duration-300 resize-none text-slate-800 text-[15px] leading-relaxed placeholder:text-slate-400"
                            spellCheck="false"
                        />

                        {/* Thanh điều hướng câu hỏi */}
                        <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
                            <button
                                onClick={() => setCurrentIdx(prev => prev - 1)}
                                disabled={currentIdx === 0}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft className="w-4 h-4" /> Câu trước
                            </button>

                            <span className="text-sm font-semibold text-slate-400">
                                {currentIdx + 1} / {totalQuestions}
                            </span>

                            {currentIdx < totalQuestions - 1 ? (
                                <button
                                    onClick={() => setCurrentIdx(prev => prev + 1)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-all duration-300"
                                >
                                    Câu tiếp <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleRequestSubmit}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1"
                                >
                                    Hoàn tất <CheckCircle2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* --- MODAL CẢNH BÁO --- */}
            <AnimatePresence>
                {/* Modal Nộp bài khi chưa làm xong */}
                {showSubmitConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full text-center shadow-xl">
                            <div className="w-12 h-12 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa hoàn thành hết</h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                Bạn mới làm <strong className="text-emerald-600">{answeredCount}/{totalQuestions}</strong> câu. Nếu nộp bây giờ, những câu bỏ trống sẽ bị tính <strong className="text-rose-600">0 điểm</strong>. Bạn chắc chứ?
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all duration-300">
                                    Quay lại làm tiếp
                                </button>
                                <button onClick={executeSubmit} disabled={isSubmitting} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1 flex justify-center items-center gap-2 disabled:opacity-60">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Nộp luôn"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Modal Thoát ngang */}
                {showExit && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full text-center shadow-xl">
                            <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <ArrowLeft className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Dừng luyện tập?</h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                Tiến độ sẽ được lưu ngầm tự động. Lần sau vào bạn có thể làm tiếp đúng chỗ đang dở!
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowExit(false)} className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all duration-300">
                                    Tiếp tục luyện tập
                                </button>
                                <button onClick={() => navigate("/dashboard")} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-all duration-300">
                                    Thoát luôn
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- OVERLAY CHỜ AI CHẤM ĐIỂM --- */}
            {isSubmitting && (
                <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-sm px-6 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-white mb-5" />
                    <h2 className="text-xl font-bold text-white mb-2">AI đang chấm bài...</h2>
                    <p className="text-slate-300 text-sm">Vui lòng đợi, quá trình này có thể mất vài chục giây.</p>
                </div>
            )}
        </div>
    );
}
