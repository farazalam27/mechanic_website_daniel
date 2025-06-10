import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ServiceCard.css';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageUrl?: string;
  linkTo?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  icon, 
  imageUrl, 
  linkTo = '/schedule' 
}) => {
  return (
    <Card className="service-card sporty-card mb-4">
      {imageUrl && (
        <div className="service-image-container">
          <Card.Img variant="top" src={imageUrl} alt={title} className="service-image" />
        </div>
      )}
      <Card.Body>
        <div className="service-icon">{icon}</div>
        <Card.Title className="service-title">{title}</Card.Title>
        <Card.Text className="service-description">
          {description}
        </Card.Text>
        <Link to={linkTo}>
          <Button variant="primary" className="service-button">
            Schedule Service
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ServiceCard;