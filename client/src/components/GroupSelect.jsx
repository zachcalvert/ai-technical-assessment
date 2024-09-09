
import { Typography, Box, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';


export default function GroupSelect({ availableGroups, selectedGroup, setSelectedGroup }) {
  return (
    <Box sx={{ padding: '2rem' }}>
      {availableGroups.length === 0 ? (
        <Paper elevation={1} sx={{ padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No groups available.
          </Typography>
        </Paper>
      ) : (
        <FormControl fullWidth>
          <InputLabel id="select-group-label">Select Group</InputLabel>
          <Select
            labelId="select-group-label"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            disabled={availableGroups.length === 0}
          >
            {availableGroups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}