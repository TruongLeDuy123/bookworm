import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    return (
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Link to={`/book/${book.book_id}`} className="text-decoration-none text-dark">
                <Card style={{ height: '100%' }}>
                    <Card.Img
                        variant="top"
                        src="https://res.cloudinary.com/dfwr3z0ls/image/upload/v1733227995/bouhsa0hcabyl1gq7h0i.png"
                        className="img-fluid"
                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body className="d-flex flex-column justify-content-between" style={{ height: '100%' }}>
                        <Card.Title
                            style={{
                                fontSize: '1rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                minHeight: '3em',
                                lineHeight: '1.5em',
                            }}
                        >
                            {book.book_title}
                        </Card.Title>
                        <Card.Text className="text-muted" style={{ fontSize: '0.9rem', minHeight: '1.5em' }}>
                            {book.author_name}
                        </Card.Text>
                        <Card.Text className="mt-auto">
                            {book.final_price < book.book_price ? (
                                <>
                                    <span className="text-muted text-decoration-line-through me-2">
                                        ${Number(book.book_price).toFixed(2)}
                                    </span>
                                    <strong>${Number(book.final_price).toFixed(2)}</strong>
                                </>
                            ) : (
                                <strong>${Number(book.book_price).toFixed(2)}</strong>
                            )}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Link>
        </Col>

    );
};

export default BookCard;