import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

import logo from '../assets/images/logo.png';

const Footer = () => {
    return (
        <footer className="bg-light border-top pt-4 pb-3 mt-4">
            <Container>
                <Row className="mb-4">
                    <Col xs={12} sm={6} md={4}>
                        <div className="d-flex align-items-center mb-2">
                            <img src={logo} alt="logo" className="me-2 w-8 h-8" />
                            <h5 className="mb-0">Bookworm</h5>
                        </div>
                        <p className="text-muted mb-1">The best place to find your favorite books.</p>
                        <p className="text-muted mb-1">
                            Email:{' '}
                            <a href="mailto:support@gmail.com" className="text-primary text-decoration-none">
                                support@gmail.com
                            </a>
                        </p>
                        <p className="text-muted mb-0">
                            Hotline:{' '}
                            <a href="tel:19001234" className="text-primary text-decoration-none">
                                1900 1234
                            </a>
                        </p>
                    </Col>

                    <Col xs={6} md={2} className='mt-2'>
                        <h6>Company</h6>
                        <ul className="list-unstyled">
                            <li><Link to="/about" className="text-muted text-decoration-none">About Us</Link></li>
                            <li><Link to="/contact" className="text-muted text-decoration-none">Contact Us</Link></li>
                            <li><Link to="/careers" className="text-muted text-decoration-none">Careers</Link></li>
                        </ul>
                    </Col>

                    <Col xs={6} md={2} className='mt-2'>
                        <h6>Support</h6>
                        <ul className="list-unstyled">
                            <li><Link to="/faq" className="text-muted text-decoration-none">FAQ</Link></li>
                            <li><Link to="/privacy" className="text-muted text-decoration-none">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-muted text-decoration-none">Terms of Service</Link></li>
                        </ul>
                    </Col>

                    <Col xs={6} md={2} className='mt-2'>
                        <h6>Legal</h6>
                        <ul className="list-unstyled">
                            <li><Link to="/return-policy" className="text-muted text-decoration-none">Return Policy</Link></li>
                            <li><Link to="/refund-policy" className="text-muted text-decoration-none">Refund Policy</Link></li>
                            <li><Link to="/shipping-policy" className="text-muted text-decoration-none">Shipping Policy</Link></li>
                        </ul>
                    </Col>

                    <Col xs={6} md={2} className='mt-2'>
                        <h6>Follow Us</h6>
                        <div className="d-flex gap-2">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted fs-5">
                                <FaFacebook />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted fs-5">
                                <FaTwitter />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted fs-5">
                                <FaInstagram />
                            </a>
                        </div>
                    </Col>
                </Row>

                <hr />

                <div className="text-center">
                    <small className="text-muted">
                        © {new Date().getFullYear()} Nash Bookstore. All rights reserved.
                    </small>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;


