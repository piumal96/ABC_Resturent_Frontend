import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const roles = ['Admin', 'Editor', 'Viewer'];

const userRolesData = {
  1: { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  2: { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
  3: { name: 'Alice Johnson', email: 'alice@example.com', role: 'Viewer' },
};

const UserRoleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Convert id to a number and safely access the userRolesData object
  const numericId = Number(id);
  const user = userRolesData[numericId as keyof typeof userRolesData];

  const [role, setRole] = useState(user?.role || '');

  const handleSave = () => {
    console.log(`Updated role for ${user?.name} to ${role}`);
    // Add logic to save the role to the backend here
    navigate('/users');
  };

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          User not found.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/users')}>
          Back to User List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" gutterBottom>
          Edit Role for {user.name}
        </Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Role"
          >
            {roles.map((roleOption) => (
              <MenuItem key={roleOption} value={roleOption}>
                {roleOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" onClick={() => navigate('/users')}>
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserRoleForm;
