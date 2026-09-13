import React, { useState } from 'react';
import axios from 'axios';
import './Header.css';
import jsPDF from 'jspdf';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const Header = () => {
    const [url, setUrl] = useState(''); // State to store the input URL
    const [responseData, setResponseData] = useState(null); // State to store the response data

    // Function to handle input change
    const handleInputChange = (e) => {
        setUrl(e.target.value);
    };

    // Function to handle sentiment analysis
    const handleAnalyzeSentiment = async () => {
        if (!url) {
            alert('Please enter a URL');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/get_reviews`, {
                url: url
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data);
            setResponseData(response.data); // Update the state with the response data
            setUrl(''); // Reset the URL input field

            // Check if the result contains an error or insufficient reviews notice
            if (response.data.error) {
                alert(response.data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to analyze sentiment. Ensure backend is running.');
        }
    };

    // Function to handle aspect-based analysis
    const handleAnalyzeAspect = async () => {
        if (!url) {
            alert('Please enter a URL');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/aspect_based_analysis`, {
                url: url
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data);
            if (response.data.error) {
                alert(response.data.error);
                return;
            }
            if (!response.data.aspect_extraction_results || response.data.aspect_extraction_results.length === 0) {
                alert('No aspect terms found in the reviews.');
                return;
            }
            createPDF(response.data);
            setUrl('');

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to analyze aspects');
        }
    };

    // Function to create PDF
const createPDF = (data) => {
    const doc = new jsPDF();
    let posY = 20;

    doc.setFontSize(18);
    doc.text(20, posY, 'Aspect Extraction Results');
    posY += 10;

    data.aspect_extraction_results.forEach((result, index) => {
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

        // Check if the text exceeds the page height
        if (posY > 270) {
            doc.addPage();
            posY = 20;
        }
    });

    doc.save('aspect_extraction_results.pdf');
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
                                <input type="text" placeholder="Enter URL of a Daraz product" value={url} onChange={handleInputChange} />
                            </form>
                        </div>
                    </div>
                    <button type="button" className="btn-submit hover-effect-px" onClick={handleAnalyzeSentiment}>Analyze Sentiment</button>
                    {/* Button for analyzing aspects */}
                    <button type="button" className="btn-submit hover-effect-px" onClick={handleAnalyzeAspect}>Analyze Aspect</button>
                    
                    {/* Conditionally render the response data */}
                    {responseData && !responseData.error && (
                        <div className="analysis-results">
                            <h2 style={{ color: 'white' }}><br></br>Analysis Results</h2>
                            <p><strong>Actual Reviews Analyzed:</strong> {responseData.review_count}</p>
                            <p><strong>Sentiment Score:</strong> {responseData.average_sentiment ? responseData.average_sentiment.toFixed(2) + "/5" : "N/A"}</p>
                            <p><strong>Overall Sentiment:</strong> {responseData.average_sentiment ? (responseData.average_sentiment >= 3.4 ? "Positive" : "Negative") : "N/A"}</p>
                            <p><strong>Review Authenticity:</strong> {responseData.result || "N/A"}</p>
                        </div>
                    )}
                    {responseData && responseData.error && (
                        <div className="analysis-results" style={{ backgroundColor: 'rgba(220, 53, 69, 0.85)', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
                            <h4 style={{ color: 'white' }}>Notice</h4>
                            <p style={{ color: 'white', margin: 0 }}>{responseData.error}</p>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
