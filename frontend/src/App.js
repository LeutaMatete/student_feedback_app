import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import Dashboard from './components/Dashboard';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageRating: 0,
    totalCourses: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  useEffect(() => {
    checkBackendConnection();
    fetchFeedback();
    fetchStats();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await axios.get(`${API_BASE}/test`);
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('disconnected');
      console.error('Backend connection failed:', error);
    }
  };

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/feedback`);
      setFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/stats`);
      const safeStats = {
        totalFeedback: Number(response.data.totalFeedback) || 0,
        averageRating: Number(response.data.averageRating) || 0,
        totalCourses: Number(response.data.totalCourses) || 0
      };
      setStats(safeStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFeedbackSubmit = async (formData) => {
    try {
      await axios.post(`${API_BASE}/feedback`, formData);
      fetchFeedback();
      fetchStats();
      setActiveTab('view');
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`${API_BASE}/feedback/${id}`);
        fetchFeedback();
        fetchStats();
        alert('Feedback deleted successfully!');
      } catch (error) {
        console.error('Error deleting feedback:', error);
        alert('Error deleting feedback. Please try again.');
      }
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '' },
    { id: 'submit', label: 'Submit Feedback', icon: '' },
    { id: 'view', label: 'View Feedback', icon: '' }
  ];

  const formatAverageRating = (rating) => {
    const num = Number(rating);
    return isNaN(num) ? '0.0' : num.toFixed(1);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Student Feedback Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-content">
          <div className="logo">
            <div className="logo-text">
              <h1>Student Feedback Portal</h1>
              <p>Share your learning experience</p>
            </div>
          </div>
          <div className="header-info">
            <div className="header-stats">
              <div className="stat-badge">
                <span className="stat-number">{stats.totalFeedback}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-badge">
                <span className="stat-number">
                  {formatAverageRating(stats.averageRating)}
                </span>
                <span className="stat-label">Avg Rating</span>
              </div>
            </div>
            <div className={`connection-status ${connectionStatus}`}>
              {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div className="tab-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-container">
        <div className="content-area">
          {activeTab === 'dashboard' && (
            <Dashboard stats={stats} feedback={feedback} />
          )}
          {activeTab === 'submit' && (
            <FeedbackForm onSubmit={handleFeedbackSubmit} />
          )}
          {activeTab === 'view' && (
            <FeedbackList 
              feedback={feedback} 
              onDelete={handleDeleteFeedback}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>BIWA2110 Web Application Development - Lab Test 2 | JSON Database Version</p>
      </div>
    </div>
  );
}

export default App;