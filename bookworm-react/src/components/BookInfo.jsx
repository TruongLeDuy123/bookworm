import React from 'react';
import { Card, Col } from 'react-bootstrap';

const BookInfo = ({ bookData }) => {
    return (
        <Card className="border h-100">
            <div className="row g-0">
                <Col xs={12} md={3} className="d-flex flex-column align-items-center p-3">
                    <img
                        src="https://res.cloudinary.com/dfwr3z0ls/image/upload/v1733227995/bouhsa0hcabyl1gq7h0i.png"
                        alt="Book"
                        className="img-fluid w-100 mb-2"
                        style={{ maxWidth: '150px', objectFit: 'cover' }}
                    />
                    <Card.Text className="text-muted text-center">
                        By <span className="fw-bold">{bookData.author.author_name}</span>
                    </Card.Text>
                </Col>

                <Col xs={12} md={9}>
                    <Card.Body>
                        <Card.Title className="fw-bold">{bookData.book_title}</Card.Title>
                        <Card.Text className="mb-2">{bookData.book_summary}</Card.Text>
                    </Card.Body>
                </Col>
            </div>
        </Card>
    );
};

export default BookInfo;