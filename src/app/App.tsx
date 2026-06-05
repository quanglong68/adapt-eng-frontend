import { BrowserRouter, Routes, Route } from "react-router-dom";


import { LevelSelectTest } from "./pages/LevelSelectTest";
import { TestExecution } from "./pages/TestExecution";
import { TestResult } from "./pages/TestResult";
import { TestReviewMistakes } from "./pages/TestReviewMistakes";
import { Screen6Dashboard } from "./pages/Screen6Dashboard";


export default function App() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#F9FAFB", minHeight: "100vh" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/select-level" element={<LevelSelectTest />} />
          <Route path="/test/:level" element={<TestExecution />} />
          <Route path="/test-result" element={<TestResult />} />
          <Route path="/test-review-mistakes" element={<TestReviewMistakes />} />
          <Route path="/dashboard" element={<Screen6Dashboard />} />
          <Route path="/" element={<Screen6Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}