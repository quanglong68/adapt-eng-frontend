import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LevelSelectTest } from "./pages/LevelSelectTest";
import { TestExecution } from "./pages/TestExecution";
import { TestResult } from "./pages/TestResult";
import { TestReviewMistakes } from "./pages/TestReviewMistakes";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { PracticeExecution } from "./pages/PracticeExecution";
import { PracticeResult } from "./pages/PracticeResult";
import { PracticeReviewMistakes } from "./pages/PracticeReviewMistakes";
import { KnowledgeMap } from "./pages/KnowledgeMap";
import { TrackSelect } from "./pages/TrackSelect";
import { SkillSelect } from "./pages/SkillSelect"; // <-- IMPORT TRANG MỚI VÀO ĐÂY
import { ToeicTestExecution } from "./pages/ToeicTestExecution";
import { ToeicTestResult } from "./pages/ToeicTestResult";
import { ToeicTestReviewMistakes } from "./pages/ToeicTestReviewMistakes";
import { ToeicPracticeExecution } from "./pages/ToeicPracticeExecution";
import { ToeicPracticeResult } from "./pages/ToeicPracticeResult";
import { ToeicPracticeReviewMistakes } from "./pages/ToeicPracticeReviewMistakes";
import { UserProfile } from "./pages/UserProfile";
import { Pricing } from "./pages/Pricing";
import { PaymentResult } from "./pages/PaymentResult";
import { VipEntertainment } from "./pages/VipEntertainment";
import { TransactionHistory } from "./components/vip/TransactionHistory";
import { Toaster } from "react-hot-toast";
import { PracticeHistory } from "./pages/PracticeHistory";
import { LevelGuardModal } from "./components/shared/LevelGuardModal";
import { DeepDiveTestPage } from "./pages/DeepDiveTestPage";


import { WritingTestExecution } from "./pages/WritingTestExecution";
import { WritingTestResult } from "./pages/WritingTestResult";
import { WritingTestReviewMistakes } from "./pages/WritingTestReviewMistakes";
import { WritingPracticeExecution } from "./pages/WritingPracticeExecution";
import { WritingPracticeResult } from "./pages/WritingPracticeResult";
import { WritingPracticeReviewMistakes } from "./pages/WritingPracticeReviewMistakes";
import { WritingPracticeHistory } from "./pages/WritingPracticeHistory";

export default function App() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#F9FAFB", minHeight: "100vh" }}>
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
          <Route path="/practice-history" element={<PracticeHistory />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="/vip-entertainment" element={<VipEntertainment />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />

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
        </Routes>
      </BrowserRouter>
    </div>
  );
}