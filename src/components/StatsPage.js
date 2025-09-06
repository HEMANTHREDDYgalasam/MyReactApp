// src/components/StatsPage.js
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function StatsPage({ shortenedUrls, onClickShortcode }) {
  if (!shortenedUrls || shortenedUrls.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 3 }}>
        No URLs shortened yet.
      </Typography>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        URL Shortener Statistics
      </Typography>
      <ul>
        {shortenedUrls.map(({ shortcode, original, expiry, clicks = [] }, index) => (
          <li key={index} style={{ marginBottom: '16px' }}>
            <Link
              href={original}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onClickShortcode(shortcode)}
              underline="hover"
              sx={{ fontWeight: 'bold', fontSize: '1.1em' }}
            >
              {shortcode}
            </Link>{' '}
            — {original}
            <br />
            <small>Expires at: {expiry}</small>
            <br />
            <small>Total Clicks: {clicks.length}</small>
            {clicks.length > 0 && (
              <ul>
                {clicks.map((click, i) => (
                  <li key={i}>
                    {click.timestamp} - {click.source}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Box>
  );
}

export default StatsPage;
