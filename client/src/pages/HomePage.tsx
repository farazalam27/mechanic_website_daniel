import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaPhone, FaOilCan, FaTools, FaCar } from 'react-icons/fa';
import './HomePage.css';

const PHONE_NUMBER = "+1 (555) 123-4567"; // Replace with Daniel's actual number

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Expert Auto Repair & Maintenance</h1>
          <p>Professional service you can trust</p>
          <div className="phone-number">
            <FaPhone />
            <a href={`tel:${PHONE_NUMBER}`}>{PHONE_NUMBER}</a>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="services-section">
        <Container>
          <h2 className="section-title">Our Services</h2>
          <Row>
            <Col md={4}>
              <Card className="service-card">
                <div className="card-img-top d-flex align-items-center justify-content-center">
                  <FaOilCan size={48} />
                </div>
                <Card.Body>
                  <Card.Title><FaOilCan /> Oil Change</Card.Title>
                  <Card.Text>
                    Professional oil change service using high-quality oils and filters
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="service-card">
                <div className="card-img-top d-flex align-items-center justify-content-center">
                  <FaTools size={48} />
                </div>
                <Card.Body>
                  <Card.Title><FaTools /> Repairs</Card.Title>
                  <Card.Text>
                    Comprehensive repair services for all makes and models
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="service-card">
                <div className="card-img-top d-flex align-items-center justify-content-center">
                  <FaCar size={48} />
                </div>
                <Card.Body>
                  <Card.Title><FaCar /> Diagnostics</Card.Title>
                  <Card.Text>
                    State-of-the-art diagnostic equipment for accurate problem identification
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Schedule Section */}
      <section className="schedule-section">
        <Container>
          <h2 className="section-title">Schedule Your Service</h2>
          <p className="text-center">
            Call us or use our online scheduling system to book your appointment
          </p>
          <div className="text-center mt-4">
            <Button variant="primary" size="lg" href="/schedule">
              Schedule Now
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;