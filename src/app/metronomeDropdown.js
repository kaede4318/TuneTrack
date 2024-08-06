// src/MetronomeDropdown.js
import React, { useState } from 'react';
import Metronome from './metronome';
import './App.css';

const MetronomeDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button className="metronome-button" onClick={toggleDropdown}>
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

