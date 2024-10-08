import React, { useRef, useState } from 'react';
import {convertToBPM} from '../src/app/utils';
import Link from 'next/link';
import fetch from 'node-fetch';
import '../src/app/App.css';
import * as pdfjsLib from 'pdfjs-dist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMusic} from '@fortawesome/free-solid-svg-icons';

// Provide PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Home = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Opens the inputted pdf in another tab
  // We don't really need this but its nice to display the pdf back 
  // to show that the upload was successful
  const viewPDF = () => {
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      window.open(fileURL);
    } else {
      alert("No file uploaded! Please upload a pdf first.");
    }
  };

  const sendPdfToNoggin = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });

    // Create a native HTML5 canvas element
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height / 3;
    const context = canvas.getContext('2d');

    // Render only the top 1/3 of the PDF page onto the canvas
    // Note: we render only the top 1/3 to make the CV noggin more efficient
    const renderContext = {
      canvasContext: context,
      viewport: viewport.clone({ height: viewport.height / 3 })
    };

    await page.render(renderContext).promise;

    const croppedDataUrl = canvas.toDataURL('image/png');

    // Send the cropped png to noggin
    const response = await fetch(
      'https://noggin.rea.gent/intense-sole-1123',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer rg_v1_01k22lhb4e9ej5advf89jmpbrnz4k1wg6hgr_ngk',
        },
        body: JSON.stringify({
          "picture": croppedDataUrl,
        }),
      }
    ).then(response => response.text());

    // Manually updates BPM from tempo marking found by noggin
    const pdfData = convertToBPM(response)
    
    // TODO: Add data to songinfo.json
    saveJsonData(pdfData);
  };

  async function saveJsonData(data) {
    const jsonData = data
  
    const response = await fetch('/api/save-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    });
  
    const result = await response.json();
    console.log(result);
  }

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    await sendPdfToNoggin(file);
  };

  return (
    <div className="home-container">
      <header className="header">
        <FontAwesomeIcon icon={faMusic} className="header-icon left-icon" />
        <h1 className="app-name">TuneTrack</h1>
        <FontAwesomeIcon icon={faMusic} className="header-icon right-icon" />
      </header>
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
      <button id='previewButton' onClick={viewPDF}>Preview File Upload (Opens in New Tab)</button>
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
