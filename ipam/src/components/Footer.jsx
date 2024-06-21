import React from 'react';
import './footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p className='footer-item'>© 2024 Dmail</p>
            <a href='/about' className='footer-item' target='_blank' rel='noopener noreferrer'>about</a>
            <p className='footer-item'>contact</p>
            <a href='/API' className='footer-item' target='_blank' rel='noopener noreferrer'>API</a>
        </footer>
    );
}

export default Footer;
