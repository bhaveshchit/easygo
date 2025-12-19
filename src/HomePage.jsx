import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function HomePage() {
  const navigate = useNavigate();
  const personImages = ['/perons.png', '/persons2.svg', '/persons3.svg'];
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);

  const handleLetsGoClick = () => {
    setCurrentPersonIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % personImages.length;
      if (newIndex === 0 && prevIndex === personImages.length - 1) {
        // If it cycles from the last image back to the first
        navigate('/auth');
      }
      return newIndex;
    });
  };

  return (
    <div className="home-page">
      <img src="/Vector.svg" className="vector-image" alt="Vector" />
      <p className="vector-text">Send Goods Anywhere Forever</p>
      <button className="skip-button">Skip-</button>
      <img src="/buildings.svg" className="buildings-image" alt="Buildings" />
      <img src={personImages[currentPersonIndex]} className="persons-image" alt="Persons" />
      <div class="info-card">
        <h3>Goods Sending Made Smooth</h3>
        <p>
          Get Faster Anywhere and Everywhere you will need to Go,<br />
          Easy Booking and Comfortable Ride Experience
        </p>
      </div>
      <button class="lets-go-btn" onClick={handleLetsGoClick}>
        Let’s Goo
        <img src="/steering-wheel.svg" alt="Steering Wheel" class="steering-wheel-icon" />
      </button>
      <div className="slider-dots-container">
        {personImages.map((_, index) => (
          <span
            key={index}
            className={`slider-dot ${index === currentPersonIndex ? 'active' : ''}`}
          ></span>
        ))}
      </div>
      <img src="/circle.svg" className="circle-image" alt="Circle" />
    </div>
  );
}

export default HomePage;