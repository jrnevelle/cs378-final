import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Ideas.css';
import { getUserId, getIdeas } from "../data/tripInfo";

function Ideas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('unvoted');
  const [allIdeas, setAllIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);

  useEffect(() => {
    async function fetchIdeas() {
      const fetchedIdeas = await getIdeas(id);
      const processedIdeas = fetchedIdeas.map(idea => {
        const yesVotes = idea.votes?.yes?.length || 0;
        const noVotes = idea.votes?.no?.length || 0;
        const totalVotes = yesVotes + noVotes;
        const acceptancePercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
        return { ...idea, acceptancePercentage: acceptancePercentage.toFixed(2)};
      });

      processedIdeas.sort((a, b) => parseFloat(b.acceptancePercentage) - parseFloat(a.acceptancePercentage));
      setAllIdeas(processedIdeas);
    }

    fetchIdeas();
  }, [id]);

  useEffect(() => {
    const userId = getUserId();

    const filterIdeas = () => {
      switch (activeTab) {
        case 'archived':
          return allIdeas.filter(idea => idea.archived);
        case 'myIdeas':
          return allIdeas.filter(idea => !idea.archived && idea.owner === userId);
        case 'voted':
          return allIdeas.filter(idea => !idea.archived && 
            (idea.votes?.yes?.includes(userId) || idea.votes?.no?.includes(userId))
          );
        case 'unvoted':
          return allIdeas.filter(idea => !idea.archived && 
            !idea.votes?.yes?.includes(userId) && !idea.votes?.no?.includes(userId)
          );
        default:
          return allIdeas;
      }
    };

    setFilteredIdeas(filterIdeas());
  }, [activeTab, allIdeas]);

  const goToNewIdea = () => {
    navigate(`/trip/${id}/ideas/new`);
  };

  return (
    <div className="ideas-page">
      <h2 className="ideas-title">Ideas for {id}</h2>

      <div className="tabs">
        {['archived', 'myIdeas', 'voted', 'unvoted'].map((key) => (
          <button
            key={key}
            className={`tab-button ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {key === 'myIdeas' ? 'My Ideas' : key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="idea-list">
        {filteredIdeas.length === 0 ? (
          <p className="no-ideas">No ideas found in this category.</p>
        ) : (
          filteredIdeas.map((idea, i) => (
            <div className="idea-card" key={i}>
              {idea.imagePreview && (
                <img src={idea.imagePreview} alt="Idea" className="idea-cover" />
              )}
              <div className="idea-content">
                <h3>{idea.name}</h3>
                <p className="idea-date">{idea.date?.toString().slice(0, 15)} {idea.time}</p>
                <p>{idea.location.latitude}, {idea.location.longitude}</p>
                <p>{idea.description}</p>
                <p>Acceptance: {idea.acceptancePercentage}%</p>
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

      <button className="add-idea-button" onClick={goToNewIdea}>
        ＋
      </button>
    </div>
  );
}

export default Ideas;
