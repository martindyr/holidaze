import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Venues from './pages/Venues';
import VenueDetails from './pages/VenueDetails';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MyBookings from './pages/MyBookings';
import MyVenues from './pages/MyVenues';

const App = () => {
    return (
        <Router>
            <Header />
            <div className="container my-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/venues" element={<Venues />} />
                    <Route path="/venue/:id" element={<VenueDetails />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                    <Route path="/my-venues" element={<MyVenues />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
};

export default App;
