// IdeaCard.js
import React from 'react';
import './IdeaCard.css';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';

const IdeaCard = ({ idea }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const voteCount = (idea.votes?.yes?.length || 0) + (idea.votes?.no?.length || 0);
  const allVoters = [...(idea.votes?.yes || []), ...(idea.votes?.no || [])];
  const maxVoters = 3;
  const visibleVoters = allVoters.slice(0, maxVoters);
  const remainingVotersCount = allVoters.length - maxVoters;

  return (
    <div className="idea-card clickable" onClick={() => navigate(`/trip/${id}/ideas/${idea.id}`)}>
      {idea.img && (
        <div class="image-container">
          <img src={idea.img} alt="Idea" className="idea-cover" />
        </div>
      )}
      <div className="idea-content">
        <h3>{idea.name}</h3>
        <p className="idea-date">
          <FaCalendarAlt style={{ width: '20px', marginRight: '2px', color: '#000' }} /> {/* Use the icon */}
          {idea.date && idea.date.toDate().toDateString()}
        </p>
        <p className="idea-tags">{idea.tags?.join(' · ')}</p>
        <div className="voters">
          {visibleVoters.map((voter, idx) => (
            <img
              key={idx}
              src={`https://www.tapback.co/api/avatar/${voter}.webp`}
              className="avatar"
              alt="voter"
            />
          ))}
          {remainingVotersCount > 0 && (
            <div className="avatar more-voters">
              <span className="dots">...</span>
            </div>
          )}
          <span>{voteCount} People Voted</span>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
