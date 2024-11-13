import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './CustomCard.css'; 

const CustomCard = ({ imageSrc, imageAlt, title, bodyContent, buttons }) => {
  return (
    <Card className="custom-card h-100 d-flex flex-column">
      {imageSrc && (
        <div className="custom-card-image">
          <Card.Img variant="top" src={imageSrc} alt={imageAlt || title} />
        </div>
      )}
      <Card.Body className="custom-card-body-content flex-grow-1">
        <Card.Title className="custom-card-title">{title}</Card.Title>
        <div className="custom-card-body-content">{bodyContent}</div>
        <div className="mt-auto button-row">
          {buttons &&
            buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || 'primary'}
                onClick={button.onClick}
                href={button.href}
                className={button.className}
              >
                {button.text}
              </Button>
            ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CustomCard;
