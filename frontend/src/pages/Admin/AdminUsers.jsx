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
  Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AdminUsers = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    role: "USER",
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
      const response = await axios.get(`${API_URL}/api/users`, {
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
    if (!newUser.role) {
      setError("Role is required");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/users`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewUser({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        phone: "",
        address: "",
        role: "USER",
      });
      setSuccess("User added successfully");
      fetchUsers();
    } catch (error) {
      setError("Failed to add user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
      setSuccess("User deleted successfully");
    } catch (error) {
      setError("Failed to delete user");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box padding={2} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Stack spacing={2} width="100%" maxWidth={600}>
        <TextField
          type="email"
          name="email"
          label="Email"
          value={newUser.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
          fullWidth
        />
        <TextField
          type="password"
          name="password"
          label="Password"
          value={newUser.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
          fullWidth
        />
        <TextField
          type="text"
          name="firstname"
          label="First Name"
          value={newUser.firstname}
          onChange={handleInputChange}
          placeholder="First Name"
          required
          fullWidth
        />
        <TextField
          type="text"
          name="lastname"
          label="Last Name"
          value={newUser.lastname}
          onChange={handleInputChange}
          placeholder="Last Name"
          required
          fullWidth
        />
        <TextField
          type="text"
          name="phone"
          label="Phone"
          value={newUser.phone}
          onChange={handleInputChange}
          placeholder="Phone"
          required
          fullWidth
        />
        <TextField
          type="text"
          name="address"
          label="Address"
          value={newUser.address}
          onChange={handleInputChange}
          placeholder="Address"
          required
          fullWidth
        />
        <FormControl fullWidth>
          <Select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            displayEmpty
            required
          >
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={addUser} fullWidth>
          Add User
        </Button>
      </Stack>
      <Box marginTop={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Box>
      <Box marginTop={2} width="100%" maxWidth={600}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography variant="h6">Name</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Email</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6">Role</Typography>
          </Grid>
       
          {users.map((user) => (
            <Grid container spacing={1} key={user.id} alignItems="center">
              <Grid item xs={4}>
                <Typography variant="body1">
                  {user.firstname} {user.lastname}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {user.email}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body1" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {user.role}
                </Typography>
              </Grid>
              <Grid item xs={1} container justifyContent="center">
                <Button variant="contained" color="error" onClick={() => deleteUser(user.id)}>
                  Delete
                </Button>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminUsers;
