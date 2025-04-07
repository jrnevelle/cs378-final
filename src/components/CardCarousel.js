// inspired from https://github.com/CodeCompleteYT/react-image-carousel/tree/main

import React, { useState, useEffect } from 'react';
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import './CardCarousel.css';

export const Carousel = ({ data }) => {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    setTrips(data);
  }, [data]);

  const nextSlide = () => {
    setSlide(slide === data.length - 1 ? 0 : slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide === 0 ? data.length - 1 : slide - 1);
  };

  const defaultImage =
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';

  return (
    <div className="carousel">
      <BsArrowLeftCircleFill onClick={prevSlide} className="arrow arrow-left" />
      {trips.map((item, index) => {
        const imageUrl = item.imageUrl || item.coverPhoto || defaultImage;
        const title = item.tripName || item.name || 'Untitled Trip';

        return (
          <div
            key={index}
            className={slide === index ? 'slide' : 'slide slide-hidden'}
          >
            <img src={imageUrl} alt="Trip Image" />
            <div className="title">{title}</div>
            <button
              className="view-trip"
              onClick={() => navigate(`/trip/${item.id}/home`)}
            >
              View Trip
            </button>
          </div>
        );
      })}
      <BsArrowRightCircleFill
        onClick={nextSlide}
        className="arrow arrow-right"
      />
      <span className="indicators">
        {trips.map((_, index) => (
          <button
            key={index}
            className={
              slide === index ? 'indicator' : 'indicator indicator-inactive'
            }
            onClick={() => setSlide(index)}
          />
        ))}
      </span>
    </div>
  );
};
