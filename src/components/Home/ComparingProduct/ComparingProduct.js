import React, { useState } from 'react';
import axios from 'axios';
import './ComparingProduct.css';

export default function ComparingProduct() {
    const [urlOne, setUrlOne] = useState('');
    const [urlTwo, setUrlTwo] = useState('');
    const [comparisonResult, setComparisonResult] = useState(null);

    const handleUrlChange = (e, setUrl) => {
        setUrl(e.target.value);
    };

    const handleCompare = (e) => {
        e.preventDefault(); // Prevent the form from submitting traditionally

        axios.post('http://127.0.0.1:5000/compare_products', {
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
            alert('Failed to compare products');
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
                            <p key={index}>Product {index + 1} Sentiment Score: {product.average_sentiment.toFixed(2)}/5</p>
                        ))}

                        {comparisonResult.summary && (
                            <>
                                <p>Better Product Sentiment: {comparisonResult.summary.most_positive.toFixed(2)}</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
