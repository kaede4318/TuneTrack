//indicates that this component and all of its children should be rendered on the client side, DON'T DELETE
"use client";

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './App.css';

//provide PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Main = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="pdf-viewer">
      <div className="pdf-container">
        <Document
          file="/test-photos/Dave Brubeck - Three To Get Ready.pdf"
          onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} width={1024} />
        </Document>
      </div>
      <div>
        {pageNumber > 1 && (
          <div className="overlay left" disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}>
            <p>This is an overlay div: </p>
            <p>Page {pageNumber} of {numPages}</p>
          </div>
        )}

        {pageNumber < numPages && (
          <div className="overlay right" disabled={pageNumber >= numPages} onClick={() => setPageNumber(pageNumber + 1)}>
            <p>This is an overlay div: </p>
            <p>Page {pageNumber} of {numPages}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;