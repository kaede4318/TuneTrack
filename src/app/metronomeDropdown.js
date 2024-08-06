// src/MetronomeDropdown.js
import React, { useState } from 'react';
import Metronome from './Metronome';

const MetronomeDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={toggleDropdown}>Metronome</button>
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          backgroundColor: 'white',
          boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
          zIndex: 1,
          padding: '10px',
          borderRadius: '4px'
        }}>
          <Metronome />
        </div>
      )}
    </div>
  );
};

export default MetronomeDropdown;
