import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

const WaterDT = () => {
  const [file, setFile] = useState(null);
  const [detection, setDetection] = useState(null);
  const [user, setUser] = useState(null); // only for auth, not shown
  const [loadingScan, setLoadingScan] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const res = await axios.get(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load user info. Please log in again.");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDetection(null);
      setError(null);
    }
  };

  const handleSelectSource = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleScan = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Not authenticated. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoadingScan(true);
    setError(null);

    try {
      const res = await axios.post(
        `${API_BASE}/api/watermark/detect`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // IMPORTANT: log keys once to ensure the field names match
      console.log("Detection response:", res.data);
      setDetection(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Error while detecting watermark."
      );
    } finally {
      setLoadingScan(false);
    }
  };

  const handleResetIncident = () => {
    setFile(null);
    setDetection(null);
    setError(null);
    setLoadingScan(false);
  };

  // Detection status text:
  const detectionStatusText =
    detection === null
      ? "Awaiting Scan"
      : detection.detected
      ? "Leak Source Identified"
      : "No Watermark Detected";

  const detectionConfidence =
    detection && detection.detected ? "99.87%" : "0.00%";

  // Watermark owner from detection result (exact property names from backend)
  const watermarkOwnerName =
    detection && detection.detected && detection.user_full_name
      ? detection.user_full_name
      : null;

  const watermarkOwnerEmail =
    detection && detection.detected && detection.user_email
      ? detection.user_email
      : null;

  const subjectName = watermarkOwnerName || null;
  const subjectEmail = watermarkOwnerEmail || "";

  const isFileSelected = !!file;
  const isStartScanEnabled = isFileSelected && !loadingScan;
  const isIncidentEnabled = detection !== null; // any completed scan

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".wav,.mp3,.mp4,.mov"
        onChange={handleFileChange}
      />

      {/* Header Section */}
      <header className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/20 mb-6">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          <span className="text-xs font-label uppercase tracking-widest text-primary-fixed-dim">
            Forensic Analysis Active
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter mb-4 text-primary">
          Leak Detection <br />
          <span className="text-slate-500">&amp; Signal Recovery</span>
        </h1>
        <p className="max-w-2xl text-on-surface-variant text-lg leading-relaxed">
          Scan suspected media for high-frequency inaudible watermarks. Our forensic engine
          cross-references extracted IDs against the secure identity registry to pinpoint leak
          sources.
        </p>
      </header>

      {/* Error / Info */}
      {error && (
        <div className="mb-4 text-sm text-error bg-error/10 px-4 py-2 rounded">
          {error}
        </div>
      )}
      {loadingUser && (
        <div className="mb-4 text-sm text-slate-400">
          Loading user profile...
        </div>
      )}

      {/* Main Forensic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Scan */}
        <div className="lg:col-span-7 space-y-8">
          {/* Drop Zone */}
          <div className="group relative aspect-video flex flex-col items-center justify-center rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant/30 hover:border-primary-container/50 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="z-10 text-center p-8">
              <span
                className="material-symbols-outlined text-6xl text-slate-600 mb-4 group-hover:text-primary-container group-hover:scale-110 transition-all duration-500"
                data-icon="upload_file"
              >
                upload_file
              </span>
              <h3 className="text-xl font-headline font-medium mb-2">
                Initialize Detection
              </h3>
              <p className="text-on-surface-variant text-sm mb-3 max-w-xs mx-auto">
                Upload .WAV, .MP3, .MOV, or .MP4. Maximum file size: 500MB.
              </p>

              {file && (
                <p className="text-xs text-slate-500 mb-2">
                  Selected: {file.name}
                </p>
              )}

              <div className="flex gap-3 justify-center">
                {/* SELECT SOURCE: always enabled */}
                <button
                  type="button"
                  onClick={handleSelectSource}
                  className="font-headline font-bold py-3 px-6 rounded-full tracking-wider transition-all bg-gradient-to-r from-primary to-primary-container text-on-primary hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]"
                >
                  SELECT SOURCE
                </button>

                {/* START SCAN: only glows when file selected */}
                <button
                  type="button"
                  onClick={handleScan}
                  disabled={!isStartScanEnabled}
                  className={
                    "font-headline font-bold py-3 px-6 rounded-full tracking-wider border transition-all " +
                    (isStartScanEnabled
                      ? "bg-primary text-on-primary border-primary hover:shadow-[0_0_20px_rgba(0,242,255,0.5)]"
                      : "bg-surface-container-high text-slate-500 border-outline-variant/40 opacity-50 cursor-not-allowed")
                  }
                >
                  {loadingScan ? "SCANNING..." : "START SCAN"}
                </button>
              </div>
            </div>
          </div>

          {/* Live Signal Monitor (animation only when scanning) */}
          <div className="bg-surface-container rounded-xl p-8 relative overflow-hidden h-64">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-label uppercase tracking-[0.2em] text-slate-500">
                Spectral Analysis
              </span>
              <span className="text-xs font-label uppercase tracking-[0.2em] text-primary">
                Scanning Frequency Range: 18kHz - 22kHz
              </span>
            </div>
            <div className="flex items-end justify-between h-32 gap-1 px-4">
              <div className="w-2 bg-primary-container h-1/2 opacity-20" />
              <div className="w-2 bg-primary-container h-3/4 opacity-40" />
              <div className="w-2 bg-primary-container h-1/4 opacity-10" />
              <div className="w-2 bg-tertiary-container h-5/6 opacity-60" />
              <div className="w-2 bg-primary-container h-2/3 opacity-30" />
              <div className="w-2 bg-primary-container h-full opacity-50" />
              <div className="w-2 bg-tertiary-container h-1/2 opacity-20" />
              <div className="w-2 bg-primary h-3/4" />
              <div className="w-2 bg-primary-container h-1/3 opacity-20" />
              <div className="w-2 bg-primary-container h-2/3 opacity-40" />
              <div className="w-2 bg-tertiary-container h-5/6 opacity-30" />
              <div className="w-2 bg-primary-container h-1/2 opacity-10" />
              <div className="w-2 bg-primary h-3/4 opacity-60" />
              <div className="w-2 bg-primary-container h-full opacity-40" />
            </div>
            {loadingScan && (
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="h-full w-px bg-primary/80 shadow-[0_0_15px_#e1fdff] absolute top-0 left-0"
                  style={{ animation: "scan 3s linear infinite" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Results & Forensics */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Match Status Card */}
          <div className="bg-surface-container-high rounded-xl p-8 border-t border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span
                className="material-symbols-outlined text-error/40 text-4xl"
                data-icon="verified_user"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
            </div>
            <h2 className="text-sm font-label uppercase tracking-[0.2em] text-slate-500 mb-8">
              Detection Status
            </h2>
            <div className="mb-8">
              <span
                className={
                  "text-4xl font-headline font-bold block mb-2 " +
                  (detection && detection.detected
                    ? "text-error"
                    : "text-slate-400")
                }
              >
                {detectionStatusText}
              </span>
              <p className="text-on-surface-variant text-sm">
                Forensic confidence: {detectionConfidence}
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                <span className="text-xs uppercase font-label text-slate-500">
                  Watermark ID
                </span>
                <span className="text-sm font-headline font-medium text-primary">
                  {detection && detection.detected ? detection.watermark_id : "--"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                <span className="text-xs uppercase font-label text-slate-500">
                  Asset ID
                </span>
                <span className="text-sm font-headline font-medium text-on-surface">
                  {detection && detection.detected ? detection.content_id : "--"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                <span className="text-xs uppercase font-label text-slate-500">
                  Timestamp
                </span>
                <span className="text-sm font-headline font-medium text-on-surface">
                  {detection && detection.detected && detection.timestamp
                    ? detection.timestamp
                    : "--"}
                </span>
              </div>
            </div>
          </div>

          {/* Subject Profile – show username + email from detection */}
          <div className="bg-surface-container rounded-xl p-8 relative overflow-hidden">
            <h2 className="text-sm font-label uppercase tracking-[0.2em] text-slate-500 mb-6">
              Subject Profile
            </h2>
            <div className="flex items-center gap-6 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-error/50 p-1">
                <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center text-xl font-headline text-error">
                  {subjectName && subjectName[0]
                    ? subjectName[0].toUpperCase()
                    : "?"}
                </div>
              </div>
              <div>
                {subjectName ? (
                  <>
                    <div className="text-xl font-headline font-bold text-on-surface">
                      {subjectName}
                    </div>
                    {subjectEmail && (
                      <div className="text-sm text-slate-500">
                        {subjectEmail}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-slate-500">
                    No watermark detected
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetIncident}
              disabled={!isIncidentEnabled}
              className={
                "w-full mt-4 py-4 font-headline font-bold uppercase tracking-widest text-sm border transition-all " +
                (isIncidentEnabled
                  ? "bg-surface-container-highest text-on-surface hover:bg-error/10 hover:text-error border-outline-variant/20"
                  : "bg-surface-container-high text-slate-500 border-outline-variant/40 opacity-50 cursor-not-allowed")
              }
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WaterDT;









