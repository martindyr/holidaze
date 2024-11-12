import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, isVenueManager } from '../../services/auth';
import LoginModal from '../spesific/LoginModal';
import RegisterModal from '../spesific/RegisterModal';
import ProfileCircle from '../spesific/ProfileCircle';
import { Navbar, Nav, Button } from 'react-bootstrap';
import './Header.css'; // Ensure you have this file for your styles
import Logo from '../../assets/icons/Logo.png'; // Import your logo image

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get current location
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Check if the user is logged in
    const isAuthenticated = !!localStorage.getItem('accessToken');

    // Check if user is manager
    const venueManager = isVenueManager();

    // Handle the logout process
    const handleLogout = () => {
        logout();
        navigate('/'); // Navigate the user back to the home page after logout
    };

    // Handle showing modals
    const handleShowLoginModal = () => setShowLoginModal(true);
    const handleCloseLoginModal = () => setShowLoginModal(false);
    const handleShowRegisterModal = () => setShowRegisterModal(true);
    const handleCloseRegisterModal = () => setShowRegisterModal(false);

    // Handle successful login (close modal and navigate)
    const handleLoginSuccess = () => {
        setShowLoginModal(false);
        navigate('/'); // Navigate to home page
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="navbar-custom">
                <div className="container">
                    <Link className="navbar-brand" to="/"> <img src={Logo} alt="Holidaze Logo" style={{ width: '25px', height: 'auto' }} />Holidaze</Link>
                    <Navbar.Toggle aria-controls="navbarNav" />
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="me-auto">
                            <Link className={`nav-link ${location.pathname === '/venues' ? 'active' : ''}`} to="/venues">Venues</Link>
                            {isAuthenticated && (
                                <Link className={`nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`} to="/my-bookings">My Bookings</Link>
                            )}
                            {venueManager && (
                                <Link className={`nav-link ${location.pathname === '/my-venues' ? 'active' : ''}`} to="/my-venues">My Venues</Link>
                            )}
                        </Nav>
                        <Nav>
                            {!isAuthenticated ? (
                                <>
                                    <Button variant="link" className="nav-link logout-button" onClick={handleShowLoginModal}>Login</Button>
                                    <Button variant="link" className="nav-link logout-button" onClick={handleShowRegisterModal}>Register</Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="link" className="nav-link logout-button" onClick={handleLogout}>Logout</Button>
                                    <div className="d-flex align-items-center" >
                                        <ProfileCircle />
                                    </div>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>

            <LoginModal show={showLoginModal} handleClose={handleCloseLoginModal} onLoginSuccess={handleLoginSuccess} />
            <RegisterModal show={showRegisterModal} handleClose={handleCloseRegisterModal} />
        </>
    );
};

export default Header;
