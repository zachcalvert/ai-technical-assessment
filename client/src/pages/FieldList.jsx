import React, { useEffect, useState } from 'react';

import { parseISO, format } from 'date-fns';
import Typography from '@mui/material/Typography';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { CircularProgress, Divider, Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Dialog, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

import { get } from '../api';
import { FIELDS_URL } from '../api/urls';
import AddField from '../components/AddField';
import FieldUploader from '../components/FieldUploader';

export default function FieldList() {
  const [fields, setFields] = React.useState([]);
  const [processing, setProcessing] = React.useState(false);
  const [addFieldOpen, setAddFieldOpen] = React.useState(false);
  const [fieldUploaderOpen, setFieldUploaderOpen] = useState(false);

  function categorizeFields(fieldsResponse) {   
    return fieldsResponse;
  }

  const formattedDate = (isoDateStr) => {
    const date = parseISO(isoDateStr);
    return format(date, 'h:mm a');
  }

  function fetchFields() {
    setProcessing(true);
    get(FIELDS_URL)
      .then(data => {
        setFields(categorizeFields(data.results));
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
    setProcessing(false);
  }

  useEffect(() => {
    fetchFields()
  }, [addFieldOpen, fieldUploaderOpen]);

  if (processing) {
    return <CircularProgress variant='indeterminate' />
  }

  return (
    <Grid container>
      <Grid item xs={4}>
        <div style={{ marginLeft: '1rem' }}>
          <Typography variant="h5" color="text.secondary">Fields</Typography>
        </div>
        
      </Grid>
      <Grid item xs={8} textAlign='right' sx={{ marginBottom: '1rem' }}>
        <Button disableElevation color="primary" variant="contained" startIcon={<AddIcon />} onClick={() => setAddFieldOpen(true)} sx={{ marginRight: '1rem', border: '1px solid #333333' }}>
          Add
        </Button>
        <Button disableElevation color="secondary" variant="contained" startIcon={<AttachFileIcon />} onClick={() => setFieldUploaderOpen(true)} sx={{ border: '1px solid #333333' }}>
          Upload
        </Button>
      </Grid>
    <Grid item xs={12}>

    <Divider />
    <Paper elevation={1}>

      {!fields.length && (
        <Typography variant='h6'>No fields to display.</Typography>
      )}

      <List>
        {fields.map((field) => (
          <ListItem key={field.id_hash} button component={Link} to={`/field/${field.id_hash}`} divider>
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6">{field.name}</Typography>
                </Stack>
              }
              secondary={
                <Stack spacing={2}>
                  <Typography variant="body2">Acreage: {field.acreage}</Typography>
                  <Typography variant="body2">Location: {field.location}</Typography>
                  {field.created && (
                    <Typography variant="body2">
                      Created: {formattedDate(field.created)}
                    </Typography>
                  )}
                  {field.last_updated && (
                    <Typography variant="body2">
                      Last updated: {formattedDate(field.last_updated)}
                    </Typography>
                  )}
                </Stack>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
    </Grid>

    <Dialog
      fullWidth={true}
      maxWidth='lg'
      open={addFieldOpen}
    >
      <DialogTitle>Add Field</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setAddFieldOpen(false)}
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
        <AddField
          setAddFieldOpen={setAddFieldOpen}
        />
      </DialogContent>
    </Dialog>

    <Dialog
      fullWidth={true}
      maxWidth='lg'
      open={fieldUploaderOpen}
    >
      <DialogTitle>Bulk Field Upload</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setFieldUploaderOpen(false)}
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
        <FieldUploader
          setFieldUploaderOpen={setFieldUploaderOpen}
        />
      </DialogContent>
    </Dialog>
  </Grid>
);
}
