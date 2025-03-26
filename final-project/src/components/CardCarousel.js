// inspired from https://github.com/CodeCompleteYT/react-image-carousel/tree/main

import React, { useState } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import "./CardCarousel.css";

export const Carousel = ({ data }) => {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setSlide(slide === data.length - 1 ? 0 : slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide === 0 ? data.length - 1 : slide - 1);
  };

  return (
    <div className="carousel">
      <BsArrowLeftCircleFill onClick={prevSlide} className="arrow arrow-left" />
      {data.map((item) => {
        return (
          <div
            key={item.id}
            className={slide === item.id ? "slide" : "slide slide-hidden"}
          >
          <img src={item.img}/>
          <div className="title">{item.name}</div>
          <button 
            className="view-trip"
            onClick={()=>navigate(`/trip/${item.id}/home`)}
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
        {data.map((item) => {
          return (
            <button
              key={item.id}
              className={
                slide === item.id ? "indicator" : "indicator indicator-inactive"
              }
              onClick={() => setSlide(item.id)}
            ></button>
          );
        })}
      </span>
    </div>
  );
};