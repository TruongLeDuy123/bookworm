import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Card, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import BookCarousel from './BookCarousel';

const chunk = (arr, size) => {
    return arr.reduce((acc, _, i) => {
        if (i % size === 0) acc.push(arr.slice(i, i + size));
        return acc;
    }, []);
};

const OnSale = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8002/books/top-discount");
                const data = await res.json();
                setBooks(data);
                console.log("check books: ", data);

            } catch (err) {
                console.error("Failed to fetch books", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const chunkedBooks = chunk(books, 4);

    if (loading) {
        return (
            <div className="d-flex justify-content-center my-5">
                <Spinner animation="border" variant="secondary" />
            </div>
        );
    }

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>On Sale</h4>
                <Link to="/shop"><Button variant="secondary">View All</Button></Link>
            </div>

            {books.length > 0 ? (
                <Carousel indicators={false}>
                    {chunkedBooks.map((group, idx) => (
                        <Carousel.Item key={idx}>
                            <div className="d-flex justify-content-center mx-2 mx-sm-3 mx-md-4 mx-lg-5">
                                <BookCarousel group={group} />
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <p>No books on sale.</p>
            )
            }
        </Container >
    )
}

export default OnSale;