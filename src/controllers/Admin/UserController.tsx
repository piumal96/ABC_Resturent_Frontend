import { useState, useEffect } from "react";
import { fetchUsers, updateUser, deleteUser, registerUserAdmin } from "@/services/api";
import UserModel from "@/models/UserModel";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const initialRoles = ["Admin", "Staff", "Customer"];

export const useUserController = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles] = useState<string[]>(initialRoles); // State for roles
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: roles[0] }); // New user form data
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
          name: userModel.username,
          email: userModel.email,
          role: userModel.role,
        }));

        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        setError("Failed to load users.");
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Handle inline role change
  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const updatedUserModel = await updateUser(id, { role: newRole });

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
      setNotification("Failed to update role");
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
      setUsers([
        ...users,
        {
          id: createdUser.id,
          name: createdUser.username,
          email: createdUser.email,
          role: createdUser.role,
        },
      ]);

      setNotification(`New user "${createdUser.username}" created.`);
      setNewUser({ name: "", email: "", password: "", role: roles[0] }); // Reset the form
      setShowUserModal(false);
    } catch (error) {
      setNotification("Failed to create user");
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (id: string) => {
    if (!id) {
      setNotification("User ID is missing.");
      return;
    }

    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id)); // Remove deleted user from the list
      setNotification("User deleted successfully.");
    } catch (error) {
      setNotification("Failed to delete user");
    }
  };

  return {
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
  };
};
