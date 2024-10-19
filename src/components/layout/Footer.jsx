import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-light text-center text-lg-start mt-4">
            <div className="text-center p-3">
                © {new Date().getFullYear()} Holidaze
            </div>
        </footer>
    );
};

export default Footer;
