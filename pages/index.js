import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import '../src/app/App.css';
import Toolbar from '../src/app/Toolbar';
import Canvas from '../src/app/canvas';
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Provide PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Main = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [drawingEnabled, setDrawingEnabled] = useState(false); // Add state for drawing

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

  const handleDrawButtonClick = () => {
    setDrawingEnabled(prev => !prev);
  };

  return (
    <div className="pdf-viewer">
      <div className="Toolbar-container">
        <Toolbar onDrawButtonClick={handleDrawButtonClick} /> {/* Pass the handler */}
      </div>
      <Canvas width={canvasSize.width} height={canvasSize.height} drawingEnabled={drawingEnabled} /> {/* Pass drawingEnabled state */}
      <div className="pdf-container">
        <Document
          file="/data/the second waltz/thesecondwaltz.pdf"
          onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} width={1024} />
        </Document>
      </div>
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
