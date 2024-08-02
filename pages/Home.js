import React from 'react';
import Link from 'next/link';
import '../src/app/App.css';

const Home = () => {
  const viewPDF = () => {
    alert("test!");
  };

  return (
    <div className="home-container">
      <h1 className="app-name">TuneTrack</h1>
      <div className="upload-container">
        <button onClick={viewPDF} className="custom-file-upload">
          Upload Sheet Music
        </button>
        <input id="file-upload" type="file" accept="application/pdf" />
      </div>
      <Link href="/Gallery" legacyBehavior>
        <a>Go to Gallery</a>
      </Link>
    </div>
  );
};

export default Home;
