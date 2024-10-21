import React, { useEffect, useState } from 'react';
import { deleteVenue, createVenue, updateVenue } from '../services/venues';
import { getUserVenues } from '../services/profiles';
import { Card, Container, Row, Col, Button, Alert, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import VenueModal from '../components/common/VenueModal';

const MyVenues = () => {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentVenue, setCurrentVenue] = useState(null);
  const [venueData, setVenueData] = useState({});
  const [isEditing, setIsEditing] = useState(false); // Track if it's a create or edit modal
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await getUserVenues({ _bookings: true });
        setVenues(response.data || response);
      } catch (err) {
        setError(`Error fetching venues: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        await deleteVenue(id);
        setVenues(venues.filter((venue) => venue.id !== id));
      } catch (err) {
        alert('Error deleting venue.');
      }
    }
  };

  const handleShowCreateModal = () => {
    setVenueData({
        name: '',
        description: '',
        media: [], // Ensure media is initialized as an empty array
        price: 0,
        maxGuests: 1,
        meta: {
            wifi: false,
            parking: false,
            breakfast: false,
            pets: false,
        },
    });
    setIsEditing(false);
    setShowModal(true);
};

const handleShowEditModal = (venue) => {
    setCurrentVenue(venue);
    setVenueData({
        ...venue,
        media: venue.media || [], // Ensure media is an array or default to empty array
    });
    setIsEditing(true);
    setShowModal(true);
};


  const handleCloseModal = () => setShowModal(false);

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
    } else {
      setVenueData({
        ...venueData,
        [name]: type === 'number' ? parseInt(value) : value,
      });
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVenue(venueData);
      setShowModal(false);
      const response = await getUserVenues({ _bookings: true });
      setVenues(response.data || response);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVenue(currentVenue.id, venueData);
      setShowModal(false);
      const response = await getUserVenues({ _bookings: true });
      setVenues(response.data || response);
    } catch (err) {
      setError(err.message);
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
                <Card.Img
                  variant="top"
                  src={venue.media.length > 0 ? venue.media[0] : 'https://via.placeholder.com/150'}
                  alt={venue.name}
                />
                <Card.Body>
                  <Card.Title>{venue.name}</Card.Title>
                  <Card.Text>{venue.description}</Card.Text>
                  <Card.Text>
                    <strong>Price:</strong> ${venue.price}<br />
                    <strong>Max Guests:</strong> {venue.maxGuests}
                  </Card.Text>
                  <Button variant="primary" onClick={() => handleShowEditModal(venue)} className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(venue.id)}>
                    Delete
                  </Button>
                  {venue.bookings?.length > 0 && (
                    <Accordion className="mt-3">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>View Bookings ({venue.bookings.length})</Accordion.Header>
                        <Accordion.Body>
                          {venue.bookings.map((booking) => (
                            <div key={booking.id} className="border p-2 mb-2">
                              <p><strong>Booking ID:</strong> {booking.id}</p>
                              <p><strong>Check-in:</strong> {new Date(booking.dateFrom).toLocaleDateString()}</p>
                              <p><strong>Check-out:</strong> {new Date(booking.dateTo).toLocaleDateString()}</p>
                              <p><strong>Guests:</strong> {booking.guests}</p>
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

      <VenueModal
        show={showModal}
        handleClose={handleCloseModal}
        venueData={venueData}
        handleChange={handleChange}
        handleSubmit={isEditing ? handleEditSubmit : handleCreateSubmit}
        buttonText={isEditing ? 'Update Venue' : 'Create Venue'}
        title={isEditing ? 'Edit Venue' : 'Create Venue'}
      />
    </Container>
  );
};

export default MyVenues;
