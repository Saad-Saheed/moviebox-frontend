// src/components/ReviewCard.jsx
import PropTypes from 'prop-types';
import './ReviewCard.css';

const ReviewCard = ({ name, review, date }) => {
  const formattedDate = new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));

  return (
    <div className="review-card shadow-sm">
      <div className="review-header d-flex align-items-center mb-2">
        <div className="avatar me-2">{name?.[0]?.toUpperCase() || 'A'}</div>
        <strong>{name || 'Anonymous'}</strong>
        <span className="ms-auto text-muted small">{formattedDate}</span>
      </div>
      <p className="mb-0">{review}</p>
    </div>
  );
};

ReviewCard.propTypes = {
  name: PropTypes.string,
  review: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default ReviewCard;
