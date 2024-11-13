import React, { useEffect, useState } from 'react';
import { getUserBookings } from '../services/profiles';
import CustomCard from '../components/common/CustomCard'
import { deleteBooking } from '../services/bookings'; // Import the delete function
import { Card, Container, Row, Col } from 'react-bootstrap';
import './MyBookings.css'

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getUserBookings();
                console.log('Bookings response:', response);
                if (response && Array.isArray(response.data)) {
                    setBookings(response.data);
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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await deleteBooking(id);
                setBookings(bookings.filter((booking) => booking.id !== id));
            } catch (err) {
                alert('Error deleting booking.');
            }
        }
    };

    if (loading) {
        return <div>Loading bookings...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <Container className="my-3">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
                <p>You have no bookings yet.</p>
            ) : (
                <Row>
                {bookings.map((booking) => (
                  <Col key={booking.id} md={6} lg={4} className="mb-4">
                    <CustomCard
                      imageSrc={
                        booking.venue.media && booking.venue.media.length > 0
                          ? booking.venue.media[0].url
                          : 'https://via.placeholder.com/150'
                      }
                      imageAlt={booking.venue.name}
                      title={booking.venue.name}
                      bodyContent={
                        <>
                          <Card.Text>

                            <ul className="list-unstyled">
                                            <li>
                                            <strong>Check-in:</strong> {new Date(booking.dateFrom).toLocaleDateString()}
                                            </li>
                                            <li>
                                            <strong>Check-out:</strong> {new Date(booking.dateTo).toLocaleDateString()}
                                            </li>
                                            <li>
                                            <strong>Guests:</strong> {booking.guests}
                                            </li>
                                            <ul className="list-unstyled d-flex justify-content-between align-items-start">
                                                <li className="d-flex align-items-end">
                                                    <div className="rating-stars">
                                                        {booking.venue.rating ? (
                                                            [...Array(5)].map((_, index) => (
                                                                <span key={index} className={index < booking.venue.rating ? 'star filled' : 'star'}>
                                                                    ★
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span>No Rating</span>
                                                        )}
                                                    </div>
                                                </li>
                                                <li className="price-tag">
                                                    <span>{booking.venue.price}$</span>
                                                </li>
                                            </ul>
                                        </ul>
                          </Card.Text>
 

                        </>
                      }
                      buttons={[
                        {
                          text: 'View Details',
                          variant: 'primary',
                          href: `/venue/${booking.venue.id}`,
                        },
                        {
                          text: 'Delete',
                          variant: 'danger',
                          onClick: () => handleDelete(booking.id),
                        },
                      ]}
                    />
                  </Col>
                ))}
              </Row>
            )}
        </Container>
    );
};

export default MyBookings;
