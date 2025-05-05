import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';

const BookCardCarousel = ({ book }) => {
    const { currency, exchangeRate } = useCurrency();
    const hasDiscount = book.final_price < book.book_price;

    return (
        <div className="mb-4 h-100 px-2 w-100 ">
            <Link to={`/book/${book.book_id}`} className="text-decoration-none text-dark h-100 d-block">
                <Card className="h-100 d-flex flex-column">
                    <Card.Img
                        variant="top"
                        src={book.book_img
                            ? "https://nhasachphuongnam.com/images/thumbnails/270/290/detailed/174/Diary_of_a_Wimpy_Kid.jpg"
                            : "https://res.cloudinary.com/dfwr3z0ls/image/upload/v1733227995/bouhsa0hcabyl1gq7h0i.png"
                        }
                        style={{
                            height: '200px',
                            objectFit: 'cover',
                        }}
                    />

                    <Card.Body className="flex-grow-1">
                        <Card.Title
                            className="fs-6 fw-semibold mb-2 text-truncate"
                            title={book.book_title}
                            style={{ minHeight: '2.5em' }}
                        >
                            {book.book_title}
                        </Card.Title>

                        <Card.Text className="text-muted small mb-0">
                            {book.author_name}
                        </Card.Text>
                    </Card.Body>

                    <Card.Footer className="p-3">
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
        </div>
    );
};

export default BookCardCarousel;
