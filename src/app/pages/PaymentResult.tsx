import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { paymentService } from "../services/payment.service";

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
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />}
            {status === "success" && <CheckCircle2 className="w-16 h-16 text-green-500" />}
            {status === "error" && <XCircle className="w-16 h-16 text-red-500" />}
          </div>
          <CardTitle style={{ color: "#1E293B" }}>
            {status === "loading" && "Đang xử lý..."}
            {status === "success" && "Payment Successful"}
            {status === "error" && "Payment Failed"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactionCode && status !== "loading" && (
            <p className="text-sm text-center text-gray-500">
              Mã giao dịch: <span className="font-mono font-semibold">{transactionCode}</span>
            </p>
          )}
          <Button
            className="w-full"
            style={{ background: "#4F46E5" }}
            onClick={() => navigate("/profile")}
            disabled={status === "loading"}
          >
            Quay lại Hồ sơ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}