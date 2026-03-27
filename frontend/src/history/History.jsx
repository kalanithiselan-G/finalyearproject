import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

const HistoryPage = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");

  const fetchHistory = async (pageNumber) => {
    if (!token) {
      console.error("No access token found. Make sure you are logged in.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/watermarks/history?page=${pageNumber}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch history", res.status);
        return;
      }

      const data = await res.json();
      setLogs(data.logs || []);
      setPage(data.page || pageNumber);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrev = () => {
    if (page > 1) {
      fetchHistory(page - 1);
    }
  };

  const handleNext = () => {
    if (page < pages) {
      fetchHistory(page + 1);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatTime = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour12: false });
  };

  const statusClasses = (status) => {
    if (status === "Embedded") {
      return {
        wrapper:
          "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 text-primary-container text-[10px] font-label uppercase tracking-widest",
        dot: "w-1.5 h-1.5 rounded-full bg-primary-container",
      };
    }
    if (status === "Detected") {
      return {
        wrapper:
          "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container/10 text-tertiary-container text-[10px] font-label uppercase tracking-widest",
        dot: "w-1.5 h-1.5 rounded-full bg-tertiary-container",
      };
    }
    if (status === "No Watermark" || status === "Flagged") {
      return {
        wrapper:
          "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error-container/20 text-error text-[10px] font-label uppercase tracking-widest",
        dot: "w-1.5 h-1.5 rounded-full bg-error",
      };
    }
    return {
      wrapper:
        "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-slate-400 text-[10px] font-label uppercase tracking-widest",
      dot: "w-1.5 h-1.5 rounded-full bg-slate-400",
    };
  };

  // Count how many logs have status "Embedded"
  const embeddedCount = logs.filter((log) => log.status === "Embedded").length;

  // Count how many logs have status "Detected"
  const detectedCount = logs.filter((log) => log.status === "Detected").length;

  return (
    <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
      {/* Header Section */}
      <header className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-7">
          <h1 className="font-headline text-6xl font-bold tracking-tight text-primary mb-4">
            Audit <span className="text-primary-container">Logs</span>
          </h1>
          <p className="text-on-surface-variant max-w-xl font-body leading-relaxed">
            A forensic timeline of all cryptographic embedding and detection
            operations. Monitor the silent sentinel&apos;s activity across your
            digital assets.
          </p>
        </div>
        <div className="md:col-span-5 flex flex-col items-end gap-4">
          {/* Embedded Videos card */}
          <div className="bg-surface-container-low px-6 py-4 rounded-xl ghost-border-top w-full md:w-auto">
            <div className="text-xs font-label uppercase tracking-widest text-slate-500 mb-1">
              Embedded Videos
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary-container shadow-[0_0_12px_#00f2ff]" />
              <span className="font-headline text-2xl font-bold">
                {embeddedCount}
              </span>
            </div>
          </div>

          {/* Detected Videos card */}
          <div className="bg-surface-container-low px-6 py-4 rounded-xl ghost-border-top w-full md:w-auto">
            <div className="text-xs font-label uppercase tracking-widest text-slate-500 mb-1">
              Detected Videos
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-tertiary-container shadow-[0_0_12px_#00f2ff]" />
              <span className="font-headline text-2xl font-bold">
                {detectedCount}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Timeline / Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Log Table */}
        <div className="lg:col-span-3">
          <div className="bg-surface-container-low rounded-2xl overflow-hidden ghost-border-top">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50 border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-label uppercase tracking-[0.2em] text-slate-400">
                    Date
                  </th>
                  <th className="px-8 py-6 text-[10px] font-label uppercase tracking-[0.2em] text-slate-400">
                    Time
                  </th>
                  <th className="px-8 py-6 text-[10px] font-label uppercase tracking-[0.2em] text-slate-400">
                    Email ID
                  </th>
                  <th className="px-8 py-6 text-[10px] font-label uppercase tracking-[0.2em] text-slate-400">
                    Video Name
                  </th>
                  <th className="px-8 py-6 text-[10px] font-label uppercase tracking-[0.2em] text-slate-400 text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-8 py-6 text-sm text-slate-400"
                    >
                      Loading logs...
                    </td>
                  </tr>
                )}

                {!loading && logs.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-8 py-6 text-sm text-slate-400"
                    >
                      No logs yet.
                    </td>
                  </tr>
                )}

                {!loading &&
                  logs.map((log) => {
                    const { wrapper, dot } = statusClasses(log.status);
                    return (
                      <tr
                        key={log._id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-8 py-6 font-headline text-sm font-medium">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-400 font-label">
                          {formatTime(log.timestamp)} UTC
                        </td>
                        <td className="px-8 py-6 text-sm">
                          <span className="px-3 py-1 bg-surface-container-lowest rounded-lg border border-white/5">
                            {log.email}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-primary-fixed-dim font-medium">
                          {log.original_filename || "-"}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className={wrapper}>
                            <span className={dot} />
                            {log.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-8 py-6 bg-surface-container-high/30 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-label uppercase tracking-widest">
                {total > 0
                  ? `Showing ${(page - 1) * 10 + 1}-${Math.min(
                      page * 10,
                      total
                    )} of ${total} Logs`
                  : "Showing 0 Logs"}
              </span>
              <div className="flex gap-4">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-variant transition-colors text-slate-400 disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-lg">
                    chevron_left
                  </span>
                </button>
                <button
                  onClick={handleNext}
                  disabled={page === pages || pages === 0}
                  className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-variant transition-colors text-slate-400 disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-lg">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HistoryPage;




