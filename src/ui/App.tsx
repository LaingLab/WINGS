import { HashRouter as Router, Routes, Route } from "react-router";
import { twMerge } from "tailwind-merge";

import TopBar from "./components/TopBar";
import HomePage from "./pages/HomePage";
import SomeOtherPage from "./pages/SomeOtherPage";
import RecordingPage from "./pages/RecordingPage";
import TrialPage from "./pages/TrialPage";

export default function App() {
  return (
    <Router>
      <div
        className={twMerge(
          "font-display no-scrollbar bg-background flex h-screen max-h-screen flex-col overflow-clip text-white select-none",
        )}
      >
        <div className="fixed top-0 right-0 left-0 z-10 h-12">
          <TopBar />
        </div>
        <div className="flex h-screen w-full flex-grow flex-col items-center justify-center pt-12">
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/some-other-path" element={<SomeOtherPage />} />
            <Route path="/recording" element={<RecordingPage />} />
            <Route path="/bluetooth" element={<>Bluetooth Page</>} />
            <Route path="/arduino" element={<>Arduino Page</>} />
            <Route path="/trial" element={<TrialPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
