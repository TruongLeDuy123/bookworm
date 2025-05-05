import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';

const BookCard = ({ book }) => {
    const { currency, exchangeRate } = useCurrency();
    const hasDiscount = book.final_price < book.book_price;
    return (
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Link to={`/book/${book.book_id}`} className="text-decoration-none text-dark">
                <Card className="h-100">
                    <Card.Img
                        variant="top"
                        src={book.book_img ? "https://nhasachphuongnam.com/images/thumbnails/270/290/detailed/174/Diary_of_a_Wimpy_Kid.jpg" : "https://res.cloudinary.com/dfwr3z0ls/image/upload/v1733227995/bouhsa0hcabyl1gq7h0i.png"}
                        className="img-fluid object-fit-cover"
                        style={{ maxHeight: '200px' }}
                    />

                    <Card.Body>
                        <Card.Title
                            className="fs-6 fw-semibold mb-2 text-truncate"
                            title={book.book_title}
                        >
                            {book.book_title}
                        </Card.Title>

                        <Card.Text className="text-muted small mb-0">
                            {book.author_name}
                        </Card.Text>
                    </Card.Body>

                    <Card.Footer className='p-3'>
                        {hasDiscount ? (
                            <>
                                <span className="text-muted text-decoration-line-through me-2">
                                    {formatCurrency(book.book_price, currency, exchangeRate)}
                                </span>
                                <strong>{formatCurrency(book.final_price, currency, exchangeRate)}</strong>
                            </>
                        ) : (
                            <strong>{formatCurrency(book.book_price, currency, exchangeRate)}</strong>
                        )}
                    </Card.Footer>
                </Card>
            </Link>
        </Col>
    );
};

export default BookCard;
