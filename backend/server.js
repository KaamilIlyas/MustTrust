const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Sentiment = require('sentiment');

const app = express();
const PORT = process.env.PORT || 3001;
const sentimentAnalyzer = new Sentiment();

// Configure CORS & JSON parsing
app.use(cors());
app.use(express.json());

// List of recognized product aspects
const PRODUCT_ASPECTS = [
    'battery life', 'battery', 'camera', 'screen', 'display', 'sound', 'audio',
    'speaker', 'build quality', 'build', 'quality', 'delivery', 'shipping',
    'packaging', 'package', 'price', 'value', 'performance', 'speed',
    'design', 'material', 'charging', 'charger', 'durability', 'size',
    'service', 'comfort', 'color', 'weight', 'seller', 'print quality', 'print speed'
];

// Helper: Extract Daraz Item ID from various URL formats
function extractDarazItemId(url) {
    if (!url || typeof url !== 'string') return null;
    const clean = url.trim();
    // 1. Format: -i12345678-
    const m1 = clean.match(/-i(\d+)/i);
    if (m1) return m1[1];
    // 2. Format: itemId=12345678
    const m2 = clean.match(/[?&]itemId=(\d+)/i);
    if (m2) return m2[1];
    // 3. Format: i12345678.html
    const m3 = clean.match(/i(\d+)\.html/i);
    if (m3) return m3[1];
    // 4. Raw numeric ID
    if (/^\d+$/.test(clean)) return clean;
    return null;
}

// Helper: Fetch real reviews from Daraz API across multiple pages
async function fetchDarazReviews(url) {
    const itemId = extractDarazItemId(url);
    if (!itemId) {
        return {
            success: false,
            error: 'Invalid Daraz product URL. Could not extract product ID.',
            reviews: []
        };
    }

    const reviews = [];
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://www.daraz.pk/',
        'Accept-Language': 'en-US,en;q=0.9',
    };

    // Daraz limits pageSize (must be <= 30). We fetch page 1 and page 2 to gather up to 40 real reviews.
    for (let page = 1; page <= 2; page++) {
        try {
            const darazApiUrl = 'https://my.daraz.pk/pdp/review/getReviewList';
            const res = await axios.get(darazApiUrl, {
                params: {
                    itemId: itemId,
                    pageSize: 20,
                    pageNo: page
                },
                headers,
                timeout: 7000
            });

            if (res.status === 200 && res.data && res.data.model && Array.isArray(res.data.model.items)) {
                const items = res.data.model.items;
                for (const item of items) {
                    const text = item.reviewContent;
                    if (text && typeof text === 'string' && text.trim().length > 1) {
                        reviews.push({
                            content: text.trim(),
                            rating: item.rating ? Number(item.rating) : null,
                            buyer: item.buyerName || 'Verified Buyer',
                            date: item.reviewTime || ''
                        });
                    }
                }
                // If fewer items returned than page size, no further pages exist
                if (items.length < 20) break;
            } else {
                break;
            }
        } catch (err) {
            console.warn(`Error fetching Daraz page ${page} for item ${itemId}:`, err.message);
            break;
        }
    }

    return {
        success: true,
        itemId,
        reviews
    };
}

// Helper: Calculate sentiment score (1.0 to 5.0) combining NLP score and star rating
function scoreSentiment(reviewObj) {
    const text = reviewObj.content;
    const nlpRes = sentimentAnalyzer.analyze(text);
    // NLP comparative: -1.0 to +1.0 mapped to 1.0 to 5.0 scale (0 maps to 3.0)
    let nlpScore = 3.0 + (nlpRes.comparative * 2.5);
    nlpScore = Math.max(1.0, Math.min(5.0, nlpScore));

    // If actual Daraz star rating (1-5) exists, blend them for high accuracy
    if (reviewObj.rating && reviewObj.rating >= 1 && reviewObj.rating <= 5) {
        return (0.6 * reviewObj.rating) + (0.4 * nlpScore);
    }
    return nlpScore;
}

// Helper: Aspect-based analysis from review sentence
function extractAspectsFromReview(sentence) {
    const lower = sentence.toLowerCase();
    const matched = [];

    for (const aspect of PRODUCT_ASPECTS) {
        if (lower.includes(aspect) && !matched.some(m => m.includes(aspect))) {
            matched.push(aspect);
        }
    }

    if (matched.length === 0) {
        matched.push('general quality');
    }

    const res = sentimentAnalyzer.analyze(sentence);
    const sentimentLabel = res.comparative > 0.05 ? 'Positive' : res.comparative < -0.05 ? 'Negative' : 'Neutral';

    return {
        sentence: sentence.trim(),
        aspect: matched,
        sentiment: matched.map(() => sentimentLabel)
    };
}

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// 1. Health check
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'MustTrust API backend is running.' });
});

// 2. Daraz Review & Sentiment Analysis
app.post('/get_reviews', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'Please enter a Daraz product URL.' });
        }

        const fetchResult = await fetchDarazReviews(url);
        if (!fetchResult.success) {
            return res.json({ error: fetchResult.error, review_count: 0 });
        }

        const reviews = fetchResult.reviews;

        // Rule: If less than 3 reviews, cannot reliably determine sentiment
        if (reviews.length === 0) {
            return res.json({
                error: 'No reviews found for this product. Cannot determine sentiment or aspect analysis.',
                review_count: 0
            });
        }

        if (reviews.length < 3) {
            return res.json({
                error: `Only ${reviews.length} review(s) found for this product. Sentiment cannot be reliably determined with less than 3 reviews.`,
                review_count: reviews.length
            });
        }

        // Calculate sentiment scores only from actual reviews
        const scores = reviews.map(r => scoreSentiment(r));
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const result = avgScore >= 3.0 ? 'Truthful' : 'Deceptive';

        return res.json({
            result,
            average_sentiment: parseFloat(avgScore.toFixed(2)),
            review_count: reviews.length
        });
    } catch (err) {
        console.error('Error in /get_reviews:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 3. Aspect-Based Analysis (Generates PDF data)
app.post('/aspect_based_analysis', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'Please enter a Daraz product URL.' });
        }

        const fetchResult = await fetchDarazReviews(url);
        if (!fetchResult.success) {
            return res.json({ error: fetchResult.error, review_count: 0 });
        }

        const reviews = fetchResult.reviews;

        // Rule: If less than 3 reviews, cannot reliably determine aspect report
        if (reviews.length === 0) {
            return res.json({
                error: 'No reviews found for this product. Cannot generate aspect analysis report.',
                review_count: 0
            });
        }

        if (reviews.length < 3) {
            return res.json({
                error: `Only ${reviews.length} review(s) found for this product. At least 3 reviews are required to generate an aspect analysis report.`,
                review_count: reviews.length
            });
        }

        const results = [];
        reviews.forEach(r => {
            // Split into sentences
            const sentences = r.content.split(/(?<=[.!?\n])\s+/).filter(s => s.trim().length > 4);
            sentences.forEach(s => {
                results.push(extractAspectsFromReview(s));
            });
        });

        return res.json({
            aspect_extraction_results: results,
            review_count: reviews.length
        });
    } catch (err) {
        console.error('Error in /aspect_based_analysis:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 4. Compare Products
app.post('/compare_products', async (req, res) => {
    try {
        const { urls } = req.body;
        if (!urls || !Array.isArray(urls) || urls.length < 2) {
            return res.status(400).json({ error: 'Please provide at least 2 URLs to compare.' });
        }

        const products = [];
        const sentiments = [];

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const fetchResult = await fetchDarazReviews(url);
            const reviews = fetchResult.reviews || [];

            if (reviews.length >= 3) {
                const scores = reviews.map(r => scoreSentiment(r));
                const avg = parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2));
                sentiments.push(avg);
                products.push({
                    url,
                    review_count: reviews.length,
                    average_sentiment: avg,
                    status: 'Analyzed'
                });
            } else {
                products.push({
                    url,
                    review_count: reviews.length,
                    average_sentiment: null,
                    status: reviews.length === 0 ? 'No reviews found' : `Insufficient reviews (${reviews.length}/3 required)`
                });
            }
        }

        const summary = sentiments.length > 0 ? {
            most_positive: Math.max(...sentiments),
            most_negative: Math.min(...sentiments)
        } : { most_positive: null, most_negative: null };

        return res.json({ products, summary });
    } catch (err) {
        console.error('Error in /compare_products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 5. Contact Form Submission
app.post('/submit', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    console.log('Contact form submission:', { name, email, message });
    res.status(200).json({ success: true, message: 'Form submitted successfully' });
});

// 6. Email Subscription
app.post('/subscribe', (req, res) => {
    const { email } = req.body;
    if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Email is required.' });
    }
    console.log('Newsletter subscription:', { email });
    res.status(200).json({ success: true, message: 'Email subscribed successfully' });
});

// Start server locally when run directly (node server.js or npm start)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`MustTrust backend is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
