// src/App.js
import React, { useState } from 'react';
import ShortenerForm from './components/ShortenerForm';
import StatsPage from './components/StatsPage';

function App() {
  const [shortenedUrls, setShortenedUrls] = useState([]);

  // Receive shortened URLs from ShortenerForm
  const handleShortenedUrls = (urls) => {
    setShortenedUrls(urls);
  };

  // Record a click on a shortened URL
  const recordClick = (shortcode) => {
    setShortenedUrls((prevUrls) =>
      prevUrls.map((url) => {
        if (url.shortcode === shortcode) {
          return {
            ...url,
            clicks: [
              ...(url.clicks || []),
              {
                timestamp: new Date().toLocaleString(),
                source: document.referrer || 'Direct',
              },
            ],
          };
        }
        return url;
      })
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <ShortenerForm onShorten={handleShortenedUrls} />
      <StatsPage shortenedUrls={shortenedUrls} onClickShortcode={recordClick} />
    </div>
  );
}

export default App;
