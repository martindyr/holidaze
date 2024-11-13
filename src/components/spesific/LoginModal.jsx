import React, { useState } from 'react';
import { loginUser } from '../../services/auth';
import FormModal from '../common/FormModal';

const LoginModal = ({ show, handleClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await loginUser(formData);
      if (response.data && response.data.accessToken) {
        onLoginSuccess();
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    }
  };

  const formFields = [
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Password', name: 'password', type: 'password', required: true },
  ];

  return (
    <FormModal
      show={show}
      handleClose={handleClose}
      title="Login"
      formFields={formFields}
      handleSubmit={handleSubmit}
      formData={formData}
      handleInputChange={handleInputChange}
      errorMessage={error}
      submitButtonText="Login"
    />
  );
};

export default LoginModal;
