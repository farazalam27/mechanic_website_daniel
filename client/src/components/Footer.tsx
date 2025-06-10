import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPhone, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaYelp } from 'react-icons/fa';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const phoneNumber = "555-123-4567";
  
  return (
    <footer className="site-footer">
      <div className="footer-main py-5">
        <Container>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <h5 className="footer-heading">Daniel's Mechanic Shop</h5>
              <p className="footer-description">
                Professional auto repair and maintenance services with a focus on quality and customer satisfaction.
              </p>
              <div className="social-links mt-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaFacebook />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaInstagram />
                </a>
                <a href="https://yelp.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaYelp />
                </a>
              </div>
            </Col>
            
            <Col md={4} className="mb-4 mb-md-0">
              <h5 className="footer-heading">Contact Information</h5>
              <ul className="footer-contact-list">
                <li>
                  <FaPhone className="contact-icon" />
                  <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
                </li>
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>123 Auto Repair Lane, Mechanicsville, CA 90210</span>
                </li>
                <li>
                  <FaClock className="contact-icon" />
                  <span>Mon-Fri: 8am-6pm | Sat: 9am-4pm | Sun: Closed</span>
                </li>
              </ul>
            </Col>
            
            <Col md={4}>
              <h5 className="footer-heading">Quick Links</h5>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/schedule">Schedule Appointment</Link></li>
                <li><Link to="/dashboard">My Vehicles</Link></li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
      
      <div className="footer-bottom py-3">
        <Container>
          <div className="text-center">
            <p className="mb-0">
              &copy; {currentYear} Daniel's Mechanic Shop. All rights reserved.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;