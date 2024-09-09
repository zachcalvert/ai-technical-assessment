import React, { useEffect, useState } from 'react';

import { Button, TextField, Typography, Box } from '@mui/material';

import { put } from '../api';
import { FIELDS_URL } from '../api/urls';


const parseLocation = (location) => {
  if (!location) return { lat: 'N/A', lng: 'N/A' };
  
  const match = location.match(/POINT \(([^ ]+) ([^ ]+)\)/);
  if (match) {
    return { lat: match[2], lng: match[1] };
  }
  return { lat: 'N/A', lng: 'N/A' };
};


const EditField = ({ field, setEditFieldOpen }) => {
  const [name, setName] = useState(field.name);
  const [acreage, setAcreage] = useState(field.acreage);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { lat, lng } = parseLocation(field.location);
    setLatitude(lat)
    setLongitude(lng)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();

    const location = `SRID=4326;POINT (${longitude} ${latitude})`;

    const data = {
      name,
      acreage,
      location,
    };

    const url = `${FIELDS_URL}${field.id_hash}/`
    try {
      const responseData = await put(url, data);
      setError(null);
      setEditFieldOpen(false);
    } catch (error) {
      setError('An error occurred');
    }
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
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

export default EditField;
