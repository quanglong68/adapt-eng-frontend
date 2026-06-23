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
import { ToeicTestExecution } from "./pages/ToeicTestExecution";
import { ToeicTestResult } from "./pages/ToeicTestResult";
import { ToeicTestReviewMistakes } from "./pages/ToeicTestReviewMistakes";
import { ToeicPracticeExecution } from "./pages/ToeicPracticeExecution";
import { ToeicPracticeResult } from "./pages/ToeicPracticeResult";
import { ToeicPracticeReviewMistakes } from "./pages/ToeicPracticeReviewMistakes";


export default function App() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#F9FAFB", minHeight: "100vh" }}>
      <BrowserRouter>
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

          <Route path="/toeic/test/:level" element={<ToeicTestExecution />} />
          <Route path="/toeic/test-result" element={<ToeicTestResult />} />
          <Route path="/toeic/test-review-mistakes" element={<ToeicTestReviewMistakes />} />
          <Route path="/toeic/practice" element={<ToeicPracticeExecution />} />
          <Route path="/toeic/practice-result" element={<ToeicPracticeResult />} />
          <Route path="/toeic/practice-review-mistakes" element={<ToeicPracticeReviewMistakes />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}