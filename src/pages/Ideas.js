import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Ideas.css';
import { useIdeas } from '../data/IdeaContext';

function Ideas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ideas } = useIdeas();

  const goToNewIdea = () => {
    navigate(`/trip/${id}/ideas/new`);
  };

  const tripIdeas = ideas.filter(idea => idea.tripId === id || !idea.tripId); // Optional filter by trip

  return (
    <div className="ideas-page">
      <h2 className="ideas-title">Ideas for {id}</h2>

      <div className="idea-list">
        {tripIdeas.length === 0 ? (
          <p className="no-ideas">No ideas yet. Click the + to add one!</p>
        ) : (
          tripIdeas.map((idea, i) => (
            <div className="idea-card" key={i}>
              {idea.imagePreview && (
                <img src={idea.imagePreview} alt="Idea" className="idea-cover" />
              )}
              <div className="idea-content">
                <h3>{idea.name}</h3>
                <p className="idea-date">{idea.date?.toString().slice(0, 15)} {idea.time}</p>
                <p>{idea.location}</p>
                <p>{idea.description}</p>
                <div className="idea-tags">
                  {idea.tags.map((tag, index) => (
                    <span key={index} className={`tag color-${index % 5}`}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="add-idea-button" onClick={goToNewIdea}>＋</button>
    </div>
  );
}

export default Ideas;
