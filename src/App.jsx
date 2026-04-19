import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ContestProvider } from "./context/ContestContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
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
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectTo || window.location.pathname)}`} replace />;
  }
  return children;
}

function P({ children }) {
  return <PageTransition>{children}</PageTransition>;
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
              <Route path="/login" element={<P><Login /></P>} />
              <Route path="/signup" element={<P><Signup /></P>} />
              <Route
                path="/create"
                element={
                  <ProtectedRoute redirectTo="/create">
                    <P><CreateContest /></P>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute redirectTo="/dashboard">
                    <P><Dashboard /></P>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute redirectTo="/admin">
                    <P><Admin /></P>
                  </ProtectedRoute>
                }
              />
              <Route path="/contest/:id" element={<P><ContestDetail /></P>} />
              <Route path="/legal" element={<P><Legal /></P>} />
              <Route path="/terms" element={<P><Terms /></P>} />
              <Route path="/privacy" element={<P><Privacy /></P>} />
            </Routes>
            <Footer />
          </div>
        </ContestProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
