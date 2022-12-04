import React, { useContext, useState } from 'react';
import {
  FloatingLabel,
  Form,
  Card,
  Button,
  Container,
  Alert,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../Context/AdminContextProvider';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { dispatch } = useContext(AdminContext);
  const navigate = useNavigate();
  const LoginAdmin = async () => {
    const data = { email, password };
    const response = await fetch('/api/admin', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    if (response.ok) {
      console.log(json);
      dispatch({ type: 'ADMINLOGIN', payload: json });
      localStorage.setItem('admin', JSON.stringify(json));
      navigate('/admin');
    } else {
      setError(json.error);
    }
  };
  return (
    <div className="adminlogin-container m-5">
      <h1 style={{ textAlign: 'center' }}>Admin Login</h1>
      <Container>
        <Card className="p-3 pt-5 pb-1">
          <FloatingLabel label="Email" className="mb-3">
            <Form.Control
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FloatingLabel>
          <FloatingLabel label="Password" className="mb-3">
            <Form.Control
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </FloatingLabel>
          <div className="login-button">
            <Button variant="primary mt-3 mb-3" onClick={LoginAdmin}>
              Login
            </Button>
          </div>
          {error ? <Alert variant={'danger'}>{error}</Alert> : <div></div>}
        </Card>
      </Container>
    </div>
  );
};

export default AdminLogin;
