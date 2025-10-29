import React from 'react';

const Dashboard = ({ stats, feedback }) => {
  const recentFeedback = feedback.slice(0, 4);
  
  const renderStars = (rating) => {
    const numRating = Number(rating) || 0;
    return '★'.repeat(numRating) + '☆'.repeat(5 - numRating);
  };

  const formatAverageRating = (rating) => {
    const num = Number(rating);
    return isNaN(num) ? '0.0' : num.toFixed(1);
  };

  const formatTotalFeedback = (total) => {
    return Number(total) || 0;
  };

  const formatTotalCourses = (courses) => {
    return Number(courses) || 0;
  };

  return (
    <div>
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <span className="number">{formatTotalFeedback(stats.totalFeedback)}</span>
          <span className="label">Total Feedback Submissions</span>
        </div>
        
        <div className="stat-card secondary">
          <span className="number">
            {formatAverageRating(stats.averageRating)}
          </span>
          <span className="label">Average Rating</span>
        </div>
        
        <div className="stat-card accent">
          <span className="number">{formatTotalCourses(stats.totalCourses)}</span>
          <span className="label">Courses Rated</span>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Feedback</h2>
          <p className="card-subtitle">Latest submissions from students</p>
        </div>

        {recentFeedback.length > 0 ? (
          <div className="feedback-grid">
            {recentFeedback.map(item => (
              <div key={item.id} className="feedback-card">
                <div className="student-info">
                  <div className="student-name">{item.studentName}</div>
                  <div className="course-code">{item.courseCode}</div>
                </div>
                
                <div className="feedback-comments" style={{ fontSize: '0.9rem', margin: '1rem 0' }}>
                  "{item.comments.length > 120 ? item.comments.substring(0, 120) + '...' : item.comments}"
                </div>
                
                <div className="feedback-footer">
                  <div className="feedback-rating">
                    {renderStars(item.rating)}
                  </div>
                  <div className="feedback-date" style={{ fontSize: '0.8rem' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <div className="icon">💭</div>
            <h3>No Feedback Yet</h3>
            <p>When students submit feedback, it will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;