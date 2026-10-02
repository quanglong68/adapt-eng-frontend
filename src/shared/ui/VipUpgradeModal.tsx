import { Crown, Clock } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

type VipModalType = "require_vip" | "max_limit" | null;

interface VipUpgradeModalProps {
  open: boolean;
  type: VipModalType;
  onClose: () => void;
}

export function VipUpgradeModal({ open, type, onClose }: VipUpgradeModalProps) {
  const navigate = useNavigate();

  if (!open || !type) return null;

  const isRequireVip = type === "require_vip";

  const handleGoVip = () => {
    onClose();
    navigate("/pricing");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
          {isRequireVip ? (
            <Crown className="w-8 h-8 text-amber-600" />
          ) : (
            <Clock className="w-8 h-8 text-amber-600" />
          )}
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-2">
          {isRequireVip ? "Cần nâng cấp VIP" : "Đã đạt giới hạn hôm nay"}
        </h2>

        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {isRequireVip
            ? "Bạn đã sử dụng 1 lượt luyện tập miễn phí hôm nay. Gói VIP cho phép luyện tập tối đa 3 đề/ngày cho Writing hỗn hợp."
            : "Bạn đã hoàn thành 3 đề Writing hỗn hợp hôm nay (giới hạn của gói VIP). Vui lòng quay lại vào ngày mai để tiếp tục luyện tập."}
        </p>

        <div className="flex flex-col gap-3">
          {isRequireVip && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGoVip}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Xem gói VIP
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full py-3.5 rounded-xl font-semibold text-slate-700 border border-slate-300 bg-white"
          >
            {isRequireVip ? "Để sau" : "Đóng"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
