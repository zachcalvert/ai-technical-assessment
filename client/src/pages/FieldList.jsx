import React, { useEffect, useState } from 'react';

import { parseISO, format } from 'date-fns';
import Typography from '@mui/material/Typography';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { CircularProgress, Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { Dialog, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckIcon from '@mui/icons-material/Check';
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

  const renderStatus = (field) => {
    console.log(field.status)
    if (field.status === "CERTIFIED") {
      return <Chip sx={{ marginTop: 'auto!important', marginBottom: 'auto!important' }} size="small" color='success' icon={<CheckIcon />} label="Certified" />
    } else if (field.status === "COMPLETE") {
      return <Chip sx={{ marginTop: 'auto!important', marginBottom: 'auto!important' }} size="small" color="error" icon={<CheckIcon />} label="Not certified" />
    } else {
      return <Chip sx={{ marginTop: 'auto!important', marginBottom: 'auto!important' }} size="small" icon={<PendingActionsIcon />} label="Pending" />
    }
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
      <Grid item xs={12} textAlign='right' sx={{ marginBottom: '1rem' }}>
          <Button color="success" variant="contained" startIcon={<AddIcon />} onClick={() => setAddFieldOpen(true)} sx={{ marginRight: '1rem' }}>
            Add
          </Button>

          <Button color="info" variant="contained" startIcon={<AttachFileIcon />} onClick={() => setFieldUploaderOpen(true)}>
            Upload
          </Button>
      </Grid>
    <Grid item xs={12}>

    <Paper elevation={1} style={{ padding: '1rem' }}>

      {!fields.length && (
        <Typography variant='h6'>No fields to display.</Typography>
      )}

      <List>
        {fields.map((field) => (
          <ListItem key={field.id_hash} button component={Link} to={`/fields/${field.id_hash}`} divider>
            <ListItemText
              primary={
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h6">{field.name}</Typography>
                  {renderStatus(field)}
                </Stack>
              }
              secondary={
                <Stack spacing={1}>
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
