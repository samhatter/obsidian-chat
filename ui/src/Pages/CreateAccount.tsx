import React, { useContext, useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Link } from '@mui/material';
import MessagingAPI from '../Shared/api/MessagingApi';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../Shared/utils/AuthContext'

const CreateAccount: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const messagingAPI = new MessagingAPI("/api");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  
  const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const response = await messagingAPI.createAccount(name, password);
      navigate('/')
    }
    catch (error) {
      alert("Could not create account. Try a unique username.")
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: '#4A4455',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      <Box sx={{ position: 'center', width: '300px', height: 'auto' }}>
                <img src='obsidianorder.svg' style={{width: '100%'}} />
      </Box>
      <Container component="main" maxWidth="xs" sx={{position: 'absolute', bottom: 10, right: 0}}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#eef',
            borderRadius: '10px',
            padding: 1,
          }}
        >
          <Typography component="h1" variant="h5" color='#0B0C10'>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#4A4455',
                            },
                            '&:hover fieldset': {
                                borderColor: '#4A4455',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#4A4455',
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#4A4455',
                        },
                    '& .MuiInputBase-input': {
                            color: '#4A4455',
                    },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px #eef inset', 
                  WebkitTextFillColor: '#0B0C10', 
                },
              }}
            />
            <TextField
              required
              fullWidth
              margin='normal'
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#4A4455',
                            },
                            '&:hover fieldset': {
                                borderColor: '#4A4455',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#4A4455',
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#4A4455',
                        },
                    '& .MuiInputBase-input': {
                            color: '#4A4455',
                    },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px #eef inset', 
                  WebkitTextFillColor: '#0B0C10', 
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#4A4455', color: '#eef'}}
            >
              Create Account
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CreateAccount;

