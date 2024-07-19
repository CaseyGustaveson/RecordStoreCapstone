import React, { useState } from "react";
import { Alert, Button, TextField, Snackbar } from "@mui/material";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");

    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success"); 
    const [openAlert, setOpenAlert] = useState(false);

    const handleRegister = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, email, firstName, lastName, phoneNumber, address }),
            });

            const data = await response.json();

            if (response.ok) {
                setUsername("");
                setPassword("");
                setEmail("");
                setFirstName("");
                setLastName("");
                setPhoneNumber("");
                setAddress("");
                
                setAlertMessage("Registration successful!");
                setAlertSeverity("success");
            } else {
                setAlertMessage(data.error || "Registration failed. Please try again.");
                setAlertSeverity("error");
            }
        } catch (error) {
            console.error("Error registering:", error);
            setAlertMessage("Registration failed. Please try again.");
            setAlertSeverity("error");
        }
        setOpenAlert(true);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <div>
            <h1>Register Page</h1>
            <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Phone Number"
                variant="outlined"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Address"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button onClick={handleRegister} variant="contained" color="primary">
                Register
            </Button>
            <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                action={
                    <Button color="inherit" onClick={handleCloseAlert}>
                        Close
                    </Button>
                }
            >
                <Alert onClose={handleCloseAlert} severity={alertSeverity}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default RegisterPage;
