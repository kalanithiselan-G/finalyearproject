import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SonicNavbar = () => {
  const { user, logout, isAuthenticated, hasVisited } = useAuth();
  const navigate = useNavigate();

  const activeBase =
    "relative uppercase text-sm tracking-widest transition-colors duration-200";

  const navLinkClass = ({ isActive }) =>
    [
      activeBase,
      "text-slate-300 hover:text-cyan-300",
      isActive ? "text-cyan-400" : "",
    ]
      .filter(Boolean)
      .join(" ");

  const getUserLogoText = () => {
    if (!isAuthenticated || !user?.email) return "SC";
    const ch = user.email.trim()[0] || "U";
    return ch.toUpperCase();
  };

  return (
    <nav className="fixed top-0 w-full flex justify-between px-8 h-20 items-center bg-black/60 backdrop-blur-md z-50 border-b border-cyan-500/20 ">
      {/* Left: Logo + brand text */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-700 text-black font-bold text-lg shadow-[0_0_18px_rgba(34,211,238,0.8)]">
          {getUserLogoText()}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-base font-semibold tracking-[0.35em] text-slate-100 uppercase">
            Sonic
          </span>
          <span className="text-[10px] tracking-[0.35em] text-cyan-300 uppercase">
            Cipher
          </span>
        </div>
      </div>

      {/* Center links */}
      <div className="flex gap-6">
        <NavLink to="/" className={navLinkClass} end>
          {({ isActive }) => (
            <span className="relative inline-flex flex-col items-center">
              <span>Home</span>
              <span
                className={`mt-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 ${
                  isActive ? "w-full" : "w-0"
                }`}
              />
            </span>
          )}
        </NavLink>

        {!isAuthenticated ? (
          <>
           
            <NavLink to="/register" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative inline-flex flex-col items-center">
                  <span>Register</span>
                  <span
                    className={`mt-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </span>
              )}
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/embed" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative inline-flex flex-col items-center">
                  <span>Embed</span>
                  <span
                    className={`mt-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </span>
              )}
            </NavLink>
            <NavLink to="/detect" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative inline-flex flex-col items-center">
                  <span>Detect</span>
                  <span
                    className={`mt-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </span>
              )}
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative inline-flex flex-col items-center">
                  <span>Profile</span>
                  <span
                    className={`mt-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </span>
              )}
            </NavLink>
            <NavLink to="/history" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative inline-flex flex-col items-center">
                  <span>History</span>
                  <span
                    className={`mt-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </span>
              )}
            </NavLink>
          </>
        )}
      </div>

      {/* Right: Auth button */}
      <div>
        {!isAuthenticated ? (
          <button
            onClick={() => navigate("/login")}
            className="uppercase text-xs tracking-[0.3em] px-5 py-2 rounded-full border border-cyan-400/70 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/25 hover:shadow-[0_0_18px_rgba(34,211,238,0.8)] transition-all duration-200"
          >
            Login
          </button>
        ) : (
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="group relative overflow-hidden uppercase text-xs tracking-[0.3em] px-5 py-2 rounded-full border border-rose-400/80 text-rose-200 bg-rose-500/10 hover:text-white transition-all duration-200"
          >
            <span className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-rose-500/40 via-orange-500/40 to-rose-500/40 opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
            <span className="flex items-center gap-2">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-rose-300 text-[9px]">
                ⏻
              </span>
              Logout
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default SonicNavbar;



