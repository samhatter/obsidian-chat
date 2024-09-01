import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Link } from '@mui/material';
import MessagingAPI from '../Shared/api/MessagingApi';
import { useNavigate } from 'react-router-dom';

const CreateAccount: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const messagingAPI = new MessagingAPI("/api");
  const navigate = useNavigate();

  const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const response = await messagingAPI.createAccount(name, password);
      console.log('Account Creation Successful', response);
      navigate('/');
    }
    catch (error) {
      console.error("Account creation failed:", error);
      alert("Account creation failed")
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Create Account
        </Typography>
        <Box component="form" onSubmit={handleCreateAccount} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="email"
            autoComplete="username"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Account
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateAccount;
