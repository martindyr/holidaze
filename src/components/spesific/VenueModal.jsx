import React, { useState } from 'react';
import FormModal from '../common/FormModal';

const VenueFormModal = ({ show, handleClose, venueData = {}, handleSubmit }) => {
  const [formData, setFormData] = useState(venueData);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const submitHandler = async (e) => {
    console.log('submithandler arguemnt: ', e)
    e.preventDefault();
    try {
      await handleSubmit(formData); // Submit form data via the handler
      setSuccessMessage('Venue saved successfully!');
      setTimeout(handleClose, 2000);
    } catch (error) {
      console.log('Error: ', error)
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const formFields = [
    { label: 'Name', name: 'name', type: 'text', required: true },
    { label: 'Description', name: 'description', type: 'textarea', required: true },
    { label: 'Media URLs (comma-separated)', name: 'media', type: 'text' },
    { label: 'Price', name: 'price', type: 'number', required: true },
    { label: 'Max Guests', name: 'maxGuests', type: 'number', required: true },
    { label: 'WiFi', name: 'wifi', type: 'checkbox' },
    { label: 'Parking', name: 'parking', type: 'checkbox' },
    { label: 'Breakfast', name: 'breakfast', type: 'checkbox' },
    { label: 'Pets Allowed', name: 'pets', type: 'checkbox' },
  ];

  return (
    <FormModal
      show={show}
      handleClose={handleClose}
      title={venueData.id ? 'Edit Venue' : 'Create Venue'}
      formFields={formFields}
      handleSubmit={submitHandler}
      formData={formData}
      handleInputChange={handleInputChange}
      errorMessage={errorMessage}
      successMessage={successMessage}
      submitButtonText={venueData.id ? 'Update Venue' : 'Create Venue'}
    />
  );
};

export default VenueFormModal;
