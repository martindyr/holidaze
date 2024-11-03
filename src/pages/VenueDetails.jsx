// src/pages/VenueDetails.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getVenueById } from '../services/venues';
import { createBooking } from '../services/bookings';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button, Carousel, Card, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './VenueDetails.css'

import BookingModal from '../components/spesific/BookingModal'; // Import the BookingModal

const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookedDates, setBookedDates] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal

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

  // Function to apply styling to booked dates from today onwards
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const todayStr = new Date().toISOString().split('T')[0];

      if (bookedDates.includes(dateStr) && dateStr >= todayStr) {
        return 'booked-date';
      }
    }
    return null;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

    // Check if the user is authenticated
    const isAuthenticated = !!localStorage.getItem('accessToken');

  return (
    <div className="container my-5">
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
            <Col md={4} style={{marginTop: 54}}>
              <Card className="text-center mb-4">
                <Card.Body>
                  <Card.Title>Booking Info</Card.Title>
                  <Card.Text>
                    <strong>Price:</strong> ${venue.price} per night
                  </Card.Text>
                  <Card.Text>
                    <strong>Capacity:</strong> {venue.maxGuests} people
                  </Card.Text>
                  {isAuthenticated && (
            <Button variant="primary" onClick={() => setShowModal(true)} className="mt-3">
              Book Now
            </Button>
          )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="details-section mb-4">
            <h3 className="mt-4">Venue Details</h3>
            <p>
              {venue.description || 'No description available.'}
            </p>
            <p>
              <strong>Location:</strong> {venue.location?.address || 'No location provided'}
            </p>
            <p>
              <strong>Amenities:</strong>{' '}
              {venue.meta.wifi && 'WiFi, '}
              {venue.meta.parking && 'Parking, '}
              {venue.meta.breakfast && 'Breakfast, '}
              {venue.meta.pets ? 'Pets allowed' : 'No pets'}
            </p>
          </div>
{/*           <h3 className="mt-4">Availability</h3>
          <Calendar
            tileClassName={tileClassName}
            minDetail="month"
            next2Label={null}
            prev2Label={null}
          /> */}

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
