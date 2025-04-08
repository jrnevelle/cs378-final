import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Ideas.css';
import { getUserId, getIdeas } from "../data/tripInfo";
import IdeaCard from '../components/IdeaCard';
import TripBanner from '../components/TripBanner';
import { FiFilter } from 'react-icons/fi'; 

function Ideas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('unvoted');
  const [allIdeas, setAllIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedTag, setSelectedTag] = useState('');
  const filterButtonRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);

const toggleDropdown = () => {
  setShowDropdown(prev => !prev);
};

const handleTagSelect = (tag) => {
  setSelectedTag(tag);
  setShowDropdown(false); // Close dropdown on selection
};

useEffect(() => {
  if (showDropdown) {
    const buttonRect = document.querySelector('.filter-overlay-btn').getBoundingClientRect();
    const dropdown = document.querySelector('.custom-dropdown');

    if (dropdown) {
      dropdown.style.top = `${buttonRect.bottom + window.scrollY}px`; // Position below button
      dropdown.style.left = `${buttonRect.left + window.scrollX - 90}px`;  // Align with button
    }
  }
}, [showDropdown]);


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
      let filtered = allIdeas.filter(idea => {
        switch (activeTab) {
          case 'archived':
            return idea.archived;
          case 'myIdeas':
            return !idea.archived && idea.owner === userId;
          case 'voted':
            return !idea.archived && (idea.votes?.yes?.includes(userId) || idea.votes?.no?.includes(userId));
          case 'unvoted':
            return !idea.archived && !idea.votes?.yes?.includes(userId) && !idea.votes?.no?.includes(userId);
          default:
            return true;
        }
      });

      // Filter by search query after tab filtering
      if (searchQuery) {
        filtered = filtered.filter(idea =>
          idea.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by selected tag
      if (selectedTag) {
        filtered = filtered.filter(idea =>
          idea.tags?.includes(selectedTag)
        );
      }

      return filtered;
    };

    setFilteredIdeas(filterIdeas());
  }, [activeTab, allIdeas, searchQuery, selectedTag]);  // Added selectedTag dependency

  // useEffect(() => {
  //   const filterButton = filterButtonRef.current;
  //   if (filterButton) {
  //     // Dynamically position the overlay button
  //     const rect = filterButton.getBoundingClientRect();
  //     const overlayBtn = document.querySelector('.filter-overlay-btn');

  //     if (overlayBtn) {
  //       overlayBtn.style.top = `${rect.top + window.scrollY + rect.height / 2 - overlayBtn.offsetHeight / 2}px`;
  //       overlayBtn.style.left = `${rect.left + window.scrollX + rect.width - overlayBtn.offsetWidth - 10}px`; // Positioned on the right side
  //     }
  //   }
  // }, [selectedTag]);

  const goToNewIdea = () => {
    navigate(`/trip/${id}/ideas/new`);
  };

  const allTags = [...new Set(allIdeas.flatMap(idea => idea.tags || []))];

  return (
    <div className="ideas-page">
      <div className='fixed-content'>
      <TripBanner />
      <div className="ideas-header">
        <h2 className="ideas-title">Ideas</h2>
        <button className="add-idea-button" onClick={goToNewIdea}>＋</button>
      </div>
      <div className="tabs-wrapper">
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
      </div>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}  // Update search query on input change
        />
        <div className="tag-filter">
          <button className="filter-overlay-btn" onClick={toggleDropdown}>
            <FiFilter color="#9FA7AF"/>
          </button>

          {showDropdown && (
            <ul className="custom-dropdown">
              <li 
                className={selectedTag === "" ? "selected" : ""}
                onClick={() => handleTagSelect("")}
              >
                None
              </li>
              {allTags.map((tag, idx) => (
                <li 
                  key={idx} 
                  className={selectedTag === tag ? "selected" : ""}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>


      </div>
      </div>
      <div className="scrollable-content">

      <div className="idea-list">
        {filteredIdeas.length === 0 ? (
          <p className="no-ideas">No ideas found in this category.</p>
        ) : (
          filteredIdeas.map((idea, i) => (
            <IdeaCard idea={idea} key={i}/>
          ))
        )}
      </div>
      </div>
    </div>
  );
}

export default Ideas;