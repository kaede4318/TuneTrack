import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import '../src/app/App.css';
import Toolbar from '../src/app/Toolbar';
import Canvas from '../src/app/canvas';
import Tuner from '../src/app/tuner';
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
  const canvasStatesRef = useRef({});

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
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    saveCanvasState(canvas);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const saveCanvasState = (canvas) => {
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    canvasStatesRef.current[pageNumber] = imageData;
  };

  const loadCanvasState = (canvas) => {
    const context = canvas.getContext('2d');
    const imageData = canvasStatesRef.current[pageNumber];
    if (imageData) {
      context.putImageData(imageData, 0, 0);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handlePageChange = (newPageNumber) => {
    saveCanvasState(document.querySelector('canvas'));
    setPageNumber(newPageNumber);
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
      {!drawingEnabled && !eraseMode && (<canvas 
        width={1024}
        height={1366}
        className="visualizer"
        style={{position: 'absolute', top: 0, zIndex: 2}}
      />)}
      {!drawingEnabled && !eraseMode && (<div 
        id="countdown"
      />)}
      <Canvas
        width={canvasSize.width}
        height={canvasSize.height}
        drawingEnabled={drawingEnabled}
        eraseMode={eraseMode}
        clearCanvas={clearCanvas}
        saveCanvasState={saveCanvasState}
        loadCanvasState={loadCanvasState}
      />
      <div className="pdf-container">
        <Document
          file="/data/the second waltz/thesecondwaltz.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} width={1024} />
        </Document>
      </div>
      <div className="pagenav">
        {pageNumber > 1 && (
          <div className="overlay left">
            <button id="prev-btn" className="nav-button" onClick={() => setPageNumber(pageNumber - 1)}>
              Prev Page
            </button>
          </div>
        )}
        <div className="overlay middle">
          Page {pageNumber} of {numPages}
        </div>
        {pageNumber < numPages && (
          <div className="overlay right">
            <button id="next-btn" className="nav-button" onClick={() => setPageNumber(pageNumber + 1)}>
              Next Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
