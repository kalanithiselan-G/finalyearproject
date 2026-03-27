// Home.jsx (LandingPage)
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const showGlowingGetStarted = !user;

  const handleGetStarted = () => {
    if (user) {
      navigate("/embed");
    } else {
      navigate("/register");
    }
  };

  const goOrLogin = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container/30 min-h-screen flex flex-col">
      <main className="pt-20 flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[621px] flex items-center justify-center overflow-hidden px-8">
          {/* Background Decoration */}
          <div className="absolute inset-0 hero-gradient pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-tertiary-container/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-5xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant/30">
              <span className="w-2 h-2 bg-primary-container rounded-full shadow-[0_0_10px_#00f2ff]" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-headline font-bold text-primary-fixed-dim">
                Anti-Piracy Protocol v4.2 Active
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-[0.9] text-on-surface">
              THE SILENT <br />
              <span className="bg-gradient-to-r from-primary-container via-secondary-container to-tertiary-container bg-clip-text text-transparent">
                SENTINEL.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-on-surface-variant font-light leading-relaxed">
              Sonic Cipher deploys forensic-grade, inaudible audio watermarking for OTT platforms.
              Detect breaches instantly, track illicit distributions, and secure your high-value
              digital assets with invisible encryption.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <button
                onClick={handleGetStarted}
                className={`px-10 py-4 font-headline font-bold uppercase tracking-widest text-sm rounded-full transition-all active:scale-95 border border-primary/40 ${
                  showGlowingGetStarted
                    ? "bg-primary text-black shadow-[0_0_30px_rgba(34,211,238,0.8)] animate-pulse"
                    : "bg-primary-container text-on-primary-container hover:bg-primary hover:text-black hover:shadow-[0_0_22px_rgba(34,211,238,0.7)]"
                }`}
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Decorative Data Flow Elements */}
          <div className="absolute bottom-20 left-10 hidden lg:block opacity-40">
            <div className="flex items-center gap-4 space-y-1">
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-primary-container" />
              <span className="text-[10px] font-headline text-primary-container uppercase tracking-tighter">
                Bitrate Monitor: Stable
              </span>
            </div>
          </div>
          <div className="absolute bottom-20 right-10 hidden lg:block opacity-40">
            <div className="flex items-center gap-4 space-y-1">
              <span className="text-[10px] font-headline text-tertiary-container uppercase tracking-tighter">
                Encryption Flow: 256-AES
              </span>
              <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-tertiary-container" />
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="py-24 px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Watermark Embed */}
            <div
              onClick={() => goOrLogin("/embed")}
              className="md:col-span-8 group relative overflow-hidden bg-surface-container-low p-8 rounded-xl glow-border cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-[80px] group-hover:bg-primary-container/10 transition-colors" />
              <div className="relative z-10 space-y-12">
                <div className="space-y-4">
                  <span
                    className="material-symbols-outlined text-4xl text-primary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    water_drop
                  </span>
                  <h3 className="text-3xl font-headline font-bold text-on-surface">
                    Watermark Embed
                  </h3>
                  <p className="text-on-surface-variant max-w-md">
                    Seamlessly inject unique forensic identifiers into your audio streams without
                    impacting fidelity. Our algorithm operates in the psychoacoustic shadow.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="h-2 w-24 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-primary-container shadow-[0_0_8px_#00f2ff]" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-primary-fixed-dim">
                    Processing Depth: 94%
                  </span>
                </div>
              </div>
              <div className="absolute bottom-4 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-8xl font-headline font-black italic">EMBED</span>
              </div>
            </div>

            {/* History */}
            <div
              onClick={() => goOrLogin("/history")}
              className="md:col-span-4 bg-surface-container-high p-8 rounded-xl glow-border flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-4">
                <span
                  className="material-symbols-outlined text-3xl text-tertiary-fixed-dim"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  history
                </span>
                <h3 className="text-xl font-headline font-bold text-on-surface">History</h3>
                <p className="text-sm text-on-surface-variant">
                  Review watermark embedding and detection logs to audit content flows over time.
                </p>
              </div>
              <div className="h-24 mt-6 overflow-hidden rounded-lg bg-surface-container-lowest relative">
                <img
                  className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1702eSBF-OGuBvU_uQZmuby46AspGWFqrSRLNSxvVA9KMhpQoFkf7enRc1YLfqy8fpB8Qn2LFvaA9ge2OF018bme_H7w2XzxvP0O_oNxel-CyUx4Ad5CTXuhVVwrk4VcPvSDHiIXhGg9PEh3JvIfrnGoNcTpoqoqNszGIeiCgdKk5-nNULWMY7O433vpWjI9eSjGb9JcQWO7zOedipHXjZQTOMT9kg5t_GaWJeTT_eiDE9NSiEpuFpqc3Ph3Kl3P1kTKtD26nDgR7"
                  alt="History visualization"
                />
              </div>
            </div>

            {/* Watermark Detect */}
            <div
              onClick={() => goOrLogin("/detect")}
              className="md:col-span-8 group relative overflow-hidden bg-surface-container-low p-8 rounded-xl glow-border flex flex-col md:flex-row gap-12 cursor-pointer"
            >
              <div className="relative z-10 space-y-6 flex-1">
                <div className="space-y-4">
                  <span
                    className="material-symbols-outlined text-4xl text-tertiary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    radar
                  </span>
                  <h3 className="text-3xl font-headline font-bold text-on-surface">
                    Watermark Detect
                  </h3>
                  <p className="text-on-surface-variant">
                    Recover identity markers from highly compressed or recorded audio samples. Our
                    detection engine survives transcoding and camcord distortion.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-primary-container text-xs font-headline font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                  Run Analysis
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
              <div className="flex-1 min-h-[160px] bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-4 flex items-end gap-1">
                <div className="flex-1 bg-primary-container/20 h-1/2" />
                <div className="flex-1 bg-primary-container/40 h-3/4" />
                <div className="flex-1 bg-tertiary-container/30 h-full" />
                <div className="flex-1 bg-primary-container/50 h-2/3" />
                <div className="flex-1 bg-primary-container/30 h-1/3" />
                <div className="flex-1 bg-tertiary-container/40 h-1/2" />
                <div className="flex-1 bg-primary-container/60 h-4/5" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#181b25] w-full py-12 px-8 border-t border-white/5 font-['Inter'] text-xs uppercase tracking-widest text-slate-500">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 w-full max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-lg font-bold text-slate-300 font-headline">Sonic Cipher</div>
            <div className="opacity-80">© 2024 Sonic Cipher. The Silent Sentinel.</div>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="hover:text-cyan-400 transition-colors duration-300" href="#">
              Security Protocol
            </a>
            <a className="hover:text-cyan-400 transition-colors duration-300" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-cyan-400 transition-colors duration-300" href="#">
              Breach Reports
            </a>
            <a className="hover:text-cyan-400 transition-colors duration-300" href="#">
              API Documentation
            </a>
          </div>
          <div className="flex gap-6 opacity-80 hover:opacity-100 transition-all">
            <span className="material-symbols-outlined cursor-pointer hover:text-cyan-400">
              terminal
            </span>
            <span className="material-symbols-outlined cursor-pointer hover:text-cyan-400">
              lan
            </span>
            <span className="material-symbols-outlined cursor-pointer hover:text-cyan-400">
              shield_with_heart
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


