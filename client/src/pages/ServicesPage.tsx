import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaOilCan, 
  FaTools, 
  FaCar, 
  FaTachometerAlt, 
  FaCogs, 
  FaSnowflake,
  FaCarBattery,
  FaWrench,
  FaClipboardCheck
} from 'react-icons/fa';
import './ServicesPage.css';

interface ServiceItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const ServiceItem: React.FC<ServiceItemProps> = ({ title, description, icon, features }) => {
  return (
    <Card className="service-item mb-4 sporty-card">
      <Card.Body>
        <div className="service-icon-container">
          {icon}
        </div>
        <Card.Title className="service-item-title">{title}</Card.Title>
        <Card.Text className="service-item-description">
          {description}
        </Card.Text>
        <ul className="service-features">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <Link to="/schedule">
          <Button variant="primary" className="w-100">Schedule This Service</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

const ServicesPage: React.FC = () => {
  const services: ServiceItemProps[] = [
    {
      title: "Oil Change",
      description: "Regular oil changes are essential for maintaining your engine's performance and longevity.",
      icon: <FaOilCan />,
      features: [
        "Premium conventional, synthetic blend, and full synthetic options",
        "Oil filter replacement",
        "Fluid level check and top-off",
        "Multi-point inspection"
      ]
    },
    {
      title: "Repairs & Diagnostics",
      description: "Our expert technicians can diagnose and fix any issues with your vehicle.",
      icon: <FaTools />,
      features: [
        "Computer diagnostics",
        "Engine repairs",
        "Transmission service",
        "Brake system repairs",
        "Suspension and steering repairs"
      ]
    },
    {
      title: "Performance Upgrades",
      description: "Take your vehicle to the next level with our performance enhancement services.",
      icon: <FaCar />,
      features: [
        "Engine tuning",
        "Exhaust system upgrades",
        "Suspension modifications",
        "Brake system upgrades",
        "Custom performance packages"
      ]
    },
    {
      title: "Tire Services",
      description: "Ensure your safety and vehicle performance with our comprehensive tire services.",
      icon: <FaTachometerAlt />,
      features: [
        "Tire rotation and balancing",
        "Wheel alignment",
        "Tire pressure monitoring",
        "Flat tire repair",
        "New tire sales and installation"
      ]
    },
    {
      title: "Preventative Maintenance",
      description: "Regular maintenance helps prevent costly repairs and extends your vehicle's life.",
      icon: <FaCogs />,
      features: [
        "Scheduled maintenance packages",
        "Fluid flushes and replacements",
        "Filter replacements",
        "Belt and hose inspections",
        "Battery testing and replacement"
      ]
    },
    {
      title: "Air Conditioning Service",
      description: "Stay comfortable year-round with our A/C and heating system services.",
      icon: <FaSnowflake />,
      features: [
        "A/C system inspection",
        "Refrigerant recharge",
        "Leak detection and repair",
        "Compressor service",
        "Heating system repair"
      ]
    },
    {
      title: "Electrical System Service",
      description: "We diagnose and repair all electrical issues to keep your vehicle running properly.",
      icon: <FaCarBattery />,
      features: [
        "Battery testing and replacement",
        "Alternator and starter repair",
        "Electrical diagnostics",
        "Lighting system repair",
        "Power accessory troubleshooting"
      ]
    },
    {
      title: "Brake Service",
      description: "Ensure your safety with our comprehensive brake system services.",
      icon: <FaWrench />,
      features: [
        "Brake pad/shoe replacement",
        "Rotor/drum resurfacing or replacement",
        "Brake fluid flush",
        "Caliper/wheel cylinder service",
        "ABS system diagnostics"
      ]
    },
    {
      title: "State Inspections",
      description: "We provide thorough state inspections to ensure your vehicle meets all requirements.",
      icon: <FaClipboardCheck />,
      features: [
        "Comprehensive vehicle inspection",
        "Emissions testing",
        "Safety inspection",
        "Documentation processing",
        "Quick service with minimal wait time"
      ]
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="services-hero-overlay">
          <Container>
            <div className="services-hero-content">
              <h1>Our Services</h1>
              <p>Professional auto repair and maintenance services for all makes and models</p>
            </div>
          </Container>
        </div>
      </section>

      {/* Services Overview */}
      <section className="services-overview py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Comprehensive Auto Services</h2>
            <p className="section-subtitle">
              At Daniel's Mechanic Shop, we offer a wide range of services to keep your vehicle running at its best.
              From routine maintenance to complex repairs, our experienced technicians have you covered.
            </p>
          </div>

          <Row>
            {services.map((service, index) => (
              <Col md={6} lg={4} key={index}>
                <ServiceItem {...service} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="services-cta py-5 sporty-gradient">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8} className="text-center">
              <h2 className="cta-title">Ready to Get Started?</h2>
              <p className="cta-text">
                Schedule an appointment today and experience our professional auto care services.
              </p>
              <Link to="/schedule">
                <Button variant="light" size="lg" className="cta-button">
                  Schedule Now
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ServicesPage;