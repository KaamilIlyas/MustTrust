import React, { useState } from 'react';
import './Form.css'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function Form() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState(''); // '', 'success', 'error'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        try {
            const response = await fetch(`${API_URL}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        }
    };
    

    return (
        <section id='contact' className="form">

            <div className="container">
                <div className="row text-center">
                    <div className="col-lg-12">
                        <h2 className="h1 form__title">GET IN TOUCH</h2>
                        <div className="section-title-border"></div>
                        <p className="form__subtitle">Have a question or something to share? We're here to help! Reach out to us if you encounter any issues or simply want to share your thoughts.</p>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">

                    <div className="col-lg-4">
                        <div className="form-info-contnet">
                            <p className="form-info">
                                <span className="h5">University:</span>
                                <br />
                                <span className="text-muted d-block mt-2">Fast Nuces, Islamabad</span>
                            </p>
                            <p className="form-info">
                                <span className="h5">Location Details:</span>
                                <br />
                                <span className="text-muted d-block mt-2">
                                    AK Brohi road, H-11/4
                                    <br />
                                    Islamabad, Pakistan
                                </span>
                            </p>
                            {/* <p className="form-info">
                                <span className="h5">Working Hours:</span>
                                <br />
                                <span className="text-muted d-block mt-2">9:00AM To 6:00PM</span>
                            </p> */}
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="form-input">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-lg">
                                        <input className="form-control" type="text" placeholder="Your name*" 
                                        name="name" value={formData.name} required onChange={handleChange} />
                                    </div>
                                    <div className="col-lg">
                                        <input className="form-control" type="email" placeholder="Your email*" 
                                        name="email" value={formData.email} required onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="">
                                    <textarea className="form-control textarea-input" name="message" spellCheck="false" id="message" 
                                    placeholder="Your message..." cols="30" rows="4" value={formData.message} required onChange={handleChange}></textarea>
                                </div>
                                <div className="text-end hover-effect-px">
                                <button type='submit' className="btn form-button">Send Message</button>
                                </div>
                                {status === 'success' && <p className="mt-2 text-success">Message sent successfully!</p>}
                                {status === 'error' && <p className="mt-2 text-danger">Something went wrong. Please try again.</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
