import React, { useEffect, useState } from 'react';
import { getAllVenues, searchVenues } from '../services/venues';
import { Card, Button, Container, Row, Col, Spinner, Form, InputGroup, Alert } from 'react-bootstrap';

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
        if (inputError) setInputError(''); // Clear input error on new input
    };

    // Handle search button click
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setInputError("The search field must contain text.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await searchVenues({ q: searchQuery });
            setVenues(Array.isArray(response.data) ? response.data : response);
        } catch (err) {
            setError("Failed to fetch search results. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Container className="my-4">
            <h2 className="text-center mb-4">Available Venues</h2>

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

            {/* Venues List */}
            <Row>
                {venues.length > 0 ? (
                    venues.map((venue) => (
                        <Col md={4} sm={6} key={venue.id} className="mb-4">
                            <Card>
                                {venue.media?.length > 0 && (
                                    <Card.Img variant="top" src={venue.media[0].url} alt={venue.media[0].alt || venue.name} />
                                )}
                                <Card.Body>
                                    <Card.Title>{venue.name}</Card.Title>
                                    <Card.Text>
                                        {venue.description || "No description available."}
                                    </Card.Text>
                                    <ul className="list-unstyled">
                                        <li><strong>Location:</strong> {venue.location?.city}, {venue.location?.country}</li>
                                        <li><strong>Max Guests:</strong> {venue.maxGuests}</li>
                                        <li><strong>Rating:</strong> {venue.rating} / 5</li>
                                        <li><strong>Price:</strong> ${venue.price} per night</li>
                                    </ul>
                                    <Button variant="primary" href={`/venue/${venue.id}`}>View Details</Button>
                                </Card.Body>
                            </Card>
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
