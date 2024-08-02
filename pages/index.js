"use client";

import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import '../src/app/App.css';
import Toolbar from '../src/app/Toolbar.js';
import Canvas from '../src/app/canvas';
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Provide PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Main = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  const draw = (context, count) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = 'grey';
    const delta = count % 800;
    context.fillRect(10, 10, 100, 10);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="pdf-viewer">
      {/* TODO: Add buttons to Toolbar (found in Toolbar.js) */}
      <div className="Toolbar-container"><Toolbar /></div>
      <Canvas width={canvasSize.width} height={canvasSize.height} />
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
      <div className="pagenav">
        {pageNumber > 1 && (
          <div className="overlay left">
            <button className="nav-button" onClick={() => setPageNumber(pageNumber - 1)}>
              Prev Page
            </button>
          </div>
        )}
        <div className="overlay middle">
          Page {pageNumber} of {numPages}
        </div>
        {pageNumber < numPages && (
          <div className="overlay right">
            <button className="nav-button" onClick={() => setPageNumber(pageNumber + 1)}>
              Next Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;