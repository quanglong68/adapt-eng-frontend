import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { SplitScreenLayout } from "../components/layouts";
import { ToeicOptionButton, renderPassageContent } from "../components/shared";
import { toeicService } from "../services/toeic.service";
import { ToeicPassageResponse, SubmitToeicPracticeRequest } from "../types/toeic.type";
import { WordCart } from "../components/vip/WordCart";

export function ToeicPracticeExecution() {
  const navigate = useNavigate();

  const [blocks, setBlocks] = useState<ToeicPassageResponse[]>([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showExit, setShowExit] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State cho sự kiện bôi đen từ vựng
  const [selectedText, setSelectedText] = useState("");
  const [selectionPos, setSelectionPos] = useState<{ x: number, y: number } | null>(null);

  // Bắt sự kiện thả chuột và "dọn dẹp" đoạn text bôi đen
  const handleMouseUp = () => {
    const selection = window.getSelection();
    let text = selection?.toString().trim();

    if (!text) {
      setSelectedText("");
      return;
    }

    // Tự động gọt bỏ dấu câu ở 2 đầu (VD: "apple," -> "apple")
    text = text.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');

    // Lọc 1: Chỉ chấp nhận chữ, số, khoảng trắng, gạch nối, nháy đơn
    const isValidCharacters = /^[a-zA-Z0-9\s\-']+$/.test(text);
    // Lọc 2: Tối đa 3 từ
    const wordCount = text.split(/\s+/).length;
    // Lọc 3: Độ dài 2 - 30 ký tự
    const isValidLength = text.length >= 2 && text.length <= 30;

    if (isValidCharacters && isValidLength && wordCount <= 3) {
      const range = selection?.getRangeAt(0).getBoundingClientRect();
      if (range && range.width > 0) {
        setSelectedText(text); // Truyền từ đã được làm sạch
        setSelectionPos({ x: range.left + (range.width / 2) - 50, y: range.top });
      }
    } else {
      setSelectedText(""); // Nếu kéo rác quá nhiều thì ẩn Tooltip luôn
    }
  };

  useEffect(() => {
    const fetchPractice = async () => {
      try {
        const data = await toeicService.getDailyPractice();
        setBlocks(data);
      } catch (error) {
        console.error("Lỗi lấy bài ôn tập TOEIC:", error);
        alert("Lỗi khi tải bài ôn tập, vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPractice();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Đang chuẩn bị phiên ôn tập...</h2>
        <p className="text-slate-500 text-sm mt-2">Hệ thống đang tải dữ liệu Spaced Repetition</p>
      </div>
    );
  }

  if (!blocks || blocks.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md w-full border border-slate-100">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Tuyệt vời!</h2>
          <p className="text-slate-500 mb-6">
            Bạn đã hoàn thành tất cả mục tiêu ôn tập của ngày hôm nay. Hãy quay lại vào ngày mai nhé!
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = blocks.reduce((sum, block) => sum + block.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const currentBlock = blocks[currentBlockIndex];
  const isPart5 = currentBlock.toeicPart === "PART_5";

  const handleSelectAnswer = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleRequestSubmit = () => {
    if (answeredCount < totalQuestions) {
      setShowSubmitConfirm(true);
    } else {
      executeSubmit();
    }
  };

  const executeSubmit = async () => {
    setIsSubmitting(true);
    setShowSubmitConfirm(false);
    try {
      const allOriginalQuestions = blocks.flatMap((b) => b.questions);
      const formattedAnswers = allOriginalQuestions.map((q) => ({
        questionId: q.questionId,
        selectedAnswer: answers[q.questionId] || "",
      }));

      const submitData: SubmitToeicPracticeRequest = {
        answers: formattedAnswers,
      };

      const result = await toeicService.submitDailyPractice(submitData);

      navigate("/toeic/practice-result", {
        state: { dataResult: result, originalBlocks: blocks },
      });
    } catch (error) {
      console.error(error);
      alert("Lỗi nộp bài ôn tập!");
      setIsSubmitting(false);
    }
  };

  return (
    <div onMouseUp={handleMouseUp} className="w-full h-full relative">
      <SplitScreenLayout
        theme="emerald"
        title={
          <>
            Ôn tập <span className="text-emerald-600">Hàng ngày</span>
          </>
        }
        progress={progress}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        onHeaderSubmit={handleRequestSubmit}
        isSubmitting={isSubmitting}
        isPart5={isPart5}
        partLabel={currentBlock.toeicPart.replace("_", " ")}
        passageContent={renderPassageContent(currentBlock.passageContent || "", "emerald")}
        questionsContent={
          <div className="space-y-12">
            {currentBlock.questions.map((q, idx) => (
              <div key={q.questionId} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-[15px] font-semibold text-slate-800 mb-5 flex gap-3 leading-relaxed">
                  <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-emerald-100 text-emerald-700 rounded-full text-xs">
                    {idx + 1}
                  </span>
                  {q.content.replace("_____", "_______")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-10">
                  {q.options.map((opt, optIdx) => (
                    <ToeicOptionButton
                      key={optIdx}
                      optionText={opt}
                      index={optIdx}
                      isSelected={answers[q.questionId] === opt}
                      onSelect={() => handleSelectAnswer(q.questionId, opt)}
                      theme="emerald"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        }
        currentBlockIndex={currentBlockIndex}
        totalBlocks={blocks.length}
        onPrevBlock={() => setCurrentBlockIndex((prev) => Math.max(0, prev - 1))}
        onNextBlock={() => setCurrentBlockIndex((prev) => Math.min(blocks.length - 1, prev + 1))}
        isLastBlock={currentBlockIndex === blocks.length - 1}
        onComplete={handleRequestSubmit}
        completeLabel="Hoàn thành"
        submittingLabel="Đang xử lý..."
        prevBlockLabel="Khối trước"
        nextBlockLabel="Khối tiếp theo"
        showExit={showExit}
        onShowExit={() => setShowExit(true)}
        onExitCancel={() => setShowExit(false)}
        onExitConfirm={() => navigate("/dashboard")}
        exitTitle="Dừng ôn tập?"
        exitMessage="Tiến độ ôn tập hằng ngày sẽ không được lưu nếu bạn thoát bây giờ."
        exitCancelLabel="Tiếp tục ôn"
        exitConfirmLabel="Thoát luôn"
        showSubmitConfirm={showSubmitConfirm}
        onSubmitConfirmCancel={() => setShowSubmitConfirm(false)}
        onSubmitConfirmConfirm={executeSubmit}
        submitConfirmMessage={
          <>
            Bạn mới hoàn thành{" "}
            <strong className="text-emerald-600">
              {answeredCount}/{totalQuestions}
            </strong>{" "}
            câu hỏi ôn tập. Những câu bỏ trống sẽ bị tính là <strong>Sai</strong> và bị lặp lại vào ngày
            mai. Nộp luôn chứ?
          </>
        }
      />

      <WordCart selectedText={selectedText} selectionPosition={selectionPos} />
    </div>
  );
}