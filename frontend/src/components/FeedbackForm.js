import React, { useState } from 'react';

const FeedbackForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    courseCode: '',
    comments: '',
    rating: 0
  });
  const [errors, setErrors] = useState({});
  const [hoverRating, setHoverRating] = useState(0);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }
    
    if (!formData.courseCode.trim()) {
      newErrors.courseCode = 'Course code is required';
    }
    
    if (!formData.comments.trim()) {
      newErrors.comments = 'Comments are required';
    }
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        studentName: '',
        courseCode: '',
        comments: '',
        rating: 0
      });
      setHoverRating(0);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
    
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Submit Your Feedback</h2>
        <p className="card-subtitle">Help us improve by sharing your learning experience</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Student Name</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your full name"
          />
          {errors.studentName && <div className="error-message">{errors.studentName}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Course Code</label>
          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., BIWA2110"
          />
          {errors.courseCode && <div className="error-message">{errors.courseCode}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Comments</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Share your thoughts about the course, what you enjoyed, and any suggestions for improvement..."
          />
          {errors.comments && <div className="error-message">{errors.comments}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Rating</label>
          <div className="rating-container">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || formData.rating) ? 'active' : ''}`}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  title={`${star} star${star > 1 ? 's' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Selected: {formData.rating > 0 ? `${formData.rating} star${formData.rating > 1 ? 's' : ''}` : 'None'}
            </div>
          </div>
          {errors.rating && <div className="error-message">{errors.rating}</div>}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}>
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;