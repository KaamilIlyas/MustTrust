import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Header.css';
import jsPDF from 'jspdf';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const Header = () => {
    const [url, setUrl] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [aspectReportData, setAspectReportData] = useState(null);
    const [showAspectModal, setShowAspectModal] = useState(false);
    const [loadingSentiment, setLoadingSentiment] = useState(false);
    const [loadingAspect, setLoadingAspect] = useState(false);
    const [toast, setToast] = useState(null); // { message, type: 'error' | 'success' | 'info' }

    const toastTimerRef = useRef(null);

    // Show toast with auto-hide after 7 seconds
    const showToast = (message, type = 'info') => {
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }
        setToast({ message, type });
        toastTimerRef.current = setTimeout(() => {
            setToast(null);
        }, 7000);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (toastTimerRef.current) {
                clearTimeout(toastTimerRef.current);
            }
        };
    }, []);

    // Function to handle input change
    const handleInputChange = (e) => {
        setUrl(e.target.value);
    };

    // Function to handle sentiment analysis
    const handleAnalyzeSentiment = async () => {
        if (!url || !url.trim()) {
            showToast('Please enter a Daraz product URL.', 'error');
            return;
        }

        setLoadingSentiment(true);
        try {
            const response = await axios.post(`${API_URL}/get_reviews`, {
                url: url.trim()
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.error) {
                setResponseData(null);
                showToast(response.data.error, 'error');
            } else {
                setResponseData(response.data);
                showToast(`Analysis complete! ${response.data.review_count} actual reviews evaluated.`, 'success');
            }
            // URL is preserved so user doesn't have to re-paste for aspect analysis
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to connect to backend. Please ensure the server is running.', 'error');
        } finally {
            setLoadingSentiment(false);
        }
    };

    // Function to handle aspect-based analysis (opens in-app white sheet modal)
    const handleAnalyzeAspect = async () => {
        if (!url || !url.trim()) {
            showToast('Please enter a Daraz product URL.', 'error');
            return;
        }

        setLoadingAspect(true);
        try {
            const response = await axios.post(`${API_URL}/aspect_based_analysis`, {
                url: url.trim()
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.error) {
                showToast(response.data.error, 'error');
                return;
            }

            if (!response.data.aspect_extraction_results || response.data.aspect_extraction_results.length === 0) {
                showToast('No aspect terms could be extracted from the reviews.', 'warning');
                return;
            }

            // Open in-app white sheet report modal (do not download straightaway)
            setAspectReportData(response.data);
            setShowAspectModal(true);
            showToast('Aspect report generated! You can preview or download below.', 'success');
            // URL is preserved
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to analyze aspects. Please ensure backend is running.', 'error');
        } finally {
            setLoadingAspect(false);
        }
    };

    // Download PDF when user explicitly clicks "Download Report"
    const handleDownloadPDF = () => {
        if (!aspectReportData || !aspectReportData.aspect_extraction_results) return;

        const doc = new jsPDF();
        let posY = 20;

        doc.setFontSize(18);
        doc.text(20, posY, 'Aspect Extraction Results');
        posY += 10;

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(20, posY, `Total Reviews Evaluated: ${aspectReportData.review_count || 'N/A'}`);
        posY += 10;
        doc.setTextColor(0);

        aspectReportData.aspect_extraction_results.forEach((result, index) => {
            doc.setFontSize(12);
            doc.text(20, posY, `Review ${index + 1}`);
            posY += 7;

            doc.setFontSize(10);
            const sentenceLines = doc.splitTextToSize(`Sentence: ${result.sentence}`, 150);
            doc.text(20, posY, sentenceLines);
            posY += (sentenceLines.length * 7);

            const aspectLines = doc.splitTextToSize(`Aspect: ${result.aspect.join(", ")}`, 150);
            doc.text(20, posY, aspectLines);
            posY += (aspectLines.length * 7);

            const sentimentLines = doc.splitTextToSize(`Sentiment: ${result.sentiment.join(", ")}`, 150);
            doc.text(20, posY, sentimentLines);
            posY += (sentimentLines.length * 7);

            posY += 5; // Add spacing between reviews

            if (posY > 270) {
                doc.addPage();
                posY = 20;
            }
        });

        doc.save('aspect_extraction_results.pdf');
        showToast('Report downloaded as PDF!', 'success');
    };

    return (
        <header>
            <div id='home' className="header-overlay">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h1>TrustIsMust</h1>
                            <p>Trust based rating system that provides sentiment and aspect based analysis of the reviews.</p>
                            <form onSubmit={(e) => { e.preventDefault(); handleAnalyzeSentiment(); }}>
                                <input
                                    type="text"
                                    placeholder="Enter URL of a Daraz product"
                                    value={url}
                                    onChange={handleInputChange}
                                />
                            </form>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button
                            type="button"
                            className="btn-submit hover-effect-px"
                            onClick={handleAnalyzeSentiment}
                            disabled={loadingSentiment}
                        >
                            {loadingSentiment ? 'Analyzing Sentiment...' : 'Analyze Sentiment'}
                        </button>
                        <button
                            type="button"
                            className="btn-submit hover-effect-px"
                            onClick={handleAnalyzeAspect}
                            disabled={loadingAspect}
                        >
                            {loadingAspect ? 'Extracting Aspects...' : 'Analyze Aspect'}
                        </button>
                    </div>

                    {/* User-friendly Sentiment Results Card */}
                    {responseData && !responseData.error && (
                        <div className="sentiment-results-card">
                            <div className="results-card-header">
                                <div className="results-card-title">
                                    <span className="results-icon">📊</span>
                                    <h3>Sentiment Analysis Results</h3>
                                </div>
                                <button
                                    type="button"
                                    className="results-close-btn"
                                    onClick={() => setResponseData(null)}
                                    title="Dismiss results"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="results-card-body">
                                <div className="results-score-row">
                                    <div className="results-score-box">
                                        <span className="results-score-label">Sentiment Score</span>
                                        <div className="results-score-value">
                                            {responseData.average_sentiment ? responseData.average_sentiment.toFixed(2) : 'N/A'}
                                            <span className="results-score-max"> / 5.0</span>
                                        </div>
                                    </div>
                                    <div className="results-progress-container">
                                        <div
                                            className={`results-progress-bar ${
                                                responseData.average_sentiment >= 3.4 ? 'positive' : 'negative'
                                            }`}
                                            style={{
                                                width: `${Math.min(100, Math.max(10, ((responseData.average_sentiment || 0) / 5) * 100))}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="results-badges-grid">
                                    <div className="results-badge-item">
                                        <span className="badge-item-label">Actual Reviews</span>
                                        <span className="badge-item-value count-pill">
                                            {responseData.review_count} verified reviews
                                        </span>
                                    </div>
                                    <div className="results-badge-item">
                                        <span className="badge-item-label">Overall Sentiment</span>
                                        <span
                                            className={`badge-item-value sentiment-pill ${
                                                responseData.average_sentiment >= 3.4 ? 'positive' : 'negative'
                                            }`}
                                        >
                                            {responseData.average_sentiment >= 3.4 ? '✓ Positive' : '✗ Negative'}
                                        </span>
                                    </div>
                                    <div className="results-badge-item">
                                        <span className="badge-item-label">Review Authenticity</span>
                                        <span
                                            className={`badge-item-value auth-pill ${
                                                responseData.result === 'Truthful' ? 'truthful' : 'deceptive'
                                            }`}
                                        >
                                            {responseData.result === 'Truthful' ? '★ Truthful' : '⚠ Deceptive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* In-App White Sheet Aspect Report Modal */}
            {showAspectModal && aspectReportData && (
                <div className="aspect-modal-backdrop" onClick={() => setShowAspectModal(false)}>
                    <div className="aspect-modal-sheet" onClick={(e) => e.stopPropagation()}>
                        {/* Top Bar */}
                        <div className="sheet-top-bar">
                            <div className="sheet-title-group">
                                <h3>Aspect Extraction Report</h3>
                                <span className="sheet-subtitle">
                                    {aspectReportData.review_count} reviews analyzed • {aspectReportData.aspect_extraction_results.length} sentences extracted
                                </span>
                            </div>
                            <div className="sheet-top-actions">
                                <button type="button" className="btn-sheet-download" onClick={handleDownloadPDF}>
                                    ⬇ Download Report
                                </button>
                                <button
                                    type="button"
                                    className="btn-sheet-close"
                                    onClick={() => setShowAspectModal(false)}
                                    title="Close preview"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>

                        {/* Printable White Sheet Preview Body */}
                        <div className="sheet-content-scroll">
                            <div className="sheet-paper">
                                <div className="paper-header">
                                    <h2>TrustIsMust Aspect Extraction Results</h2>
                                    <p className="paper-meta">
                                        Date: {new Date().toLocaleDateString()} • Extracted from verified Daraz product customer reviews
                                    </p>
                                    <hr className="paper-divider" />
                                </div>

                                <div className="paper-reviews-list">
                                    {aspectReportData.aspect_extraction_results.map((result, idx) => {
                                        const overallSentiment = result.sentiment && result.sentiment[0] ? result.sentiment[0] : 'Neutral';
                                        return (
                                            <div className="paper-review-card" key={idx}>
                                                <div className="paper-review-header">
                                                    <span className="review-num-tag">Review {idx + 1}</span>
                                                    <span className={`review-sentiment-tag ${overallSentiment.toLowerCase()}`}>
                                                        {overallSentiment}
                                                    </span>
                                                </div>
                                                <p className="paper-sentence">"{result.sentence}"</p>
                                                <div className="paper-aspects-row">
                                                    <span className="aspects-label">Aspects:</span>
                                                    <div className="aspects-tags-container">
                                                        {result.aspect && result.aspect.map((asp, aIdx) => (
                                                            <span className="aspect-tag-pill" key={aIdx}>
                                                                {asp}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="sheet-bottom-bar">
                            <button type="button" className="btn-sheet-cancel" onClick={() => setShowAspectModal(false)}>
                                Close
                            </button>
                            <button type="button" className="btn-sheet-download" onClick={handleDownloadPDF}>
                                ⬇ Download Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom-Left Responsive Toast Notification (Auto-hides after 7s) */}
            {toast && (
                <div className="toast-container-bl" role="alert" aria-live="assertive">
                    <div className={`toast-card-bl ${toast.type}`}>
                        <div className="toast-icon">
                            {toast.type === 'error' && '⚠️'}
                            {toast.type === 'success' && '✅'}
                            {toast.type === 'warning' && '⚡'}
                            {toast.type === 'info' && 'ℹ️'}
                        </div>
                        <div className="toast-message-content">
                            <span className="toast-title">
                                {toast.type === 'error' ? 'Error' : toast.type === 'success' ? 'Success' : 'Notice'}
                            </span>
                            <p className="toast-text">{toast.message}</p>
                        </div>
                        <button
                            type="button"
                            className="toast-close-button"
                            onClick={() => setToast(null)}
                            aria-label="Close notification"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
