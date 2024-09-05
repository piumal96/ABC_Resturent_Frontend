import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Snackbar,
  Modal,
  TextField,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchUsers, updateUser, deleteUser, registerUserAdmin } from '@/services/api'; // Import API functions
import UserModel from '@/models/UserModel';
import Layout from '@/components/Layout/Layout';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const initialRoles = ['Admin', 'Staff', 'Customer']; // Initial roles

const UserManagementDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles] = useState<string[]>(initialRoles); // State for roles
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: roles[0] }); // New user form data
  const [showUserModal, setShowUserModal] = useState<boolean>(false); // Modal for user creation
  const [notification, setNotification] = useState<string | null>(null); // Snackbar notification
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch users from the API when the component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers: UserModel[] = await fetchUsers();

        // Map UserModel to User interface
        const usersData: User[] = fetchedUsers.map((userModel) => ({
          id: userModel.id,
          name: userModel.username, // Assuming `username` is equivalent to `name`
          email: userModel.email,
          role: userModel.role,
        }));

        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        setError('Failed to load users.');
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Handle inline role change
  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const updatedUserModel = await updateUser(id, { role: newRole }); // Use updateUser to change the role

      // Update the user list in state with the updated user data
      const updatedUser: User = {
        id: updatedUserModel.id,
        name: updatedUserModel.username,
        email: updatedUserModel.email,
        role: updatedUserModel.role,
      };

      setUsers(users.map((user) => (user.id === id ? updatedUser : user)));
      setNotification(`Role updated for ${updatedUser.name}`);
    } catch (error) {
      setNotification('Failed to update role');
    }
  };

  // Handle creating a new user
  const handleCreateUser = async () => {
    try {
      const createdUser = await registerUserAdmin({
        username: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      });

      // Add the new user to the list of users
      setUsers([...users, {
        id: createdUser.id,
        name: createdUser.username,
        email: createdUser.email,
        role: createdUser.role,
      }]);

      setNotification(`New user "${createdUser.username}" created.`);
      setNewUser({ name: '', email: '', password: '', role: roles[0] }); // Reset the form
      setShowUserModal(false);
    } catch (error) {
      setNotification('Failed to create user');
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (id: string) => {
    if (!id) {
      setNotification('User ID is missing.');
      return;
    }

    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id)); // Remove deleted user from the list
      setNotification('User deleted successfully.');
    } catch (error) {
      setNotification('Failed to delete user');
    }
  };

  return (
    <Layout>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management Dashboard
      </Typography>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {/* User Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as string)}
                      >
                        {roles.map((roleOption) => (
                          <MenuItem key={roleOption} value={roleOption}>
                            {roleOption}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDeleteUser(user.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Create User Button */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setShowUserModal(true)}
            >
              Create User
            </Button>
          </Box>
        </>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        message={notification}
      />

      {/* Create User Modal */}
      <Modal open={showUserModal} onClose={() => setShowUserModal(false)}>
        <Box sx={{ p: 3, bgcolor: 'white', m: 'auto', mt: '10%', maxWidth: 400 }}>
          <Typography variant="h6" gutterBottom>Create a New User</Typography>
          
          {/* User Name */}
          <TextField
            label="Name"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            sx={{ mb: 2 }}
          />

          {/* User Email */}
          <TextField
            label="Email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            sx={{ mb: 2 }}
          />

          {/* User Password */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            sx={{ mb: 2 }}
          />

          {/* User Role */}
          <Select
            fullWidth
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as string })}
            sx={{ mb: 3 }}
          >
            {roles.map((roleOption) => (
              <MenuItem key={roleOption} value={roleOption}>
                {roleOption}
              </MenuItem>
            ))}
          </Select>

          {/* Create User Button */}
          <Button variant="contained" onClick={handleCreateUser} fullWidth>
            Create User
          </Button>
        </Box>
      </Modal>
    </Box>
    </Layout>
  );
};

export default UserManagementDashboard;
