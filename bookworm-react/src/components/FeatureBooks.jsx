import React, { useState } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import BookCarousel from './BookCarousel';
import useFetchBooks from '../hooks/useFetchBooks';
import { LoadingSpinner, EmptyState } from './UIComponents';

export default function FeaturedBooks() {
    const { data: recommendedBooks, loading: loadingRecommended, error: errorRecommended } = useFetchBooks("http://127.0.0.1:8002/books/top-rated-recommended");
    const { data: popularBooks, loading: loadingPopular, error: errorPopular } = useFetchBooks("http://127.0.0.1:8002/books/top-reviewed-popular");

    const [key, setKey] = useState('recommended');

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
                        {loadingRecommended ? (
                            <LoadingSpinner />
                        ) : errorRecommended ? (
                            <EmptyState message={errorRecommended} />
                        ) : (
                            <div className="d-flex justify-content-center mx-2 mx-sm-3 mx-md-4 mx-lg-5">
                                <BookCarousel group={recommendedBooks} />
                            </div>
                        )}
                    </div>
                </Tab>

                <Tab eventKey="popular" title="Popular">
                    <div className='border rounded shadow-sm p-3 bg-white'>
                        {loadingPopular ? (
                            <LoadingSpinner />
                        ) : errorPopular ? (
                            <EmptyState message={errorPopular} />
                        ) : (
                            <div className="d-flex justify-content-center mx-2 mx-sm-3 mx-md-4 mx-lg-5">
                                <BookCarousel group={popularBooks} />
                            </div>
                        )}
                    </div>
                </Tab>
            </Tabs>
        </Container>
    );
}
