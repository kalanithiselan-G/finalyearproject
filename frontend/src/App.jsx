import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./Navbar/ProtectedRoute";
import SonicNavbar from "./Navbar/Navbar.jsx";

import LandingPage from "./Home.jsx";
import LoginPage from "./form/Login.jsx";
import RegisterPage from "./form/Register.jsx";

import EmbedPage from "./watermark/WaterEB.jsx";
import DetectPage from "./watermark/WaterDT.jsx";
import HistoryPage from "./history/History.jsx";
import ProfilePage from "./userprofile/Profile.jsx";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SonicNavbar />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/embed"
            element={
              <ProtectedRoute>
                <EmbedPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/detect"
            element={
              <ProtectedRoute>
                <DetectPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
