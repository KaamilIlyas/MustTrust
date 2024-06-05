import {faClone, faStopCircle, faLocationArrow, faDigitalTachograph, faDatabase, faLanguage } from '@fortawesome/free-solid-svg-icons'

export const data = {
    serve: [
        {
            title: (
            <a href='#home'>{'Sentiment Score'} </a>
            ),
            text: 'Our system employs advanced sentiment analysis techniques to assess the sentiment expressed in product reviews.',
            icon: faStopCircle
        },
        {
            title: (
            <a href='#home'>{'Aspect-Based Analysis'} </a>
            ),
            text: 'Our system performs aspect-based analysis to identify specific aspects or features mentioned in the reviews.',
            icon: faLocationArrow
        },
        {
            title: (
            <a href='#comparing-product'>{'Comparison Feature'} </a>
            ),      
            text: 'With our comparison feature, you can now compare two products side by side to make well-informed choices.',
            icon: faClone
        },
        {
            title: (
            <a href='#'>{'Digital Design'} </a>
            ),
            text: "Our digital design services focus on creating intuitive interfaces and user-friendly experiences.",
            icon: faDigitalTachograph
        },
        {
            title: (
            <a href='#'>{'Data-driven Strategies'} </a>
            ),
            text: 'We leverage data-driven strategies to deliver accurate and reliable ratings.',
            icon: faDatabase
        },
        {
            title: (
            <a href='#'>{'Machine Learning Algorithm'} </a>
            ),
            text: 'At the core of our system is a sophisticated machine learning algorithms trained on vast amounts of review data.',
            icon: faLanguage
        },
    ]
}