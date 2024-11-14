import React, { useState } from 'react';
import FormModal from '../common/FormModal';

const VenueModal = ({
  show,
  handleClose,
  venueData = {},
  onSubmit,
  handleChange,
  buttonText,
  title,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const submitHandler = async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
  
    const formData = { ...venueData };
  
    if (formData.media && Array.isArray(formData.media)) {
      formData.media = formData.media.map((item) => {
        if (typeof item === 'string') {
          return { url: item.trim() };
        } else if (typeof item === 'object' && item.url) {
          return { url: item.url.trim() };
        }
        return item;
      });
    } else if (formData.media && typeof formData.media === 'string') {
      formData.media = formData.media.split(',').map((url) => ({ url: url.trim() }));
    }
  
    try {
      await onSubmit(formData);
      setSuccessMessage('Venue saved successfully!');
      setTimeout(handleClose, 2000);
    } catch (error) {
      console.error('Error submitting venue data: ', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const formFields = [
    { label: 'Name', name: 'name', type: 'text', required: true },
    { label: 'Description', name: 'description', type: 'textarea', required: true },
    { label: 'Media URLs (comma-separated)', name: 'media', type: 'text' },
    { label: 'Price', name: 'price', type: 'number', required: true },
    { label: 'Max Guests', name: 'maxGuests', type: 'number', required: true },
    { label: 'Country', name: 'location.country', type: 'text' },
    { label: 'City', name: 'location.city', type: 'text' },
    { label: 'Address', name: 'location.address', type: 'text'},
    { label: 'WiFi', name: 'wifi', type: 'checkbox' },
    { label: 'Parking', name: 'parking', type: 'checkbox' },
    { label: 'Breakfast', name: 'breakfast', type: 'checkbox' },
    { label: 'Pets Allowed', name: 'pets', type: 'checkbox' },
  ];

  return (
    <FormModal
      show={show}
      handleClose={handleClose}
      title={title}
      formFields={formFields}
      handleSubmit={submitHandler}
      formData={venueData}
      handleInputChange={handleChange}
      errorMessage={errorMessage}
      successMessage={successMessage}
      submitButtonText={buttonText}
    />
  );
};

export default VenueModal;
