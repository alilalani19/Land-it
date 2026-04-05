import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ContestProvider } from "./context/ContestContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CreateContest from "./pages/CreateContest";
import ContestDetail from "./pages/ContestDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Legal from "./pages/Legal";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

function ProtectedRoute({ children, redirectTo }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectTo || window.location.pathname)}`} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContestProvider>
          <div className="min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/create"
                element={
                  <ProtectedRoute redirectTo="/create">
                    <CreateContest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute redirectTo="/dashboard">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute redirectTo="/admin">
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="/contest/:id" element={<ContestDetail />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
            <Footer />
          </div>
        </ContestProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
