import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch } from 'react-icons/fa';
import './NewIdea.css';
import { useIdeas } from '../data/IdeaContext';
import { getTripById } from '../data/getTripById';


function NewIdea() {
   const { id } = useParams();
   const trip = getTripById(id);
   const tripName = trip?.name || "Trip";
  const navigate = useNavigate();
  const { addIdea } = useIdeas();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: new Date(),
    time: '',
    link: '',
    tags: '',
    description: '',
    image: null,
    imagePreview: null,
  });

  const [tagList, setTagList] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
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

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && formData.tags.trim()) {
      setTagList([...tagList, formData.tags.trim()]);
      setFormData({ ...formData, tags: '' });
      e.preventDefault();
    }
  };

  const openGoogleMaps = () => {
    const query = encodeURIComponent(formData.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const idea = { ...formData, tags: tagList };
    addIdea(idea);
    navigate(`/trip/${id}/ideas`);
  };

  return (
    <div className="new-idea-container">
      {formData.imagePreview && (
        <img src={formData.imagePreview} className="cover-image" alt="Idea preview" />
      )}

      <div className="new-idea-header">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <h1>{id || 'Trip Name'}!</h1>
      </div>

      <h2>Add New Idea</h2>
      <form className="new-idea-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />

        <div className="location-wrapper">
          <input name="location" placeholder="Location" onChange={handleChange} value={formData.location} />
          <FaSearch className="location-icon" onClick={openGoogleMaps} />
        </div>

        <DatePicker
          selected={formData.date}
          onChange={(date) => setFormData({ ...formData, date })}
          className="datepicker"
          dateFormat="MMMM d, yyyy"
        />

        <input
          type="time"
          name="time"
          onChange={handleChange}
          className="timepicker"
        />

        <input name="link" placeholder="Link" onChange={handleChange} />
        
        <input
          name="tags"
          placeholder="Add tags and press Enter"
          value={formData.tags}
          onChange={handleChange}
          onKeyDown={handleAddTag}
        />
        <div className="tags-container">
          {tagList.map((tag, index) => (
            <span key={index} className={`tag color-${index % 5}`}>{tag}</span>
          ))}
        </div>

        <textarea name="description" placeholder="Description" onChange={handleChange} />

        <label className="image-label">
          Image
          <input name="image" type="file" accept="image/*" onChange={handleChange} />
        </label>

        <button type="submit" className="submit-button">Save</button>
      </form>
    </div>
  );
}

export default NewIdea;
