import { useEffect, useState } from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Unstable_Grid2';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { SnackbarProvider } from 'notistack'

import Header from './components/Header';
import AuthRoutes from './routes/AuthRoutes';
import UnAuthRoutes from './routes/UnAuthRoutes';
import AuthService from './services/auth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C1E1C1',
    },
    secondary: {
      main: '#C3B1E1',
    },
    tertiary: {
      main: "#C3B1E1"
    },
    black: {
      main: "#333333"
    },
    background: {
      default: '#333333',
    },
    text: {
      primary: '#333333',
      secondary: '#333333',
    },
    action: {
      hover: '#C1E1C1',
    },
  },
  typography: {
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
});

function App() {
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState({'id': null, 'email': null});

  useEffect(() => {
    console.log({user})
    AuthService.getProfile().then(user => {
      console.log({user})
      if (user) {
        setUser(user);
      }
    })
  }, [])

  const logout = async () => {
    setProcessing(true);

    try {
      let data = await AuthService.logout();
      if (data.status) {
        setProcessing(false);
        window.location.replace('/login');
      } else {
        setProcessing(false);
      }
    }
    catch {
      setProcessing(false);
    }
  }

  if (processing) return <CircularProgress color="success" />;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <SnackbarProvider>
        <ThemeProvider theme={theme}>
          <Header
            user={user}
            logout={logout}
          />
          <Grid container sx={{
            height: 'calc(100vh - 64px)',
            padding: '32px'
          }}>
            <BrowserRouter>
              <Routes>
                {AuthRoutes}
                {UnAuthRoutes}
              </Routes>
            </BrowserRouter>
          </Grid>
        </ThemeProvider>
      </SnackbarProvider>
    </LocalizationProvider>
  );
}

export default App;
