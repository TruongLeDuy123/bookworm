import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Form, Dropdown, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';
import BookPagination from './BookPagination';

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
            // console.log("CHECK PAGINATION: ", currentPage, limit);
            let url = `http://127.0.0.1:8002/reviews/pagination/?skip=${(currentPage - 1) * limit}&limit=${limit}&sort=${sortOption}`
            if (selectedStar !== null) url += `&rating=${selectedStar}`
            let res = await (await fetch(url)).json();
            setArrayReview(res.reviews)
            // setTotalReviews(res.total)
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
            let dataReview = await fetch(`http://127.0.0.1:8002/reviews/statistics`);
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
                // console.log("check book data: ", res);

            } catch (e) {
                console.log("Failed to fetch book info", e);
            }
        };

        const fetchDetailBook = async () => {
            try {
                let book = await fetch(`http://127.0.0.1:8002/book-has-discount/${+id}`);
                let res = await book.json();
                setBook(res);
                // console.log("check detail: ", res);
            } catch (e) {
                console.log("Failed to fetch book", e);
            }
        };
        fetchInfoBook()
        fetchDetailBook()
        // console.log("check pagi: ", currentPage, totalReviews, limit);

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
                    <Card className="border h-100">
                        <Row className="g-0">
                            {/* Book Image */}
                            <Col xs={12} md={3} className="d-flex flex-column align-items-center p-3">
                                <img
                                    src="https://res.cloudinary.com/dfwr3z0ls/image/upload/v1733227995/bouhsa0hcabyl1gq7h0i.png"
                                    alt="Book"
                                    className="img-fluid w-100 mb-2"
                                    style={{ maxWidth: '150px', objectFit: 'cover' }}
                                />
                                <Card.Text className="text-muted text-center">
                                    By <span className="fw-bold">{bookData.author.author_name}</span>
                                </Card.Text>
                            </Col>

                            {/* Book Info */}
                            <Col xs={12} md={9}>
                                <Card.Body>
                                    <Card.Title className="fw-bold">{bookData.book_title}</Card.Title>
                                    <Card.Text className="mb-2">{bookData.book_summary}</Card.Text>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Right Side: Price & Quantity */}
                <Col xs={12} md={4}>
                    <Card className="h-100 pb-5">
                        {/* Giá */}
                        <div className="bg-light border rounded p-3 mb-3 text-center">
                            <h6 className="mb-0">
                                {book.has_discount ? (
                                    <>
                                        <span className="text-muted text-decoration-line-through me-2">${Number(bookData.book_price).toFixed(2)}</span>
                                        <strong className="text-danger">${Number(book.discount_price).toFixed(2)}</strong>
                                    </>
                                ) : (
                                    <strong>${Number(bookData.book_price).toFixed(2)}</strong>
                                )}
                            </h6>
                        </div>

                        {/* Quantity */}
                        <div className="mb-3 px-3">
                            <label className="form-label fw-bold">Quantity</label>
                            <div className="d-flex align-items-center justify-content-between border rounded">
                                <Button variant="light" onClick={decreaseQty}>−</Button>
                                <div className="px-3">{quantity}</div>
                                <Button variant="light" onClick={increaseQty}>+</Button>
                            </div>
                        </div>

                        {/* Add to cart */}
                        <div className="px-3">
                            <Button variant="secondary" className="w-100 mt-2" onClick={handleAddNumber}>
                                Add to cart
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            <br />

            <Row className="gy-4 mt-4">
                {/* Left Section - Customer Reviews */}
                <Col xs={12} lg={8}>
                    <Card className="p-4 border h-100">
                        <h5 className="fw-bold mb-2">
                            Customer Reviews <span className="fw-normal fs-6">(Filtered by {checkTotal ? 'all' : starFilter})</span>
                        </h5>

                        <div className="d-flex align-items-center mb-3">
                            <h3 className="fw-bold mb-0 me-2">{avgStar.toFixed(1)} Star</h3>
                        </div>

                        <div className="mb-3 text-decoration-underline d-flex flex-wrap gap-2" style={{ cursor: "pointer" }}>
                            <span
                                className={`me-4 ${checkTotal ? 'fw-bold' : ''}`}
                                onClick={() => handleTotalReviews()}
                            >
                                ({totalReviews})
                            </span>
                            {
                                [5, 4, 3, 2, 1].map((item) => (
                                    <span
                                        key={item}
                                        className={`me-2 ${selectedStar === item ? 'fw-bold' : ''}`}
                                        onClick={() => handleSelectedStar(item)}
                                    >
                                        {item} star ({arrayStar[item - 1]}) {item !== 1 ? '| ' : ''}
                                    </span>
                                ))
                            }
                        </div>

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-3">
                            <div>
                                Showing {totalReviewsByStar === 0 ? 0 : 1 + (currentPage - 1) * limit}–{Math.min(currentPage * limit, totalReviewsByStar)} of {totalReviewsByStar} reviews
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <select
                                    onChange={handleSortChange}
                                    className="form-select form-select-sm"
                                >
                                    <option value="desc">Sort by date: newest to oldest</option>
                                    <option value="asc">Sort by date: oldest to newest</option>
                                </select>

                                <select
                                    onChange={handleLimitChange}
                                    className="form-select form-select-sm"
                                >
                                    <option value="5">Show 5</option>
                                    <option value="15">Show 15</option>
                                    <option value="20">Show 20</option>
                                    <option value="25">Show 25</option>
                                </select>
                            </div>
                        </div>

                        {
                            arrayReview?.length > 0 ? (
                                arrayReview.map((review) => (
                                    <div key={review.id}>
                                        <h6 className="fw-bold mb-2 fs-5">{review.review_title}
                                            <span className="fw-normal fs-6"> | {review.rating_start} stars</span>
                                        </h6>
                                        <p className="mb-1 text-break">{review.review_details}</p>
                                        <small>
                                            {new Date(review.review_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </small>
                                        <hr />
                                    </div>
                                ))
                            ) : (
                                <p>No reviews</p>
                            )
                        }

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

                        <Form className="px-4 pb-4" onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Add a title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter review title"
                                    required
                                    maxLength={120}
                                    value={title}
                                    onChange={handleTitle}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Details please! Your review helps other shoppers.</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Write your review here..."
                                    value={detail}
                                    onChange={handleDetail}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Select a rating star</Form.Label>
                                <Form.Select value={rating} onChange={handleRating}>
                                    <option value="1">1 Star</option>
                                    <option value="2">2 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="5">5 Stars</option>
                                </Form.Select>
                            </Form.Group>

                            <hr className="w-100" />
                            <div className="px-1">
                                <Button variant="secondary" className="w-100 fw-bold" type="submit">
                                    Submit Review
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>

        </Container>
    );
};

export default BookDetailPage;
