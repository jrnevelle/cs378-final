import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIdeaById, updateIdeaVotes, getUserId, getTripMemberById } from '../data/tripInfo';
import { db } from '../data/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './IdeaDetails.css';
import TripBanner from '../components/TripBanner';
import { FiArrowLeft, FiCalendar, FiEdit, FiLink, FiMapPin, FiThumbsDown, FiThumbsUp } from 'react-icons/fi';

function IdeaDetails() {
  const { tripId, ideaId } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const userId = getUserId();
  const [owner, setOwner] = useState("");

  useEffect(() => {
    async function fetchIdea() {
      const fetchedIdea = await getIdeaById(tripId, ideaId);
      setIdea(fetchedIdea);

      if (fetchedIdea?.votes?.yes?.includes(userId)) {
        setUserVote('yes');
      } else if (fetchedIdea?.votes?.no?.includes(userId)) {
        setUserVote('no');
      }
    }

    fetchIdea();
  }, [tripId, ideaId, userId]);

  useEffect(() => {
      async function fetchOwner() {
        if (!idea || !idea.owner) return;
        const fetchedOwner = await getTripMemberById(tripId, idea.owner);
        if (fetchedOwner) setOwner(fetchedOwner.name);
      }
      fetchOwner();
    }, [idea]);

  const handleClick = () => {
    window.open("https://www.getyourguide.com/", "_blank");
  };

  const handleVote = async (vote) => {
    if (!idea) return;

    const updatedVotes = {
      yes: [...idea.votes.yes],
      no: [...idea.votes.no],
    };

    updatedVotes.yes = updatedVotes.yes.filter((uid) => uid !== userId);
    updatedVotes.no = updatedVotes.no.filter((uid) => uid !== userId);

    updatedVotes[vote] = [...updatedVotes[vote], userId];

    await updateIdeaVotes(tripId, ideaId, updatedVotes);

    const tripRef = doc(db, 'trips', tripId);
    const tripSnap = await getDoc(tripRef);
    const threshold = tripSnap.exists()
      ? tripSnap.data().votingThreshold || 0.5
      : 0.5;

    const yes = updatedVotes.yes.length;
    const no = updatedVotes.no.length;
    const total = yes + no;
    const approval = total > 0 ? yes / total : 0;

    await updateDoc(doc(db, 'trips', tripId, 'ideas', ideaId), {
      votes: updatedVotes,
      archived: approval < threshold,
    });

    // Update local state
    setIdea({
      ...idea,
      votes: updatedVotes,
      archived: approval < threshold,
    });
    setUserVote(vote);
  };

  const handleEditVotes = () => {
    setUserVote(null);
  };

  if (!idea) return <TripBanner id={tripId}/>;

  const yesVotes = idea.votes.yes.length;
  const noVotes = idea.votes.no.length;
  const totalVotes = yesVotes + noVotes;
  const approvalPercentage = (totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0).toFixed(2);

  return (
    <div className="idea-details">
      <div className="trip-banner-wrapper">
        <TripBanner id={tripId}/>
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft/>
        </button>
      </div>
      <div className='title-wrapper'>
        <h2 className="idea-title">{idea.name}</h2>
        <p className="idea-tags-details">{idea.tags?.join(' · ')}</p>
      </div>
      
      {idea.img && (
        <div className='idea-cover-details'>
        <img src={idea.img} alt="Idea" className="idea-image" />
        </div>
      )}
      <div className='details-description-wrapper'>
        <div className='details-wrapper'>
          <div className='details-wrapper-text'>
            <div className='posted-wrapper'>
              <img className='posted-img' src={`https://www.tapback.co/api/avatar/${idea.owner}.webp`}/>
              <p className='posted-name'>Posted by {owner}</p>
            </div>
            <div className='date-wrapper'>
              <FiCalendar size="20"/>
              <p className='date-text'>{idea.date && idea.date.toDate().toDateString()}</p>
            </div>
            <div className='location-wrapper'>
              <FiMapPin />
              <p className="location-text">{idea.location.latitude},{' '}{idea.location.longitude}</p>
            </div>
          </div>
          <div className='details-wrapper-link'>
            <button onClick={handleClick} className="details-link">
              <FiLink size="18"/>
            </button>
          </div>
        </div>
        <div className='description-details'>
          <p>{idea.description}</p>
        </div>
      </div>

      {!userVote ? (
        <div className="vote-buttons">
          <button
            className={`vote-button yes-button ${userVote === 'yes' ? 'selected' : ''}`}
            onClick={() => handleVote('yes')}
          >
            <FiThumbsUp size="30" color="white" />
          </button>
          <button
            className={`vote-button no-button ${userVote === 'no' ? 'selected' : ''}`}
            onClick={() => handleVote('no')}
          >
            <FiThumbsDown size="30" color="white" />
          </button>
        </div>
      
      ) : (
        <div className='vote-progress-percent'>
          <div className="vote-progress-wrapper">
            <div className="vote-progress">
              <div className="progress-bar" style={{ width: `${approvalPercentage}%` }}></div>
            </div>
            <button className="edit-vote-button" onClick={handleEditVotes}>
              <FiEdit/>
            </button>
          </div>
          <h3>Approval: {approvalPercentage}%</h3>
          <p>{yesVotes}/{totalVotes} Votes</p>
        </div>

      )}

      {/* <p>
        <strong>Acceptance:</strong>{' '}
        {(
          (idea.votes.yes.length /
            (idea.votes.yes.length + idea.votes.no.length || 1)) *
          100
        ).toFixed(2)}
        %
      </p>

      <h3>Votes</h3>
      <p>
        <strong>Yes Votes:</strong> {idea.votes.yes.length} (
        {idea.votes.yes.join(', ')})
      </p>
      <p>
        <strong>No Votes:</strong> {idea.votes.no.length} (
        {idea.votes.no.join(', ')})
      </p>

      <div className="vote-buttons">
        <button
          className={userVote === 'yes' ? 'selected' : ''}
          onClick={() => handleVote('yes')}
        >
          👍 Yes
        </button>
        <button
          className={userVote === 'no' ? 'selected' : ''}
          onClick={() => handleVote('no')}
        >
          👎 No
        </button>
      </div> */}
    </div>
  );
}

export default IdeaDetails;
