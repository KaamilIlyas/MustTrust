import React from 'react';
import './Sentiment.css'
import { data } from '../../../data/SentimentData'

export default function Sentiment() {
    const content = data.feedbackInfo.map((el, index) => {
        return (
            <div id='feedback' className="col-lg-4 hover-effect" key={index}>
                <div className="feedback__content">
                    <img src={el.image} alt={el.image} />
                    <p>
                        {el.explanation}
                    </p>
                </div>
                <div className="user-feedback-info">
                    <h5 className="user-name">{el.emotion} - <span className="text-muted">{el.sentiment}</span></h5>
                </div>
            </div>
        )
    })
    return(
        <section className="feedback">
            <div className="container">
                <div className="row text-center">
                    <div className="col-lg-12">
                        <h2 className="h1 feedback__title">Sentiment Analysis</h2>
                        <div className="section-title-border"></div>
                        <p className="feedback__subtitle">Our sentiment analysis feature deciphers the emotional tone conveyed in text, helping users swiftly grasp the underlying sentiment whether positive, negative, or neutral.</p>
                    </div>
                </div>
            </div>
            <div className="container user-feedback">
                <div className="row">
                    {content}
                </div>
            </div>
        </section>
    );
}
