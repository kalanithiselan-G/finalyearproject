import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
const [showPassword, setShowPassword] = React.useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      login(res.data.access_token);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body overflow-hidden min-h-screen">
      <main className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Section: Visual Identity & Animation */}
        <section className="hidden lg:flex lg:w-3/5 relative flex-col justify-center items-center overflow-hidden bg-surface-container-lowest">
          {/* Background Decorative Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-container/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-tertiary-container/5 rounded-full blur-[120px]" />

          {/* Forensic Visualization Area */}
          <div className="relative w-full max-w-2xl px-12">
            {/* Data Layers Visual */}
            <div className="relative aspect-video glass-panel border border-outline-variant/15 rounded-xl overflow-hidden group">
              <img
                alt="abstract digital data grid with glowing blue particles and interconnected nodes representing secure communication networks"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6j5red77_fREKAES-IghIaGVpsy-QVC6IuOG3h6_Drr4xb1r4nY2Nc-Akjbc7wiXz8XK59OUAMQ5pgQQGpPDgLsYu04JQEP7EdNsDiMxn3n-dY_w0hYS9Ree-swu3qiLDdQw2qdcMc9kMbc04TeU6vp3Jn6SqvjAh-DnJNrGpC4YZdqaVmG3xB48DZzmEBuE2gZSaG8Ea8oIbkNoNRqA1FYnV_bjii27N0VPEN-qgwWFVHlX55gbrZbHaTpHZCJaT1TKs1h5JX12H"
                className="absolute inset-0 w-full h-auto object-cover opacity-30 mix-blend-overlay"
              />
              {/* Audio Spectrogram Representation */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 px-8">
                <div className="w-1.5 h-12 bg-primary-container rounded-full opacity-40" />
                <div className="w-1.5 h-24 bg-primary rounded-full" />
                <div className="w-1.5 h-40 bg-tertiary-container rounded-full shadow-[0_0_15px_rgba(245,206,255,0.5)]" />
                <div className="w-1.5 h-32 bg-primary-container rounded-full" />
                <div className="w-1.5 h-56 bg-primary-fixed-dim rounded-full shadow-[0_0_20px_rgba(0,219,231,0.5)]" />
                <div className="w-1.5 h-28 bg-primary-container rounded-full" />
                <div className="w-1.5 h-44 bg-tertiary rounded-full" />
                <div className="w-1.5 h-16 bg-primary rounded-full opacity-60" />
                <div className="w-1.5 h-24 bg-primary-container rounded-full" />
              </div>
              {/* HUD Overlays */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-container rounded-full" />
                <span className="font-headline text-[10px] uppercase tracking-[0.2em] text-primary-container">
                  Watermark: Active
                </span>
              </div>
              <div className="absolute bottom-6 right-6 text-right">
                <div className="font-headline text-xs uppercase tracking-widest text-on-surface-variant opacity-60">
                  Trace Frequency
                </div>
                <div className="font-headline text-2xl font-bold text-primary">
                  19.2 kHz
                </div>
              </div>
            </div>

            {/* Editorial Quote */}
            <div className="mt-12 max-w-md">

              <p className="font-body text-on-surface-variant text-lg leading-relaxed max-w-sm">
                Forensic audio watermarking for premium OTT content. Inaudible protection,
                indisputable evidence.
              </p>
            </div>
          </div>
        </section>

        {/* Right Section: Login Form */}
        <section className="w-full lg:w-2/5 flex flex-col justify-center items-center px-8 sm:px-16 bg-surface-dim relative">
          <div className="w-full max-w-md">
            <header className="mb-10">
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">
                Access Portal
              </h2>
              <p className="font-body text-on-surface-variant">
                Identify yourself to access the Sentinel dashboard.
              </p>
            </header>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block font-headline text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1"
                >
                  Operational Email
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                    alternate_email
                  </span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="name@organization.com"
                    className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border-0 rounded-xl focus:ring-2 focus:ring-primary-container/30 text-on-surface transition-all duration-300 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label
                    htmlFor="password"
                    className="block font-headline text-[10px] uppercase tracking-[0.2em] text-on-surface-variant"
                  >
                    Security Key
                  </label>
                </div>
<div className="relative group">
  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
    lock
  </span>
  <input
    id="password"
    name="password"
    type={showPassword ? "text" : "password"}
    placeholder="••••••••••••"
    className="w-full h-14 pl-12 pr-12 bg-surface-container-lowest border-0 rounded-xl focus:ring-2 focus:ring-primary-container/30 text-on-surface transition-all duration-300 outline-none"
  />
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
  >
    <span className="material-symbols-outlined">
      {showPassword ? "visibility" : "visibility_off"}
    </span>
  </button>
</div>

              </div>

              <button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-headline font-bold uppercase tracking-[0.15em] rounded-xl hover:shadow-[0_0_30px_rgba(0,242,255,0.3)] transition-all duration-300 active:scale-[0.98]"
              >
                Authorize Access
              </button>
            </form>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-on-surface-variant">
              Already Account exits ?
              <Link
                to="/register"
                className="text-primary-fixed-dim font-bold hover:text-primary transition-colors ml-1"
              >
                Register here
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;






