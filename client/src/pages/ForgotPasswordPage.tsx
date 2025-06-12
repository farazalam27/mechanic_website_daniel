import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPhone, FaLock, FaArrowLeft } from 'react-icons/fa';
import { authAPI } from '../services/api';
import './ForgotPasswordPage.css';

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, '');
      const response = await authAPI.forgotPassword(cleanPhoneNumber);
      
      if (response.success) {
        setStep('reset');
        setSuccess(`Reset code sent! For demo: ${response.resetCode}`);
      } else {
        setError(response.message || 'Failed to send reset code');
      }
    } catch (err: any) {
      setError('Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, '');
      const response = await authAPI.resetPassword(cleanPhoneNumber, resetCode, newPassword);
      
      if (response.success) {
        setShowSuccessModal(true);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err: any) {
      setError('Failed to reset password. Please check your reset code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <Card className="forgot-password-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <div className="forgot-password-icon">
                    <FaLock />
                  </div>
                  <h2 className="forgot-password-title">
                    {step === 'request' ? 'Forgot Password' : 'Reset Password'}
                  </h2>
                  <p className="forgot-password-subtitle">
                    {step === 'request' 
                      ? 'Enter your phone number to receive a reset code'
                      : 'Enter the reset code and your new password'
                    }
                  </p>
                </div>

                {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
                {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

                {step === 'request' ? (
                  <Form onSubmit={handleRequestReset}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaPhone /> Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        required
                        autoFocus
                      />
                    </Form.Group>

                    <div className="d-grid mb-3">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={loading || !phoneNumber}
                      >
                        {loading ? 'Sending...' : 'Send Reset Code'}
                      </Button>
                    </div>

                    <div className="text-center">
                      <Link to="/login" className="text-decoration-none">
                        <FaArrowLeft className="me-1" />
                        Back to Login
                      </Link>
                    </div>
                  </Form>
                ) : (
                  <Form onSubmit={handleResetPassword}>
                    <Form.Group className="mb-3">
                      <Form.Label>Reset Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        maxLength={6}
                        required
                        autoFocus
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label><FaLock /> New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={6}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label><FaLock /> Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={6}
                        required
                      />
                    </Form.Group>

                    <div className="d-grid mb-3">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={loading || !resetCode || !newPassword || !confirmPassword}
                      >
                        {loading ? 'Resetting...' : 'Reset Password'}
                      </Button>
                    </div>

                    <div className="text-center">
                      <Button 
                        variant="link" 
                        onClick={() => setStep('request')}
                        className="text-decoration-none p-0"
                      >
                        <FaArrowLeft className="me-1" />
                        Back to Request Code
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Password Reset Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your password has been successfully reset. You can now log in with your new password.</p>
        </Modal.Body>
        <Modal.Footer>
          <Link to="/login">
            <Button variant="primary">
              Go to Login
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ForgotPasswordPage;