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
  const [drawingEnabled, setDrawingEnabled] = useState(false);
  const [eraseMode, setEraseMode] = useState(false);
  const [clearCanvas, setClearCanvas] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  const handleDrawButtonClick = () => {
    setDrawingEnabled(true);
    setEraseMode(false);
  };

  const handleEraseButtonClick = () => {
    setDrawingEnabled(false);
    setEraseMode(true);
  };

  const handleClearButtonClick = () => {
    setClearCanvas(true);
    setTimeout(() => setClearCanvas(false), 0);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="pdf-viewer">
      <div className="Toolbar-container">
        <Toolbar
          onDrawButtonClick={handleDrawButtonClick}
          onEraseButtonClick={handleEraseButtonClick}
          onClearButtonClick={handleClearButtonClick}
        />
      </div>
      <Canvas
        width={canvasSize.width}
        height={canvasSize.height}
        drawingEnabled={drawingEnabled}
        eraseMode={eraseMode}
        clearCanvas={clearCanvas}
      />
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
