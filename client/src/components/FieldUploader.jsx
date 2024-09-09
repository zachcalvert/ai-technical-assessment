import React, { useState } from 'react';

import { Button, Typography } from '@mui/material';

import { post } from '../api';
import { UPLOAD_URL } from '../api/urls';

const FieldUploader = ({ setFieldUploaderOpen }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      const { responseData, errorMessage } = await post(UPLOAD_URL, formData, true);
      if (errorMessage) {
        setError(`An error occurred: ${errorMessage.detail}`);
        setMessage(null);
      }
      else {
        setMessage(responseData.message);
        setError(null);
        setFieldUploaderOpen(false);
      }
     
    } catch (error) {
      setError('An error occurred');
      setMessage(null);
    }
  };

  return (
    <div sx={{ width: '100%' }}>
      <form onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          required 
        />
        <Button sx={{ marginRight: 0 }} variant="contained" type="submit">Upload CSV</Button>
      </form>
      {error && <Typography color="error">{error}</Typography>}
    </div>
  );
};

export default FieldUploader;
