import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

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
        {/* Public authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Overview />} />
            <Route
              path="/risk"
              element={<RiskIntelligence />}
            />
            <Route
              path="/transactions"
              element={<Transactions />}
            />
            <Route
              path="/analytics"
              element={<Analytics />}
            />
            <Route
              path="/what-if"
              element={<WhatIfSimulator />}
            />
            <Route
              path="/ai-advisor"
              element={<AIAdvisor />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;