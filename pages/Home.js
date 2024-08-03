import React, { useRef, useState } from 'react';
import Link from 'next/link';
import fetch from 'node-fetch';
import '../src/app/App.css';
import * as pdfjsLib from 'pdfjs-dist';

// Provide PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Home = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pngDataUrl, setPngDataUrl] = useState(null);

  // Opens the inputted pdf in another tab
  // We don't really need this but its nice to display the pdf back 
  // to show that the upload was successful
  const viewPDF = () => {
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      window.open(fileURL);
    } else {
      alert("No file selected!");
    }
  };

  const convertPdfToPng = async (file) => {
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
    setPngDataUrl(croppedDataUrl);

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
          "picture": pngDataUrl,
        }),
      }
    ).then(response => response.text());

    console.log(response);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    await convertPdfToPng(file);
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
      <button id='previewButton' onClick={viewPDF}>View Uploaded Sheet Music</button>
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
