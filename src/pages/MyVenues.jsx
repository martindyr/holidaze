import React, { useEffect, useState } from 'react';
import { deleteVenue, createVenue, updateVenue } from '../services/venues';
import { getUserVenues } from '../services/profiles';
import CustomCard from '../components/common/CustomCard';
import Truncate from '../components/common/Truncate';
import { Card, Container, Row, Col, Button, Alert, Accordion, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import VenueModal from '../components/spesific/VenueModal';

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
      location: {
        
        country: '',
        city: '',
        address: '',
      },
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

    // Safely convert media array of objects into a comma-separated string for the input field
    const mediaString = Array.isArray(venue.media)
      ? venue.media.map((mediaItem) => mediaItem.url).join(', ')
      : ''; // If media is undefined or not an array, default to an empty string

    setVenueData({
      ...venue,
      media: mediaString, // Set media as a comma-separated string
    });

    setIsEditing(true);
    setShowModal(true);
  };


  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    console.log('change', e)
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
        media: value.split(',').map((url) => url),
      });
    } else {
      setVenueData({
        ...venueData,
        [name]: type === 'number' ? parseInt(value) : value,
      });
    }
  };

  const handleCreateSubmit = async (formData) => {
    setError(null);
    try {
      await createVenue(formData);
      setShowModal(false);
      const response = await getUserVenues({ _bookings: true });
      setVenues(response.data || response);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      await updateVenue(currentVenue.id, formData);
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
    <Container className="my-3">
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
            <Col key={venue.id} sm={12} md={6} lg={4} className="mb-4">
              <CustomCard
                imageSrc={venue.media.length > 0 ? venue.media[0].url : 'https://via.placeholder.com/150'}
                imageAlt={venue.name}
                title={venue.name}
                bodyContent={
                  <>
                    <Card.Text>{Truncate(venue.description) || 'No description available.'}</Card.Text>
                    <ul className="list-unstyled">
                      <li>
                        <strong>Location:</strong>        {venue.location?.city && venue.location?.country ? (
                          `${venue.location.city}, ${venue.location.country}`
                        ) : venue.location?.city ? (
                          venue.location.city
                        ) : venue.location?.country ? (
                          venue.location.country
                        ) : (
                          "No location provided"
                        )}
                      </li>
                      <li>
                        <strong>Capacity:</strong> {venue.maxGuests} guests
                      </li>
                      <li>
                        <strong>Price:</strong> ${venue.price} per night
                      </li>
                      <li>
                        <strong>Rating:</strong> <span>{venue.rating ? (`${venue.rating} / 5`) : 'No Rating'}</span>
                      </li>
                    </ul>
                    {venue.bookings?.length > 0 && (
                      <Accordion className="my-3">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Bookings ({venue.bookings.length})</Accordion.Header>
                          <Accordion.Body>
                            {venue.bookings.length > 0 ? (
                              <ListGroup>
                                {venue.bookings.map((booking) => (
                                  <ListGroup.Item key={booking.id} className="mb-2">
                                    <h5>
                                      Booking for {booking.guests} guest(s):{' '}
                                      <small>
                                        {new Date(booking.dateFrom).toLocaleDateString()} -{' '}
                                        {new Date(booking.dateTo).toLocaleDateString()}
                                      </small>
                                    </h5>
                                    <div>
                                      <strong>Customer Name:</strong> {booking.customer.name}
                                    </div>
                                    <div>
                                      <strong>Email:</strong> {booking.customer.email}
                                    </div>
                                    <div>
                                      <strong>Bio:</strong> {booking.customer.bio || 'No bio provided'}
                                    </div>
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            ) : (
                              <div>No bookings available for this venue.</div>
                            )}
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    )}
                  </>
                }
                buttons={[
                  {
                    text: 'View Details',
                    variant: 'primary',
                    href: `/venue/${venue.id}`,
                  },
                  {
                    text: 'Edit',
                    variant: 'primary',
                    onClick: () => handleShowEditModal(venue),
                  },
                  {
                    text: 'Delete',
                    variant: 'danger',
                    onClick: () => handleDelete(venue.id),
                  },
                ]}
              />
            </Col>
          ))}
        </Row>
      )}

      <VenueModal
        show={showModal}
        handleClose={handleCloseModal}
        venueData={venueData}
        handleChange={handleChange}
        onSubmit={isEditing ? handleEditSubmit : handleCreateSubmit} // Use onSubmit prop
        buttonText={isEditing ? 'Update Venue' : 'Create Venue'}
        title={isEditing ? 'Edit Venue' : 'Create Venue'}
      />

    </Container>
  );
};

export default MyVenues;
