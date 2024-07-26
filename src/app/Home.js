import './App.css';
import React from 'react';

const Home = () => {
  const viewPDF = () => {
    alert("test!");
  }
    return (
      <div className="home-container">
        <h1 className="app-name">TuneTrack</h1>
        <div className="upload-container">
          
          <button onClick={viewPDF} htmlFor="file-upload" className="custom-file-upload">
            Upload Sheet Music
          </button>
          <input id="file-upload" type="file" accept="application/pdf" />
        </div>
      </div>
    );
  };
  
export default Home;
