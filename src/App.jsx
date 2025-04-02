import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import SignUp from './pages/SignUp/SignUp';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#45a2e0',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
    
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: '#fff',
          borderRadius: '60px 60px 0px 0px',
          boxShadow: 3,
          padding: 3,
          minHeight: '97vh',
          minWidth: '100vw',
          marginTop: '20px'
        }}
      >
        <Routes>
        <Route path="/signup" element={<SignUp />} />{' '}
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
