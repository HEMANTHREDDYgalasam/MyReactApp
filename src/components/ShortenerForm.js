// src/components/ShortenerForm.js
import React, { useState } from 'react';
import { Box, TextField, Button, Grid, Typography, Alert } from '@mui/material';
import { log } from '../utils/logger';

function ShortenerForm({ onShorten }) {
  const [urlInputs, setUrlInputs] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [error, setError] = useState('');

  // Add new input row (max 5)
  const addRow = () => {
    if (urlInputs.length < 5) {
      setUrlInputs([...urlInputs, { url: '', validity: '', shortcode: '' }]);
    } else {
      setError("You can shorten up to 5 URLs at once. Let's focus on these for now!");
    }
  };

  const handleChange = (index, field, value) => {
    const newInputs = [...urlInputs];
    newInputs[index][field] = value;
    setUrlInputs(newInputs);
  };

  const validateURL = (str) => {
    const pattern = /^https?:\/\/\S+/;
    return pattern.test(str);
  };

  const validateShortcode = (code) => {
    if (!code) return true; // optional
    const pattern = /^[a-zA-Z0-9]{4,12}$/;
    return pattern.test(code);
  };

  const validateValidity = (val) => {
    if (!val) return true; // optional
    const n = Number(val);
    return Number.isInteger(n) && n > 0 && n <= 1440; // max 24 hours
  };

  const handleShorten = async () => {
    try {
      for (let i = 0; i < urlInputs.length; i++) {
        const { url, validity, shortcode } = urlInputs[i];
        if (!url.trim()) {
          await log("frontend", "warn", "component", `Validation failed: empty URL in row ${i + 1}`);
          setError(`Oops! Please enter the original URL in row ${i + 1}.`);
          return;
        }
        if (!validateURL(url)) {
          await log("frontend", "warn", "component", `Validation failed: invalid URL in row ${i + 1}`);
          setError(`Hmm... The URL in row ${i + 1} seems invalid. It should start with http:// or https://.`);
          return;
        }
        if (!validateValidity(validity)) {
          await log("frontend", "warn", "component", `Validation failed: invalid validity in row ${i + 1}`);
          setError(`Please enter a valid number of minutes (1-1440) for validity in row ${i + 1}.`);
          return;
        }
        if (!validateShortcode(shortcode)) {
          await log("frontend", "warn", "component", `Validation failed: invalid shortcode in row ${i + 1}`);
          setError(`Shortcode in row ${i + 1} must be 4-12 letters and numbers, no spaces or symbols.`);
          return;
        }
      }

      await log("frontend", "info", "component", "User clicked shorten button.");

      const results = urlInputs.map(({ url, validity, shortcode }) => {
        const code = shortcode || Math.random().toString(36).substring(2, 8);
        const mins = validity ? parseInt(validity) : 30;
        const expiryDate = new Date(Date.now() + mins * 60000);
        return {
          original: url,
          shortcode: code,
          expiry: expiryDate.toLocaleString(),
        };
      });

      setShortenedUrls(results);
      setError('');

      await log("frontend", "info", "component", "User shortened URLs successfully.");

      if (onShorten) {
        onShorten(results);
      }
    } catch (error) {
      await log("frontend", "error", "component", `Unexpected error: ${error.message}`);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Box mt={3}>
      <Typography variant="h5" gutterBottom>
        Let's shorten some URLs!
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        You can shorten up to 5 URLs at once. Enter the full URL starting with <em>http://</em> or <em>https://</em>.
        Optionally, add how many minutes the link should stay valid (default 30) and your preferred shortcode.
      </Typography>
      <Grid container spacing={2}>
        {urlInputs.map((input, idx) => (
          <Grid key={idx} container spacing={1} sx={{ mb: 1 }}>
            <Grid item xs={6}>
              <TextField
                label={`Original URL (Row ${idx + 1})`}
                value={input.url}
                onChange={(e) => handleChange(idx, 'url', e.target.value)}
                placeholder="https://example.com"
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Validity (minutes)"
                value={input.validity}
                type="number"
                onChange={(e) => handleChange(idx, 'validity', e.target.value)}
                placeholder="30"
                fullWidth
                inputProps={{ min: 1, max: 1440 }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Preferred Shortcode"
                value={input.shortcode}
                onChange={(e) => handleChange(idx, 'shortcode', e.target.value)}
                placeholder="e.g., mycode123"
                fullWidth
              />
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Box mt={2}>
        <Button onClick={addRow} disabled={urlInputs.length >= 5}>
          Add Another URL
        </Button>
        <Button variant="contained" sx={{ ml: 2 }} onClick={handleShorten}>
          Shorten URLs
        </Button>
      </Box>

      {!!error && (
        <Alert severity="warning" sx={{ mt: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {shortenedUrls.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Here are your shortened URLs:
          </Typography>
          <ul>
            {shortenedUrls.map(({ shortcode, original, expiry }, idx) => (
              <li key={idx}>
                <strong>{shortcode}</strong> → {original} <br />
                <small>Expires at: {expiry}</small>
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
}

export default ShortenerForm;
