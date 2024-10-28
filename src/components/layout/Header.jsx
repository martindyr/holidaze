import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, isVenueManager, getName } from '../../services/auth';
import LoginModal from '../spesific/LoginModal';
import RegisterModal from '../spesific/RegisterModal';

const Header = () => {
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Check if the user is logged in
    const isAuthenticated = !!localStorage.getItem('accessToken');

    // Check if user is manager
    const venueManager = isVenueManager();

    // Get the logged-in user's name
    const userName = getName();

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
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link className="navbar-brand" to="/">Holidaze</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                        <li className="nav-item">
                                        <Link className="btn btn-link nav-link" to="/venues">
                                            Venues
                                        </Link>
                                    </li>
                            {!isAuthenticated && (
                                <>
                                    <li className="nav-item">
                                        <button className="btn btn-link nav-link" onClick={handleShowLoginModal}>
                                            Login
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn btn-link nav-link" onClick={handleShowRegisterModal}>
                                            Register
                                        </button>
                                    </li>
                                </>
                            )}

                            {isAuthenticated && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/my-bookings">My Bookings</Link>
                                    </li>

                                    {venueManager && (
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/my-venues">My Venues</Link>
                                        </li>
                                    )}

                                    <li className="nav-item">
                                        <button className="btn btn-link nav-link" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <LoginModal
                show={showLoginModal}
                handleClose={handleCloseLoginModal}
                onLoginSuccess={handleLoginSuccess}
            />

            <RegisterModal
                show={showRegisterModal}
                handleClose={handleCloseRegisterModal}
            />
        </>
    );
};

export default Header;
