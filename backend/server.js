const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/FYP-TrustIsMust', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Define schema and model for form data
const FormDataSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});

const FormData = mongoose.model('FormData', FormDataSchema);

// Define schema and model for email subscriptions
const EmailSubscriptionSchema = new mongoose.Schema({
    email: String
});

const EmailSubscription = mongoose.model('EmailSubscription', EmailSubscriptionSchema);

// Route to handle form submission
app.post('/submit', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const formData = new FormData({ name, email, message });
        await formData.save();
        res.status(200).send('Form submitted successfully');
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle email subscriptions
app.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        const emailSubscription = new EmailSubscription({ email });
        await emailSubscription.save();
        res.status(200).send('Email subscribed successfully');
    } catch (error) {
        console.error('Error subscribing email:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
