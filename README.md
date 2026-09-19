# MustTrust

E-commerce review authentication and Aspect-Based Sentiment Analysis (ABSA) system. Classifies whether customer feedback is genuine or deceptive using a trained Multinomial Naive Bayes model and extracts sentiment across granular product dimensions (build quality, battery life, packaging, value) to compute trust scores.

**Live Demo:** [https://trust-is-must.vercel.app](https://trust-is-must.vercel.app/)

## Features

- **Fake Review Detection**: Multinomial Naive Bayes model trained with Scikit-Learn and NLTK on e-commerce review datasets.
- **Aspect-Based Sentiment Analysis (ABSA)**: Parses customer reviews into key attribute categories (delivery speed, build quality, customer support, price-to-performance).
- **Product Trust Scoring**: Aggregates verified vs. suspicious review metrics into an overall product credibility score.
- **Interactive Web Interface**: React frontend with side-by-side product comparisons, aspect score breakdowns, and PDF summary exports.

## Tech Stack

- **Frontend**: React, React-Bootstrap, Axios, jsPDF
- **Backend**: Node.js, Express, MongoDB / Mongoose
- **Machine Learning**: Python, Scikit-Learn, NLTK, Joblib

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.8+ (for model scripts)
- MongoDB (optional, for persistent review history)

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```
The API server starts on `http://localhost:5000`.

### 2. Frontend Setup

From the project root:

```bash
npm install
npm start
```
The application opens at `http://localhost:3000`.

### ML Artifacts & Notebooks

Pre-trained model weights and training pipelines are located in `Daraz_Reviews/`:
- `naive_bayes_model.joblib`: Serialized Naive Bayes classifier
- `count_vectorizer.joblib`: Trained text vectorizer
- `darazReviews.ipynb`: Data cleaning, preprocessing, and training pipeline

## License

MIT
