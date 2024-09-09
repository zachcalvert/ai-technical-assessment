import React, { useState } from 'react';

import { Button, TextField, Typography, Box } from '@mui/material';

import { post } from '../api';
import { FIELDS_URL, UPLOAD_URL } from '../api/urls';

const AddField = ({ setAddFieldOpen }) => {
  const [name, setName] = useState(null);
  const [acreage, setAcreage] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      name,
      acreage,
      latitude,
      longitude
    };

    try {
      const responseData = await post(FIELDS_URL, data);
      setError(null);
      setAddFieldOpen(false);
    } catch (error) {
      setError('An error occurred');
    }
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
    <Typography variant="h6" gutterBottom>
      Add a New Field
    </Typography>
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Acreage"
          variant="outlined"
          fullWidth
          type="number"
          value={acreage}
          onChange={(e) => setAcreage(e.target.value)}
          required
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Latitude"
          variant="outlined"
          fullWidth
          type="number"
          step="any"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Longitude"
          variant="outlined"
          fullWidth
          type="number"
          step="any"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
      </Box>
      {error && <Typography color="error" gutterBottom>{error}</Typography>}
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  </Box>
  );
};

export default AddField;
