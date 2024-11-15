import React, { useEffect, useState } from 'react';
import CustomCard from '../components/common/CustomCard'
import Truncate from '../components/common/Truncate'
import { getAllVenues, searchVenues } from '../services/venues';
import { Card, Button, Container, Row, Col, Form, InputGroup, Alert } from 'react-bootstrap';
import './Venues.css'

function Venues() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [inputError, setInputError] = useState('');

    // Fetch all venues on component mount
    useEffect(() => {
        async function fetchVenues() {
            try {
                const response = await getAllVenues();
                setVenues(Array.isArray(response.data) ? response.data : response);
            } catch (err) {
                setError("Failed to load venues. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchVenues();
    }, []);

    // Handle search input change
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        // Clear input error on new input
        if (inputError) setInputError(''); 
    };


    const handleSearch = async () => {

        setLoading(true);
        setError(null);

        try {
            // Allow user to clear search field
            if (!searchQuery) {
                const response = await getAllVenues();
                setVenues(Array.isArray(response.data) ? response.data : response);
                // Venue search
            } else {
                const response = await searchVenues({ q: searchQuery });
                setVenues(Array.isArray(response.data) ? response.data : response);
            }
        } catch (err) {
            setError("Failed to fetch search results. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading venues...</div>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Container className="my-3">
            <h2 className="mb-">Venues</h2>

            {/* Search Input and Button */}
            <InputGroup className="mb-4">
                <Form.Control
                    type="text"
                    placeholder="Search for a venue..."
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                <Button variant="primary" onClick={handleSearch}>Search</Button>
            </InputGroup>
            {inputError && <Alert variant="danger">{inputError}</Alert>}

            {/* Venue List */}
            <Row>
                {venues.length > 0 ? (
                    venues.map((venue) => (
                        <Col key={venue.id} sm={12} md={6} lg={4} className="mb-4">
                            <CustomCard
                                imageSrc={venue.media?.length > 0 ? venue.media[0].url : null}
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
                                            <ul className="list-unstyled d-flex justify-content-between align-items-start">
                                                <li className="d-flex align-items-end">
                                                    <div className="rating-stars">
                                                        {venue.rating ? (
                                                            [...Array(5)].map((_, index) => (
                                                                <span key={index} className={index < venue.rating ? 'star filled' : 'star'}>
                                                                    ★
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span>No Rating</span>
                                                        )}
                                                    </div>
                                                </li>
                                                <li className="price-tag">
                                                    <span>{venue.price}$</span>
                                                </li>
                                            </ul>
                                        </ul>
                                    </>
                                }
                                buttons={[
                                    {
                                        text: 'View Details',
                                        variant: 'primary',
                                        href: `/venue/${venue.id}`,
                                    },
                                ]}
                            />
                        </Col>
                    ))
                ) : (
                    <p>No venues found.</p>
                )}
            </Row>
        </Container>
    );
}

export default Venues;
