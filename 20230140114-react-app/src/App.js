import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import Navbar from "./components/Navbar";
import PresensiPage from "./components/PresensiPage";
import ReportPage from "./components/ReportPage";

// ===============================
// PROTECTED ROUTE
// ===============================
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const exp = decoded.exp * 1000;

    // Token kadaluarsa
    if (Date.now() > exp) {
      localStorage.removeItem("token");
      return <Navigate to="/login" />;
    }

    return children; // token valid
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
};

// ===============================
// ADMIN ONLY ROUTE
// ===============================
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);

    if (decoded.role !== "admin") {
      return <Navigate to="/dashboard" />;
    }

    return children;
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
};

// ===============================
// MAIN APP
// ===============================
function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/presensi"
          element={
            <ProtectedRoute>
              <PresensiPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <AdminRoute>
              <ReportPage />
            </AdminRoute>
          }
        />

        {/* Redirect default */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
