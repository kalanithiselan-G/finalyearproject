
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const AuthLayout = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const full_name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await axios.post("http://localhost:8000/api/auth/register", {
        full_name,
        email,
        password,
      });

      const token = res.data?.access_token;

      if (!token) {
        alert("Registration succeeded but no token returned. Please log in.");
        return;
      }

      login(token);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data) {
        const detail = err.response.data.detail;

        if (detail === "Email already registered") {
          alert("This email is already registered. Please log in instead.");
        } else {
          alert(detail || "Registration failed");
        }
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen mt-20">
      <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
        {/* Left Section: Register Animation */}
        <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative flex-col justify-center items-center overflow-hidden bg-surface-container-lowest">
          {/* Background Decorative Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-container/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-tertiary-container/5 rounded-full blur-[120px]" />

          {/* Registration Animation: concentric rings + pulsing nodes */}
          <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
            {/* Outer scanning ring */}
            <div className="absolute inset-0 border border-primary-container/30 rounded-full animate-[spin_24s_linear_infinite]" />
            {/* Middle ring */}
            <div className="absolute inset-10 border border-tertiary-container/30 rounded-full animate-[spin_18s_linear_infinite_reverse]" />
            {/* Inner ring */}
            <div className="absolute inset-20 border border-primary/20 rounded-full animate-[spin_12s_linear_infinite]" />

            {/* Core badge */}
            <div className="relative w-56 h-56 rounded-full glass-panel flex flex-col items-center justify-center shadow-[0_0_60px_rgba(0,242,255,0.2)]">
              <span
                className="material-symbols-outlined text-primary-container text-6xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                person_add
              </span>
              <p className="mt-3 font-headline text-xs uppercase tracking-[0.25em] text-primary-container/80">
                New Operator
              </p>
              <p className="mt-1 font-headline text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/70">
                Registration Sequence
              </p>
            </div>

            {/* Pulsing nodes */}
            <div className="absolute -top-2 left-1/4 flex flex-col items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="font-headline text-[9px] uppercase tracking-[0.25em] text-primary-container/70">
                Identity
              </span>
            </div>

            <div className="absolute bottom-6 right-10 flex flex-col items-end gap-2">
              <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="font-headline text-[9px] uppercase tracking-[0.25em] text-tertiary-container/70">
                Key Exchange
              </span>
            </div>

            <div className="absolute top-10 right-16 flex flex-col items-end gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-fixed-dim animate-pulse" />
              <span className="font-headline text-[9px] uppercase tracking-[0.25em] text-primary-fixed-dim/70">
                Node Link
              </span>
            </div>
          </div>

          {/* Copy for register page */}
          {/* <div className="relative mt-10 px-12 text-center md:text-left max-w-xl">
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-4">
              Spin up your <span className="text-primary-container">secure</span> operator.
            </h2>
            <p className="font-body text-on-surface-variant text-base md:text-lg leading-relaxed">
              Provision a new identity, bind it to your watermarking pipeline and gain
              end‑to‑end traceability across every encoded stream.
            </p>
          </div> */}
        </section>

        {/* Right Section: Registration Form */}
        <section className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-surface">
          <div className="mb-12">
            <div className="md:hidden flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary-container text-3xl">
                lock_open
              </span>
              <span className="font-headline text-xl font-bold tracking-tight text-primary">
                Sonic Cipher
              </span>
            </div>
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">
              Initialize Security Profile
            </h2>
            <p className="text-on-surface-variant">
              Access the next generation of silent watermarking.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleRegister}>
            {/* Name */}
            <div className="group relative">
              <label
                htmlFor="name"
                className="block font-headline text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 transition-colors group-focus-within:text-primary-container"
              >
                Operator Identity
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-container transition-colors">
                  person_outline
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoFocus
                  className="w-full bg-surface-container-lowest border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary-container/50 transition-all outline-none ghost-border"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="group relative">
              <label
                htmlFor="email"
                className="block font-headline text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 transition-colors group-focus-within:text-primary-container"
              >
                Digital Node (Email)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-container transition-colors">
                  alternate_email
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full bg-surface-container-lowest border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary-container/50 transition-all outline-none ghost-border"
                  placeholder="operator@sonic-cipher.net"
                />
              </div>
            </div>

            {/* Password */}
<div className="group relative">
  <label
    htmlFor="password"
    className="block font-headline text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 transition-colors group-focus-within:text-primary-container"
  >
    Encryption Key
  </label>
  <div className="relative">
    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-container transition-colors">
      key
    </span>
    <input
      id="password"
      name="password"
      type={showPassword ? "text" : "password"}
      className="w-full bg-surface-container-lowest border-none rounded-xl py-4 pl-12 pr-12 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary-container/50 transition-all outline-none ghost-border"
      placeholder="••••••••••••"
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

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-xl font-headline font-bold uppercase tracking-widest text-sm transition-all hover:shadow-[0_0_30px_rgba(0,242,255,0.3)] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Initialize Account
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm text-on-surface-variant">
              Already Account exits ?
              <Link
                to="/login"
                className="text-primary-fixed-dim font-bold hover:text-primary transition-colors ml-1"
              >
                Login here
              </Link>
            </p>
          </div>
        </section>
      </main>

      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary-container/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-tertiary-container/5 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
};

export default AuthLayout;





