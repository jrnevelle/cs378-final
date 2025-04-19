import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch } from 'react-icons/fa';
import './NewIdea.css';
import { collection, addDoc, serverTimestamp, GeoPoint } from 'firebase/firestore';
import { db, auth } from '../data/firebaseConfig';
import TripBanner from '../components/TripBanner';
import { FiArrowLeft } from 'react-icons/fi';

function NewIdea() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: new Date(),
    time: '',
    link: '',
    tags: '',
    description: '',
    img: '',
  });

  const [tagList, setTagList] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      '_blank'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to add an idea.');
      return;
    }
  
    let geoLocation = null;
    const loc = formData.location.split(',');
    if (loc.length === 2) {
      const lat = parseFloat(loc[0].trim());
      const lng = parseFloat(loc[1].trim());
      if (!isNaN(lat) && !isNaN(lng)) {
        geoLocation = new GeoPoint(lat, lng);
      }
    }
  
    const ideaData = {
      name: formData.name,
      location: geoLocation || formData.location,  // fallback to string if invalid
      date: formData.date,
      time: formData.time,
      link: formData.link,
      tags: tagList,
      description: formData.description,
      img: formData.img,
      owner: user.uid,
      votes: {
        yes: [],
        no: [],
      },
      createdAt: serverTimestamp(),
      archived: false,
    };
  
    try {
      const ideasRef = collection(db, 'trips', id, 'ideas');
      await addDoc(ideasRef, ideaData);
      navigate(`/trip/${id}/ideas`);
    } catch (err) {
      console.error('Error saving idea:', err);
      alert('Failed to save idea. Please try again.');
    }
  };
  

  return (
    <div>
    <TripBanner id={id}/>
    <div className="new-idea-container">
      

      <div className="new-idea-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft/>
        </button>
      </div>
      <h3 className='new-idea-title'>New Idea</h3>
      <form className="new-idea-form" onSubmit={handleSubmit}>
        <input className="name-input" name="name" placeholder="Name" onChange={handleChange} />

        <div className="location-wrapper">
          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            value={formData.location}
          />
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
            <span key={index} className={`tag color-${index % 5}`}>
              {tag}
            </span>
          ))}
        </div>

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="description-container"
        />

        {formData.img && (
          <div className="image-preview-container-new-idea">
            <img
              src={formData.img}
              className="cover-image-new-idea"
              alt="Idea preview"
              onError={(e) => (e.target.style.display = 'none')}
            />
          </div>
        )}

        <label className="image-label">
          Image URL
          <input
            name="img"
            type="text"
            placeholder="https://example.com/image.jpg"
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="submit-button">
          Save
        </button>
      </form>
    </div>
    </div>
  );
}

export default NewIdea;
