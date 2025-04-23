import React from 'react';
import { Card } from 'react-bootstrap';

function BookCard({ book }) {
    return (
        <Card className="h-100">
            <Card.Img variant="top" src={book.book_img} />
            <Card.Body>
                <Card.Title style={{ fontSize: '1rem' }}>{book.book_title}</Card.Title>
                <Card.Text className="text-muted mb-1">{book.author_name}</Card.Text>
                <Card.Text className="text-muted">
                    {book.book_price - book.final_price > 0 ? (
                        <>
                            <span className="text-muted text-decoration-line-through me-2">
                                ${Number(book.book_price).toFixed(2)}
                            </span>
                            <strong>${Number(book.final_price).toFixed(2)}</strong>
                        </>
                    ) : (
                        <strong>
                            ${Number(book.book_price).toFixed(2)}
                        </strong>
                    )}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
export default BookCard;
