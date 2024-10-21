// src/components/RegisterModal.js

import React, { useState } from 'react';
import FormModal from '../common/FormModal';
import { registerUser } from '../../services/auth';

const RegisterModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    venueManager: false,
    password: '',
  });
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
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      if (response.data) {
        setSuccessMessage('Registration successful! You can now log in.');
        setTimeout(handleClose, 2000);
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred during registration. Please try again.');
    }
  };

  const formFields = [
    { label: 'Name', name: 'name', type: 'text', required: true },
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Venue Manager', name: 'venueManager', type: 'checkbox' },
    { label: 'Password', name: 'password', type: 'password', required: true },
  ];

  return (
    <FormModal
      show={show}
      handleClose={handleClose}
      title="Register"
      formFields={formFields}
      handleSubmit={submitHandler}
      formData={formData}
      handleInputChange={handleInputChange}
      errorMessage={errorMessage}
      successMessage={successMessage}
      submitButtonText="Register"
    />
  );
};

export default RegisterModal;
