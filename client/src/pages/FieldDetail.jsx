import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Grid, Typography, CircularProgress, Card, CardContent, Box } from '@mui/material';
import { Dialog, DialogTitle } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { get } from '../api'
import { FIELDS_URL } from '../api/urls';
import EditField from '../components/EditField';
import DeleteField from '../components/DeleteField';

const parseLocation = (location) => {
  if (!location) return { lat: 'N/A', lng: 'N/A' };
  
  // Example WKT format: "SRID=4326;POINT (-121 45)"
  const match = location.match(/POINT \(([^ ]+) ([^ ]+)\)/);
  if (match) {
    return { lat: match[2], lng: match[1] };
  }
  return { lat: 'N/A', lng: 'N/A' };
};

const FieldDetail = () => {
  const { id } = useParams();
  const [processing, setProcessing] = useState(false);
  const [fieldData, setFieldData] = useState(null);
  const [editFieldOpen, setEditFieldOpen] = useState(false);
  const [deleteFieldOpen, setDeleteFieldOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate for handling back navigation

  useEffect(() => {
    const url = `${FIELDS_URL}${id}/`;
    setProcessing(true);
    get(url)
      .then(data => {
        setFieldData(data);
      })
      .catch(error => {
        console.error("There was an error fetching field data", error);
      });
    setProcessing(false);
  }, [editFieldOpen]);

  if (processing) {
    return <CircularProgress variant="indeterminate" />;
  }

  const { lat, lng } = parseLocation(fieldData?.location);

  return (
    <Grid container spacing={2} alignContent="start">
      <Grid item xs={1} />
      <Grid item xs={10} display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: '4rem' }}>
        <Button 
          color="primary" 
          variant="text" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <div>
          <Button color="info" variant="contained" startIcon={<EditIcon />} onClick={() => setEditFieldOpen(true)} sx={{ marginRight: '1rem' }}>
            Edit
          </Button>
          <Button color="error" variant="contained" startIcon={<DeleteIcon />} onClick={() => setDeleteFieldOpen(true)}>
            Delete
          </Button>
        </div>
      </Grid>
      <Grid item xs={1} />
      
      <Grid item xs={3} />
      <Grid item xs={6}>
        <Card variant="outlined" sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {fieldData?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Acreage: {fieldData?.acreage}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Latitude: {lat}, Longitude: {lng}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(fieldData?.created).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last Updated: {new Date(fieldData?.last_updated).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3} />

      {/* Edit Dialog */}
      <Dialog
        fullWidth={true}
        maxWidth="lg"
        open={editFieldOpen}
      >
        <DialogTitle>Edit Field</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setEditFieldOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <EditField
            field={fieldData}
            setEditFieldOpen={setEditFieldOpen}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        fullWidth={true}
        maxWidth="lg"
        open={deleteFieldOpen}
      >
        <DialogTitle>Confirm delete</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setDeleteFieldOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <DeleteField
            field={fieldData}
            setDeleteFieldOpen={setDeleteFieldOpen}
          />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default FieldDetail;