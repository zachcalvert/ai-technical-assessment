import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Grid, Button, Box } from '@mui/material';

import { remove } from '../api';
import { FIELDS_URL } from '../api/urls';

const DeleteField = ({ field }) => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = `${FIELDS_URL}${field.id_hash}/`
    try {
      await remove(url);
      navigate('/');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Grid item xs={12} sx={{ marginBottom: '1rem' }}>
        <Button color="success" variant="contained" onClick={handleSubmit} sx={{ marginRight: '1rem' }}>
          Yes, delete
        </Button>
        <Button color="error" variant="contained" onClick={() => setDeleteFieldOpen(false)}>
          No, exit out
        </Button>
      </Grid>
    </Box>
  );
};

export default DeleteField;
