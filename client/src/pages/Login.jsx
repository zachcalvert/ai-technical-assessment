import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSnackbar } from 'notistack';

import AuthService from '../services/auth';

const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [processing, setProcessing] = useState(false);
  let navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();


  const [form, setForm] = useState({
    email: { value: "" },
    password: { value: "" }
  });

  const handleChange = (e) => {
    let _form = { ...form };
    _form[e.target.name].value = e.target.value;
    setForm(_form);
  }

  const submitForm = async (e) => {
    e.preventDefault();

    if (form.email.value && form.password.value) {
      setProcessing(true);

      try {
        let data = await AuthService.login(form.email.value, form.password.value);
        if (data.status) {
          setProcessing(false); window.location.replace('/');
          enqueueSnackbar('Welcome!', {variant: 'success'})
        } else {
          setProcessing(false);
          enqueueSnackbar('Incorrect email or password', {variant: 'error'})
        }
      }
      catch (e) {
        setProcessing(false);
      }
    }
  }

  return (
    <Grid container>
      <Grid item sm={4} xs={3} />
      <Grid item sm={4} xs={6}>
        <Paper elevation={3} sx={{ padding: '2rem' }}>
        <Typography variant="h4">Login</Typography>
        <form className="mb-4" onSubmit={submitForm}>
          <TextField variant="standard" margin="normal" fullWidth
            label="Email Address" name="email" autoFocus
            value={form.email.value} onChange={handleChange}
            />
          <TextField variant="standard" margin="normal"
            label="Password*" type={passwordVisibility ? "text" : "password"} fullWidth name="password"
            value={form.password.value} onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" tabIndex="-1"
                    onClick={e => setPasswordVisibility(!passwordVisibility)} >
                    {passwordVisibility ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" fullWidth disabled={!form.email || !form.password || processing} variant="contained" color="primary" > {processing ? "Processing..." : "Log In"} </Button>
        </form>
        </Paper>
      </Grid>
      <Grid item sm={4} xs={3} />
    </Grid>)
}

export default Login;
