import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getIdeaById, updateIdeaVotes, getUserId } from "../data/tripInfo";
import "./IdeaDetails.css";

function IdeaDetails() {
  const { tripId, ideaId } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const userId = getUserId();

  useEffect(() => {
    async function fetchIdea() {
      const fetchedIdea = await getIdeaById(tripId, ideaId);
      setIdea(fetchedIdea);

      if (fetchedIdea?.votes?.yes?.includes(userId)) {
        setUserVote("yes");
      } else if (fetchedIdea?.votes?.no?.includes(userId)) {
        setUserVote("no");
      }
    }

    fetchIdea();
  }, [tripId, ideaId, userId]);

  const handleVote = async (vote) => {
    if (!idea) return;

    const updatedVotes = { yes: [...idea.votes.yes], no: [...idea.votes.no] };

    if (vote === "yes") {
      updatedVotes.yes = [...new Set([...updatedVotes.yes, userId])]; 
      updatedVotes.no = updatedVotes.no.filter((uid) => uid !== userId); 
    } else {
      updatedVotes.no = [...new Set([...updatedVotes.no, userId])]; 
      updatedVotes.yes = updatedVotes.yes.filter((uid) => uid !== userId); 
    }

    await updateIdeaVotes(tripId, ideaId, updatedVotes);
    setIdea({ ...idea, votes: updatedVotes });
    setUserVote(vote);
  };

  if (!idea) return <p>Loading idea details...</p>;

  return (
    <div className="idea-details">
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>
      <h2>{idea.name}</h2>
      {idea.imagePreview && <img src={idea.imagePreview} alt="Idea" className="idea-cover" />}
      <p><strong>Description:</strong> {idea.description}</p>
      <p><strong>Location:</strong> {idea.location.latitude}, {idea.location.longitude}</p>
      <p><strong>Date:</strong> {idea.date && idea.date.toDate().toDateString()}</p>
      <p><strong>Acceptance:</strong> {((idea.votes.yes.length / (idea.votes.yes.length + idea.votes.no.length || 1)) * 100).toFixed(2)}%</p>

      <h3>Votes</h3>
      <p><strong>Yes Votes:</strong> {idea.votes.yes.length} ({idea.votes.yes.join(", ")})</p>
      <p><strong>No Votes:</strong> {idea.votes.no.length} ({idea.votes.no.join(", ")})</p>

      <div className="vote-buttons">
        <button className={userVote === "yes" ? "selected" : ""} onClick={() => handleVote("yes")}>👍 Yes</button>
        <button className={userVote === "no" ? "selected" : ""} onClick={() => handleVote("no")}>👎 No</button>
      </div>
    </div>
  );
}

export default IdeaDetails;
