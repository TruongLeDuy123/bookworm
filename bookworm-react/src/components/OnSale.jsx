import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Button, Container } from 'react-bootstrap';
import BookCarousel from './BookCarousel';
import useFetchBooks from '../hooks/useFetchBooks';
import { LoadingSpinner, EmptyState } from './UIComponents';
import "./Carousel.css"

const chunk = (arr, size) => {
    return arr.reduce((acc, _, i) => {
        if (i % size === 0) acc.push(arr.slice(i, i + size));
        return acc;
    }, []);
};

const OnSale = () => {
    const { data: books, loading, error } = useFetchBooks("http://127.0.0.1:8003/books/top-discount");
    const chunkedBooks = chunk(books, 4);

    if (loading) return <LoadingSpinner />;
    if (error) return <EmptyState message={error} />;

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>On Sale</h4>
                <Link to="/shop"><Button variant="secondary">View All</Button></Link>
            </div>

            {books.length > 0 ? (
                <div className="border rounded shadow-sm p-3 bg-white position-relative carousel-wrapper">
                    <Carousel indicators={false} nextLabel="" prevLabel="">
                        {chunkedBooks.map((group, idx) => (
                            <Carousel.Item key={idx}>
                                <div className="d-flex justify-content-center mx-2 mx-sm-3 mx-md-4 mx-lg-5">
                                    <BookCarousel group={group} />
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            ) : (
                <EmptyState message="No books on sale." />
            )}

        </Container>
    );
};

export default OnSale;