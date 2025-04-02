import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import api from '../../services/api';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateName = (name) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name.trim());
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async () => {
    if (!validateName(name)) {
      setError('Nome inválido. Use apenas letras e espaços.');
      return;
    }
    if (!validateEmail(email)) {
      setError('E-mail inválido.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    try {
      await api.post('/signup', { name: name.trim(), email: email.trim(), password });
      navigate('/login');
    } catch (error) {
      console.log(error);
      setError('Erro ao criar conta');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" gap={2} mt={5}>
        <Typography variant="h5">Criar Conta</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Nome"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
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
        <TextField
          label="Confirmar Senha"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Cadastrar
        </Button>
        <Typography variant="body2">
          Já tem uma conta? <a href="/login">Faça login</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignUp;
