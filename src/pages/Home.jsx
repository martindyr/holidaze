import React, { useEffect, useState } from 'react';
import { getAllVenues } from '../services/venues';
import { Link } from 'react-router-dom';
import './Home.css'
import FeaturedSection from '../components/spesific/FeaturedSection';
import { Button } from 'react-bootstrap';

const Homepage = () => {
  const [venues, setVenues] = useState([]); // Ensure venues is initialized as an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await getAllVenues();

        // Check if the response contains the data array
        if (response && Array.isArray(response.data)) {
          setVenues(response.data);
        } else {
          setError("Invalid response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  if (loading) {
    return <div>Loading venues...</div>;
  }

  if (error) {
    return <div>Error fetching venues: {error}</div>;
  }

  // Filter venues for different sections
  const topRatedVenues = venues.filter((venue) => venue.rating >= 4.5).slice(0, 6);
  const mostBookedVenues = venues
    .filter((venue) => venue._count.bookings > 0)
    .sort((a, b) => b._count.bookings - a._count.bookings)
    .slice(0, 6);
  const recentlyAddedVenues = venues
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .slice(0, 6);

  return (

    <div className="homepage">
      <div className="hero-section full-width">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1 className="hero-heading animate-fadein">Find Your Perfect Escape</h1>
          <p className="hero-subtext animate-fadein">Discover unique venues for your next adventure. Immerse yourself in luxury, charm, and unforgettable experiences.</p>
          <Link to="/venues">
            <Button variant="primary" size="lg" className="cta-button animate-fadein">
              Browse Venues
            </Button>
          </Link>
        </div>
      </div>
      <FeaturedSection title="Top-Rated Venues" venues={topRatedVenues} />

      <FeaturedSection title="Most Booked Venues" venues={mostBookedVenues} />

      <FeaturedSection title="Recently Added Venues" venues={recentlyAddedVenues} />
    </div>
  );
};

export default Homepage;
