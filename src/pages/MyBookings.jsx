import React, { useEffect, useState } from 'react';
import { getUserBookings } from '../services/profiles'; // Import the getUserBookings function
import { Card, Container, Row, Col } from 'react-bootstrap'; // Use Bootstrap for styling

const MyBookings = () => {
    const [bookings, setBookings] = useState([]); // Initialize bookings as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getUserBookings();
                console.log('Bookings response:', response); // Debugging: log the API response

                // Access the "data" property from the response
                if (response && Array.isArray(response.data)) {
                    setBookings(response.data); // Set the bookings array from the "data" property
                } else {
                    setError('Invalid response format.');
                }
            } catch (err) {
                setError(`Error fetching bookings: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return <div>Loading bookings...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <Container className="my-5">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
                <p>You have no bookings yet.</p>
            ) : (
                <Row>
                    {bookings.map((booking) => (
                        <Col key={booking.id} md={6} lg={4} className="mb-4">
                            <Card>
                                {booking.venue.media && booking.venue.media.length > 0 ? (
                                    <Card.Img
                                        variant="top"
                                        src={booking.venue.media[0].url}
                                        alt={booking.venue.media[0].alt || booking.venue.name}
                                    />
                                ) : (
                                    <Card.Img
                                        variant="top"
                                        src="https://via.placeholder.com/150"
                                        alt="No image available"
                                    />
                                )}
                                <Card.Body>
                                    <Card.Title>{booking.venue.name}</Card.Title>
                                    <Card.Text>
                                        <strong>Check-in:</strong> {new Date(booking.dateFrom).toLocaleDateString()}<br />
                                        <strong>Check-out:</strong> {new Date(booking.dateTo).toLocaleDateString()}<br />
                                        <strong>Guests:</strong> {booking.guests}<br />
                                        <strong>Price:</strong> ${booking.venue.price}<br />
                                        <strong>Rating:</strong> {booking.venue.rating}/5
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Description:</strong> {booking.venue.description}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Amenities:</strong><br />
                                        {booking.venue.meta.wifi && "WiFi, "}
                                        {booking.venue.meta.parking && "Parking, "}
                                        {booking.venue.meta.breakfast && "Breakfast, "}
                                        {booking.venue.meta.pets ? "Pets allowed" : "No pets allowed"}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default MyBookings;
