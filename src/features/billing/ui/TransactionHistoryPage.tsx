import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, CheckCircle2, XCircle, AlertTriangle, ArrowLeft, RefreshCw, Timer, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paymentService } from "../../../entities/billing/payment.service";
import { handleApiError } from "../../../shared/api/handleApiError";
import { TransactionHistoryItem } from "../../../entities/billing/payment.type";

const statusConfig: Record<string, { label: string; badgeClass: string; iconWrap: string; iconClass: string; icon: React.ElementType }> = {
  SUCCESS: {
    label: "Thành công",
    badgeClass: "bg-green-50 text-green-700 border-green-200",
    iconWrap: "bg-green-100",
    iconClass: "text-green-600",
    icon: CheckCircle2,
  },
  FAILED: {
    label: "Thất bại",
    badgeClass: "bg-red-50 text-red-600 border-red-200",
    iconWrap: "bg-red-100",
    iconClass: "text-red-600",
    icon: XCircle,
  },
  CANCELED: {
    label: "Đã hủy",
    badgeClass: "bg-slate-100 text-slate-500 border-slate-200",
    iconWrap: "bg-slate-100",
    iconClass: "text-slate-500",
    icon: AlertTriangle,
  },
  PENDING: {
    label: "Chờ thanh toán",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    iconWrap: "bg-amber-100",
    iconClass: "text-amber-600",
    icon: Timer,
  },
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

  if (expired) return <span className="text-xs text-slate-400">Đã hết hạn</span>;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-600">
      <Timer className="w-3 h-3" />
      {timeLeft}
    </span>
  );
}

export function TransactionHistoryPage() {
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
      handleApiError(err, "Không thể hủy giao dịch.");
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
    <div className="min-h-screen bg-slate-50 relative">
      {/* HERO strip full-width */}
      <div className="w-full bg-slate-50 relative overflow-hidden border-b border-slate-200/60">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -top-16 right-0 w-96 h-96 bg-violet-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-10 relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200/60 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 mb-2">
                <Clock className="w-3.5 h-3.5" />
                Billing
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Lịch sử giao dịch</h1>
              <p className="text-slate-500 text-sm mt-1.5">Theo dõi trạng thái thanh toán VNPAY, gia hạn và lịch sử gói VIP của bạn.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchHistory}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200/60 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all shrink-0"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-0 px-6 pb-12 py-8 border-t border-slate-200/60">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
            <p className="text-slate-500 font-medium">Đang tải lịch sử giao dịch...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center">
            <p className="text-red-600 font-medium inline-flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              {error}
            </p>
          </div>
        ) : transactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Chưa có giao dịch nào</h3>
            <p className="text-sm text-slate-500">Hãy nâng cấp VIP để bắt đầu hành trình học tập.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-slate-200/60 divide-y divide-slate-200/60 overflow-hidden"
          >
            {transactions.map((txn, index) => {
              const config = statusConfig[txn.status] || statusConfig.PENDING;
              const StatusIcon = config.icon;
              const canCancel = txn.status === 'PENDING' && isWithin15Mins(txn.createdAt);

              return (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
                  className="p-5 sm:p-6 hover:bg-slate-50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${config.iconWrap}`}>
                        <StatusIcon className={`w-6 h-6 ${config.iconClass}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">{txn.packageName || "VIP"}</span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badgeClass}`}>
                            <StatusIcon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono truncate">{txn.transactionCode}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-slate-900 whitespace-nowrap">{formatPrice(txn.amount)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{formatDate(txn.createdAt)}</span>
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
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 transition-all duration-300"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Thanh toán
                            </motion.button>
                          )}
                          {canCancel && (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              disabled={cancelingId === txn.id}
                              onClick={() => handleCancel(txn.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-600 border border-red-200 bg-white hover:bg-red-50 transition-all duration-300 disabled:opacity-60"
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
