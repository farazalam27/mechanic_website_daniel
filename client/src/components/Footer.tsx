import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPhone, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const phoneNumber = "(555) 123-4567";
  
  return (
    <footer className="site-footer">
      <div className="footer-main py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
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
              <div className="social-links mt-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaFacebook />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaInstagram />
                </a>
              </div>
              <div className="copyright-section mt-4">
                <p className="mb-0">
                  &copy; {currentYear} Daniel's Mechanic Shop. All rights reserved.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;