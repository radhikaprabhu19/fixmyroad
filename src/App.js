import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Reportform from "./Reportform";
import Fullmap from "./Fullmap";
import Detection from "./Detection";

function ReportPage() {
  return (
    <div className="report-page-container">
      <Reportform />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/report" element={<ReportPage />} />

        <Route path="/map" element={<Fullmap />} />

        <Route path="/detect" element={<Detection />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;