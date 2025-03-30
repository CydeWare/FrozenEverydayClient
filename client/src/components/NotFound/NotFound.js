import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './NotFound.css';

const NotFound = () => {
  const [rotation, setRotation] = useState(0);

  // Import images dynamically
  const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
      images[item.replace('./', '')] = r(item);
    });
    return images;
  };

  const images = importAll(
    require.context('../images', false, /\.(png|jpe?g|svg|webp|avif)$/)
  );

  // Update rotation based on window size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = 45 / (width / height);
      setRotation(-ratio);
    };

    handleResize(); // Run on mount
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="NotFound">
      <a href="/">
        <svg height="0.8em" width="0.8em" viewBox="0 0 2 1" preserveAspectRatio="none">
          <polyline fill="none" stroke="#fff" strokeWidth="0.1" points="0.9,0.1 0.1,0.5 0.9,0.9" />
        </svg>
        Home
      </a>
      <div className="background-wrapper">
        <h1
          id="visual"
          style={{
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          }}
        >
          404
        </h1>
      </div>
      <p>The page you’re looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
