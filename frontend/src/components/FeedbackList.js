import React from 'react';

const FeedbackList = ({ feedback, onDelete }) => {
  const renderStars = (rating) => {
    const numRating = Number(rating) || 0;
    return '★'.repeat(numRating) + '☆'.repeat(5 - numRating);
  };

  if (feedback.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <h3>No Feedback Yet</h3>
          <p>Be the first to share your feedback and help improve the learning experience!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Feedback</h2>
          <p className="card-subtitle">{feedback.length} submission{feedback.length !== 1 ? 's' : ''} from students</p>
        </div>
      </div>
      
      <div className="feedback-grid" style={{ marginTop: '1.5rem' }}>
        {feedback.map(item => (
          <div key={item.id} className="feedback-card">
            <div className="feedback-header">
              <div className="student-info">
                <div className="student-name">{item.studentName}</div>
                <div className="course-code">{item.courseCode}</div>
              </div>
              <button 
                className="btn btn-danger"
                onClick={() => onDelete(item.id)}
                title="Delete feedback"
                style={{ padding: '0.5rem' }}
              >
                delete
              </button>
            </div>
            
            <div className="feedback-comments">
              "{item.comments}"
            </div>
            
            <div className="feedback-footer">
              <div className="feedback-rating" title={`Rating: ${item.rating}/5`}>
                {renderStars(item.rating)}
                <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                  ({(Number(item.rating) || 0)}/5)
                </span>
              </div>
              <div className="feedback-date">
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;