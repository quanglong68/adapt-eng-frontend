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
        </Routes>
      </BrowserRouter>
    </div>
  );
}