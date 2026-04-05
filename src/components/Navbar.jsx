import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <img src="/logo.svg" alt="Land-it logo" className="w-9 h-9 rounded-xl shadow-sm" />
          <span className="text-xl font-bold font-[family-name:var(--font-display)] tracking-tight text-[#222]">
            Land-<span className="gradient-text">it</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          <Link to="/" className="glass-btn glass-btn-sm no-underline">
            Explore Contests
          </Link>
          <Link to="/create" className="glass-btn glass-btn-sm no-underline">
            Create Contest
          </Link>

          {user ? (
            <div className="flex items-center gap-3 ml-1">
              {user.isAdmin && (
                <Link to="/admin" className="p-1.5 rounded-lg hover:bg-black/5 transition text-[#222]/40 hover:text-[#222] no-underline" title="Admin Panel">
                  <Shield className="w-4 h-4" />
                </Link>
              )}
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 no-underline hover:opacity-80 transition"
              >
                <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold">
                  {user.avatar}
                </div>
                <span className="text-sm font-medium text-[#222] max-w-[120px] truncate">
                  {user.name}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-black/5 transition text-[#222]/40 hover:text-[#222]"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-1">
              <Link to="/login" className="glass-btn glass-btn-sm no-underline">
                Sign in
              </Link>
              <Link to="/signup" className="glass-btn glass-btn-sm no-underline">
                Sign up
              </Link>
            </div>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-black/5 transition">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/5 px-4 py-4 flex flex-col gap-3">
          <Link to="/" onClick={() => setOpen(false)} className="glass-btn glass-btn-md no-underline text-center">
            Explore Contests
          </Link>
          <Link to="/create" onClick={() => setOpen(false)} className="glass-btn glass-btn-md no-underline text-center">
            Create Contest
          </Link>

          {user ? (
            <div className="flex flex-col gap-3 pt-3 border-t border-black/5">
              {user.isAdmin && (
                <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-medium no-underline text-[#222]/70 hover:text-[#222] py-2">
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 no-underline py-2"
              >
                <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold">
                  {user.avatar}
                </div>
                <span className="text-sm font-medium">{user.name}</span>
                <LayoutDashboard className="w-4 h-4 text-[#222]/40 ml-auto" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-[#222]/50 hover:text-[#222] transition flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-3 border-t border-black/5">
              <Link to="/login" onClick={() => setOpen(false)} className="glass-btn glass-btn-md no-underline text-center">
                Sign in
              </Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="glass-btn glass-btn-md no-underline text-center">
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
