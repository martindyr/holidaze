// src/pages/MyVenues.js

import React, { useEffect, useState } from 'react';
import {  deleteVenue, createVenue, updateVenue } from '../services/venues';
import { getUserVenues } from '../services/profiles';
import { Card, Container, Row, Col, Button, Modal, Alert, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import VenueForm from '../components/common/VenueForm'; 

const MyVenues = () => {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentVenue, setCurrentVenue] = useState(null); // For editing
  const [venueData, setVenueData] = useState({}); // For create/edit form
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user's venues with bookings
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await getUserVenues({ _bookings: true });
        console.log('Venues response:', response);
        if (Array.isArray(response)) {
          setVenues(response);
        } else if (response.data && Array.isArray(response.data)) {
          setVenues(response.data);
        } else {
          setError('Invalid response format.');
        }
      } catch (err) {
        setError(`Error fetching venues: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

// Handle Delete Venue
const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        await deleteVenue(id);
        // Remove the deleted venue from the state
        setVenues(venues.filter((venue) => venue.id !== id));
      } catch (err) {
        alert('Error deleting venue.');
        console.error('Delete error:', err);
      }
    }
  };

  // Open Create Venue Modal
  const handleShowCreateModal = () => {
    setVenueData({
      name: '',
      description: '',
      media: [],
      price: 0,
      maxGuests: 1,
      meta: {
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false,
      },
    });
    setShowCreateModal(true);
  };

  // Open Edit Venue Modal
  const handleShowEditModal = (venue) => {
    setCurrentVenue(venue);
    setVenueData(venue);
    setShowEditModal(true);
  };

  // Handle Create/Edit Form Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (['wifi', 'parking', 'breakfast', 'pets'].includes(name)) {
      setVenueData({
        ...venueData,
        meta: {
          ...venueData.meta,
          [name]: checked,
        },
      });
    } else if (name === 'media') {
      setVenueData({
        ...venueData,
        media: value.split(',').map((url) => url.trim()),
      });
    } else {
      setVenueData({
        ...venueData,
        [name]: type === 'number' ? parseInt(value) : value,
      });
    }
  };

  // Handle Create Venue Submission
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVenue(venueData);
      setShowCreateModal(false);
      // Refresh venues list
      const response = await getUserVenues({ _bookings: true });
      setVenues(response.data || response);
    } catch (err) {
      setError(err.message || 'Error creating venue.');
    }
  };

  // Handle Edit Venue Submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVenue(currentVenue.id, venueData);
      setShowEditModal(false);
      // Refresh venues list
      const response = await getUserVenues({ _bookings: true });
      setVenues(response.data || response);
    } catch (err) {
      setError(err.message || 'Error updating venue.');
    }
  };

  if (loading) {
    return <div>Loading venues...</div>;
  }

  return (
    <Container className="my-5">
      <h2>My Venues</h2>
      <Button variant="primary" onClick={handleShowCreateModal} className="mb-4">
        Create Venue
      </Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {venues.length === 0 ? (
        <p>You have no venues yet.</p>
      ) : (
        <Row>
          {venues.map((venue) => (
            <Col key={venue.id} md={6} lg={4} className="mb-4">
              <Card>
                {venue.media && venue.media.length > 0 ? (
                  <Card.Img variant="top" src={venue.media[0]} alt={venue.name} />
                ) : (
                  <Card.Img variant="top" src="https://via.placeholder.com/150" alt="No image available" />
                )}
                <Card.Body>
                  <Card.Title>{venue.name}</Card.Title>
                  <Card.Text>{venue.description}</Card.Text>
                  <Card.Text>
                    <strong>Price:</strong> ${venue.price}<br />
                    <strong>Max Guests:</strong> {venue.maxGuests}
                  </Card.Text>
                  <Card.Text>
                    <strong>Amenities:</strong><br />
                    {venue.meta.wifi && 'WiFi, '}
                    {venue.meta.parking && 'Parking, '}
                    {venue.meta.breakfast && 'Breakfast, '}
                    {venue.meta.pets ? 'Pets allowed' : 'No pets allowed'}
                  </Card.Text>
                  <Button variant="primary" onClick={() => handleShowEditModal(venue)} className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(venue.id)}>
                    Delete
                  </Button>
                  {/* Bookings Accordion */}
                  {venue.bookings && venue.bookings.length > 0 && (
                    <Accordion className="mt-3">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>View Bookings ({venue.bookings.length})</Accordion.Header>
                        <Accordion.Body>
                          {venue.bookings.map((booking) => (
                            <div key={booking.id} className="border p-2 mb-2">
                              <p>
                                <strong>Booking ID:</strong> {booking.id}
                              </p>
                              <p>
                                <strong>Check-in:</strong> {new Date(booking.dateFrom).toLocaleDateString()}
                              </p>
                              <p>
                                <strong>Check-out:</strong> {new Date(booking.dateTo).toLocaleDateString()}
                              </p>
                              <p>
                                <strong>Guests:</strong> {booking.guests}
                              </p>
                            </div>
                          ))}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Venue Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Venue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VenueForm
            venueData={venueData}
            handleChange={handleChange}
            handleSubmit={handleCreateSubmit}
            buttonText="Create Venue"
          />
        </Modal.Body>
      </Modal>

      {/* Edit Venue Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Venue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VenueForm
            venueData={venueData}
            handleChange={handleChange}
            handleSubmit={handleEditSubmit}
            buttonText="Update Venue"
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MyVenues;
