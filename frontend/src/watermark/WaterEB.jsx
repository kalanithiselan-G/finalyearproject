import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const SonicCipherEmbed = () => {
  const { token, user } = useAuth();

  const [file, setFile] = useState(null);
  const [contentId, setContentId] = useState("ASSET_ALPHA_01");
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [status, setStatus] = useState({
    bitstream: "PENDING",
    masking: "PENDING",
    payload: "PENDING",
  });
  const [progress, setProgress] = useState(0); // 0–100
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setSuccess(false);
    setDownloadUrl(null);
    setProgress(0);
    setStatus({
      bitstream: "PENDING",
      masking: "PENDING",
      payload: "PENDING",
    });
  };

  const handleContentIdChange = (e) => {
    setContentId(e.target.value);
    setSuccess(false);
  };

  const resetAll = () => {
    setFile(null);
    setDownloadUrl(null);
    setProgress(0);
    setStatus({
      bitstream: "PENDING",
      masking: "PENDING",
      payload: "PENDING",
    });
    setSuccess(false);
    setIsEmbedding(false);
  };

  const handleGenerateWatermark = async () => {
    if (!file) {
      alert("Please select an audio/video file first.");
      return;
    }
    if (!token) {
      alert("You must be logged in to embed a watermark.");
      return;
    }

    setIsEmbedding(true);
    setSuccess(false);
    setProgress(0);
    setStatus({
      bitstream: "PENDING",
      masking: "PENDING",
      payload: "PENDING",
    });

    // Simulated client-side progress while backend is working
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; // stop at 95 until server finishes
        return prev + 5;
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (contentId) {
        formData.append("content_id", contentId);
      }

      const res = await axios.post(
        "http://localhost:8000/api/watermark/embed",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      // When backend finished, complete progress and statuses
      setProgress(100);
      setStatus({
        bitstream: "COMPLETE",
        masking: "OPTIMIZED",
        payload: "COMPLETE",
      });
      setSuccess(true);

      const blobUrl = URL.createObjectURL(res.data);
      setDownloadUrl(blobUrl);
    } catch (err) {
      console.error(err);
      alert("Error embedding watermark");
      setProgress(0);
      setStatus({
        bitstream: "PENDING",
        masking: "PENDING",
        payload: "PENDING",
      });
      setSuccess(false);
    } finally {
      clearInterval(interval);
      setIsEmbedding(false);
    }
  };

  const isWaveVisible = isEmbedding && progress < 100;

  return (
    <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Hero Header */}
      <header className="mb-12">
        <h1 className="text-6xl font-headline font-bold tracking-tighter mb-4 text-primary">
          Watermark Embed
        </h1>
        <p className="text-on-surface-variant max-w-2xl font-light leading-relaxed">
          Secure your intellectual property with inaudible forensic markers.
          Deploy the silent sentinel across your digital assets with surgical
          precision.
        </p>
      </header>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Configuration */}
        <div className="lg:col-span-7 space-y-8">
          {/* Upload Section */}
          <section className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/15">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-xl uppercase tracking-widest text-primary-fixed-dim">
                Source Asset
              </h2>
              <span className="text-[10px] text-slate-500 uppercase tracking-tighter">
                Secure Uplink Active
              </span>
            </div>
            <label className="relative group cursor-pointer border-2 border-dashed border-outline-variant/30 rounded-xl p-12 flex flex-col items-center justify-center transition-all duration-500 hover:border-primary-container/50 hover:bg-surface-container">
              <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span
                  className="material-symbols-outlined text-primary-container text-3xl"
                  data-icon="cloud_upload"
                >
                  cloud_upload
                </span>
              </div>
              <p className="font-headline text-lg mb-1">
                {file ? file.name : "Drop audio or video files"}
              </p>
              <p className="text-on-surface-variant text-sm font-light">
                Supports WAV, MP3, MP4 (Max 2GB)
              </p>
              <input
                className="absolute inset-0 opacity-0 cursor-pointer"
                type="file"
                onChange={handleFileChange}
              />
            </label>
          </section>

          {/* Metadata Form */}
          <section className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/15">
            <h2 className="font-headline text-xl uppercase tracking-widest text-primary-fixed-dim mb-8">
              Cipher Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-[0.15em] text-slate-500 font-headline">
                  User ID
                </label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none transition-all placeholder:text-slate-700"
                  placeholder="SC-992-X"
                  type="text"
                  value={user ? user.id : "SC-992-X"}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-[0.15em] text-slate-500 font-headline">
                  Content ID
                </label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none transition-all placeholder:text-slate-700"
                  placeholder="ASSET_ALPHA_01"
                  type="text"
                  value={contentId}
                  onChange={handleContentIdChange}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs uppercase tracking-[0.15em] text-slate-500 font-headline">
                  Timestamp
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-slate-400 outline-none"
                    readOnly
                    type="text"
                    value={
                      new Date()
                        .toISOString()
                        .replace("T", " ")
                        .slice(0, 19) + " UTC"
                    }
                  />
                  <span
                    className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
                    data-icon="schedule"
                  >
                    schedule
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <button
                type="button"
                onClick={handleGenerateWatermark}
                disabled={isEmbedding}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-lg font-headline font-bold uppercase tracking-widest transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span
                    className="material-symbols-outlined"
                    data-icon="fingerprint"
                  >
                    fingerprint
                  </span>
                  {isEmbedding ? "Embedding..." : "Generate Watermark"}
                </span>
              </button>
            </div>

            {downloadUrl && (
              <div className="mt-4 text-center">
                <a
                  href={downloadUrl}
                  download="watermarked_output.mp4"
                  onClick={() => {
                    setTimeout(() => {
                      resetAll();
                    }, 500);
                  }}
                  className="text-primary underline"
                >
                  Download Watermarked File
                </a>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Visualization & Status */}
        <div className="lg:col-span-5 space-y-8">
          {/* Waveform Scanning Section */}
          <section className="bg-surface-container-high p-8 rounded-xl border border-outline-variant/15 flex flex-col h-full min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline text-xl uppercase tracking-widest text-tertiary-fixed-dim">
                Embedding Engine
              </h2>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isEmbedding
                      ? "bg-primary shadow-[0_0_12px_rgba(0,242,255,0.8)]"
                      : success
                      ? "bg-primary"
                      : "bg-slate-600"
                  }`}
                />
                <span className="text-[10px] uppercase tracking-tighter">
                  {isEmbedding ? "Analyzing" : success ? "Complete" : "Idle"}
                </span>
              </div>
            </div>

            {/* Wave block */}
            <div className="flex-grow flex items-center justify-center mb-8 relative">
              {isWaveVisible ? (
                <>
                  <div className="flex items-end gap-[3px] h-48 w-full justify-center px-4">
                    {[
                      40, 70, 50, 90, 60, 30, 80, 55, 100, 45, 75, 35, 65, 85,
                      50,
                    ].map((height, idx) => {
                      const delays = [
                        0.1, 0.3, 0.2, 0.5, 0.4, 0.7, 0.6, 0.2, 0.8, 0.1, 0.9,
                        0.3, 0.5, 0.7, 0.4,
                      ];
                      return (
                        <div
                          key={idx}
                          className="waveform-bar w-1 rounded-full bg-gradient-to-t from-primary-container to-tertiary-container animate-waveUpDown"
                          style={{
                            animationDelay: `${delays[idx]}s`,
                            height: `${height}%`,
                          }}
                        />
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="h-48 w-full" />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-headline uppercase tracking-wider">
                  Bitstream Analysis
                </span>
                <span className="text-primary font-mono">
                  {progress < 30
                    ? `RUNNING ${progress}%`
                    : status.bitstream === "COMPLETE"
                    ? "COMPLETE 100%"
                    : `RUNNING ${progress}%`}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-headline uppercase tracking-wider">
                  Masking Thresholds
                </span>
                <span className="text-primary font-mono">
                  {progress < 60
                    ? `RUNNING ${Math.max(progress - 20, 0)}%`
                    : status.masking === "OPTIMIZED"
                    ? "OPTIMIZED 100%"
                    : `RUNNING ${Math.max(progress - 20, 0)}%`}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-headline uppercase tracking-wider">
                  Payload Injection
                </span>
                <span className="text-primary font-mono">
                  {progress < 100
                    ? `RUNNING ${Math.max(progress - 40, 0)}%`
                    : status.payload === "COMPLETE"
                    ? "COMPLETE 100%"
                    : `RUNNING ${Math.max(progress - 40, 0)}%`}
                </span>
              </div>

              <div
                className={`mt-8 p-4 border rounded-lg flex items-center gap-4 ${
                  success
                    ? "bg-primary-container/20 border-primary-container text-primary-container"
                    : "bg-primary-container/10 border-primary-container/20 opacity-30"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  data-icon="verified"
                >
                  verified
                </span>
                <p className="text-sm font-medium">
                  Cipher successfully embedded. Finalizing manifest...
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default SonicCipherEmbed;















