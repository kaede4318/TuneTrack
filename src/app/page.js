//indicates that this component and all of its children should be rendered on the client side, DON'T DELETE
"use client";

import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './App.css';
import Toolbar from './Toolbar.js';
import Canvas from './canvas.js';

//provide PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Main = () => {

  const draw = (context, count) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.fillStyle = 'grey'
    const delta = count % 800
    context.fillRect(10,10,100,10)
  }

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="pdf-viewer">
      <div id="root"></div> {/*root, where we mount the canvas component*/}
      {/* TODO: Add buttons to Toolbar (found in Toolbar.js) */}
      <div className="Toolbar-container"><Toolbar /></div>
      <div className="pdf-container">
        {/* TODO: Create an input button for the PDF */}
        {/* TODO: make the width variable */}
        <Document
          file="/test-photos/thesecondwaltz.pdf"
          onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} width={1024}/>
          {/* <Page pageNumber={pageNumber} width={window.innerWidth}/> */}
        </Document>
        
      </div>
      {/* TODO: Need to disable flipping pages somehow when adding notes */}
      <div>
        {pageNumber > 1 && (
          <div className="overlay left" onClick={() => setPageNumber(pageNumber - 1)}>
            <p>prev page </p>
            <p>Page {pageNumber} of {numPages}</p>
          </div>
        )}
        {pageNumber < numPages && (
          <div className="overlay right" onClick={() => setPageNumber(pageNumber + 1)}>
            <p>next page </p>
            <p>Page {pageNumber} of {numPages}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;