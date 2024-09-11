import { useEffect, useState } from 'react';

import { Box, CircularProgress, Divider, Grid, Typography } from '@mui/material';

import { get } from '../api';
import { CURRENT_USER_URL } from '../api/urls';

const Profile = () => {
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchUser() {
      setProcessing(true);
      try {
        const userData = await get(CURRENT_USER_URL);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
      setProcessing(false);
    }
    fetchUser();
  }, []);

  if (processing) {
    return (
      <Grid container>
        <Grid item xs={12} alignItems="center">
        <CircularProgress variant='indeterminate' />
        </Grid>
      </Grid>
    )
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: '1rem' }}>Profile</Typography>
      <Divider sx={{ marginBottom: '1rem' }} />
      <Typography>Email: {user?.email}</Typography>
    </Box>
  )
}

export default Profile;
