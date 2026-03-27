import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 1) get current user
        const meRes = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) throw new Error("Failed to fetch /me");
        const meData = await meRes.json();
        setUser(meData);

        // 2) get history for this user (still loaded, but not used here)
        const histRes = await fetch(
          `${API_BASE}/api/watermarks/history?page=1&limit=100`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!histRes.ok) throw new Error("Failed to fetch history");
        const histData = await histRes.json();
        setHistory(histData.logs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto text-on-surface">
        <p>Loading profile...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto text-on-surface">
        <p>User not found. Please log in again.</p>
      </main>
    );
  }

  // Derive display name and first letter for avatar
  const displayName =
    user.full_name && user.full_name.trim().length > 0
      ? user.full_name
      : user.email.split("@")[0];

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
      {/* Hero Profile Section */}
      <section className="flex flex-col items-center mb-24">
        {/* Simple avatar using first letter */}
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-3xl group-hover:bg-primary-container/40 transition-all duration-500" />
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-[3px] bg-gradient-to-tr from-primary to-tertiary-container shadow-2xl flex items-center justify-center">
            <div className="w-full h-full rounded-full flex items-center justify-center bg-surface text-primary text-4xl md:text-5xl font-headline border-4 border-surface">
              {avatarLetter}
            </div>
          </div>
        </div>

        {/* Use user name instead of CYPHER_NODE_07 */}
        <h1 className="mt-6 text-4xl md:text-5xl font-headline font-bold text-primary tracking-tight text-center">
          {displayName}
        </h1>
        <p className="mt-2 font-label text-sm uppercase tracking-[0.3em] text-slate-500">
          Authorized Agent
        </p>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Identity Parameters Card */}
        <div className="md:col-span-7 bg-surface-container-low p-10 rounded-xl relative overflow-hidden group border-t border-white/5">
          <h2 className="font-headline text-2xl mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container">
              fingerprint
            </span>
            Identity Parameters
          </h2>
          <div className="space-y-8">
            <div className="flex flex-col gap-1">
              <span className="font-label text-xs uppercase tracking-widest text-slate-500">
                User Name
              </span>
              <p className="text-xl font-medium text-on-surface">
                {displayName}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label text-xs uppercase tracking-widest text-slate-500">
                Secure Communication
              </span>
              <p className="text-xl font-medium text-on-surface">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Operation Logs CTA */}
        <div className="md:col-span-5 flex flex-col gap-8">
          <div className="bg-surface-container-high p-8 rounded-xl ghost-border flex flex-col justify-between h-full group hover:bg-surface-container-highest transition-all duration-300">
            <div>
              <span
                className="material-symbols-outlined text-4xl text-primary mb-4"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                history
              </span>
              <h3 className="font-headline text-3xl font-bold tracking-tight mb-2">
                Operation Logs
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Access full forensic audit of your watermarking activities and
                detection events.
              </p>
            </div>
            <button
              className="mt-8 primary-gradient text-on-primary font-headline font-bold uppercase tracking-widest py-4 px-6 rounded-lg text-sm flex items-center justify-between group-hover:scale-[1.02] transition-transform"
              onClick={() => {
                window.location.href = "/history";
              }}
            >
              View History
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;


