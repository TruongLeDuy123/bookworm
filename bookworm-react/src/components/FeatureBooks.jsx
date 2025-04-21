import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Row, Col } from 'react-bootstrap';
import BookCard from './BookCard';

export default function FeaturedBooks() {
    const [key, setKey] = useState('recommended');
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [popularBooks, setPopularBooks] = useState([]);
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const resRecommended = await fetch("http://127.0.0.1:8002/books/top-rated-recommended");
                const dataRec = await resRecommended.json();
                const resPopular = await fetch("http://127.0.0.1:8002/books/top-reviewed-poplular");
                const dataPop = await resPopular.json();
                setRecommendedBooks(dataRec);
                setPopularBooks(dataPop);
            } catch (err) {
                console.error("Failed to fetch books", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [])
    return (
        <Container className="my-5">
            <h4 className="text-center mb-4">Featured Books</h4>

            <Tabs
                id="featured-books-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="justify-content-center mb-4"
                variant="pills"
            >
                <Tab eventKey="recommended" title="Recommended">
                    <Row>
                        {recommendedBooks.map((book, idx) => (
                            <Col key={idx} xs={6} md={4} lg={3} xl={3} className="mb-4">
                                <BookCard book={book} />
                            </Col>
                        ))}
                    </Row>
                </Tab>

                <Tab eventKey="popular" title="Popular">
                    <Row>
                        {popularBooks.map((book, idx) => (
                            <Col key={idx} xs={6} md={4} lg={3} xl={3} className="mb-4">
                                <BookCard book={book} />
                            </Col>
                        ))}
                    </Row>
                </Tab>
            </Tabs>
        </Container>
    );
}
