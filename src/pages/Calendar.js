import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getUserId, getIdeas } from '../data/tripInfo';
import './Calendar.css';

const localizer = momentLocalizer(moment);

function Calendar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allIdeas, setAllIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialView = queryParams.get("view") || Views.MONTH;
  const initialDate = queryParams.get("date") ? new Date(queryParams.get("date")) : new Date();

  const [view, setView] = useState(initialView);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const handleEventClick = event => {
    navigate(`/trip/${id}/ideas/${event.id}`);
  };  

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setView(Views.DAY);
  }; 

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("view", view);
    params.set("date", selectedDate.toISOString());
  
    navigate({ search: params.toString() }, { replace: true });
  }, [view, selectedDate, navigate]); 

  useEffect(() => {
    async function fetchIdeas() {
      const fetchedIdeas = await getIdeas(id);
      const processedIdeas = fetchedIdeas.map(idea => {
        const yesVotes = idea.votes?.yes?.length || 0;
        const noVotes = idea.votes?.no?.length || 0;
        const totalVotes = yesVotes + noVotes;
        const acceptancePercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
        return { 
          ...idea, 
          acceptancePercentage: acceptancePercentage.toFixed(2),
          start: idea.date?.toDate?.() ?? new Date(),
          end: idea.date?.toDate?.() ?? new Date(),
          title: idea.name,
        };
      }).filter(idea => parseFloat(idea.acceptancePercentage) >= 50);

      processedIdeas.sort((a, b) => parseFloat(b.acceptancePercentage) - parseFloat(a.acceptancePercentage));
      setAllIdeas(processedIdeas);
    }

    fetchIdeas();
  }, [id]);

  return (
    <div className="p-4 calendar-container">
      <h2 className="text-2xl font-semibold mb-4">Trip Calendar for {id}</h2>
      <BigCalendar
        localizer={localizer}
        events={allIdeas}
        startAccessor={"start"}
        endAccessor={"end"}
        titleAccessor={"title"}
        views={['month', 'week', 'day']}
        style={{ height: 600 }}
        onNavigate={(newDate) => setSelectedDate(newDate)}
        date={selectedDate || new Date()}
        oonSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventClick}
        onView={setView}
        view={view}
      />

      {selectedIdea && (
        <div className="mt-6 border rounded p-4 shadow-lg bg-white">
          <h3 className="text-xl font-bold mb-2">{selectedIdea.name}</h3>
          {selectedIdea.imagePreview && (
            <img src={selectedIdea.imagePreview} alt="Preview" className="w-full max-h-60 object-cover rounded mb-2" />
          )}
          <p><strong>Date:</strong> {selectedIdea.date?.toDate().toDateString()}</p>
          <p><strong>Location:</strong> {selectedIdea.location.latitude}, {selectedIdea.location.longitude}</p>
          <p><strong>Description:</strong> {selectedIdea.description}</p>
          <p><strong>Acceptance:</strong> {selectedIdea.acceptancePercentage}%</p>
          <div className="mt-2 flex gap-2 flex-wrap">
            {selectedIdea.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-blue-200 rounded text-sm">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
