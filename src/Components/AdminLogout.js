import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../Context/AdminContextProvider';

const AdminLogout = () => {
  const { dispatch } = useContext(AdminContext);
  const navigate = useNavigate();
  const logoutHandler = () => {
    dispatch({ type: 'ADMINLOGOUT' });
    localStorage.removeItem('admin');
    navigate('/');
  };

  return (
    <Button variant="danger" onClick={logoutHandler}>
      Logout
    </Button>
  );
};

export default AdminLogout;
