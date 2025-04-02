import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import api from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError('E-mail inválido.');
      return;
    }

    try {
      const { data } = await api.post('/login', { email: email.trim(), password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      setError('Credenciais inválidas');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" gap={2} mt={5}>
        <Typography variant="h5">Login</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Entrar
        </Button>
        <Typography variant="body2">
          Não possui acesso? <a href="/signup">Crie uma conta</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;