import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"; // THÊM useSearchParams

import { SplitScreenLayout } from "../components/layouts";
import { ToeicOptionButton, renderPassageContent } from "../components/shared";
import { toeicService } from "../services/toeic.service";
import { Level } from "../types/common.type";
import { ToeicPassageResponse, SubmitToeicTestRequest } from "../types/toeic.type";

export function ToeicTestExecution() {
  const { level } = useParams<{ level: Level }>();
  const navigate = useNavigate();

  // ĐỌC CHẾ ĐỘ THI TỪ URL
  const [searchParams] = useSearchParams();
  const isLevelUpMode = searchParams.get("mode") === "level-up";

  const [blocks, setBlocks] = useState<ToeicPassageResponse[]>([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showExit, setShowExit] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await toeicService.generateTest(level!);
        setBlocks(data);
      } catch (error) {
        console.error("Lỗi lấy đề thi TOEIC:", error);
        alert("Lỗi khi tạo đề thi, vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTest();
  }, [level]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Đang chuẩn bị đề thi TOEIC {level}...</h2>
        <p className="text-slate-500 text-sm mt-2">Đang phân tích cấu trúc 50 câu...</p>
      </div>
    );
  }

  if (!blocks || blocks.length === 0) return null;

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

      const submitData: SubmitToeicTestRequest = {
        testedLevel: level!,
        answers: formattedAnswers,
      };

      // RẼ NHÁNH GỌI API DỰA VÀO MODE
      const result = isLevelUpMode
        ? await toeicService.submitLevelUpTest(submitData)
        : await toeicService.submitTest(submitData);

      // Ném dữ liệu và cờ mode sang trang Result
      navigate("/toeic/test-result", {
        state: {
          dataResult: result,
          originalBlocks: blocks,
          mode: isLevelUpMode ? "level-up" : "normal"
        },
      });
    } catch (error) {
      console.error(error);
      alert("Lỗi nộp bài!");
      setIsSubmitting(false);
    }
  };

  return (
    <SplitScreenLayout
      theme="indigo"
      title={
        <>
          {isLevelUpMode ? "Bài thi Thăng cấp" : "Bài Test đánh giá"} <span className="text-indigo-600">TOEIC {level}</span>
        </>
      }
      progress={progress}
      answeredCount={answeredCount}
      totalQuestions={totalQuestions}
      onHeaderSubmit={handleRequestSubmit}
      isSubmitting={isSubmitting}
      isPart5={isPart5}
      partLabel={currentBlock.toeicPart.replace("_", " ")}
      passageContent={renderPassageContent(currentBlock.passageContent || "", "indigo")}
      questionsContent={
        <div className="space-y-12">
          {currentBlock.questions.map((q, idx) => (
            <div key={q.questionId} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-[15px] font-semibold text-slate-800 mb-5 flex gap-3 leading-relaxed">
                <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full text-xs">
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
                    theme="indigo"
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
      submittingLabel="Đang chấm điểm..."
      prevBlockLabel="Trang trước"
      nextBlockLabel="Khối tiếp theo"
      showExit={showExit}
      onShowExit={() => setShowExit(true)}
      onExitCancel={() => setShowExit(false)}
      onExitConfirm={() => navigate(isLevelUpMode ? "/dashboard" : "/select-level")}
      exitTitle="Thoát bài thi?"
      exitMessage="Bài làm của bạn sẽ không được lưu lại. Bạn có chắc chắn muốn thoát?"
      exitCancelLabel="Tiếp tục thi"
      exitConfirmLabel="Thoát luôn"
      showSubmitConfirm={showSubmitConfirm}
      onSubmitConfirmCancel={() => setShowSubmitConfirm(false)}
      onSubmitConfirmConfirm={executeSubmit}
      submitConfirmMessage={
        <>
          Bạn mới hoàn thành{" "}
          <strong className="text-indigo-600">
            {answeredCount}/{totalQuestions}
          </strong>{" "}
          câu hỏi. Những câu chưa chọn sẽ bị tính là <strong>Sai</strong>. Bạn có chắc chắn muốn nộp
          bài lúc này?
        </>
      }
    />
  );
}