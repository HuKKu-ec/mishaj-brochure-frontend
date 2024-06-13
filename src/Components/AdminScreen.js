import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AddItems from './AddItems';
import AddCatogory from './AddCatogory';
import ItemsField from './ItemsField';
import { AdminContext } from '../Context/AdminContextProvider';

const AdminScreen = () => {
  const { admin } = useContext(AdminContext);

  return (
    <div className="admin-container">
      {admin ? (
        <Container>
          <Row>
            <Col lg="4">
              <AddItems />
              <AddCatogory />
            </Col>
            <Col className="mt-5" lg="8">
              <ItemsField />
            </Col>
          </Row>
        </Container>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default AdminScreen;
