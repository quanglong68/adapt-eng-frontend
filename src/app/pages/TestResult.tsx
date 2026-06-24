import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Bot, ChevronRight, BarChart2, AlertTriangle, CheckCircle2, Eye } from "lucide-react";
import confetti from "canvas-confetti";
import { useLocation, useNavigate } from "react-router-dom";

import { CircularProgress } from "../components/shared";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "../components/ui/alert-dialog";
import { testService } from "../services/test.service";
import { TestSubmissionResponse } from "../types/test.type";
import { Level } from "../types/common.type";

export function TestResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const fired = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const testResult = location.state?.dataResult as TestSubmissionResponse;
  const originalQuestions = location.state?.originalQuestions;

  useEffect(() => {
    if (!testResult || fired.current) return;
    fired.current = true;
    const end = Date.now() + 2500;
    const colors = ["#4F46E5", "#10B981", "#F43F5E", "#F59E0B", "#A855F7"];
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [testResult]);

  // Hàm xử lý chung khi người dùng bấm nút Chọn Level
  const handleSetLevel = async (selectedLevel: Level) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await testService.setLevel(selectedLevel);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi lưu cấp độ, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!testResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-xl font-bold text-slate-700 mb-4">Không tìm thấy kết quả làm bài!</h2>
        <button onClick={() => navigate("/")} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-8" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ delay: 0.5, duration: 0.6 }} className="text-5xl mb-4">
            🎉
          </motion.div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1E293B" }}>Bài test hoàn thành!</h1>
          <p className="text-sm" style={{ color: "#64748B" }}>AI đã phân tích xong kết quả của bạn</p>
        </motion.div>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-3xl p-8 mb-6 text-center"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: "1px solid #F1F5F9" }}
        >
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <CircularProgress value={testResult.correctAnswers} max={testResult.totalQuestions} variant="test" />

              <div className="mt-4">
                <div className="font-bold text-base mb-1" style={{ color: "#1E293B" }}>
                  Tổng điểm: {testResult.scorePercentage.toFixed(1)}%
                </div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: testResult.passedThreshold ? "#D1FAE5" : "#FEF2F2",
                    color: testResult.passedThreshold ? "#059669" : "#EF4444"
                  }}
                >
                  {testResult.passedThreshold ? (
                    <><CheckCircle2 className="w-3 h-3" /> Đạt yêu cầu</>
                  ) : (
                    <><AlertTriangle className="w-3 h-3" /> Cần cải thiện</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="rounded-3xl p-6 mb-6"
          style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)", border: "1px solid #BFDBFE" }}
        >
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)" }}
            >
              <Bot className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <div className="font-bold text-sm mb-2" style={{ color: "#1E40AF" }}>
                Nhận xét từ AI AdaptEng 🤖
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#1E40AF" }}>
                {testResult.systemMessage}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Breakdown stats cơ bản */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl p-4 text-center" style={{ border: "1px solid #F1F5F9" }}>
            <div className="text-2xl mb-1">✅</div>
            <div className="font-bold text-base" style={{ color: "#1E293B" }}>{testResult.correctAnswers}</div>
            <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>Câu đúng</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center" style={{ border: "1px solid #F1F5F9" }}>
            <div className="text-2xl mb-1">❌</div>
            <div className="font-bold text-base" style={{ color: "#1E293B" }}>{testResult.totalQuestions - testResult.correctAnswers}</div>
            <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>Câu sai</div>
          </div>
        </motion.div>

        {/* ── CÁC NÚT ĐIỀU HƯỚNG TÁC VỤ ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="flex flex-col gap-3">

          {/* Nút 1: Xem lại bài làm */}
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            // Chuyển trang và đính kèm luôn mảng reviewList sang trang đó
            onClick={() => navigate("/test-review-mistakes", {
              state: {
                dataResult: testResult,
                originalQuestions: originalQuestions
              }
            })}
            className="w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all mb-2"
            style={{ background: "#EEF2FF", border: "1px solid #C7D2FE", color: "#4F46E5" }}
          >
            <Eye className="w-4 h-4" />
            Xem lại chi tiết bài làm
          </motion.button>

          {/* Nút 2: Đồng ý học theo AI gợi ý */}
          <motion.button
            whileHover={{ scale: 1.015, boxShadow: "0 10px 32px rgba(79,70,229,0.4)" }} whileTap={{ scale: 0.98 }}
            onClick={() => handleSetLevel(testResult.recommendedLevel)}
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 6px 20px rgba(79,70,229,0.35)", opacity: isSubmitting ? 0.7 : 1 }}
          >
            Đồng ý, bắt đầu học {testResult.recommendedLevel}
            <ChevronRight className="w-4 h-4" />
          </motion.button>

          {/* Nút 3: Cố chấp giữ nguyên mục tiêu ban đầu */}
          {testResult.testedLevel !== "A1" && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSetLevel(testResult.testedLevel)}
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{ background: "transparent", border: "2px solid #E5E7EB", color: "#64748B", opacity: isSubmitting ? 0.7 : 1 }}
            >
              <BarChart2 className="w-4 h-4" />
              Không, tôi vẫn muốn học mức {testResult.testedLevel}
            </motion.button>
          )}

        </motion.div>
      </div>
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="rounded-3xl p-6 bg-white border border-slate-100 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              🎉 Thiết lập thành công!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500">
              Mục tiêu học tập của bạn đã được cập nhật thành công. Hãy bắt đầu hành trình chinh phục ngay thôi!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-md shadow-indigo-200"
            >
              Đi tới Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>

  );
}