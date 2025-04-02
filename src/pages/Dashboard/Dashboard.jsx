import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../../services/api';
import UserModal from '../../components/UserModal';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false)
      console.log(error);
      
    } 
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setOpenUserModal(true);
  };

  const handleOpenEditUser = (user) => {
    setEditingUser(user);
    setOpenUserModal(true);
  };

  const handleCloseUserModal = () => {
    setOpenUserModal(false);
    setEditingUser(null);
    fetchUsers();
  };

  const handleOpenDeleteUser = (user) => {
    setUserToDelete(user);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setUserToDelete(null);
    setOpenDeleteModal(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) {
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/users/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={4}
        mb={2}
      >
        <Typography variant="h4">User Control</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenCreateUser}
          >
            Criar Usuário
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setLogoutOpen(true)}
            style={{ marginLeft: '10px' }}
          >
            Sair
          </Button>
        </Box>
      </Box>


      {loading ? (
        <Typography>Carregando usuários...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditUser(user)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteUser(user)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <UserModal
        open={openUserModal}
        handleClose={handleCloseUserModal}
        user={editingUser}
      />

      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>
          Tem certeza que deseja excluir {userToDelete?.name}?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancelar</Button>
          <Button color="error" onClick={handleDeleteUser}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)}>
        <DialogTitle>Deseja sair?</DialogTitle>
        <DialogContent>
          Ao sair, você precisará fazer login novamente.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutOpen(false)}>Não</Button>
          <Button onClick={handleLogout} color="error">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
