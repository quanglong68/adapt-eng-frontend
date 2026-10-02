import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Crown, Loader2, Check, ArrowLeft, Zap, AlertTriangle, ShieldCheck } from "lucide-react";
import { MOCK_PACKAGES, paymentService } from "../../../entities/billing/payment.service";

export function Pricing() {
  const navigate = useNavigate();
  const [loadingPackageId, setLoadingPackageId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // States cho Modal cảnh báo cộng dồn VIP
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingPaymentUrl, setPendingPaymentUrl] = useState<string | null>(null);
  const [warningText, setWarningText] = useState("");

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  // Fix lỗi BFCache (Trắng màn hình khi ấn Back trên trình duyệt)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setLoadingPackageId(null);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handlePay = async (packageId: number) => {
    setLoadingPackageId(packageId);
    setError(null);
    try {
      // Hứng ĐẦY ĐỦ các trường từ Backend trả về
      const { vnpayUrl, hasActiveVip, warningMessage } = await paymentService.createPaymentUrl({ packageId });

      // Nếu có VIP và có câu cảnh báo -> Bật Modal
      if (hasActiveVip && warningMessage) {
        setWarningText(warningMessage);
        setPendingPaymentUrl(vnpayUrl);
        setShowWarningModal(true);
        setLoadingPackageId(null);
      } else {
        // Nếu không có VIP -> Chuyển thẳng sang VNPAY
        window.location.href = vnpayUrl;
      }
    } catch (err) {
      console.error("Payment URL creation failed:", err);
      setError("Không thể tạo liên kết thanh toán. Vui lòng thử lại.");
      setLoadingPackageId(null);
    }
  };

  const handleConfirmPayment = () => {
    if (pendingPaymentUrl) {
      window.location.href = pendingPaymentUrl;
      // Ẩn modal sau khi chuyển trang
      setTimeout(() => {
        setShowWarningModal(false);
        setPendingPaymentUrl(null);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 relative">
      {/* HERO strip full-width + mesh glow */}
      <div className="w-full bg-slate-50 relative overflow-hidden border-b border-slate-200/60">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -top-16 right-0 w-96 h-96 bg-violet-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-10 relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="flex items-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200/60 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <span className="text-sm font-semibold text-slate-500">Quay lại Dashboard</span>
          </motion.div>
          <div className="text-center space-y-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200"
          >
            <Crown className="w-4 h-4" />
            AdaptEng VIP
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600"
          >
            Mở khóa sức mạnh AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg max-w-xl mx-auto"
          >
            Học tập hiệu quả hơn gấp 3 lần với thuật toán Spaced Repetition và công nghệ sinh đề tự động không giới hạn.
          </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 border-t border-slate-200/60">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl text-center font-medium bg-red-50 text-red-600 border border-red-200 flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Pricing columns — phẳng, phân tách bằng divider */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200/60 overflow-hidden grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200/60"
        >
          {MOCK_PACKAGES.map((pkg, index) => {
            const isPopular = pkg.id === 2; // Gói 6 tháng

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`relative p-8 flex flex-col transition-all duration-300 ${
                  isPopular
                    ? "bg-indigo-50/50 ring-1 ring-inset ring-indigo-200"
                    : "bg-white hover:bg-slate-50/60"
                }`}
              >
                {isPopular && (
                  <div className="inline-flex w-fit items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md mb-4">
                    <Zap className="w-3.5 h-3.5" /> PHỔ BIẾN NHẤT
                  </div>
                )}

                <h3 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                <p className="text-sm text-slate-500 min-h-[40px] mb-6">{pkg.description}</p>

                <div className="mb-8">
                  <span className={`text-4xl font-extrabold tracking-tight ${isPopular ? "text-indigo-600" : "text-slate-900"}`}>
                    {formatPrice(pkg.price)}
                  </span>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    `${pkg.durationDays} ngày truy cập VIP`,
                    "Lưu từ AI (SM-2)",
                    "Ôn tập thông minh Spaced Repetition",
                    "Sinh đề thi không giới hạn"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                      <div className="mt-0.5 rounded-full p-0.5 bg-green-100 shrink-0">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loadingPackageId !== null}
                  onClick={() => handlePay(pkg.id)}
                  className={`mt-auto w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center transition-all duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:pointer-events-none ${
                    isPopular
                      ? "text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
                      : "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:scale-[1.02]"
                  }`}
                >
                  {loadingPackageId === pkg.id ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Thanh toán qua VNPAY"
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Reassurance row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500"
        >
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            Thanh toán bảo mật qua VNPAY
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-indigo-600" />
            Kích hoạt VIP tức thì
          </span>
        </motion.div>
      </div>

      {/* Modal Cảnh báo Nâng cấp (Hiển thị đè lên trên cùng) */}
      <AnimatePresence>
        {showWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWarningModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl border border-slate-200/60 p-8 max-w-md w-full"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-center text-slate-900 mb-3">Xác nhận gia hạn</h2>
              <p className="text-slate-500 text-center mb-8 leading-relaxed">
                {warningText}
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowWarningModal(false)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Hủy bỏ
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmPayment}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  Đồng ý thanh toán
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
