import React, { useState } from 'react';
import axios from 'axios';
import './ComparingProduct.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function ComparingProduct() {
    const [urlOne, setUrlOne] = useState('');
    const [urlTwo, setUrlTwo] = useState('');
    const [comparisonResult, setComparisonResult] = useState(null);

    const handleUrlChange = (e, setUrl) => {
        setUrl(e.target.value);
    };

    const handleCompare = (e) => {
        e.preventDefault(); // Prevent the form from submitting traditionally

        axios.post(`${API_URL}/compare_products`, {
            urls: [urlOne, urlTwo]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            setComparisonResult(response.data);
            // Reset URL states after displaying results
            setUrlOne('');
            setUrlTwo('');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to compare products. Ensure backend is running.');
        });
    };

    return (
        <section id="comparing-product">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <h2 className="price__title">Paste URL Below</h2> 
                        <div className="section-title-border"></div>
                        <p className="price__subtitle">Easily compare two different products side by side with our intuitive comparison tool. Simply paste the URLs of the products you want to compare into the designated text boxes, and instantly generate sentiment scores for each product.</p>
                    </div>
                </div>
            </div>

            <div>
            <form id="comparison-form" onSubmit={handleCompare}>
            <input type="text" className='first-url' placeholder="First product URL" value={urlOne} onChange={(e) => handleUrlChange(e, setUrlOne)} />
            <input type="text" className='second-url' placeholder="Second product URL" value={urlTwo} onChange={(e) => handleUrlChange(e, setUrlTwo)} />
            </form>
            <button type="submit" form="comparison-form" className="btn-submit hover-effect-px">Compare</button>

                {comparisonResult && (
                    <div className="comparison-results">
                        <br></br>
                        <h3>Comparison Results</h3>
                        {comparisonResult.products.map((product, index) => (
                            <p key={index}>
                                <strong>Product {index + 1}:</strong> {product.average_sentiment !== null
                                    ? `Sentiment Score: ${product.average_sentiment.toFixed(2)}/5 (${product.review_count} actual reviews)`
                                    : `${product.status || 'Less than 3 reviews (cannot determine sentiment)'}`}
                            </p>
                        ))}

                        {comparisonResult.summary && comparisonResult.summary.most_positive !== null && (
                            <p><strong>Top Recommended Product Score:</strong> {comparisonResult.summary.most_positive.toFixed(2)}/5</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
