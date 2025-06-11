import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { FaTools } from 'react-icons/fa';
import './Header.css';

const Header: React.FC = () => {
  
  return (
    <header className="site-header">
      {/* Main navigation */}
      <Navbar bg="light" expand="lg" className="py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand">
            <FaTools className="me-2" />
            <span className="brand-text">Daniel's Mechanic Shop</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/services">Services</Nav.Link>
              <Nav.Link as={NavLink} to="/schedule">Schedule</Nav.Link>
              <Nav.Link as={NavLink} to="/dashboard">My Vehicles</Nav.Link>
              <Nav.Link as={NavLink} to="/admin">Admin</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;