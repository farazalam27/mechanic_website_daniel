import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaTools, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'admin' | null>(null);

  const checkAuthState = () => {
    const customerToken = localStorage.getItem('customerToken');
    const adminToken = localStorage.getItem('adminToken');

    if (customerToken) {
      setIsLoggedIn(true);
      setUserType('customer');
    } else if (adminToken) {
      setIsLoggedIn(true);
      setUserType('admin');
    } else {
      setIsLoggedIn(false);
      setUserType(null);
    }
  };

  useEffect(() => {
    checkAuthState();

    // Listen for storage changes to update header when login state changes
    const handleStorageChange = () => {
      checkAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab storage changes
    window.addEventListener('authStateChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerPhone');
    localStorage.removeItem('adminToken');
    
    // Update state
    setIsLoggedIn(false);
    setUserType(null);
    
    // Dispatch event to update other components
    window.dispatchEvent(new Event('authStateChange'));
    
    // Redirect to home
    navigate('/');
  };

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
              {!isLoggedIn ? (
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
              ) : (
                <>
                  {userType === 'customer' && (
                    <Nav.Link as={NavLink} to="/dashboard">My Vehicles</Nav.Link>
                  )}
                  {userType === 'admin' && (
                    <Nav.Link as={NavLink} to="/admin">Admin Panel</Nav.Link>
                  )}
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={handleLogout}
                    className="ms-2"
                  >
                    <FaSignOutAlt className="me-1" />
                    Logout
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;