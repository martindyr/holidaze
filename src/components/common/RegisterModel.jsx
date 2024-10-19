import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { registerUser } from '../../services/auth';

const RegisterModal = ({ show, handleClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [venueManager, setVenueManager] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);  // Clear previous errors
        setSuccessMessage('');

        const data = {
            name,
            email,
            venueManager,
            password
        };

        try {
            const response = await registerUser(data);

            if (response.data) {
                setSuccessMessage('Registration successful! You can now log in.');
                handleClose();
            } else {
                setError('Registration failed. Please check your details and try again.');
            }
        } catch (err) {
            setError('An error occurred during registration. Please try again.');
            console.error(err);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="registerName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="registerEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="registerVenueManager">
                        <Form.Check
                            type="checkbox"
                            label="Venue Manager"
                            checked={venueManager}
                            onChange={(e) => setVenueManager(e.target.checked)}
                        />
                    </Form.Group>
                    <Form.Group controlId="registerPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        Register
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default RegisterModal;
