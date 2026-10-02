import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
    ArrowLeft,
    Star,
    Sparkles,
    CheckCircle2,
    Loader2,
    Crown,
    XCircle,
    Lightbulb,
    MoonStar,
    KeyRound,
    BookOpenText,
    History,
    ChevronRight,
    BadgeCheck,
} from "lucide-react";
import { vipService } from "../../../entities/premium/vip.service";
import { handleApiError } from "../../../shared/api/handleApiError";
import toast from "react-hot-toast";
import { CosmicBackground } from "./CosmicBackground";

// Hàm xáo trộn mảng ngẫu nhiên (Fisher-Yates Shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export interface VipSentence {
    english_sentence: string;
    has_blank: boolean;
    target_word: string | null;
    word_meaning: string | null;
    options: string[];
    hint_translation: string | null;
    full_translation: string;
    vietnamese_translation?: string;
}

export interface VipStory {
    title: string;
    genre: string;
    sentences: VipSentence[];
}

export interface VipTarot {
    target_word: string;
    word_meaning: string;
    english_sentence: string;
    options: string[];
    vietnamese_translation: string;
}

export interface VipEntertainmentContent {
    tarot: VipTarot;
    story: VipStory | null;
}

// === PHASE 1: TAROT HUYỀN BÍ ===
function TarotPhase({ tarot, hasStory, onContinue, onGoDashboard, isSubmitting }: { tarot: VipTarot, hasStory: boolean, onContinue: () => void, onGoDashboard: () => void, isSubmitting: boolean }) {
    const [wrongPicks, setWrongPicks] = useState<Set<string>>(new Set());
    const [isSuccess, setIsSuccess] = useState(false);
    const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

    const handleSelect = (option: string) => {
        if (isSuccess) return;

        if (option === tarot.target_word) {
            setIsSuccess(true);
            setFeedbackMsg("Vận mệnh đã mở khóa!");
        } else {
            setWrongPicks(prev => new Set(prev).add(option));
            setFeedbackMsg(`Đây chưa phải vận mệnh của bạn. (Gợi ý: Từ này có nghĩa là "${tarot.word_meaning}")`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-[80vh] flex flex-col items-center justify-center p-6 [perspective:1400px]"
        >
            <motion.div
                whileHover={isSuccess ? { scale: 1.01 } : { rotateX: 3, rotateY: -3, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
                className={`relative max-w-2xl w-full rounded-[2rem] p-8 md:p-10 text-center overflow-hidden border backdrop-blur-xl transition-all duration-300 ${isSuccess
                    ? "border-amber-400/50 bg-white/[0.05] shadow-[0_0_80px_rgba(251,191,36,0.35)]"
                    : "border-amber-500/30 bg-white/[0.04] shadow-[0_0_40px_rgba(0,0,0,0.4)]"
                    }`}
            >
                <div aria-hidden className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-500/20 blur-[110px] pointer-events-none" />
                <div aria-hidden className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-violet-600/20 blur-[110px] pointer-events-none" />

                <div className="relative">
                    <div className="relative w-fit mx-auto mb-5">
                        <motion.div
                            aria-hidden
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
                            className="absolute -inset-2.5 rounded-[1.3rem] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(251,191,36,0.55)_70deg,transparent_130deg,rgba(167,139,250,0.55)_210deg,transparent_270deg)] blur-[5px]"
                        />
                        <div className={`relative w-14 h-14 flex items-center justify-center rounded-2xl border border-amber-500/30 bg-slate-950 shadow-[0_0_24px_rgba(251,191,36,0.35)] transition-all duration-300 ${isSuccess ? "scale-110" : ""}`}>
                            {isSuccess ? <Crown className="w-7 h-7 text-amber-400" /> : <MoonStar className="w-7 h-7 text-amber-400" />}
                        </div>
                    </div>

                    <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-3">
                        <Sparkles className="w-3.5 h-3.5" /> Tarot mỗi ngày
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-8">
                        Lời Tiên Tri <span className="text-amber-400">Hôm Nay</span>
                    </h2>

                    <p className="text-xl md:text-2xl text-slate-200 leading-relaxed mb-10 font-medium">
                        {tarot.english_sentence.split('[blank]').map((part, i, arr) => (
                            <span key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                    <span className={`mx-2 px-6 py-1 rounded-xl font-bold border-b-2 transition-all duration-300 ${isSuccess ? 'bg-amber-400/15 text-amber-300 border-amber-400' : 'bg-white/5 border-white/20 text-transparent'
                                        }`}>
                                        {isSuccess ? tarot.target_word : "____"}
                                    </span>
                                )}
                            </span>
                        ))}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 relative z-10">
                        {tarot.options.map((option, idx) => {
                            const isWrong = wrongPicks.has(option);
                            const isAnswer = option === tarot.target_word;

                            return (
                                <AnimatePresence key={option}>
                                    {!isWrong && (
                                        <motion.button
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.92 }}
                                            transition={{ delay: idx * 0.07, duration: 0.4, ease: "easeOut" }}
                                            whileHover={!isSuccess ? { scale: 1.02 } : {}}
                                            whileTap={!isSuccess ? { scale: 0.98 } : {}}
                                            onClick={() => handleSelect(option)}
                                            disabled={isSuccess}
                                            className={`py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300 border ${isSuccess && isAnswer
                                                ? "bg-amber-400 text-slate-900 border-amber-400 shadow-[0_0_28px_rgba(251,191,36,0.5)]"
                                                : "bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-amber-500/30"
                                                }`}
                                        >
                                            {option}
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            );
                        })}
                    </div>

                    <AnimatePresence mode="wait">
                        {feedbackMsg && !isSuccess && (
                            <motion.div
                                key={feedbackMsg}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center gap-2 text-base font-medium text-red-300"
                            >
                                <XCircle className="w-5 h-5 shrink-0" />
                                <span>{feedbackMsg}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, duration: 0.45, ease: "easeOut" }}
                                className="mt-8 space-y-6"
                            >
                                <div className="flex items-center justify-center gap-2 text-amber-300 font-semibold">
                                    <BadgeCheck className="w-5 h-5" />
                                    <span>{feedbackMsg}</span>
                                </div>
                                <div className="p-6 rounded-2xl bg-black/30 border border-amber-500/30">
                                    <p className="text-amber-100/90 text-lg leading-relaxed italic">
                                        &ldquo;{tarot.vietnamese_translation}&rdquo;
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={hasStory ? onContinue : onGoDashboard}
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-[0_0_28px_rgba(251,191,36,0.5)] hover:shadow-[0_0_40px_rgba(251,191,36,0.65)] transition-all duration-300 flex items-center justify-center gap-2 mx-auto disabled:opacity-60"
                                >
                                    {isSubmitting && !hasStory ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                    {hasStory ? (
                                        <>Tiếp tục khám phá câu chuyện <ChevronRight className="w-5 h-5" /></>
                                    ) : (
                                        "Đã nắm rõ vận mệnh"
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}

// === PHASE 2: CÂU CHUYỆN GIẢI MÃ ===
function StoryPhase({ story, tarotTranslation, onFinishAll }: { story: VipStory; tarotTranslation: string; onFinishAll: () => void }) {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [wrongPicks, setWrongPicks] = useState<Record<number, Set<string>>>({});
    const [feedback, setFeedback] = useState<Record<number, { isCorrect: boolean, msg: string }>>({});
    const [showHints, setShowHints] = useState<Record<number, boolean>>({});

    const totalBlanks = story.sentences.filter(s => s.has_blank).length;
    const correctCount = Object.keys(answers).length;

    useEffect(() => {
        if (totalBlanks > 0 && correctCount === totalBlanks) {
            setTimeout(() => onFinishAll(), 1500);
        } else if (totalBlanks === 0) {
            onFinishAll();
        }
    }, [correctCount, totalBlanks, onFinishAll]);

    const handleSelect = (sIdx: number, option: string, sentence: VipSentence) => {
        if (answers[sIdx]) return;

        if (option === sentence.target_word) {
            setAnswers(prev => ({ ...prev, [sIdx]: option }));
            setFeedback(prev => ({ ...prev, [sIdx]: { isCorrect: true, msg: "Tuyệt vời! Bạn đã ghép đúng mảnh vỡ." } }));
        } else {
            setWrongPicks(prev => ({ ...prev, [sIdx]: new Set(prev[sIdx] || []).add(option) }));
            setFeedback(prev => ({
                ...prev,
                [sIdx]: { isCorrect: false, msg: "Không khớp với câu chuyện, hãy chọn lại đi!" }
            }));
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="max-w-4xl mx-auto py-10 px-4">

            {/* Header Gợi ý bằng Bản dịch của Tarot */}
            <div className="mb-8 p-6 md:p-8 rounded-3xl bg-white/[0.04] backdrop-blur-xl flex flex-col items-center justify-center gap-4 border border-amber-500/30 text-center shadow-[0_0_40px_rgba(0,0,0,0.35)]">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-amber-500/30 bg-amber-500/10">
                    <Star className="w-6 h-6 text-amber-400" />
                </div>
                <p className="text-base leading-relaxed text-slate-400">
                    Thông điệp Tarot của bạn hôm nay:
                    <strong className="text-amber-400 text-lg mt-2 block">&ldquo;{tarotTranslation}&rdquo;</strong>
                    <span className="mt-1 block text-sm">Hãy mang tinh thần này để giải mã câu chuyện dưới đây.</span>
                </p>
                {totalBlanks > 0 && (
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        Đã giải mã <span className="text-amber-400">{correctCount}/{totalBlanks}</span>
                    </p>
                )}
            </div>

            <div className="text-center mb-10">
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-2">
                    <BookOpenText className="w-3.5 h-3.5" /> {story.genre}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{story.title}</h2>
            </div>

            <div className="space-y-6">
                {story.sentences.map((sentence, sIdx) => {
                    const isSolved = !!answers[sIdx];
                    const currentWrong = wrongPicks[sIdx] || new Set();
                    const currentFb = feedback[sIdx];
                    const isHintShown = showHints[sIdx];

                    // Bắt chữ [blank] chuyển thành dấu gạch dưới dài cho Gợi ý
                    const displayHintTranslation = (sentence.hint_translation || sentence.vietnamese_translation)?.replace(/\[blank\]/g, '_______');
                    // Dịch Full 100% tiếng Việt
                    const displayFullTranslation = sentence.full_translation || sentence.vietnamese_translation?.replace(/\[blank\]/g, sentence.target_word || '');

                    return (
                        <motion.div
                            key={sIdx}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(sIdx * 0.07, 0.5), duration: 0.45, ease: "easeOut" }}
                            className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 ${!sentence.has_blank ? 'bg-white/[0.03] border-white/10' :
                                isSolved ? 'bg-emerald-400/[0.06] border-emerald-400/30 shadow-[0_0_30px_rgba(16,185,129,0.12)]' : 'bg-white/[0.04] border-white/10 hover:border-amber-500/30'
                                }`}
                        >
                            {/* Tiếng Anh */}
                            <p className="text-lg md:text-xl text-slate-100 leading-relaxed font-medium mb-6">
                                {sentence.has_blank ? (
                                    sentence.english_sentence.split('[blank]').map((part, pIdx, arr) => (
                                        <span key={pIdx}>
                                            {part}
                                            {pIdx < arr.length - 1 && (
                                                <span className={`mx-2 px-4 py-0.5 rounded-xl font-bold border-b-2 transition-all duration-300 ${isSolved ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400' : 'bg-white/5 text-transparent border-white/20'
                                                    }`}>
                                                    {isSolved ? sentence.target_word : "____"}
                                                </span>
                                            )}
                                        </span>
                                    ))
                                ) : (
                                    sentence.english_sentence
                                )}
                            </p>

                            {/* Nút Gợi ý / Bản dịch Full */}
                            <div className="mb-6">
                                {(!sentence.has_blank || isSolved) ? (
                                    // Đã làm xong: Hiện Bản dịch Full thuần Việt
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-base text-emerald-100/90 italic border-l-2 border-emerald-400 pl-4 bg-emerald-400/10 py-3 pr-4 rounded-r-xl">
                                        {displayFullTranslation}
                                    </motion.p>
                                ) : (
                                    // Chưa làm xong: Ẩn Gợi ý đi, bấm nút mới bung ra
                                    <div className="min-h-[44px]">
                                        {isHintShown ? (
                                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 bg-white/[0.03] rounded-xl border-l-2 border-indigo-400 pl-4 py-4 pr-4">
                                                <p className="text-sm text-slate-400 italic flex items-start gap-2">
                                                    <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-indigo-300" />
                                                    <span><span className="font-semibold text-indigo-300 mr-1 not-italic">Gợi ý câu:</span>{displayHintTranslation}</span>
                                                </p>
                                                <p className="text-sm text-slate-300 flex items-start gap-2">
                                                    <KeyRound className="w-4 h-4 mt-0.5 shrink-0 text-indigo-300" />
                                                    <span><span className="font-semibold text-indigo-300 mr-1">Từ cần điền:</span>
                                                        Mang ý nghĩa là <strong className="text-white">&ldquo;{sentence.word_meaning}&rdquo;</strong>.</span>
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <button onClick={() => setShowHints(prev => ({ ...prev, [sIdx]: true }))} className="text-sm font-semibold text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/30 px-4 py-2.5 rounded-xl transition-all duration-300">
                                                <Lightbulb className="w-4 h-4" /> Xem gợi ý từ và dịch nghĩa
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Options & Feedback */}
                            {sentence.has_blank && !isSolved && (
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-3">
                                        {sentence.options?.map((option) => {
                                            const isWrong = currentWrong.has(option);
                                            if (isWrong) return null; // Ẩn luôn đáp án sai để người dùng tập trung

                                            return (
                                                <motion.button
                                                    key={option}
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => handleSelect(sIdx, option, sentence)}
                                                    className="px-6 py-3 rounded-xl text-base font-semibold bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:border-amber-500/30 hover:text-white transition-all duration-300"
                                                >
                                                    {option}
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    <AnimatePresence>
                                        {currentFb && !currentFb.isCorrect && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
                                            >
                                                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                                                <p className="text-red-300 font-medium">{currentFb.msg}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            <AnimatePresence>
                                {currentFb && currentFb.isCorrect && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-4 flex items-center gap-2 text-emerald-300 font-medium"
                                    >
                                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                                        <span>{currentFb.msg}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

function toLocalDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

// Màn hình khi chưa có đề để làm: nói đúng lý do thay vì báo "đã hoàn thành"
function EmptyEntertainment({ reason, pendingCount, storyDate, submitting, onSkip, onGoDashboard, onGoPricing, onGenerated }: {
    reason: string; pendingCount: number; storyDate: string | null; submitting: boolean;
    onSkip: () => void; onGoDashboard: () => void; onGoPricing: () => void; onGenerated: () => void;
}) {
    const [generating, setGenerating] = useState(false);
    const pollRef = useRef<number | null>(null);

    useEffect(() => () => {
        if (pollRef.current) window.clearInterval(pollRef.current);
    }, []);

    // Bấm "Tạo đề ngay": gọi BE sinh đề ngầm rồi poll đến khi có đề (giống luồng DeepDive)
    const handleGenerateNow = async () => {
        setGenerating(true);
        try {
            const res = await vipService.requestEntertainmentGeneration();
            toast.success(res.message || "AI đang sinh đề Tarot cho bạn...");
            let attempts = 0;
            pollRef.current = window.setInterval(async () => {
                attempts++;
                try {
                    const data = await vipService.getDailyEntertainment();
                    if (data.status === 'HAS_STORY' && data.contentJson) {
                        if (pollRef.current) window.clearInterval(pollRef.current);
                        setGenerating(false);
                        onGenerated();
                        return;
                    }
                } catch {
                    // Bỏ qua lỗi mạng lẻ tẻ, poll tiếp
                }
                if (attempts >= 30) {
                    if (pollRef.current) window.clearInterval(pollRef.current);
                    setGenerating(false);
                    toast.success("AI cần thêm chút thời gian. Xong sẽ có thông báo chuông ngay!");
                }
            }, 3000);
        } catch (err) {
            setGenerating(false);
            handleApiError(err, "Không tạo được đề lúc này. Vui lòng thử lại!");
        }
    };
    const copy: Record<string, { title: string; desc: string }> = {
        NO_PENDING_WORDS: {
            title: "Chưa có đề giải trí hôm nay",
            desc: "Bạn chưa lưu từ nào nên AI không có nguyên liệu sinh đề. Hãy bôi đen và lưu từ khi luyện đề — đề Tarot sẽ có sau 2h sáng.",
        },
        WAITING_JOB: {
            title: "Sẵn sàng dệt vận mệnh",
            desc: `Bạn đã lưu ${pendingCount} từ. Bấm nút bên dưới để AI sinh đề Tarot ngay — xong sẽ có thông báo chuông. (Hoặc chờ hệ thống tự sinh lúc 2h sáng.)`,
        },
        NOT_VIP: {
            title: "Cần gói Premium",
            desc: "Vũ trụ giải trí VIP chỉ dành cho tài khoản Premium còn hạn.",
        },
        BROKEN_STORY: {
            title: "Đề cũ bị lỗi nội dung",
            desc: "Đề đang dở đọc không được. Bạn có thể bỏ qua đề cũ để nhận đề mới sau 2h sáng.",
        },
    };
    const { title, desc } = copy[reason] ?? copy.WAITING_JOB;

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
            <CosmicBackground density={40} />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full max-w-md rounded-[2rem] border border-amber-500/30 bg-white/[0.04] backdrop-blur-xl p-8"
            >
                <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 shadow-[0_0_24px_rgba(251,191,36,0.35)]">
                    <Crown className="w-7 h-7 text-amber-400" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-2">Khu vực VIP</p>
                <h1 className="text-2xl font-bold tracking-tight text-white mb-3">{title}</h1>
                <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto mb-8">{desc}</p>
                <div className="flex flex-col gap-3 w-full">
                    {reason === "WAITING_JOB" && (
                        <button
                            onClick={handleGenerateNow}
                            disabled={generating}
                            className="w-full py-3.5 rounded-full font-bold text-sm text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-[0_0_28px_rgba(251,191,36,0.5)] hover:shadow-[0_0_40px_rgba(251,191,36,0.65)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
                        >
                            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            {generating ? "AI đang dệt vận mệnh..." : "Tạo đề ngay"}
                        </button>
                    )}
                    {generating && (
                        <p className="text-xs text-slate-500">Mất khoảng 10 - 60 giây. Bạn có thể rời trang, xong sẽ có thông báo.</p>
                    )}
                    {(reason === "BROKEN_STORY" || storyDate) && (
                        <button
                            onClick={onSkip}
                            disabled={submitting}
                            className="w-full py-3 rounded-full font-bold text-sm text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.45)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <History className="w-4 h-4" />}
                            {submitting ? "Đang xử lý..." : "Bỏ qua đề cũ"}
                        </button>
                    )}
                    {reason === "NOT_VIP" && (
                        <button
                            onClick={onGoPricing}
                            className="w-full py-3 rounded-full font-bold text-sm text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.45)] transition-all duration-300"
                        >
                            Xem gói Premium
                        </button>
                    )}
                    <button
                        onClick={onGoDashboard}
                        className="w-full py-3 rounded-full font-semibold text-sm bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300"
                    >
                        Về Dashboard
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// === MAIN COMPONENT ===
export function VipEntertainment() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<VipEntertainmentContent | null>(null);
    const [emptyReason, setEmptyReason] = useState<string | null>(null);
    const [pendingCount, setPendingCount] = useState(0);
    const [storyDate, setStoryDate] = useState<string | null>(null);

    const [phase, setPhase] = useState<'TAROT' | 'STORY' | 'COMPLETED'>('TAROT');
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await vipService.getDailyEntertainment();

            // Đề hôm nay đã làm xong -> báo đúng bản chất rồi về dashboard
            if (data.status === 'DONE_TODAY' || (data.isCompleted && !data.contentJson && !data.status)) {
                // Fallback cũ: BE chưa nâng cấp mà trả trống -> coi như đã xong (giữ hành vi cũ)
                if (!data.status) {
                    toast.success("Bạn đã hoàn thành nhiệm vụ hôm nay rồi!");
                    navigate("/dashboard");
                    return;
                }
                toast.success("Bạn đã hoàn thành đề giải trí hôm nay rồi! Hẹn gặp lại sau 2h sáng mai.");
                navigate("/dashboard");
                return;
            }

            // Chưa có đề để làm -> hiện màn hình hướng dẫn đúng lý do, KHÔNG đá về dashboard
            if (data.status === 'EMPTY' || (!data.contentJson && !data.status)) {
                const reason = data.emptyReason ?? 'WAITING_JOB';
                setEmptyReason(reason);
                try {
                    const statusInfo = await vipService.getEntertainmentStatus();
                    setPendingCount(statusInfo.pendingCount);
                } catch {
                    setPendingCount(0);
                }
                return;
            }

            if (data.contentJson) {
                let rawStr = data.contentJson.trim();
                let parsedContent: VipEntertainmentContent | null = null;
                let attempts = 0;

                while (rawStr.length > 0 && attempts < 20) {
                    try {
                        parsedContent = JSON.parse(rawStr) as VipEntertainmentContent;
                        break;
                    } catch (e) {
                        rawStr = rawStr.slice(0, -1).trim();
                        attempts++;
                    }
                }

                if (parsedContent?.tarot) {
                    // TỰ ĐỘNG XÁO TRỘN CÁC ĐÁP ÁN KHI NHẬN JSON ĐỂ CHỐNG SPAM
                    if (parsedContent.tarot?.options) {
                        parsedContent.tarot.options = shuffleArray(parsedContent.tarot.options);
                    }
                    if (parsedContent.story?.sentences) {
                        parsedContent.story.sentences = parsedContent.story.sentences.map(s => ({
                            ...s,
                            options: s.options ? shuffleArray(s.options) : []
                        }));
                    }
                    setContent(parsedContent);
                    setStoryDate(data.entertainmentDate);
                } else {
                    // JSON hỏng không đọc được -> coi như chưa có đề + cho phép bỏ qua đề cũ
                    setEmptyReason('BROKEN_STORY');
                    setStoryDate(data.entertainmentDate);
                }
            }
        } catch (err) {
            handleApiError(err, "Không tải được nội dung giải trí. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSkipStory = async () => {
        setSubmitting(true);
        try {
            const res = await vipService.skipStory();
            toast.success(res.message);
            setContent(null);
            setStoryDate(null);
            await fetchData();
        } catch (err) {
            handleApiError(err, "Không bỏ qua được đề cũ.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleTarotComplete = () => {
        if (!content?.story || content.story.sentences.length === 0) {
            handleFinishStory();
        } else {
            setPhase('STORY');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleFinishStory = () => {
        setPhase('COMPLETED');
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.4 }, colors: ['#4F46E5', '#F59E0B', '#10B981'] });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const submitCompletion = async () => {
        setSubmitting(true);
        try {
            const res = await vipService.completeStory();
            if (res.success) {
                toast.success("Hoàn tất xuất sắc! Giỏ từ đã được dọn dẹp.");
                navigate("/dashboard");
            }
        } catch (err) {
            toast.error("Lỗi khi lưu kết quả.");
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center gap-4">
                <CosmicBackground density={30} />
                <div className="relative flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
                    <p className="text-sm text-slate-400">Đang mở cánh cửa VIP...</p>
                </div>
            </div>
        );
    }

    // Chưa có đề để làm -> màn hình hướng dẫn đúng lý do (không đá về dashboard nữa)
    if (emptyReason && !content) {
        return <EmptyEntertainment
            reason={emptyReason}
            pendingCount={pendingCount}
            storyDate={storyDate}
            submitting={submitting}
            onSkip={handleSkipStory}
            onGoDashboard={() => navigate("/dashboard")}
            onGoPricing={() => navigate("/pricing")}
            onGenerated={fetchData}
        />;
    }

    if (!content) return null;

    const todayStr = toLocalDateStr(new Date());
    const isOldStory = !!storyDate && storyDate !== todayStr;

    const hasStory = !!content.story && content.story.sentences.length > 0;

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
            <CosmicBackground />

            {/* Nút Back - Trong lúc làm truyện, bấm quay lại sẽ về Dashboard (cố tình ko lưu) */}
            <div className="fixed top-6 left-6 z-50">
                <button onClick={() => navigate("/dashboard")} aria-label="Về Dashboard" className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:border-amber-500/30 transition-all duration-300">
                    <ArrowLeft className="w-5 h-5" />
                </button>
            </div>

            {/* Đề tồn từ hôm trước -> gắn nhãn + cho bỏ qua để chống kẹt FOMO */}
            {isOldStory && (
                <div className="relative max-w-2xl mx-auto pt-24 px-6">
                    <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-amber-400/10 border border-amber-500/30 text-sm">
                        <span className="text-amber-200 font-medium flex items-center gap-2">
                            <History className="w-4 h-4 shrink-0 text-amber-400" />
                            Đây là đề ngày {storyDate} — làm nốt để mở khóa từ mới.
                        </span>
                        <button
                            onClick={handleSkipStory}
                            disabled={submitting}
                            className="shrink-0 px-4 py-2 rounded-full text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.45)] transition-all duration-300 disabled:opacity-60"
                        >
                            {submitting ? "..." : "Bỏ qua đề cũ"}
                        </button>
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">

                {/* PHASE 1 */}
                {phase === 'TAROT' && (
                    <TarotPhase
                        key="tarot"
                        tarot={content.tarot}
                        hasStory={hasStory}
                        isSubmitting={submitting}
                        onContinue={() => {
                            setPhase('STORY');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onGoDashboard={submitCompletion}
                    />
                )}

                {/* PHASE 2 */}
                {phase === 'STORY' && content.story && (
                    <motion.div key="story" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.45, ease: "easeOut" }} className="relative pt-24 pb-32">
                        <StoryPhase
                            story={content.story}
                            tarotTranslation={content.tarot.vietnamese_translation}
                            onFinishAll={handleFinishStory}
                        />
                    </motion.div>
                )}

                {/* PHASE 3: THEATER MODE */}
                {phase === 'COMPLETED' && (
                    <motion.div key="completed" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="relative pt-24 pb-32 max-w-4xl mx-auto px-4">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-emerald-400/10 text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-400/30 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-2">
                                <Sparkles className="w-3.5 h-3.5" /> Hoàn thành
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">Mảnh Ghép Hoàn Hảo!</h1>
                            <p className="text-slate-400">Bạn đã khôi phục toàn bộ câu chuyện thành công.</p>
                        </div>

                        {content.story && (
                            <div className="bg-white/[0.04] backdrop-blur-xl rounded-[2rem] p-8 md:p-12 border border-amber-500/30 mb-10 relative overflow-hidden">
                                <div aria-hidden className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-500/15 blur-[110px] pointer-events-none" />
                                <div className="relative z-10">
                                    <h2 className="text-center text-2xl md:text-3xl font-bold tracking-tight text-white mb-8">{content.story.title}</h2>

                                    <div className="mb-6 p-6 md:p-8 bg-white/[0.03] rounded-3xl border-l-2 border-amber-400">
                                        <p className="text-lg text-slate-100 leading-relaxed font-medium">
                                            {content.story.sentences.map(s => s.has_blank ? s.english_sentence.replace('[blank]', s.target_word!) : s.english_sentence).join(" ")}
                                        </p>
                                    </div>

                                    <div className="p-6 md:p-8 bg-emerald-400/10 rounded-3xl border-l-2 border-emerald-400">
                                        <p className="text-base text-emerald-100/90 leading-relaxed italic">
                                            {content.story.sentences.map(s => s.full_translation || s.vietnamese_translation).join(" ")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bảng tổng hợp từ vựng Tarot (Chỉ hiện khi ko có truyện) */}
                        {!content.story && (
                            <div className="bg-white/[0.04] backdrop-blur-xl rounded-[2rem] p-10 border border-amber-500/30 mb-10 text-center">
                                <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">{content.tarot.target_word}</h2>
                                <p className="text-lg text-slate-400 italic mb-6">({content.tarot.word_meaning})</p>
                                <p className="text-lg text-slate-100 font-medium">{content.tarot.english_sentence.replace('[blank]', content.tarot.target_word)}</p>
                                <p className="text-sm text-slate-400 mt-2">{content.tarot.vietnamese_translation}</p>
                            </div>
                        )}

                        {/* Nút Chốt Đơn Độc Nhất */}
                        <div className="flex justify-center max-w-lg mx-auto">
                            <button
                                disabled={submitting}
                                onClick={submitCompletion}
                                className="w-full py-4 rounded-full font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-[0_0_28px_rgba(251,191,36,0.5)] hover:shadow-[0_0_40px_rgba(251,191,36,0.65)] flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Lưu thành tích và Về trang chủ</>}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
