// src/Metronome.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const Metronome = () => {
  const [bpm, setBpm] = useState(120);
  const [playing, setPlaying] = useState(false);
  const clickRef = useRef(null);
  const intervalId = useRef(null);

  useEffect(() => {
    if (playing) {
      intervalId.current = setInterval(() => {
        clickRef.current.play();
        clickRef.current.currentTime = 0;
      }, (60 / bpm) * 1000);
    } else {
      clearInterval(intervalId.current);
    }
    return () => clearInterval(intervalId.current);
  }, [playing, bpm]);

  const handleBpmChange = (event) => {
    setBpm(event.target.value);
  };

  const togglePlaying = () => {
    setPlaying(!playing);
  };

  return (
    <div className="metronome">
      <div>
        <label htmlFor="bpm" className="bpm-label">BPM: </label>
        <input
          type="number"
          id="bpm"
          value={bpm}
          onChange={handleBpmChange}
          min="40"
          max="240"
          className='bpm-input'
        />
      </div>
      <button onClick={togglePlaying}>{playing ? 'Stop' : 'Start'}</button>
      <audio ref={clickRef} src="/click.mp3" preload="auto"></audio>
    </div>
  );
};

export default Metronome;
