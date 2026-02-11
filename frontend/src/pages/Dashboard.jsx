import { useState, useEffect } from 'react';
import { watermarkService } from '../services/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('embed');
  const [file, setFile] = useState(null);
  const [contentId, setContentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [detectionResult, setDetectionResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    try {
      const data = await watermarkService.getHistory();
      setHistory(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load history' });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleEmbedWatermark = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const blob = await watermarkService.embedWatermark(file, contentId);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked_${file.name.split('.')[0]}.wav`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage({ type: 'success', text: 'Watermark embedded successfully! File downloaded.' });
      setFile(null);
      setContentId('');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to embed watermark' });
    } finally {
      setLoading(false);
    }
  };

  const handleDetectWatermark = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    setDetectionResult(null);

    try {
      const result = await watermarkService.detectWatermark(file);
      setDetectionResult(result);
      
      if (result.detected) {
        setMessage({ type: 'success', text: 'Watermark detected successfully!' });
      } else {
        setMessage({ type: 'error', text: 'No watermark detected in this file' });
      }
      
      setFile(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to detect watermark' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="container" style={{ marginTop: '40px' }}>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'embed' ? 'active' : ''}`}
            onClick={() => setActiveTab('embed')}
          >
            Embed Watermark
          </button>
          <button
            className={`tab ${activeTab === 'detect' ? 'active' : ''}`}
            onClick={() => setActiveTab('detect')}
          >
            Detect Watermark
          </button>
          <button
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        {message.text && (
          <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
            {message.text}
          </div>
        )}

        {activeTab === 'embed' && (
          <div className="card">
            <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>Embed Watermark</h2>
            
            <form onSubmit={handleEmbedWatermark}>
              <div
                className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload-embed').click()}
              >
                <input
                  id="file-upload-embed"
                  type="file"
                  className="file-input-hidden"
                  accept="audio/*,video/*"
                  onChange={handleFileChange}
                />
                {file ? (
                  <p style={{ color: 'var(--primary)', fontWeight: '500' }}>
                    Selected: {file.name}
                  </p>
                ) : (
                  <>
                    <p style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                      Drag and drop your audio/video file here
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      or click to browse
                    </p>
                  </>
                )}
              </div>

              <div className="input-group" style={{ marginTop: '24px' }}>
                <label htmlFor="contentId">Content ID (optional)</label>
                <input
                  id="contentId"
                  type="text"
                  value={contentId}
                  onChange={(e) => setContentId(e.target.value)}
                  placeholder="Enter content identifier"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading || !file}
              >
                {loading ? 'Processing...' : 'Embed Watermark'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'detect' && (
          <div className="card">
            <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>Detect Watermark</h2>
            
            <form onSubmit={handleDetectWatermark}>
              <div
                className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload-detect').click()}
              >
                <input
                  id="file-upload-detect"
                  type="file"
                  className="file-input-hidden"
                  accept="audio/*,video/*"
                  onChange={handleFileChange}
                />
                {file ? (
                  <p style={{ color: 'var(--primary)', fontWeight: '500' }}>
                    Selected: {file.name}
                  </p>
                ) : (
                  <>
                    <p style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                      Drag and drop your audio/video file here
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      or click to browse
                    </p>
                  </>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '24px' }}
                disabled={loading || !file}
              >
                {loading ? 'Detecting...' : 'Detect Watermark'}
              </button>
            </form>

            {detectionResult && detectionResult.detected && (
              <div className="detection-result">
                <h3>Detection Result</h3>
                <div className="detection-info">
                  <p><strong>Status:</strong> Watermark Detected</p>
                  {detectionResult.watermark_id && (
                    <p><strong>Watermark ID:</strong> {detectionResult.watermark_id.substring(0, 16)}...</p>
                  )}
                  {detectionResult.user_email && (
                    <p><strong>Source User:</strong> {detectionResult.user_email}</p>
                  )}
                  {detectionResult.content_id && (
                    <p><strong>Content ID:</strong> {detectionResult.content_id}</p>
                  )}
                  {detectionResult.timestamp && (
                    <p><strong>Timestamp:</strong> {new Date(detectionResult.timestamp).toLocaleString()}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="card">
            <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>Watermark History</h2>
            
            {history.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                No watermark history found
              </p>
            ) : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Original File</th>
                    <th>Content ID</th>
                    <th>Watermark ID</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record._id}>
                      <td>{record.original_filename}</td>
                      <td>{record.content_id}</td>
                      <td>{record.watermark_id.substring(0, 16)}...</td>
                      <td>{new Date(record.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
