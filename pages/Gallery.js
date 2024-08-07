import React from 'react';
import Link from 'next/link';
import '../src/app/App.css';

const images = [
  '/data/the second waltz/thesecondwaltz.pdf',
  '/data/Dave Brubeck - Three To Get Ready.pdf',
];

const Gallery = () => {
  return (
    <div className="gallery">
      <Link href="/" legacyBehavior>
          <button className="back-button">Back</button>
      </Link>
      {images.map((src, index) => (
        <div key={index} className="gallery-item">
          
          <Link href="/Home" legacyBehavior>
            <a className="iframe-wrapper">
              <iframe
                src={src}
                style={{ width: '100%', height: '450px' }}
                title={`Gallery ${index}`}
              />
              <div className="overlay gallery">Click to View</div>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
