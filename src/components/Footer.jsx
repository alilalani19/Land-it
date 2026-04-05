import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#222]/40">
          &copy; {new Date().getFullYear()} Land-it. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <Link to="/legal" className="text-xs text-[#222]/40 hover:text-[#222] no-underline transition">
            Legal
          </Link>
          <Link to="/terms" className="text-xs text-[#222]/40 hover:text-[#222] no-underline transition">
            Terms of Service
          </Link>
          <Link to="/privacy" className="text-xs text-[#222]/40 hover:text-[#222] no-underline transition">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
