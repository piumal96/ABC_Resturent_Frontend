// src/components/UserManagementDashboard.tsx
import React from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUserController } from "@/controllers/Admin/UserController";
import Layout from "@/components/Layout/Layout";

const UserManagementDashboard: React.FC = () => {
  const {
    users,
    roles,
    newUser,
    showUserModal,
    notification,
    loading,
    error,
    setNewUser,
    setShowUserModal,
    setNotification,
    handleRoleChange,
    handleCreateUser,
    handleDeleteUser,
  } = useUserController();

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Management Dashboard
        </Typography>

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100px" }}>
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
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
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
          <Box sx={{ p: 3, bgcolor: "white", m: "auto", mt: "10%", maxWidth: 400 }}>
            <Typography variant="h6" gutterBottom>
              Create a New User
            </Typography>

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
