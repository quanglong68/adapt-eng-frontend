import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LevelSelectTest } from "../features/auth/ui/LevelSelectTest";
import { TestExecution } from "../features/legacy/ui/TestExecution";
import { TestResult } from "../features/legacy/ui/TestResult";
import { TestReviewMistakes } from "../features/legacy/ui/TestReviewMistakes";
import { Dashboard } from "../features/progress/ui/Dashboard";
import { Login } from "../features/auth/ui/Login";
import { PracticeExecution } from "../features/legacy/ui/PracticeExecution";
import { PracticeResult } from "../features/legacy/ui/PracticeResult";
import { PracticeReviewMistakes } from "../features/legacy/ui/PracticeReviewMistakes";
import { KnowledgeMap } from "../features/progress/ui/KnowledgeMap";
import { TrackSelect } from "../features/auth/ui/TrackSelect";
import { SkillSelect } from "../features/auth/ui/SkillSelect"; // <-- IMPORT TRANG MỚI VÀO ĐÂY
import { ToeicTestExecution } from "../features/toeic-reading/ui/ToeicTestExecution";
import { ToeicTestResult } from "../features/toeic-reading/ui/ToeicTestResult";
import { ToeicTestReviewMistakes } from "../features/toeic-reading/ui/ToeicTestReviewMistakes";
import { ToeicPracticeExecution } from "../features/toeic-reading/ui/ToeicPracticeExecution";
import { ToeicPracticeResult } from "../features/toeic-reading/ui/ToeicPracticeResult";
import { ToeicPracticeReviewMistakes } from "../features/toeic-reading/ui/ToeicPracticeReviewMistakes";
import { UserProfile } from "../features/progress/ui/UserProfile";
import { Pricing } from "../features/billing/ui/Pricing";
import { PaymentResult } from "../features/billing/ui/PaymentResult";
import { VipEntertainment } from "../features/premium/ui/VipEntertainment";
import { TransactionHistoryPage } from "../features/billing/ui/TransactionHistoryPage";
import { Toaster } from "react-hot-toast";
import { ToeicPracticeHistory } from "../features/toeic-reading/ui/ToeicPracticeHistory";
import { LevelGuardModal } from "../shared/ui/LevelGuardModal";
import { DeepDiveTestPage } from "../features/premium/ui/DeepDiveTestPage";


import { WritingTestExecution } from "../features/toeic-writing/ui/WritingTestExecution";
import { WritingTestResult } from "../features/toeic-writing/ui/WritingTestResult";
import { WritingTestReviewMistakes } from "../features/toeic-writing/ui/WritingTestReviewMistakes";
import { WritingPracticeExecution } from "../features/toeic-writing/ui/WritingPracticeExecution";
import { WritingPracticeResult } from "../features/toeic-writing/ui/WritingPracticeResult";
import { WritingPracticeReviewMistakes } from "../features/toeic-writing/ui/WritingPracticeReviewMistakes";
import { WritingPracticeHistory } from "../features/toeic-writing/ui/WritingPracticeHistory";
import { WritingCombinedExecution } from "../features/toeic-writing/ui/WritingCombinedExecution";
import { WritingCombinedResult } from "../features/toeic-writing/ui/WritingCombinedResult";
import { WritingCombinedHistory } from "../features/toeic-writing/ui/WritingCombinedHistory";

export default function App() {
  return (
    <div className="bg-slate-50 text-slate-900 antialiased" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif", minHeight: "100vh" }}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '16px',
              background: '#fff',
              color: '#1E293B',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            },
          }}
        />
        <LevelGuardModal />
        <Routes>
          <Route path="/select-level" element={<LevelSelectTest />} />
          <Route path="/test/:level" element={<TestExecution />} />
          <Route path="/test-result" element={<TestResult />} />
          <Route path="/test-review-mistakes" element={<TestReviewMistakes />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login />} />

          <Route path="/practice-execution" element={<PracticeExecution />} />
          <Route path="/practice-result" element={<PracticeResult />} />
          <Route path="/practice-review-mistakes" element={<PracticeReviewMistakes />} />
          <Route path="/knowledge-map" element={<KnowledgeMap />} />
          <Route path="/select-track" element={<TrackSelect />} />

          {/* ---> CHÈN ROUTE MỚI Ở ĐÂY <--- */}
          <Route path="/select-skill" element={<SkillSelect />} />

          <Route path="/toeic/test/:level" element={<ToeicTestExecution />} />
          <Route path="/toeic/test-result" element={<ToeicTestResult />} />
          <Route path="/toeic/test-review-mistakes" element={<ToeicTestReviewMistakes />} />

          <Route path="/toeic/practice" element={<ToeicPracticeExecution />} />
          <Route path="/toeic/practice-result" element={<ToeicPracticeResult />} />
          <Route path="/toeic/practice-review-mistakes" element={<ToeicPracticeReviewMistakes />} />

          <Route path="/toeic/test/deep-dive/:sessionId" element={<DeepDiveTestPage />} />
          <Route path="/practice-history" element={<ToeicPracticeHistory />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="/vip-entertainment" element={<VipEntertainment />} />
          <Route path="/transaction-history" element={<TransactionHistoryPage />} />

          {/* CÁC ROUTE WRITING */}
          <Route path="/toeic/writing/select-level" element={<LevelSelectTest />} />
          <Route path="/toeic/writing/test/:level" element={<WritingTestExecution />} />
          <Route path="/toeic/writing/test-result" element={<WritingTestResult />} />
          <Route path="/toeic/writing/test-review-mistakes" element={<WritingTestReviewMistakes />} />

          {/* CÁC ROUTE LUYỆN TẬP WRITING HÀNG NGÀY */}
          <Route path="/toeic/writing/practice" element={<WritingPracticeExecution />} />
          <Route path="/toeic/writing/practice-result" element={<WritingPracticeResult />} />
          <Route path="/toeic/writing/practice-review-mistakes" element={<WritingPracticeReviewMistakes />} />
          <Route path="/toeic/writing/practice-history" element={<WritingPracticeHistory />} />

          {/* SESSION HỖN HỢP 3xP1 + P2 + P3 */}
          <Route path="/toeic/writing/combined-practice" element={<WritingCombinedExecution mode="daily" />} />
          <Route path="/toeic/writing/combined-test/:level" element={<WritingCombinedExecution mode="test" />} />
          <Route path="/toeic/writing/combined-result" element={<WritingCombinedResult />} />
          <Route path="/toeic/writing/combined-history" element={<WritingCombinedHistory />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}