import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Crown, Loader2, Check, ArrowLeft, Zap, AlertTriangle } from "lucide-react";
import { MOCK_PACKAGES, paymentService } from "../services/payment.service";

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
    <div className="min-h-screen pb-12" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b px-8 py-4 flex items-center sticky top-0 z-10" style={{ borderColor: "#E5E7EB" }}>
        <motion.button
          whileHover={{ scale: 1.05, background: "#F1F5F9" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard")}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 mr-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <span className="text-lg font-bold" style={{ color: "#1E293B" }}>Nâng cấp tài khoản</span>
      </div>

      <div className="max-w-4xl mx-auto mt-12 px-6 space-y-10">

        {/* Title Section */}
        <div className="text-center space-y-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-md" style={{ background: "linear-gradient(135deg, #F59E0B, #EA580C)" }}>
            <Crown className="w-4 h-4" />
            AdaptEng VIP
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-extrabold tracking-tight" style={{ color: "#1E293B" }}>
            Mở khóa sức mạnh AI
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-500 text-lg max-w-xl mx-auto">
            Học tập hiệu quả hơn gấp 3 lần với thuật toán Spaced Repetition và công nghệ sinh đề tự động không giới hạn.
          </motion.p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl text-center font-medium bg-red-50 text-red-600 border border-red-200">
            {error}
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto">
          {MOCK_PACKAGES.map((pkg, index) => {
            const isPopular = pkg.id === 2; // Gói 6 tháng

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`relative bg-white rounded-3xl p-8 ${isPopular ? 'border-2' : 'border'}`}
                style={{
                  borderColor: isPopular ? "#4F46E5" : "#E5E7EB",
                  boxShadow: isPopular ? "0 20px 40px rgba(79,70,229,0.15)" : "0 4px 20px rgba(0,0,0,0.03)",
                  transform: isPopular ? "scale(1.05)" : "scale(1)"
                }}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-md flex items-center gap-1" style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                    <Zap className="w-3.5 h-3.5" /> PHỔ BIẾN NHẤT
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2" style={{ color: "#1E293B" }}>{pkg.name}</h3>
                <p className="text-sm text-gray-500 min-h-[40px] mb-6">{pkg.description}</p>

                <div className="mb-8">
                  <span className="text-4xl font-extrabold" style={{ color: isPopular ? "#4F46E5" : "#1E293B" }}>
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
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                      <div className="mt-0.5 rounded-full p-0.5" style={{ background: "#DCFCE7" }}>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: isPopular ? "0 8px 20px rgba(79,70,229,0.25)" : "" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loadingPackageId !== null}
                  onClick={() => handlePay(pkg.id)}
                  className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center transition-colors ${isPopular
                    ? "text-white"
                    : "text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                    }`}
                  style={{ background: isPopular ? "linear-gradient(135deg, #4F46E5, #7C3AED)" : "" }}
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
        </div>
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
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-3">Xác nhận gia hạn</h2>
              <p className="text-slate-600 text-center mb-8 leading-relaxed">
                {warningText}
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowWarningModal(false)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Hủy bỏ
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmPayment}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-amber-200 transition-colors"
                  style={{ background: "linear-gradient(135deg, #F59E0B, #EA580C)" }}
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