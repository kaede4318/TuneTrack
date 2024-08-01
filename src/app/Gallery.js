import './App.css';
import React from 'react';


const images = [
  '/test-photos/thesecondwaltz.pdf',
];

function Gallery() {
    return (
      <div className="gallery">
        {files.map((src, index) => (
          <div key={index} className="gallery-item">
            <iframe
              src={src}
              style={{ width: '100%', height: '500px' }} 
              title={`Gallery ${index}`}
            />
          </div>
        ))}
      </div>
    );
  }
  
