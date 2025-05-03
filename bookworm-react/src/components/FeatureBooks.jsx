import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Row, Col } from 'react-bootstrap';
import BookCard from './BookCard';
import BookCarousel from './BookCarousel';

export default function FeaturedBooks() {
    const [key, setKey] = useState('recommended');
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [popularBooks, setPopularBooks] = useState([]);
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const resRecommended = await fetch("http://127.0.0.1:8002/books/top-rated-recommended");
                const dataRec = await resRecommended.json();
                const resPopular = await fetch("http://127.0.0.1:8002/books/top-reviewed-popular");
                const dataPop = await resPopular.json();
                console.log("check datarec: ", dataRec);
                console.log("check datapop: ", dataPop);
                setRecommendedBooks(dataRec);
                setPopularBooks(dataPop);
            } catch (err) {
                console.error("Failed to fetch books", err);
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
                    <div className='border rounded shadow-sm p-3 bg-white'>
                        <div className="d-flex justify-content-center mx-2 mx-sm-3 mx-md-4 mx-lg-5">
                            <BookCarousel group={recommendedBooks} />
                        </div>
                    </div>
                </Tab>

                <Tab eventKey="popular" title="Popular">
                    <div className='border rounded shadow-sm p-3 bg-white'>
                        <div className="d-flex justify-content-center mx-2 mx-sm-3 mx-md-4 mx-lg-5">
                            <BookCarousel group={popularBooks} />
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </Container>
    );
}
