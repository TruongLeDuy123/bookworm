import React from 'react';
import { Row, Col } from 'react-bootstrap';
import BookCard from './BookCard';

const BookCarousel = ({ group }) => {

    return (
        <Row className="g-4 justify-content-center">
            {group && group.length ? (
                group.map(book => (
                    <BookCard key={book.id} book={book} />
                ))
            ) : (
                <Col xs={6} md={4} lg={3} xl={3} className="mb-4">
                    <p className="text-muted mt-3">No data available</p>
                </Col>
            )}
        </Row>
    );
};

export default BookCarousel;
