import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { ArrowLeft, Star, Sparkles, CheckCircle2, Loader2, Crown, XCircle, Lightbulb } from "lucide-react";
import { vipService } from "../services/vip.service";
import toast from "react-hot-toast";

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
            setFeedbackMsg("✨ Vận mệnh đã mở khóa!");
        } else {
            setWrongPicks(prev => new Set(prev).add(option));
            setFeedbackMsg(`❌ Đây chưa phải vận mệnh của bạn. (Gợi ý: Từ này có nghĩa là "${tarot.word_meaning}")`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="min-h-[80vh] flex flex-col items-center justify-center p-6"
        >
            <motion.div
                animate={{ boxShadow: isSuccess ? "0 0 80px rgba(250, 204, 21, 0.6)" : "0 20px 60px rgba(79,70,229,0.3)" }}
                className="relative max-w-2xl w-full rounded-[2rem] p-10 text-center overflow-hidden border border-white/10"
                style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)" }}
            >
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
                    <div className="absolute top-20 right-20 w-3 h-3 bg-yellow-200 rounded-full animate-pulse" />
                    <div className="absolute bottom-10 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" />
                </div>

                <Crown className={`w-16 h-16 mx-auto mb-6 transition-all ${isSuccess ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] scale-110' : 'text-indigo-300'}`} />

                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-500 mb-8 font-serif tracking-wide">
                    Lời Tiên Tri Hôm Nay
                </h2>

                <p className="text-2xl text-white/90 leading-relaxed mb-10 font-medium">
                    {tarot.english_sentence.split('[blank]').map((part, i, arr) => (
                        <span key={i}>
                            {part}
                            {i < arr.length - 1 && (
                                <span className={`mx-2 px-6 py-1 rounded-xl font-bold border-b-4 transition-all duration-500 ${isSuccess ? 'bg-yellow-400/20 text-yellow-300 border-yellow-500' : 'bg-white/5 border-indigo-400 text-transparent'
                                    }`}>
                                    {isSuccess ? tarot.target_word : "____"}
                                </span>
                            )}
                        </span>
                    ))}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                    {tarot.options.map((option) => {
                        const isWrong = wrongPicks.has(option);
                        const isAnswer = option === tarot.target_word;

                        return (
                            <AnimatePresence key={option}>
                                {!isWrong && (
                                    <motion.button
                                        initial={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                                        whileHover={!isSuccess ? { scale: 1.05 } : {}}
                                        whileTap={!isSuccess ? { scale: 0.95 } : {}}
                                        onClick={() => handleSelect(option)}
                                        disabled={isSuccess}
                                        className={`py-4 px-6 rounded-2xl font-bold text-lg transition-all ${isSuccess && isAnswer
                                            ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 shadow-[0_0_30px_rgba(250,204,21,0.5)]"
                                            : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
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
                            className="text-lg font-medium italic text-red-400"
                        >
                            {feedbackMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 space-y-6"
                        >
                            <div className="p-6 rounded-2xl bg-black/30 border border-yellow-500/30">
                                <p className="text-yellow-100 text-xl leading-relaxed font-serif italic">
                                    "{tarot.vietnamese_translation}"
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={hasStory ? onContinue : onGoDashboard}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto px-10 py-4 rounded-2xl font-bold text-slate-900 bg-gradient-to-r from-yellow-400 to-amber-500 shadow-[0_0_20px_rgba(250,204,21,0.4)] flex items-center justify-center gap-2 mx-auto"
                            >
                                {isSubmitting && !hasStory ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                {hasStory ? "Tiếp tục khám phá câu chuyện" : "Đã nắm rõ vận mệnh"}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
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
            setFeedback(prev => ({ ...prev, [sIdx]: { isCorrect: true, msg: "✨ Tuyệt vời! Bạn đã ghép đúng mảnh vỡ." } }));
        } else {
            setWrongPicks(prev => ({ ...prev, [sIdx]: new Set(prev[sIdx] || []).add(option) }));
            setFeedback(prev => ({
                ...prev,
                [sIdx]: { isCorrect: false, msg: "❌ Không khớp với câu chuyện, hãy chọn lại đi!" }
            }));
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-10 px-4">

            {/* Header Gợi ý bằng Bản dịch của Tarot */}
            <div className="mb-10 p-8 rounded-3xl bg-indigo-900 flex flex-col items-center justify-center gap-4 shadow-2xl border border-indigo-700 text-center">
                <Star className="w-12 h-12 text-yellow-400 shrink-0 animate-pulse" />
                <p className="text-lg italic leading-relaxed text-indigo-100">
                    Thông điệp Tarot của bạn hôm nay:<br />
                    <strong className="text-yellow-400 font-serif text-xl mt-2 block">"{tarotTranslation}"</strong><br />
                    Hãy mang tinh thần này để giải mã câu chuyện dưới đây.
                </p>
            </div>

            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-slate-800 font-serif">{story.title}</h2>
            </div>

            <div className="space-y-12">
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
                            className={`p-8 rounded-3xl border-2 transition-all duration-500 ${!sentence.has_blank ? 'bg-slate-50 border-slate-200' :
                                isSolved ? 'bg-emerald-50 border-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'bg-white border-indigo-50 shadow-xl'
                                }`}
                        >
                            {/* Tiếng Anh */}
                            <p className="text-2xl text-slate-800 leading-relaxed font-medium mb-6">
                                {sentence.has_blank ? (
                                    sentence.english_sentence.split('[blank]').map((part, pIdx, arr) => (
                                        <span key={pIdx}>
                                            {part}
                                            {pIdx < arr.length - 1 && (
                                                <span className={`mx-2 px-4 py-1 rounded-xl font-bold border-b-4 transition-all ${isSolved ? 'bg-emerald-200 text-emerald-800 border-emerald-400' : 'bg-slate-100 text-transparent border-slate-300'
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
                            <div className="mb-8">
                                {(!sentence.has_blank || isSolved) ? (
                                    // Đã làm xong: Hiện Bản dịch Full thuần Việt
                                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-lg text-emerald-700 italic border-l-4 border-emerald-400 pl-4 bg-emerald-50 py-3 pr-4 rounded-r-xl shadow-sm">
                                        {displayFullTranslation}
                                    </motion.p>
                                ) : (
                                    // Chưa làm xong: Ẩn Gợi ý đi, bấm nút mới bung ra
                                    <div className="min-h-[44px]">
                                        {isHintShown ? (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 bg-indigo-50/50 rounded-r-lg border-l-4 border-indigo-300 pl-4 py-4 pr-4">
                                                <p className="text-md text-slate-600 italic">
                                                    <span className="font-semibold text-indigo-500 mr-2">💡 Gợi ý câu:</span>
                                                    {displayHintTranslation}
                                                </p>
                                                <p className="text-md text-slate-700">
                                                    <span className="font-semibold text-indigo-500 mr-2">🔑 Từ cần điền:</span>
                                                    Mang ý nghĩa là <strong className="text-indigo-600">"{sentence.word_meaning}"</strong>.
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <button onClick={() => setShowHints(prev => ({ ...prev, [sIdx]: true }))} className="text-sm font-medium text-indigo-500 hover:text-indigo-600 flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition-colors">
                                                <Lightbulb className="w-4 h-4" /> Xem gợi ý từ & dịch nghĩa
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Options & Feedback */}
                            {sentence.has_blank && !isSolved && (
                                <div className="space-y-6">
                                    <div className="flex flex-wrap gap-3">
                                        {sentence.options?.map((option) => {
                                            const isWrong = currentWrong.has(option);
                                            if (isWrong) return null; // Ẩn luôn đáp án sai để người dùng tập trung

                                            return (
                                                <motion.button
                                                    key={option}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleSelect(sIdx, option, sentence)}
                                                    className="px-6 py-3 rounded-xl text-lg font-semibold bg-white border-2 border-indigo-100 text-indigo-600 shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                                                >
                                                    {option}
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    <AnimatePresence>
                                        {currentFb && !currentFb.isCorrect && (
                                            <motion.div
                                                initial={{ opacity: 0, x: [10, -10, 10, -10, 0] }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.4 }}
                                                className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3"
                                            >
                                                <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                                                <p className="text-red-700 font-medium text-lg">{currentFb.msg}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

// === MAIN COMPONENT ===
export function VipEntertainment() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<VipEntertainmentContent | null>(null);

    const [phase, setPhase] = useState<'TAROT' | 'STORY' | 'COMPLETED'>('TAROT');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await vipService.getDailyEntertainment();

                if (data.isCompleted) {
                    toast.success("Bạn đã hoàn thành nhiệm vụ hôm nay rồi!");
                    navigate("/dashboard");
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

                    if (parsedContent) {
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
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

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
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader2 className="w-12 h-12 animate-spin text-yellow-400" />
            </div>
        );
    }

    if (!content) return null;

    const hasStory = !!content.story && content.story.sentences.length > 0;

    return (
        <div className="min-h-screen" style={{ background: phase === 'TAROT' ? '#0F172A' : '#F8FAFC', transition: 'background 1s ease' }}>

            {/* Nút Back - Trong lúc làm truyện, bấm quay lại sẽ về Dashboard (cố tình ko lưu) */}
            <div className="fixed top-6 left-6 z-50">
                <button onClick={() => navigate("/dashboard")} className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${phase === 'TAROT' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

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
                    <motion.div key="story" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="pt-24 pb-32">
                        <StoryPhase
                            story={content.story}
                            tarotTranslation={content.tarot.vietnamese_translation}
                            onFinishAll={handleFinishStory}
                        />
                    </motion.div>
                )}

                {/* PHASE 3: THEATER MODE */}
                {phase === 'COMPLETED' && (
                    <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-32 max-w-4xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100 border-4 border-white">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <h1 className="text-4xl font-bold text-slate-800 mb-4 font-serif">Mảnh Ghép Hoàn Hảo!</h1>
                            <p className="text-lg text-slate-500">Bạn đã khôi phục toàn bộ câu chuyện thành công.</p>
                        </div>

                        {content.story && (
                            <div className="bg-white rounded-[2rem] p-12 shadow-2xl border border-slate-100 mb-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60" />
                                <div className="relative z-10 prose prose-lg max-w-none">
                                    <h2 className="text-center text-4xl font-serif text-slate-800 mb-10">{content.story.title}</h2>

                                    <div className="mb-10 p-8 bg-slate-50 rounded-3xl border-l-4 border-indigo-500 shadow-sm">
                                        <p className="text-xl text-slate-800 leading-relaxed font-medium">
                                            {content.story.sentences.map(s => s.has_blank ? s.english_sentence.replace('[blank]', s.target_word!) : s.english_sentence).join(" ")}
                                        </p>
                                    </div>

                                    <div className="p-8 bg-emerald-50 rounded-3xl border-l-4 border-emerald-500 shadow-sm">
                                        <p className="text-lg text-emerald-800 leading-relaxed italic">
                                            {content.story.sentences.map(s => s.full_translation || s.vietnamese_translation).join(" ")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bảng tổng hợp từ vựng Tarot (Chỉ hiện khi ko có truyện) */}
                        {!content.story && (
                            <div className="bg-white rounded-[2rem] p-10 shadow-2xl border border-slate-100 mb-12 text-center">
                                <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                                <h2 className="text-3xl font-serif text-slate-800 mb-4">{content.tarot.target_word}</h2>
                                <p className="text-xl text-slate-600 italic mb-6">({content.tarot.word_meaning})</p>
                                <p className="text-lg text-slate-800 font-medium">{content.tarot.english_sentence.replace('[blank]', content.tarot.target_word)}</p>
                                <p className="text-md text-slate-500 mt-2">{content.tarot.vietnamese_translation}</p>
                            </div>
                        )}

                        {/* Nút Chốt Đơn Độc Nhất */}
                        <div className="flex justify-center max-w-lg mx-auto">
                            <button
                                disabled={submitting}
                                onClick={submitCompletion}
                                className="w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
                            >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Lưu thành tích & Về trang chủ</>}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}