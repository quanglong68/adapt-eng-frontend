import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, CheckCircle2, XCircle, AlertTriangle, ArrowLeft, RefreshCw, Timer, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paymentService } from "../../services/payment.service";
import { TransactionHistoryItem } from "../../types/payment.type";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  SUCCESS: { label: "Thành công", color: "#059669", bg: "#DCFCE7", icon: CheckCircle2 },
  FAILED: { label: "Thất bại", color: "#DC2626", bg: "#FEE2E2", icon: XCircle },
  CANCELED: { label: "Đã hủy", color: "#6B7280", bg: "#F3F4F6", icon: AlertTriangle },
  PENDING: { label: "Chờ thanh toán", color: "#D97706", bg: "#FEF3C7", icon: Timer },
};

function CountdownTimer({ createdAt }: { createdAt: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calcTimeLeft = () => {
      const created = new Date(createdAt).getTime();
      const now = Date.now();
      const diff = 15 * 60 * 1000 - (now - created);
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft("00:00");
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    };

    calcTimeLeft();
    const interval = setInterval(calcTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  if (expired) return <span className="text-xs text-gray-400">Đã hết hạn</span>;
  return (
    <span className="text-xs font-mono font-bold" style={{ color: "#D97706" }}>
      <Timer className="w-3 h-3 inline mr-1" />
      {timeLeft}
    </span>
  );
}

export function TransactionHistory() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<TransactionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getTransactionHistory();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transaction history:", err);
      setError("Không thể tải lịch sử giao dịch.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCancel = async (id: number) => {
    setCancelingId(id);
    try {
      await paymentService.cancelTransaction(id);
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'CANCELED' as const } : t));
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể hủy giao dịch.");
    } finally {
      setCancelingId(null);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const isWithin15Mins = (createdAt: string) => {
    const created = new Date(createdAt).getTime();
    return Date.now() - created < 15 * 60 * 1000;
  };

  return (
    <div className="min-h-screen" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b px-8 py-4 flex items-center sticky top-0 z-10" style={{ borderColor: "#E5E7EB" }}>
        <motion.button
          whileHover={{ scale: 1.05, background: "#F1F5F9" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 mr-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <span className="text-lg font-bold flex-1" style={{ color: "#1E293B" }}>Lịch sử giao dịch</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchHistory}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100"
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="max-w-3xl mx-auto mt-6 px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: "#4F46E5" }} />
            <p className="text-gray-500 font-medium">Đang tải lịch sử giao dịch...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-600 mb-2">Chưa có giao dịch nào</h3>
            <p className="text-sm text-gray-400">Hãy nâng cấp VIP để bắt đầu hành trình học tập.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((txn, index) => {
              const config = statusConfig[txn.status] || statusConfig.PENDING;
              const StatusIcon = config.icon;
              const canCancel = txn.status === 'PENDING' && isWithin15Mins(txn.createdAt);

              return (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-3xl p-6"
                  style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: config.bg }}>
                        <StatusIcon className="w-6 h-6" style={{ color: config.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color: "#1E293B" }}>{txn.packageName || "VIP"}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: config.bg, color: config.color }}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">{txn.transactionCode}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold" style={{ color: "#1E293B" }}>{formatPrice(txn.amount)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{formatDate(txn.createdAt)}</span>
                      {txn.status === 'PENDING' && <CountdownTimer createdAt={txn.createdAt} />}
                    </div>

                    <div className="flex items-center gap-2">
                      {txn.status === 'PENDING' && (
                        <>
                          {txn.vnpayUrl && (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => window.location.href = txn.vnpayUrl}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                              style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Thanh toán
                            </motion.button>
                          )}
                          {canCancel && (
                            <motion.button
                              whileHover={{ scale: 1.03, background: "#FEF2F2" }}
                              whileTap={{ scale: 0.97 }}
                              disabled={cancelingId === txn.id}
                              onClick={() => handleCancel(txn.id)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                              style={{ border: "1.5px solid #FCA5A5", color: "#DC2626" }}
                            >
                              {cancelingId === txn.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              Hủy đơn
                            </motion.button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}