// src/components/VenueForm.js

import React from 'react';
import { Form, Button } from 'react-bootstrap';

const VenueForm = ({ venueData, handleChange, handleSubmit, buttonText }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formVenueName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={venueData.name}
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
          value={venueData.description}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formVenueMedia">
        <Form.Label>Media URLs (comma-separated)</Form.Label>
        <Form.Control
          type="text"
          name="media"
          value={venueData.media.join(', ')}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formVenuePrice">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={venueData.price}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formVenueMaxGuests">
        <Form.Label>Max Guests</Form.Label>
        <Form.Control
          type="number"
          name="maxGuests"
          value={venueData.maxGuests}
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
          checked={venueData.meta.wifi}
          onChange={handleChange}
        />
        <Form.Check
          type="checkbox"
          label="Parking"
          name="parking"
          checked={venueData.meta.parking}
          onChange={handleChange}
        />
        <Form.Check
          type="checkbox"
          label="Breakfast"
          name="breakfast"
          checked={venueData.meta.breakfast}
          onChange={handleChange}
        />
        <Form.Check
          type="checkbox"
          label="Pets Allowed"
          name="pets"
          checked={venueData.meta.pets}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3">
        {buttonText}
      </Button>
    </Form>
  );
};

export default VenueForm;
