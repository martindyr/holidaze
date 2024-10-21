import React from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

const VenueForm = ({ 
  show, 
  handleClose, 
  venueData, 
  handleChange, 
  handleSubmit, 
  buttonText, 
  title 
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formVenueName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={venueData.name || ''} // Default to empty string if undefined
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formVenueDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={venueData.description || ''} // Default to empty string if undefined
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formVenueMedia">
            <Form.Label>Media URLs (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              name="media"
              value={Array.isArray(venueData.media) ? venueData.media.join(', ') : ''} // Safely access media
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formVenuePrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={venueData.price || ''} // Default to empty string if undefined
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formVenueMaxGuests">
            <Form.Label>Max Guests</Form.Label>
            <Form.Control
              type="number"
              name="maxGuests"
              value={venueData.maxGuests || ''} // Default to empty string if undefined
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formVenueAmenities">
            <Form.Label>Amenities</Form.Label>
            <Form.Check
              type="checkbox"
              label="WiFi"
              name="wifi"
              checked={venueData.meta?.wifi || false} // Use optional chaining to avoid error
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              label="Parking"
              name="parking"
              checked={venueData.meta?.parking || false} // Use optional chaining to avoid error
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              label="Breakfast"
              name="breakfast"
              checked={venueData.meta?.breakfast || false} // Use optional chaining to avoid error
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              label="Pets Allowed"
              name="pets"
              checked={venueData.meta?.pets || false} // Use optional chaining to avoid error
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            {buttonText}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default VenueForm;
