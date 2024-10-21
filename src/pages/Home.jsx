import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Home.css';  // Import Home-specific CSS
import Footer from '../components/layout/Footer';  // Import Footer

const Home = () => {
  return (
    <>
      <div className="home-hero">
        <Container>
          <h1>Welcome to Holidaze</h1>
          <p>Your one-stop destination for booking venues.</p>
          <Button variant="primary" size="lg" href="/venues">Browse Venues</Button>
        </Container>
      </div>
      
      <Container className="home-featured">
        <h2>Featured Venues</h2>
        {/* Add your featured venues here */}
      </Container>

    </>
  );
};

export default Home;
