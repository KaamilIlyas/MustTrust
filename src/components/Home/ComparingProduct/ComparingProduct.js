import React, { useState } from 'react';
import axios from 'axios';
import './ComparingProduct.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function ComparingProduct() {
    const [urlOne, setUrlOne] = useState('');
    const [urlTwo, setUrlTwo] = useState('');
    const [comparisonResult, setComparisonResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null); // { message, type: 'error' }

    const showToast = (message) => {
        // Error toast stays visible until user crosses it out
        setToast({ message, type: 'error' });
    };

    const handleUrlChange = (e, setUrl) => {
        setUrl(e.target.value);
    };

    const handleCompare = async (e) => {
        e.preventDefault();

        if (!urlOne.trim() || !urlTwo.trim()) {
            showToast('Please enter both product URLs to compare.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/compare_products`, {
                urls: [urlOne.trim(), urlTwo.trim()]
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.error) {
                showToast(response.data.error);
                setComparisonResult(null);
            } else {
                setComparisonResult(response.data);
                // URLs stay populated so user doesn't have to re-enter them
                // No success message is shown
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to compare products. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    // Helper: Determine top recommended product index
    const getTopProductIndex = () => {
        if (!comparisonResult || !comparisonResult.products) return -1;
        const p0 = comparisonResult.products[0]?.average_sentiment;
        const p1 = comparisonResult.products[1]?.average_sentiment;
        if (p0 !== null && p1 !== null) {
            if (p0 > p1) return 0;
            if (p1 > p0) return 1;
            return -2; // tied
        }
        if (p0 !== null) return 0;
        if (p1 !== null) return 1;
        return -1;
    };

    const topIndex = getTopProductIndex();

    return (
        <section id="comparing-product">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <h2 className="price__title">Compare Products</h2>
                        <div className="section-title-border"></div>
                        <p className="price__subtitle">
                            Easily compare two products side by side. Paste the URLs below to generate sentiment scores based on verified customer feedback.
                        </p>
                    </div>
                </div>

                <div className="compare-form-wrapper">
                    <form id="comparison-form" onSubmit={handleCompare} className="compare-inputs-form">
                        <div className="compare-inputs-row">
                            <input
                                type="text"
                                className="compare-input"
                                placeholder="First product Daraz URL"
                                value={urlOne}
                                onChange={(e) => handleUrlChange(e, setUrlOne)}
                            />
                            <span className="compare-vs-badge">VS</span>
                            <input
                                type="text"
                                className="compare-input"
                                placeholder="Second product Daraz URL"
                                value={urlTwo}
                                onChange={(e) => handleUrlChange(e, setUrlTwo)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-submit hover-effect-px compare-action-btn"
                            disabled={loading}
                        >
                            {loading ? 'Comparing Products...' : 'Compare Products'}
                        </button>
                    </form>
                </div>

                {/* Modern User-Friendly Comparison Card */}
                {comparisonResult && comparisonResult.products && (
                    <div className="comparison-results-card">
                        <div className="comparison-card-header">
                            <div className="comparison-card-title">
                                <span className="comparison-icon">⚖️</span>
                                <h3>Product Comparison Results</h3>
                            </div>
                            <button
                                type="button"
                                className="comparison-close-btn"
                                onClick={() => setComparisonResult(null)}
                                title="Dismiss comparison"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Top Winner Summary Highlight */}
                        {comparisonResult.summary && comparisonResult.summary.most_positive !== null && (
                            <div className="comparison-winner-banner">
                                <span className="winner-trophy">🏆</span>
                                <div className="winner-info">
                                    <span className="winner-label">Top Recommended Product</span>
                                    <span className="winner-score">
                                        {topIndex >= 0 ? `Product ${topIndex + 1}` : 'Tie'} with Sentiment Score of{' '}
                                        <strong>{comparisonResult.summary.most_positive.toFixed(2)} / 5.0</strong>
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Side-by-side Product Cards Grid */}
                        <div className="comparison-grid">
                            {comparisonResult.products.map((product, index) => {
                                const hasReviews = product.average_sentiment !== null;
                                const isWinner = topIndex === index;
                                const score = hasReviews ? product.average_sentiment : 0;
                                const percentage = Math.min(100, Math.max(10, (score / 5) * 100));

                                return (
                                    <div
                                        key={index}
                                        className={`compare-product-item ${isWinner ? 'winner-card' : ''}`}
                                    >
                                        <div className="product-item-top">
                                            <span className="product-item-title">Product {index + 1}</span>
                                            {isWinner && <span className="product-winner-tag">★ Top Pick</span>}
                                        </div>

                                        <div className="product-score-display">
                                            {hasReviews ? (
                                                <>
                                                    <div className="product-score-number">
                                                        {score.toFixed(2)}
                                                        <span className="product-score-denom"> / 5.0</span>
                                                    </div>
                                                    <div className="product-progress-track">
                                                        <div
                                                            className={`product-progress-fill ${
                                                                score >= 3.4 ? 'positive' : 'negative'
                                                            }`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="insufficient-score-notice">
                                                    <span className="notice-icon">⚠️</span>
                                                    <span className="notice-msg">
                                                        {product.status || 'Less than 3 reviews found'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="product-meta-row">
                                            <span className="product-reviews-badge">
                                                {product.review_count !== undefined
                                                    ? `${product.review_count} actual reviews`
                                                    : 'No reviews'}
                                            </span>
                                            <span
                                                className={`product-status-pill ${
                                                    hasReviews
                                                        ? score >= 3.4
                                                            ? 'positive'
                                                            : 'negative'
                                                        : 'warning'
                                                }`}
                                            >
                                                {hasReviews
                                                    ? score >= 3.4
                                                        ? 'Positive Sentiment'
                                                        : 'Negative Sentiment'
                                                    : 'Cannot Determine'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom-Left Responsive Toast Notification (Error stays until crossed) */}
            {toast && (
                <div className="toast-container-bl" role="alert" aria-live="assertive">
                    <div className="toast-card-bl error">
                        <div className="toast-icon">⚠️</div>
                        <div className="toast-message-content">
                            <span className="toast-title">Error</span>
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
        </section>
    );
}
