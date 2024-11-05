// src/components/specific/BookingModal.js

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { addDays, isAfter, startOfDay } from 'date-fns';
import './BookingModal.css'

const BookingModal = ({
  show,
  handleClose,
  venue,
  bookedDates = [],
  createBooking,
  fetchVenue,
}) => {
  const [bookingData, setBookingData] = useState({ guests: 1 });
  const [selectedDates, setSelectedDates] = useState([]);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    if (!show) {
      setSelectedDates([]); // Clear dates when modal closes
      setBookingError('');
      setBookingSuccess('');
      console.log('Modal Closed. State Reset.');
    }
  }, [show]);

  // Handle date selection (for both single and range selections)
  const handleDateChange = (dates) => {
    console.log('handleDateChange called with:', dates);

    if (!dates) {
      // No dates selected
      setSelectedDates([]);
      console.log('No dates selected.');
      return;
    }

    if (Array.isArray(dates)) {
      const [start, end] = dates;
      if (start && end) {
        // Both dates selected
        setSelectedDates([start, end]);
        console.log('Selected Date Range:', { start, end });
      } else if (start && !end) {
        // Only one date selected
        setSelectedDates([start, start]);
        console.log('Selected Single Date:', start);
      }
    } else if (dates instanceof Date) {
      // Should not happen with selectRange, but handle just in case
      setSelectedDates([dates, dates]);
      console.log('Selected Single Date:', dates);
    } else {
      // Invalid dates
      setSelectedDates([]);
      console.log('Invalid dates selected.');
    }
  };

  // Check if selected dates conflict with existing bookings
  const hasConflictingDates = () => {
    console.log('hasConflictingDates called with selectedDates:', selectedDates);

    if (!selectedDates || selectedDates.length !== 2) return false;
    const [start, end] = selectedDates;

    if (!(start instanceof Date) || isNaN(start.getTime())) {
      console.log('Invalid start date in hasConflictingDates:', start);
      return false;
    }

    if (!(end instanceof Date) || isNaN(end.getTime())) {
      console.log('Invalid end date in hasConflictingDates:', end);
      return false;
    }

    const selectedRange = [];
    let currentDate = startOfDay(start);
    const actualEnd = startOfDay(end);

    while (!isAfter(currentDate, actualEnd)) {
      const dateStr = currentDate.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD' in UTC
      selectedRange.push(dateStr);
      currentDate = addDays(currentDate, 1);
    }

    const hasConflict = selectedRange.some((date) =>
      bookedDates.includes(date)
    );
    console.log('Checking for Conflicting Dates:', { selectedRange, hasConflict });
    return hasConflict;
  };

  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    console.log('handleBookingSubmit called');
    console.log('selectedDates:', selectedDates);

    const [dateFrom, dateTo] = selectedDates;

    console.log('dateFrom:', dateFrom);
    console.log('dateTo:', dateTo);

    if (!(dateFrom instanceof Date) || isNaN(dateFrom.getTime())) {
      setBookingError('Please select at least one valid date.');
      console.error('Booking Error: Invalid dateFrom.', dateFrom);
      return;
    }

    if (!(dateTo instanceof Date) || isNaN(dateTo.getTime())) {
      setBookingError('Please select at least one valid date.');
      console.error('Booking Error: Invalid dateTo.', dateTo);
      return;
    }

    if (hasConflictingDates()) {
      setBookingError(
        'Selected dates conflict with existing bookings. Please choose different dates.'
      );
      console.error('Booking Error: Conflicting dates found.');
      return;
    }

    const { guests } = bookingData;

    const bookingPayload = {
      dateFrom: dateFrom.toISOString(), // Keep as ISO string for backend
      dateTo: dateTo.toISOString(),
      guests: parseInt(guests),
      venueId: venue.id,
    };
    console.log('Booking Payload:', bookingPayload);

    try {
      await createBooking(bookingPayload);
      setBookingSuccess('Booking successful!');
      console.log('Booking Successful:', bookingPayload);
      // Refresh venue data to get updated bookings
      if (fetchVenue) {
        await fetchVenue();
      }
      setTimeout(() => handleClose(), 2000); // Close modal after successful booking
    } catch (err) {
      setBookingError('An error occurred while booking.');
      console.error('Booking Error:', err);
    }
  };

  const formatShortWeekday = (locale, date) => {
    return date.toLocaleDateString(locale, { weekday: 'narrow' }).toUpperCase(); // Returns first letter of the weekday
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Book {venue?.name || 'Venue'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {bookingError && <Alert variant="danger">{bookingError}</Alert>}
        {bookingSuccess && <Alert variant="success">{bookingSuccess}</Alert>}
        <Form onSubmit={handleBookingSubmit}>
          <div className="mb-3">
            <strong>Select Check-in and Check-out Dates:</strong>
            <Calendar
              selectRange
              next2Label={null}
              prev2Label={null}
              formatShortWeekday={formatShortWeekday}
              allowPartialRange
              onChange={handleDateChange}
               className="custom-calendar"
              minDate={new Date()}
              tileDisabled={({ date, view }) => {
                if (view !== 'month') return false;
                const dateStr = date.toISOString().split('T')[0];
                return (
                  bookedDates.includes(dateStr) ||
                  date < startOfDay(new Date())
                );
              }}
              tileClassName={({ date, view }) => {
                if (view !== 'month') return null;
                const dateStr = date.toISOString().split('T')[0];
                if (bookedDates.includes(dateStr)) {
                  return 'booked-date'; // Add a custom class for booked dates
                }
                return null;
              }}
            />
          </div>

          <Form.Group controlId="formGuests" className="mb-3">
            <Form.Label>Number of Guests</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max={venue?.maxGuests || 1}
              value={bookingData.guests}
              onChange={(e) =>
                setBookingData({ ...bookingData, guests: e.target.value })
              }
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Confirm Booking
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BookingModal;
