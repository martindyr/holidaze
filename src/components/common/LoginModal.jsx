import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { loginUser } from '../../services/auth';

const LoginModal = ({ show, handleClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);  // Clear previous errors

        try {
            const response = await loginUser({ email, password });

            if (response.data && response.data.accessToken) {
                console.log('Login successful:', response.data);
                // Call the success handler to close modal and navigate
                onLoginSuccess();
            } else {
                setError('Login failed: Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred during login. Please try again.');
            console.error(err);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="loginEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="loginPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        Login
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;
