import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../data/firebaseConfig';

function PlanNewTrip() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startDate: new Date(),
    endDate: new Date(),
    image: null,
    imagePreview: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      const file = files[0];
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  return (
    <div className="new-trip-container">
      {formData.imagePreview && (
        <img src={formData.imagePreview} className="cover-image" alt="Trip preview" />
      )}
      <h2>Create a New Trip</h2>
      <form onSubmit =" ">
        <input name="name" placeholder="Trip Name" onChange={handleChange} required />

        <div className="location-wrapper">
          <input name="location" placeholder="Location" onChange={handleChange} value={formData.location} required />
        </div>

        <label>Start Date:</label>
        <DatePicker selected={formData.startDate} onChange={(date) => setFormData({ ...formData, startDate: date })} className="datepicker" dateFormat="MMMM d, yyyy" required />

        <label>End Date:</label>
        <DatePicker selected={formData.endDate} onChange={(date) => setFormData({ ...formData, endDate: date })} className="datepicker" dateFormat="MMMM d, yyyy" required />

        <label className="image-label">
          Trip Image
          <input name="image" type="file" accept="image/*" onChange={handleChange} />
        </label>

        <button type="submit" className="submit-button">Save Trip</button>
      </form>
    </div>
  );
}

export default PlanNewTrip;
