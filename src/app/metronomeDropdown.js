// src/MetronomeDropdown.js
import React, { useState } from 'react';
import Metronome from './metronome';
import './App.css';

const MetronomeDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setIsActive(prev => !prev);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        className={`metronome-button ${isActive ? 'active' : ''}`} 
        onClick={toggleDropdown}
      >
        Metronome
      </button>
      {showDropdown && (
        <div className="metronome-dropdown">
          <Metronome />
        </div>
      )}
    </div>
  );
};

export default MetronomeDropdown;

