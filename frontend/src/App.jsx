import { React, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Root from "./routes/Root.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import PrivacyPage from "./pages/Privacy/PrivacyPage.jsx";
import TermsPage from "./pages/Privacy/TermsPage.jsx";
import AdminReservationsPanel from "./pages/Admin/AdminReservationsPanel.jsx";
import ScrollToTop from "./components/Scroll/ScrollToTop.jsx";
import AdminLoginPage from "./pages/Admin/AdminLoginPage.jsx";
import RequireAuth from "./components/Auth/RequireAuth.jsx";
import AdminAuthPage from "./pages/Admin/AdminAuthPage.jsx";
import ResetPasswordPage from "./pages/Admin/ResetPasswordPage.jsx";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Root />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          <Route path="/login" element={<AdminAuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/admin" element={<AdminReservationsPanel />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
