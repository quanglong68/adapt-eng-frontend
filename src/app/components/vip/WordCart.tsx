import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookmarkCheck, X, Loader2, AlertCircle, BookmarkPlus } from "lucide-react";
import { toast } from "react-hot-toast";
import { vipService } from "../../services/vip.service";
import { VipSavedWord, VipSaveWordResponse } from "../../types/vip.type";

interface WordCartProps {
  selectedText?: string;
  selectionPosition?: { x: number; y: number } | null;
}

export function WordCart({ selectedText, selectionPosition }: WordCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [words, setWords] = useState<VipSavedWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const cartRef = useRef<HTMLDivElement>(null);

  // Fetch pending words
  const fetchWords = async () => {
    try {
      const data = await vipService.getPendingWords();
      setWords(data);
    } catch (err) {
      console.error("Failed to fetch pending words:", err);
    }
  };

  useEffect(() => {
    if (isOpen) fetchWords();
  }, [isOpen]);

  // Show tooltip when text is selected
  useEffect(() => {
    if (selectedText && selectionPosition) {
      setTooltipVisible(true);
      setTooltipPos({
        x: selectionPosition.x,
        // Đẩy tooltip lên cao 45px so với con trỏ chuột để không che chữ
        y: selectionPosition.y - 45,
      });
    } else {
      setTooltipVisible(false);
    }
  }, [selectedText, selectionPosition]);

  // Handle save word from selection
  const handleSaveSelection = async () => {
    if (!selectedText) return;
    setTooltipVisible(false);

    const result = await toast.promise(
      vipService.saveWord(selectedText.trim()),
      {
        loading: "Đang lưu từ...",
        success: (res: VipSaveWordResponse) => {
          if (!res.success) {
            throw new Error(res.message);
          }
          fetchWords();
          return res.message;
        },
        // MÓC SÂU VÀO LỖI 403 CỦA BACKEND ĐỂ LẤY CÂU CHỮ XỊN
        error: (err: any) => {
          return err.response?.data?.message || err.message || "Không thể lưu từ.";
        },
      }
    );
  };

  // Handle remove word
  const handleRemoveWord = async (word: string) => {
    try {
      await vipService.removeWord(word);
      setWords(prev => prev.filter(w => w.word !== word));
      toast.success(`Đã xóa "${word}" khỏi giỏ từ.`);
    } catch (err) {
      toast.error("Không thể xóa từ.");
    }
  };

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        if (!(e.target as HTMLElement).closest('.word-cart-tooltip')) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Selection Tooltip */}
      <AnimatePresence>
        {tooltipVisible && selectedText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="fixed z-[9999] word-cart-tooltip"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <div className="px-3 py-2 rounded-xl text-xs font-semibold text-white shadow-lg flex items-center gap-1.5 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
              onClick={handleSaveSelection}
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              Lưu từ VIP
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Word Cart Bubble */}
      <div className="fixed bottom-6 right-6 z-50" ref={cartRef}>
        {/* Bubble button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl relative"
          style={{
            background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
            boxShadow: "0 8px 32px rgba(79,70,229,0.4)",
          }}
        >
          <BookmarkCheck className="w-6 h-6 text-white" />
          {words.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {words.length}
            </span>
          )}
        </motion.button>

        {/* Dropdown panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 w-72 bg-white rounded-3xl overflow-hidden shadow-2xl"
              style={{ border: "1px solid #E5E7EB" }}
            >
              <div className="p-4 border-b" style={{ borderColor: "#F1F5F9", background: "#F8FAFC" }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold" style={{ color: "#1E293B" }}>Giỏ từ VIP</h3>
                  <span className="text-xs font-medium text-gray-400">{words.length}/10 từ</span>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto p-2">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#4F46E5" }} />
                  </div>
                ) : words.length === 0 ? (
                  <div className="text-center py-8">
                    <BookmarkCheck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs text-gray-400">Bôi đen từ vựng để lưu vào giỏ từ</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {words.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 group"
                      >
                        <span className="text-sm font-medium text-gray-700">{item.word}</span>
                        <motion.button
                          whileHover={{ scale: 1.2, background: "#FEE2E2" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveWord(item.word)}
                          className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5 text-red-400" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Warning if limit reached */}
              {words.length >= 10 && (
                <div className="px-4 py-3 border-t flex items-start gap-2" style={{ borderColor: "#F1F5F9", background: "#FFFBEB" }}>
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">Đã đạt giới hạn 10 từ. Hãy chờ xử lý vào 2h sáng mai.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}