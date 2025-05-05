import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Form, Dropdown, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';
import BookPagination from '../components/BookPagination';
import ReviewForm from '../components/ReviewForm';
import BookInfo from '../components/BookInfo';
import PriceAndQuantity from '../components/PriceAndQuantity';
import { ReviewHeader, ReviewFilters, ReviewList } from '../components/ReviewComponents';

const BookDetailPage = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [bookData, setBookData] = useState(null);
    const [book, setBook] = useState(null);
    const [totalReviews, setTotalReviews] = useState(0)
    const [totalReviewsByStar, setTotalReviewsByStar] = useState(0)
    const [avgStar, setAvgStar] = useState(0)
    const [arrayStar, setArrayStar] = useState([0, 0, 0, 0, 0])

    const [title, setTitle] = useState('')
    const [detail, setDetail] = useState('')
    const [rating, setRating] = useState("1")

    const [arrayReview, setArrayReview] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const [sortOption, setSortOption] = useState("desc");

    const [starFilter, setStarFilter] = useState("");
    const [selectedStar, setSelectedStar] = useState(null);

    const [checkTotal, setCheckTotal] = useState(true);

    const increaseQty = () => setQuantity(prev => prev + 1 === 9 ? 8 : prev + 1);
    const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const fetchAllReviews = async () => {
        try {
            let url = `http://127.0.0.1:8002/reviews/pagination/?book_id=${+id}&skip=${(currentPage - 1) * limit}&limit=${limit}&sort=${sortOption}`
            if (selectedStar !== null) url += `&rating=${selectedStar}`
            let res = await (await fetch(url)).json();
            setArrayReview(res.reviews)
            setTotalReviewsByStar(res.total)
        } catch (e) {
            console.log("Failed to fetch all reviews", e);
        }
    }

    useEffect(() => {
        fetchAllReviews()
    }, [currentPage, limit, selectedStar, sortOption])

    const fetchReview = async () => {
        try {
            let dataReview = await fetch(`http://127.0.0.1:8002/reviews/statistics/${+id}`);
            let res = await dataReview.json();
            setTotalReviews(res.total_reviews);
            setAvgStar(res.average_rating)
            setArrayStar([res.review_counts.one_star, res.review_counts.two_star, res.review_counts.three_star, res.review_counts.four_star, res.review_counts.five_star])
        } catch (e) {
            console.log("Failed to fetch review", e);
        }
    }

    useEffect(() => {
        fetchReview()
    }, [])

    useEffect(() => {
        const fetchInfoBook = async () => {
            try {
                let dataBook = await fetch(`http://127.0.0.1:8002/book/${+id}`);
                let res = await dataBook.json();
                setBookData(res);
            } catch (e) {
                console.log("Failed to fetch book info", e);
            }
        };

        const fetchDetailBook = async () => {
            try {
                let book = await fetch(`http://127.0.0.1:8002/book-has-discount/${+id}`);
                let res = await book.json();
                setBook(res);
            } catch (e) {
                console.log("Failed to fetch book", e);
            }
        };
        fetchInfoBook()
        fetchDetailBook()
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAddNumber = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find((item) => item.book_id === +id);

        if (existing) {
            if (existing.quantity + quantity > 8) {
                Swal.fire({
                    icon: 'info',
                    title: 'Số lượng tối đa là 8',
                    confirmButtonText: 'OK'
                });
                return
            }
            existing.quantity += quantity;
        } else {
            cart.push({
                book_id: +id,
                quantity: quantity,
                book_price: bookData.book_price,
                price: book.has_discount ? book.discount_price : bookData.book_price,
                book_cover_photo: bookData.book_cover_photo,
                book_title: bookData.book_title,
                author_name: bookData.author.author_name,
                has_discount: book.has_discount
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        Swal.fire({
            icon: 'success',
            title: 'Thêm sản phẩm vào giỏ hàng thành công!',
            showConfirmButton: true,
            timer: 1500,
            confirmButtonText: 'OK'
        });
        if (!localStorage.getItem("quantity")) localStorage.setItem("quantity", quantity)
        else {
            let currentQuantity = +localStorage.getItem("quantity") + quantity
            localStorage.setItem("quantity", currentQuantity)
        }
        window.dispatchEvent(new Event("cartUpdated"))
    }

    if (!bookData || !book) {
        return <div>Loading...</div>;
    }

    const handleTitle = (e) => {
        const value = e.target.value
        setTitle(value)
    }

    const handleDetail = (e) => {
        const value = e.target.value
        setDetail(value)
    }

    const handleRating = (e) => {
        const value = e.target.value
        setRating(value)
    }

    const handleSelectedStar = (item) => {
        setCheckTotal(false)
        setSelectedStar(item);
        setCurrentPage(1);
        setStarFilter(item + " star");
    };

    const handleLimitChange = (e) => {
        setLimit(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setCurrentPage(1);
    };

    const handleTotalReviews = () => {
        setCheckTotal(true)
        setCurrentPage(1);
        setSelectedStar(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("http://127.0.0.1:8002/create-reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    book_id: +id,
                    review_title: title,
                    review_details: detail,
                    rating_start: rating
                })
            });

            const data = await response.json();
            console.log(data);
            Swal.fire({
                icon: 'success',
                title: 'Thêm review thành công!',
                showConfirmButton: true,
                timer: 5000,
                confirmButtonText: 'OK'
            }).then(() => {
                fetchAllReviews()
                fetchReview()
                setTitle('')
                setDetail('')
                setRating('1')
            })
        } catch (err) {
            alert("err")
        }
    }

    return (
        <Container className="mt-5">
            <h5 className="mb-4 fw-bold">{bookData.category.category_name}</h5>
            <hr />
            <Row className="gy-4">
                <Col xs={12} md={8}>
                    <BookInfo bookData={bookData} />
                </Col>

                {/* Right Side: Price & Quantity */}
                <Col xs={12} md={4}>
                    <PriceAndQuantity book={book} bookData={bookData} quantity={quantity} increaseQty={increaseQty} decreaseQty={decreaseQty} handleAddNumber={handleAddNumber} />
                </Col>
            </Row>

            <br />

            <Row className="gy-4 mt-4">
                {/* Left Section - Customer Reviews */}
                <Col xs={12} lg={8}>
                    <Card className="p-4 border h-100">
                        <ReviewHeader
                            avgStar={avgStar}
                            checkTotal={checkTotal}
                            starFilter={starFilter}
                            totalReviews={totalReviews}
                            handleTotalReviews={handleTotalReviews}
                            selectedStar={selectedStar}
                            handleSelectedStar={handleSelectedStar}
                            arrayStar={arrayStar}
                        />

                        <ReviewFilters
                            currentPage={currentPage}
                            limit={limit}
                            totalReviewsByStar={totalReviewsByStar}
                            handleSortChange={handleSortChange}
                            handleLimitChange={handleLimitChange}
                        />

                        <ReviewList arrayReview={arrayReview} />

                        <div className="d-flex justify-content-center mt-4">
                            <BookPagination
                                currentPage={currentPage}
                                total={totalReviewsByStar}
                                limit={limit}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </Card>
                </Col>

                {/* Right Section - Write Review Form */}
                <Col xs={12} lg={4}>
                    <Card className="border h-100 d-flex flex-column">
                        <h5 className="fw-bold ps-4 pt-4">Write a Review</h5>
                        <hr className="w-100" />

                        <ReviewForm
                            title={title}
                            detail={detail}
                            rating={rating}
                            handleTitle={handleTitle}
                            handleDetail={handleDetail}
                            handleRating={handleRating}
                            handleSubmit={handleSubmit}
                        />
                    </Card>
                </Col>
            </Row>

        </Container>
    );
};

export default BookDetailPage;
