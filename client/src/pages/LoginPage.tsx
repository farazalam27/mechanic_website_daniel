import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaPhone } from 'react-icons/fa';
import { authAPI } from '../services/api';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'customer' | 'admin'>('customer');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (loginType === 'admin') {
        // Admin login with username and password
        const response = await authAPI.adminLogin(identifier, password);
        if (response.token) {
          localStorage.setItem('adminToken', response.token);
          window.dispatchEvent(new Event('authStateChange'));
          navigate('/admin');
        }
      } else {
        // Customer login with phone number and password
        // Remove formatting from phone number before sending
        const cleanPhoneNumber = identifier.replace(/[^\d]/g, '');
        const response = await authAPI.customerLogin(cleanPhoneNumber, password);
        if (response.success) {
          localStorage.setItem('customerToken', response.token);
          localStorage.setItem('customerPhone', cleanPhoneNumber);
          window.dispatchEvent(new Event('authStateChange'));
          navigate('/dashboard');
        } else {
          throw new Error('Authentication failed');
        }
      }
    } catch (err: any) {
      if (loginType === 'admin') {
        setError('Invalid username or password');
      } else {
        setError('Invalid phone number or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (loginType === 'customer') {
      setIdentifier(formatPhoneNumber(value));
    } else {
      setIdentifier(value);
    }
  };

  return (
    <div className="login-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <Card className="login-card">
              <Card.Body>
              <div className="text-center mb-4">
                <div className="login-icon">
                  {loginType === 'customer' ? <FaPhone /> : <FaUser />}
                </div>
                <h2 className="login-title">
                  {loginType === 'customer' ? 'Customer Login' : 'Admin Login'}
                </h2>
                <p className="login-subtitle">
                  {loginType === 'customer' 
                    ? 'Enter your phone number and password to access your account'
                    : 'Enter your username and password to access the dashboard'
                  }
                </p>
              </div>
              
              <div className="login-type-selector mb-4">
                <Button
                  variant={loginType === 'customer' ? 'primary' : 'outline-primary'}
                  className="w-50"
                  onClick={() => {
                    setLoginType('customer');
                    setIdentifier('');
                    setPassword('');
                    setError(null);
                  }}
                >
                  Customer
                </Button>
                <Button
                  variant={loginType === 'admin' ? 'primary' : 'outline-primary'}
                  className="w-50"
                  onClick={() => {
                    setLoginType('admin');
                    setIdentifier('');
                    setPassword('');
                    setError(null);
                  }}
                >
                  Admin
                </Button>
              </div>

              {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {loginType === 'customer' ? (
                      <><FaPhone /> Phone Number</>
                    ) : (
                      <><FaUser /> Username</>
                    )}
                  </Form.Label>
                  <Form.Control
                    type={loginType === 'customer' ? 'tel' : 'text'}
                    placeholder={loginType === 'customer' ? '(555) 123-4567' : 'Enter username'}
                    value={identifier}
                    onChange={handleIdentifierChange}
                    required
                    autoFocus
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label><FaLock /> Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading || !identifier || !password}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              </Form>

              {loginType === 'customer' && (
                <div className="text-center mt-3">
                  <div className="mb-2">
                    <Link to="/forgot-password" className="text-decoration-none">
                      Forgot your password?
                    </Link>
                  </div>
                  <small className="text-muted">
                    New customer? Schedule an appointment to create an account.
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;