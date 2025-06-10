import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { FaPhone, FaCalendarAlt, FaTools } from 'react-icons/fa';
import './Header.css';

const Header: React.FC = () => {
  // This would typically come from a configuration or environment variable
  const phoneNumber = "555-123-4567";
  
  return (
    <header className="site-header">
      {/* Top bar with phone number */}
      <div className="contact-bar sporty-gradient">
        <Container>
          <div className="d-flex justify-content-between align-items-center py-2">
            <div className="contact-info">
              <FaPhone className="me-2" />
              <span className="phone-number">Call us: <a href={`tel:${phoneNumber}`}>{phoneNumber}</a></span>
            </div>
            <div>
              <Link to="/schedule" className="btn btn-outline-light btn-sm">
                <FaCalendarAlt className="me-1" /> Schedule Service
              </Link>
            </div>
          </div>
        </Container>
      </div>
      
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