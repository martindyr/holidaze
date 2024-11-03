import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Importing React Icons
import './Footer.css'; // Ensure you create a Footer.css file if needed

const Footer = () => {
    return (
        <footer className="footer bg-light text-center text-lg-start pt-4 pb-4">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-6 mb-4">
                        <h5 className="text-uppercase" style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-primary)' }}>About Us</h5>
                        <p style={{ color: 'var(--dark-color)' }}>
                            Holidaze is your go-to platform for booking luxurious accommodations. We offer a wide range of properties that cater to all your vacation needs.
                        </p>
                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">
                        <h5 className="text-uppercase" style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-primary)' }}>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/venues" style={{ color: 'var(--dark-color)' }}>Venues</a></li>
                            <li><a href="/my-bookings" style={{ color: 'var(--dark-color)' }}>My Bookings</a></li>
                            <li><a href="/my-venues" style={{ color: 'var(--dark-color)' }}>My Venues</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-12 mb-4">
                        <h5 className="text-uppercase" style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-primary)' }}>Follow Us</h5>
                        <div>
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="me-3">
                                <FaFacebook size={24} color="var(--dark-color)" />
                            </a>
                            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="me-3">
                                <FaTwitter size={24} color="var(--dark-color)" />
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="me-3">
                                <FaInstagram size={24} color="var(--dark-color)" />
                            </a>
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin size={24} color="var(--dark-color)" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="text-center p-3 mt-4" style={{ color: 'var(--dark-color)' }}>
                    © {new Date().getFullYear()} Holidaze. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
