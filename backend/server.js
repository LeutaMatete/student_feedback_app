const express = require('express');
const cors = require('cors');
const { 
  initializeDB, 
  addFeedback, 
  getAllFeedback, 
  deleteFeedback, 
  getStats 
} = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
initializeDB().then(() => {
  console.log('Database initialized successfully');
});

// Routes

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Get all feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await getAllFeedback();
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Add new feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { studentName, courseCode, comments, rating } = req.body;
    
    // Validation
    if (!studentName || !courseCode || !comments || !rating) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const feedbackData = {
      studentName: studentName.trim(),
      courseCode: courseCode.trim(),
      comments: comments.trim(),
      rating: parseInt(rating)
    };

    const newFeedback = await addFeedback(feedbackData);
    res.status(201).json({ 
      message: 'Feedback submitted successfully', 
      feedback: newFeedback 
    });
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Delete feedback
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Feedback ID is required' });
    }

    const success = await deleteFeedback(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Student Feedback API'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available:`);
  console.log(`   GET  http://localhost:${PORT}/api/feedback`);
  console.log(`   POST http://localhost:${PORT}/api/feedback`);
  console.log(`   DEL  http://localhost:${PORT}/api/feedback/:id`);
  console.log(`   GET  http://localhost:${PORT}/api/stats`);
});