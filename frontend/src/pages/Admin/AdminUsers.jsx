import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  TextField,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3001/api/users";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phoneNumber: "",
    address: "",
    role: "ADMIN"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const checkAuth = () => {
      if (!token) {
        navigate("/login");
      } else if (role !== "ADMIN") {
        navigate("/");
      } else {
        fetchUsers();
      }
    };
    checkAuth();
  }, [navigate, token, role]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        throw new Error("Unexpected response format");
      }
      setIsLoading(false);
    } catch (error) {
      setError("Failed to fetch users");
      setIsLoading(false);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post(
        API_URL,
        { ...newUser, role: newUser.role.toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers([...users, response.data]);
      setNewUser({ name: "", email: "", password: "", role: "" });
      setSuccess("User added successfully");
    } catch (error) {
      setError("Failed to add user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
      setSuccess("User deleted successfully");
    } catch (error) {
      setError("Failed to delete user");
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <TextField
          label="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <FormControl>
          <Select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={addUser}>
          Add User
        </Button>
      </Stack>
      <Box marginTop={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Box>
      <Box marginTop={2}>
        {users.map((user) => (
          <Box
            key={user.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>{user.name}</Typography>
            <Typography>{user.email}</Typography>
            <Typography>{user.role}</Typography>
            <Button variant="contained" onClick={() => deleteUser(user.id)}>
              Delete
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AdminUsers;
