import React, { useState } from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            if (response.ok) {
                setEmail('');
                setError('');
                setSuccess(true);
                setTimeout(() => setSuccess(false), 4000);
            } else {
                setError('Subscription failed. Please try again.');
            }
        } catch (error) {
            console.error('Error subscribing email:', error);
            setError('Something went wrong. Please try again.');
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError(''); // Clear error message when the user starts typing
    };

    return (
        <>
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <h4>TrustIsMust</h4>
                            <ul className="list-unstyled footer-list">
                                <li><a href="#home">Home</a></li>
                                <li><a href="#features">Features</a></li>
                                <li><a href="#comparing-product">Compare Products</a></li>
                                <li><a href="#contact">Contact Us</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <h4>Information</h4>
                            <ul className="list-unstyled footer-list">
                                <li><a href="#home">Terms & Condition</a></li>
                                <li><a href="#about">About Us</a></li>
                                <li><a href="#Careers">Fast Nuces</a></li>
                                <li><a href="#Contact">Bookmarks</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <h4>Support</h4>
                            <ul className="list-unstyled footer-list">
                                <li><a href="#home">FAQ</a></li>
                                <li><a href="#about">Contact</a></li>
                                <li><a href="#Careers">Disscusion</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <h4>Subscribe</h4>
                            <p className="">
                            Stay updated! Subscribe to receive the latest feature updates!
                            </p>
                            <div className="footer__subscribe">
                                <input type="email" placeholder="Email" value={email} onChange={handleEmailChange}/>
                                <button className="footer__subscribe-icon" onClick={handleSubscribe}>
                                <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            {success && <p className="text-success mt-1" style={{fontSize:'0.85rem'}}>Subscribed successfully!</p>}
                        </div>
                    </div>
                </div>
            </footer>
            <div className="under-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <p className="copy-right">
                                Copyright &copy; 2024, Kamil Ilyas
                            </p>
                        </div>
                        {/* <div className="col-lg-6">
                            <div className="payment-method">
                                <span>
                                    <Visa style={{ marginRight: 10 }} />
                                </span>
                                <span>
                                    <Mastercard style={{ marginRight: 10 }} />
                                </span>
                                <span>
                                    <PaypalTransparent className="paypal" style={{ marginRight: 10 }} />
                                </span>
                                <span>
                                    <Maestro />
                                </span>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}
