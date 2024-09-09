import Container from 'react-bootstrap/Container';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import logo from '../logo.png';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import AdminLogout from './AdminLogout';
import { useContext } from 'react';
import { AdminContext } from '../Context/AdminContextProvider';

const NavbarHead = () => {
  const { admin } = useContext(AdminContext);
  return (
    <div
      className="navbar-container"
      style={{ position: 'sticky', top: 0, width: '100%', zIndex: 1 }}
    >
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/">
            {/* <Image
              fluid
              style={{ height: '45px', margin: '20px' }}
              src={logo}
              placeholder="Mishaj brand Logo is missing"
            /> */}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          {admin ? (
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
              >
                <Link
                  style={{
                    all: 'unset',
                    marginLeft: '10px',
                    cursor: 'pointer',
                  }}
                  to="/"
                >
                  Home
                </Link>

                <Link
                  style={{
                    all: 'unset',
                    marginLeft: '10px',
                    cursor: 'pointer',
                  }}
                  to="/admin"
                >
                  Admin
                </Link>
              </Nav>
              <AdminLogout />
            </Navbar.Collapse>
          ) : (
            <div></div>
          )}
        </Container>
      </Navbar>
    </div>
  );
};
export default NavbarHead;
