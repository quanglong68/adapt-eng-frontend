import { motion } from "motion/react";
import { Brain, CheckCircle2, Loader2, Play, Sparkles, X } from "lucide-react";
import { DeepDiveRecommendation } from "../../../../entities/deepdive/deepDive.type";
import { KnowledgeBadge } from "./KnowledgeBadge";

type DeepDiveStatus = 'IDLE' | 'GENERATING' | 'READY';

interface DeepDiveModalProps {
  item: DeepDiveRecommendation;
  status?: { status: DeepDiveStatus; sessionId?: string };
  onClose: () => void;
  onConfirm: () => void;
  onStartSession: (sessionId: string) => void;
}

export function DeepDiveModal({ item, status, onClose, onConfirm, onStartSession }: DeepDiveModalProps) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-md shadow-xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 transition" aria-label="Đóng">
          <X className="w-5 h-5" />
        </button>

        {status?.status === 'GENERATING' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-2">AI đang thiết kế đề thi...</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Quá trình này mất khoảng <strong>10 - 15 giây</strong>. Bạn có thể giữ nguyên màn hình này hoặc đóng lại, hệ thống sẽ tiếp tục chạy ngầm.
            </p>
            <button onClick={onClose} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition">
              Ẩn chạy ngầm
            </button>
          </div>
        ) : status?.status === 'READY' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-2">Đề thi đã sẵn sàng!</h3>
            <p className="text-sm text-slate-500 mb-6">Đề thi chuyên biệt 10 câu dành riêng cho bạn đã được tạo thành công.</p>
            <button
              onClick={() => status.sessionId && onStartSession(status.sessionId)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <Play className="w-4 h-4" /> Làm bài ngay
            </button>
          </div>
        ) : (
          <div className="py-2">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-2">Khởi động AI Chuyên Sâu</h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Hệ thống AI sẽ phân tích và tạo bộ đề độc quyền dựa trên điểm yếu:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 font-semibold text-sm text-slate-800">
              <KnowledgeBadge item={item} />
            </div>
            <button onClick={onConfirm} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition">
              <Sparkles className="w-4 h-4" /> Xác nhận tạo đề
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
