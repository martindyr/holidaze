// src/pages/VenueDetails.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getVenueById } from '../services/venues';
import { createBooking } from '../services/bookings';
import 'react-calendar/dist/Calendar.css';
import { Button, Carousel, Card, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './VenueDetails.css'
import { FaWifi, FaParking, FaUtensils, FaPaw } from 'react-icons/fa';

import BookingModal from '../components/spesific/BookingModal';

const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookedDates, setBookedDates] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchVenue();
  }, [id]);

  const fetchVenue = async () => {
    try {
      setLoading(true);
      const data = await getVenueById(id);
      const venueData = data.data;
      setVenue(venueData);

      if (venueData && venueData.bookings) {
        const datesSet = new Set();

        venueData.bookings.forEach((booking) => {
          let currentDate = new Date(booking.dateFrom);
          const endDate = new Date(booking.dateTo);

          while (currentDate <= endDate) {
            datesSet.add(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });

        setBookedDates(Array.from(datesSet));
      }
    } catch (err) {
      setError('Could not load venue details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem('accessToken');

  return (
    <div className="container my-3">
      {venue && (
        <>
          <Row className="mb-4">
            <Col md={8}>
              <h2 className="mb-3">{venue.name}</h2>
              {venue.media && venue.media.length > 0 ? (
                <Carousel>
                  {venue.media.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        src={image.url}
                        alt={venue.name}
                        className="d-block w-100 img-fluid rounded"
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <div>No image available</div>
              )}
            </Col>
            <Col md={4} style={{ marginTop: 54 }}>
              <Card className=" amenities-box text-center mb-4">
                <Card.Body>
                <h3>Booking Info</h3>
                  <Card.Text>
                    <strong>Price:</strong> ${venue.price} per night
                  </Card.Text>
                  <Card.Text>
                    <strong>Capacity:</strong> {venue.maxGuests} guests
                  </Card.Text>
                  {isAuthenticated && (
                    <Button variant="primary" onClick={() => setShowModal(true)} className="mt-3">
                      Book Now
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row >
          <div className="details-section mb-4">
            <h3 className="mt-4">Details</h3>
            <p>
              {venue.description || 'No description available.'}
            </p>
            <Row>
              <Col md={6}  className="location-box">
                <h3>Location</h3>
                <p>
                  <strong>Country:</strong> {venue.location?.country || 'Not provided'}
                </p>
                <p>
                  <strong>City:</strong> {venue.location?.city || 'Not provided'}
                </p>
                <p>
                  <strong>Address:</strong> {venue.location?.address || 'Not provided'}
                </p>
              </Col>
              <Col md={6} className="amenities-box">
                <h3 >Amenities</h3>
                  <p>
                    <FaWifi size={24} color="var(--dark-color)" />
                    <span className="amenity-icon">{venue.meta.wifi ? 'Wifi' : 'No Wifi'}</span>
                  </p>
                  <p>
                    <FaParking size={24} color="var(--dark-color)" />
                    <span className="amenity-icon">{venue.meta.parking ? 'Parking' : 'No Parking'}</span>
                  </p>
                  <p>
                    <FaUtensils size={24} color="var(--dark-color)" />
                    <span className="amenity-icon">{venue.meta.breakfast ? 'Breakfast' : 'No breakfast'}</span>
                  </p>
                  <p>
                    <FaPaw size={24} color="var(--dark-color)" />
                    <span className="amenity-icon">{venue.meta.pets ? 'Pets are allowed' : 'Pets are not allowed'}</span>
                  </p>
              </Col>
            </Row>
          </div>

          <BookingModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            venue={venue}
            bookedDates={bookedDates}
            createBooking={createBooking}
            fetchVenue={fetchVenue}
          />
        </>
      )}
    </div>
  );
};

export default VenueDetails;
