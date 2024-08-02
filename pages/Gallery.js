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
      {images.map((src, index) => (
        <div key={index} className="gallery-item">
          <Link href="/" legacyBehavior>
            <a className="iframe-wrapper">
              <iframe
                src={src}
                style={{ width: '100%', height: '500px' }}
                title={`Gallery ${index}`}
              />
              <div className="overlay">Click to go to Page</div>
            </a>
          </Link>
        </div>
      ))}
      <Link href="/" legacyBehavior>
        <a>Go to Page</a>
      </Link>
    </div>
  );
};

export default Gallery;


