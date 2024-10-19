// src/pages/VenueDetails.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getVenueById } from '../services/venues';
import { createBooking } from '../services/bookings';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../App.css';

// Import Bootstrap components
import { Modal, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import date-fns functions
import { parseISO, addDays, format, isBefore, isAfter } from 'date-fns';

const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookedDates, setBookedDates] = useState([]);

  // State for booking modal
  const [showModal, setShowModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null); // For date selection
  const [bookingData, setBookingData] = useState({
    guests: 1,
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

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
          let currentDate = parseISO(booking.dateFrom);
          const endDate = parseISO(booking.dateTo);

          // Include the end date without adding an extra day
          while (!isAfter(currentDate, endDate)) {
            const dateStr = format(currentDate, 'yyyy-MM-dd');
            datesSet.add(dateStr);
            currentDate = addDays(currentDate, 1);
          }
        });

        setBookedDates(Array.from(datesSet));
      }
    } catch (err) {
      console.error('Error fetching venue details:', err);
      setError('Could not load venue details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to apply styling to booked dates from today onwards
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = format(date, 'yyyy-MM-dd');
      const todayStr = format(new Date(), 'yyyy-MM-dd');

      if (bookedDates.includes(dateStr) && dateStr >= todayStr) {
        return 'booked-date';
      }
    }
    return null;
  };

  // Function to disable dates before today and booked dates from today onwards
  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = format(date, 'yyyy-MM-dd');
      const todayStr = format(new Date(), 'yyyy-MM-dd');

      if (dateStr < todayStr) {
        return true;
      }

      if (bookedDates.includes(dateStr) && dateStr >= todayStr) {
        return true;
      }
    }
    return false;
  };

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('accessToken');

  // Handle opening and closing modal
  const handleShowModal = () => {
    setSelectedDates(null);
    setBookingData({
      guests: 1,
    });
    setBookingError('');
    setBookingSuccess('');
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  // Handle date selection from calendar
  const handleDateChange = (dates) => {
    if (Array.isArray(dates)) {
      const [start, end] = dates;
      if (!end) {
        // Only one date selected; set both start and end to the same date
        setSelectedDates([start, start]);
      } else {
        setSelectedDates(dates);
      }
    } else {
      // Single date selected
      setSelectedDates([dates, dates]);
    }
  };

  // Check for conflicting dates
  const hasConflictingDates = () => {
    if (!selectedDates || selectedDates.length !== 2) {
      return false;
    }

    const [start, end] = selectedDates;
    const selectedRange = [];

    let currentDate = start;
    while (!isAfter(currentDate, end)) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      selectedRange.push(dateStr);
      currentDate = addDays(currentDate, 1);
    }

    return selectedRange.some((date) => bookedDates.includes(date));
  };

  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDates || selectedDates.length !== 2) {
      setBookingError('Please select at least one date.');
      return;
    }

    if (hasConflictingDates()) {
      setBookingError('Selected dates conflict with existing bookings. Please choose different dates.');
      return;
    }

    const { guests } = bookingData;
    const [dateFrom, dateTo] = selectedDates;

    const bookingStartDate = dateFrom;
    const bookingEndDate = dateTo;

    const bookingPayload = {
      dateFrom: bookingStartDate.toISOString(),
      dateTo: bookingEndDate.toISOString(),
      guests: parseInt(guests),
      venueId: id,
    };

    try {
      const accessToken = localStorage.getItem('accessToken');
      await createBooking(bookingPayload, {}, accessToken);

      setBookingSuccess('Booking successful!');
      await fetchVenue(); // Refresh calendar with new booked dates
      setTimeout(() => setShowModal(false), 2000);
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError(err.errors[0]?.message || 'An error occurred while booking.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container my-5">
      {venue && (
        <>
          <h2 className="mb-3">{venue.name}</h2>
          {venue.media && venue.media.length > 0 ? (
            <img src={venue.media[0].url} alt={venue.name} className="img-fluid mb-4 rounded" />
          ) : (
            <div>No image available</div>
          )}
          <p>
            <strong>Location:</strong> {venue.location?.address || 'N/A'}
          </p>
          <p>
            <strong>Description:</strong> {venue.description}
          </p>
          <p>
            <strong>Price:</strong> ${venue.price}
          </p>
          <p>
            <strong>Capacity:</strong> {venue.maxGuests} people
          </p>
          <p>
            <strong>Amenities:</strong>{' '}
            {venue.meta.wifi && 'WiFi, '}
            {venue.meta.parking && 'Parking, '}
            {venue.meta.breakfast && 'Breakfast, '}
            {venue.meta.pets ? 'Pets allowed' : 'No pets'}
          </p>

          {/* Book Now button */}
          {isAuthenticated && (
            <Button variant="primary" onClick={handleShowModal} className="mt-3">
              Book Now
            </Button>
          )}

          <h3 className="mt-4">Availability</h3>
          <Calendar
            tileClassName={tileClassName}
            tileDisabled={tileDisabled}
            minDetail="month"
            next2Label={null}
            prev2Label={null}
            selectRange={false} // Ensure selectRange is false for the main calendar
          />

          {/* Booking Modal */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Book {venue.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {bookingError && <Alert variant="danger">{bookingError}</Alert>}
              {bookingSuccess && <Alert variant="success">{bookingSuccess}</Alert>}
              <form onSubmit={handleBookingSubmit}>
                <div>
                  <label>
                    <strong>Select Check-in and Check-out Dates:</strong>
                  </label>
                  <Calendar
                    selectRange={true}
                    allowPartialRange={true} // Add this line
                    onChange={handleDateChange}
                    tileClassName={tileClassName}
                    tileDisabled={tileDisabled}
                    minDate={new Date()}
                    next2Label={null}
                    prev2Label={null}
                  />
                </div>
                <div className="mt-3">
                  <label htmlFor="guests">
                    <strong>Number of Guests:</strong>
                  </label>
                  <input
                    type="number"
                    name="guests"
                    id="guests"
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ guests: e.target.value })}
                    min="1"
                    max={venue.maxGuests}
                    required
                    className="form-control"
                  />
                </div>
                <Button variant="primary" type="submit" className="mt-3">
                  Confirm Booking
                </Button>
              </form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
};

export default VenueDetails;
