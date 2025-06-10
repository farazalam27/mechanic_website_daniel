import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaTools } from 'react-icons/fa';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} className="text-center">
            <div className="not-found-content">
              <div className="error-code">404</div>
              <h1 className="error-title">Page Not Found</h1>
              <p className="error-message">
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable.
              </p>
              <div className="error-actions">
                <Link to="/">
                  <Button variant="primary" className="me-3">
                    <FaHome className="me-2" /> Go to Homepage
                  </Button>
                </Link>
                <Link to="/schedule">
                  <Button variant="outline-primary">
                    <FaTools className="me-2" /> Schedule Service
                  </Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFoundPage;