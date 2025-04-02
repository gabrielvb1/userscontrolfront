import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import api from '../services/api';

const UserModal = ({ open, handleClose, user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setType(user.type);
    } else {
      setName('');
      setEmail('');
      setType('');
    }
  }, [user]);

  const validateName = (name) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name.trim());
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSave = async () => {
    if (!validateName(name)) {
      setError('Nome inválido. Use apenas letras e espaços.');
      return;
    }
    if (!validateEmail(email)) {
      setError('E-mail inválido.');
      return;
    }
    if (!type) {
      setError('Selecione um tipo de usuário.');
      return;
    }

    const formattedUser = { name: name.trim(), email: email.trim(), type };
    const token = localStorage.getItem('token');

    try {
      if (user) {
        await api.put(`/users/${user.id}`, formattedUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/users', formattedUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{user ? 'Editar Usuário' : 'Criar Usuário'}</DialogTitle>
      <DialogContent>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          select
          label="Tipo"
          fullWidth
          margin="normal"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="admin">Administrador</MenuItem>
          <MenuItem value="user">Usuário</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;