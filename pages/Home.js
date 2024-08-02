import React, { useRef, useState } from 'react';
import Link from 'next/link';
import fetch from 'node-fetch';
import '../src/app/App.css';

const Home = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const viewPDF = () => {
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      window.open(fileURL);
    } else {
      alert("No file selected!");
    }
  };

  const extractData = async () => {
    const response = await fetch(
      'https://noggin.rea.gent/intense-sole-1123',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer rg_v1_01k22lhb4e9ej5advf89jmpbrnz4k1wg6hgr_ngk',
        },
        body: JSON.stringify({
          // fill variables here.
          // You can use an external URL or a data URL here.
          "picture": "",
        }),
      }
    ).then(response => response.text());
  }

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="home-container">
      <h1 className="app-name">TuneTrack</h1>
      <div className="upload-container">
        <button onClick={handleButtonClick} className="custom-file-upload">
          Upload Sheet Music
        </button>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
      <button onClick={viewPDF}>View PDF</button>
      <Link href="/Gallery" legacyBehavior>
        <a>
          <button id="galleryNavButton">
            Go to Gallery
          </button>
        </a>
      </Link>
    </div>
  );
};

export default Home;