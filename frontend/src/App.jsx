import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Overview from "./pages/Overview";
import RiskIntelligence from "./pages/RiskIntelligence";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import WhatIfSimulator from "./pages/WhatIfSimulator";
import AIAdvisor from "./pages/AIAdvisor";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/risk" element={<RiskIntelligence />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/what-if" element={<WhatIfSimulator />} />
          <Route path="/ai-advisor" element={<AIAdvisor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;