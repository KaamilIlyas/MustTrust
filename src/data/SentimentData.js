import positive from '../assets/users/positive.png'
import neurtal from '../assets/users/neutral.png'
import negative from '../assets/users/negative.png'

export const data = {
    feedbackInfo: [
        {
            emotion: 'POSITIVE',
            sentiment: 'Sentiment',
            image: positive,
            explanation: "My experience so far has been 'fantastic'"
        },{
            emotion: 'NEUTRAL',
            sentiment: 'Sentiment',
            image: neurtal,
            explanation: "The product is 'ok' i guess"
        },{
            emotion: 'NEGATIVE',
            sentiment: 'Sentiment',
            image: negative,
            explanation: "Your support team is 'useless'"
        },
    ]
};