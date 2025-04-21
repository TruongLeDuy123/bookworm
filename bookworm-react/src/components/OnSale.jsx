import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Card, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import "./OnSale.css";

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
                            <Row className="gx-4 ">
                                {group.map(book => (
                                    <Col key={book.id} xs={6} md={3} >
                                        <Link to={`/book/${book.book_id}`} key={book.book_id} className="text-decoration-none text-dark">
                                            <Card style={{ minHeight: '100%' }}>
                                                <Card.Img variant="top" src="" />
                                                <Card.Body>
                                                    <Card.Title style={{ fontSize: '1rem' }}>{book.book_title}</Card.Title>
                                                    <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>
                                                        {book.author_name}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        {book.total_discount > 0 ?
                                                            (
                                                                <>
                                                                    <span className="text-muted text-decoration-line-through me-2">
                                                                        ${Number(book.book_price).toFixed(2)}
                                                                    </span>
                                                                    <strong>${Number(book.final_price).toFixed(2)}</strong>
                                                                </>
                                                            ) :
                                                            (
                                                                <strong>
                                                                    ${Number(book.book_price).toFixed(2)}
                                                                </strong>
                                                            )
                                                        }
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <p>No books on sale.</p>
            )}
        </Container>
    )
}

export default OnSale;