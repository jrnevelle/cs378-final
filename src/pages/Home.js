import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { Carousel } from "../components/CardCarousel";
import allTrips from "../data/allTrips.json"

function Home() {
    const trips = allTrips.trips;
    return (
        
        <div className="Home">
            <Link to="/profile" className="profile">
                <img src="profile.png" alt="Profile" />
            </Link>
            <div className="trip-carousel">
                <h3>Current Trips</h3>
                <Carousel data={trips} />
                <div className="action-buttons">
                    <Link to="/plan-new-trip" className="button">Plan New Trip</Link>
                    <Link to="/past-trips" className="button">View Past Trips</Link>
                </div>
            </div>

            
        </div>
    );
}

export default Home;