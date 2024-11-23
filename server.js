// Use import instead of require
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Create an Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request body

// Simple AI Logic Placeholder
const getAIResponse = (message) => {
  if (message.toLowerCase().includes('quiz')) {
    return 'Let me quiz you on your weak topics!';
  } else if (message.toLowerCase().includes('explain')) {
    return 'Please upload your notes, and I will explain them!';
  } else {
    return 'Hello! How can I assist you today?';
  }
};

// Route to handle chatbot question
app.post('/chatbot/question', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received message:', message);  // Log incoming message

    const response = getAIResponse(message);  // Process the message
    console.log('Sending response:', response);  // Log outgoing response

    res.json({ answer: response });  // Send response to frontend
  } catch (error) {
    console.error('Error processing AI response:', error);
    res.status(500).json({ error: 'Failed to get response from AI', details: error.message });
  }
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});