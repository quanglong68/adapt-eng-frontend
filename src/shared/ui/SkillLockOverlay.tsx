import { Lock, Target } from "lucide-react";

interface SkillLockOverlayProps {
  skillLabel: string;
  actionLabel?: string;
  onAction: () => void;
}

/**
 * Màn hình khóa khi user chưa làm bài test của kỹ năng:
 * nền mờ + ổ khóa + nút đi làm bài test.
 * z-index cao hơn LevelGuardModal toàn cục để luôn nhìn thấy;
 * khi bấm sẽ đóng modal toàn cục rồi mới điều hướng.
 */
export function SkillLockOverlay({ skillLabel, actionLabel = "Làm bài Đánh giá ngay", onAction }: SkillLockOverlayProps) {
  const handleAction = () => {
    window.dispatchEvent(new CustomEvent("CLOSE_LEVEL_GUARD"));
    onAction();
  };
  return (
    <div className="fixed inset-0 z-[10000] bg-white/70 backdrop-blur-md flex flex-col items-center justify-center px-6">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl max-w-md w-full text-center px-8 py-10">
        <div className="w-14 h-14 flex items-center justify-center mx-auto mb-5 rounded-2xl bg-indigo-50 text-indigo-600">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">Tính năng bị khóa</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Để sử dụng các tính năng luyện tập, bạn cần hoàn thành bài Đánh giá Năng lực cho kỹ năng <strong>{skillLabel}</strong> trước.
        </p>
        <button
          onClick={handleAction}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          <Target className="w-4 h-4" /> {actionLabel}
        </button>
      </div>
    </div>
  );
}
