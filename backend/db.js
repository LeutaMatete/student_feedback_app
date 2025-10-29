const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database file if it doesn't exist
const initializeDB = async () => {
  try {
    await fs.access(DB_FILE);
  } catch (error) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(DB_FILE, JSON.stringify([], null, 2));
    console.log('Database file created successfully');
  }
};

// Read all feedback from database
const readFeedback = async () => {
  try {
    await initializeDB();
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
};

// Write feedback to database
const writeFeedback = async (feedback) => {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(feedback, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
};

// Add new feedback
const addFeedback = async (feedbackData) => {
  try {
    const feedback = await readFeedback();
    const newFeedback = {
      id: uuidv4(),
      ...feedbackData,
      createdAt: new Date().toISOString()
    };
    
    feedback.push(newFeedback);
    const success = await writeFeedback(feedback);
    
    if (success) {
      return newFeedback;
    } else {
      throw new Error('Failed to save feedback');
    }
  } catch (error) {
    console.error('Error adding feedback:', error);
    throw error;
  }
};

// Get all feedback
const getAllFeedback = async () => {
  return await readFeedback();
};

// Delete feedback by ID
const deleteFeedback = async (id) => {
  try {
    const feedback = await readFeedback();
    const initialLength = feedback.length;
    const updatedFeedback = feedback.filter(item => item.id !== id);
    
    if (updatedFeedback.length === initialLength) {
      return false; // No feedback was deleted
    }
    
    const success = await writeFeedback(updatedFeedback);
    return success;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
};

// Get statistics
const getStats = async () => {
  try {
    const feedback = await readFeedback();
    
    if (feedback.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        totalCourses: 0
      };
    }
    
    const totalFeedback = feedback.length;
    const totalRating = feedback.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / totalFeedback;
    
    const uniqueCourses = new Set(feedback.map(item => item.courseCode));
    const totalCourses = uniqueCourses.size;
    
    return {
      totalFeedback,
      averageRating,
      totalCourses
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
};

module.exports = {
  initializeDB,
  addFeedback,
  getAllFeedback,
  deleteFeedback,
  getStats
};