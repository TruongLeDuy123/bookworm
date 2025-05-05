import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useFetchBooks from '../hooks/useFetchBooks';
import { LoadingSpinner, EmptyState } from './UIComponents';
import "./Carousel.css";
import BookCardCarousel from './BookCardCarousel';

const PrevArrow = ({ onClick }) => (
    <div className={`custom-arrow prev-arrow`} onClick={onClick} />
);

const NextArrow = ({ onClick }) => (
    <div className={`custom-arrow next-arrow`} onClick={onClick} />
);

const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 900,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

const OnSale = () => {
    const { data: books, loading, error } = useFetchBooks("http://127.0.0.1:8002/books/top-discount");

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
                    <Slider {...sliderSettings}>
                        {books.map((group, idx) => (
                            <div key={idx} className=''>
                                <BookCardCarousel book={group} />
                            </div>
                        ))}
                    </Slider>
                </div>
            ) : (
                <EmptyState message="No books on sale." />
            )}
        </Container>
    );
};

export default OnSale;
