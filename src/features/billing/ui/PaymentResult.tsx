import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Loader2, Receipt, ArrowLeft } from "lucide-react";
import { Button } from "../../../shared/ui/button";
import { paymentService } from "../../../entities/billing/payment.service";

export function PaymentResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Đang xác thực giao dịch với ngân hàng...");

  const transactionCode = searchParams.get("vnp_TxnRef");

  useEffect(() => {
    const verifyWithBackend = async () => {
      // Biến đống query trên URL thành Object
      const params = Object.fromEntries(searchParams.entries());

      // Nếu người dùng tự gõ link bậy bạ không có mã giao dịch
      if (!params.vnp_TxnRef || !params.vnp_SecureHash) {
        setStatus("error");
        setMessage("Đường dẫn không hợp lệ.");
        return;
      }

      try {
        // Gửi toàn bộ dữ liệu về Backend để tự nó kiểm tra chữ ký
        const result = await paymentService.verifyPayment(params);
        if (result.success) {
          setStatus("success");
          setMessage(result.message);
        } else {
          setStatus("error");
          setMessage(result.message);
        }
      } catch (error) {
        setStatus("error");
        setMessage("Lỗi kết nối đến máy chủ. Vui lòng kiểm tra lại lịch sử giao dịch.");
      }
    };

    verifyWithBackend();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-md w-full bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-300 hover:scale-[1.01]"
      >
        {/* Status header */}
        <div className="p-8 pb-6 text-center space-y-4">
          <div className="flex justify-center">
            {status === "loading" && (
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="w-16 h-16 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            )}
            {status === "error" && (
              <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>

          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                status === "loading"
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : status === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              {status === "loading" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {status === "success" && <CheckCircle2 className="w-3.5 h-3.5" />}
              {status === "error" && <XCircle className="w-3.5 h-3.5" />}
              {status === "loading" ? "Đang xử lý" : status === "success" ? "Thành công" : "Thất bại"}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            {status === "loading" && "Đang xử lý..."}
            {status === "success" && "Thanh toán thành công"}
            {status === "error" && "Thanh toán thất bại"}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
        </div>

        {/* Flat detail list */}
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {transactionCode && status !== "loading" && (
            <div className="flex items-center justify-between gap-3 px-8 py-4">
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                <Receipt className="w-4 h-4" />
                Mã giao dịch
              </span>
              <span className="font-mono font-semibold text-sm text-slate-900 truncate">{transactionCode}</span>
            </div>
          )}
          <div className="px-8 py-6">
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
              onClick={() => navigate("/profile")}
              disabled={status === "loading"}
            >
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Quay lại Hồ sơ
              </span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
