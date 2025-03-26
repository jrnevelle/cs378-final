import React from 'react';
import { useParams } from 'react-router-dom';

function Calendar() {
  const { id } = useParams();

  return (
    <div>
      <h3>Calendar for Trip ID: {id}</h3>
    </div>
  );
}

export default Calendar;
