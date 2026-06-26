import { ReactNode, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Crown, Sparkles } from "lucide-react";

interface PremiumGuardProps {
  isPremium: boolean;
  children: ReactNode;
}

export function PremiumGuard({ isPremium, children }: PremiumGuardProps) {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCapture = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Nếu đã có VIP -> Cho đi qua bình thường
      if (isPremium) {
        return;
      }

      // Kiểm tra xem user có đang click vào các phần tử tương tác (button, link...) không
      const target = event.target as HTMLElement;
      const interactive = target.closest("button, a, [role='button'], input[type='button'], input[type='submit']");

      if (!interactive) {
        return;
      }

      // Nếu KHÔNG có VIP -> Chặn sự kiện click và bật Popup
      event.preventDefault();
      event.stopPropagation();
      setDialogOpen(true);
    },
    [isPremium]
  );

  return (
    <>
      <div onClickCapture={handleCapture} className="contents">
        {children}
      </div>

      <AnimatePresence>
        {dialogOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Lớp nền đen mờ đằng sau */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDialogOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Khung Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center overflow-hidden"
            >
              {/* Hiệu ứng trang trí góc */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-60 pointer-events-none" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-200"
                  style={{ background: "linear-gradient(135deg, #F59E0B, #EA580C)" }}>
                  <Crown className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Tính năng VIP</h2>
                <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                  Trải nghiệm học tập thông minh và giải trí chữa lành với công nghệ AI độc quyền. Vui lòng nâng cấp gói VIP để mở khóa!
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDialogOpen(false)}
                    className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Để sau
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setDialogOpen(false);
                      navigate("/pricing");
                    }}
                    className="flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-amber-200 transition-colors flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #F59E0B, #EA580C)" }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Nâng cấp
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}