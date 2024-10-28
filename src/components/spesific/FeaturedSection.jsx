import React from 'react';
import CustomCard from '../common/CustomCard'; // The card component we created earlier
import { Row, Col, Card } from 'react-bootstrap';

const FeaturedSection = ({ title, venues }) => {
  return (
    <section className="featured-section my-5">
      <h2>{title}</h2>
      <Row>
        {venues.map((venue) => (
          <Col key={venue.id} md={6} lg={4} className="mb-4">
            <CustomCard
              imageSrc={venue.media[0]?.url || 'https://via.placeholder.com/150'}
              imageAlt={venue.name}
              title={venue.name}
              description={venue.description}
              additionalContent={
                <>
                  <Card.Text>
                    <strong>Price:</strong> ${venue.price}
                    <br />
                    <strong>Max Guests:</strong> {venue.maxGuests}
                    <br />
                    <strong>Rating:</strong> {venue.rating}/5
                  </Card.Text>
                </>
              }
              buttons={[
                { text: 'View Details', variant: 'primary', href: `/venue/${venue.id}` },
              ]}
            />
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default FeaturedSection;
