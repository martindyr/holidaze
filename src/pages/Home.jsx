import React from 'react';
import { Container, Button } from 'react-bootstrap';

const Home = () => {
    return (
        <Container className="my-5 text-center">
            <h1 className="display-4">Welcome to Holidaze!</h1>
            <p className="lead">Your one-stop destination for booking venues.</p>
            <hr className="my-4" />
            <p>
                Discover amazing venues for your next event or getaway.
            </p>
            <Button variant="primary" size="lg" href="/venues">
                Browse Venues
            </Button>
        </Container>
    );
};

export default Home;
