import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";

import ScanResi from "./pages/ScanResi";
import MarketplaceResi from "./pages/MarketplaceResi";
import MatchResult from "./pages/MatchResult";

import "./styles.css";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const { isAuth } = useAuth();

  const noSidebarPaths = ["/", "/login", "/register"];

  const hideSidebar =
    noSidebarPaths.includes(location.pathname) || !isAuth;

  return (
    <div className="app">
      {!hideSidebar && <Sidebar />}

      <main className={hideSidebar ? "main main--full" : "main"}>
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AppLayout>
      <Routes>

        {/* LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVATE ROUTES */}
        <Route
          path="/scan"
          element={
            <PrivateRoute>
              <ScanResi />
            </PrivateRoute>
          }
        />

        <Route
          path="/marketplace"
          element={
            <PrivateRoute>
              <MarketplaceResi />
            </PrivateRoute>
          }
        />

        <Route
          path="/match"
          element={
            <PrivateRoute>
              <MatchResult />
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div style={{ padding: 32 }}>
              <h1>404</h1>
              <p>Halaman tidak ditemukan.</p>
            </div>
          }
        />
      </Routes>
    </AppLayout>
  );
};

export default App;