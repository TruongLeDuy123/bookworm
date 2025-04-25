import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Form, Dropdown, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';

const BookDetailPage = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [bookData, setBookData] = useState(null);
    const [book, setBook] = useState(null);
    const increaseQty = () => setQuantity(prev => prev + 1 === 9 ? 8 : prev + 1);
    const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const [currentPage, setCurrentPage] = useState(1);
    const totalReviews = 3134;
    const reviewsPerPage = 12;

    const totalPages = Math.ceil(totalReviews / reviewsPerPage);

    useEffect(() => {
        const fetchInfoBook = async () => {
            try {
                let dataBook = await fetch(`http://127.0.0.1:8001/book/${id}`);
                let res = await dataBook.json();
                setBookData(res);
                console.log("check book data: ", res);

            } catch (e) {
                console.log("Failed to fetch book info", e);
            }
        };
        const fetchDetailBook = async () => {
            try {
                let book = await fetch(`http://127.0.0.1:8001/book-has-discount/${id}`);
                let res = await book.json();
                setBook(res);
                console.log("check detail: ", res); 

            } catch (e) {
                console.log("Failed to fetch book", e);
            }
        };
        fetchInfoBook();
        fetchDetailBook()
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAddNumber = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find((item) => item.book_id === id);

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ 
                book_id: id, 
                quantity: quantity, 
                book_price: bookData.book_price, 
                price: book.has_discount ? book.discount_price: bookData.book_price,
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

    return (
        <Container className="mt-5">
            <h5 className="mb-4 fw-bold">{bookData.category.category_name}</h5>
            <hr />
            <Row>
                <Col md={8}>
                    <Card className="border">
                        <Row>
                            {/* Book Image chiếm 3/12 */}
                            <Col md={3}>
                                <div>
                                    <img
                                        src="https://res.cloudinary.com/dfwr3z0ls/image/upload/v1733227995/bouhsa0hcabyl1gq7h0i.png"
                                        // {bookData.book_cover_photo}

                                        alt="Book"
                                        className="img-fluid"
                                    />
                                </div>
                                <Card.Text className="text-muted mt-3 p-2">
                                    By <span className="fw-bold">{bookData.author.author_name}</span>
                                </Card.Text>
                            </Col>

                            {/* Book Info chiếm 9/12 */}
                            <Col md={9}>
                                <Card.Body>
                                    <Card.Title className="fw-bold">{bookData.book_title}</Card.Title>
                                    <Card.Text className="mb-2">
                                        {bookData.book_summary}
                                    </Card.Text>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Right Side: Price & Quantity */}
                <Col md={4}>
                    <Card className="pb-5">
                        {/* Phần giá */}
                        <div className="bg-light border rounded ps-5 p-3 mb-3">
                            <h6 className="mb-0">
                                {book.has_discount ?
                                    (
                                        <>
                                            <span className="text-muted text-decoration-line-through me-2">${Number(bookData.book_price).toFixed(2)}</span>
                                            <strong>${Number(book.discount_price).toFixed(2)}</strong>
                                        </>
                                    ) :
                                    (
                                        <strong>${Number(bookData.book_price).toFixed(2)}</strong>
                                    )
                                }

                            </h6>
                        </div>

                        <div className="mb-3 px-5 w-100">
                            <label className="form-label fw-bold">Quantity</label>
                            <div className="d-flex align-items-center justify-content-between border rounded w-100">
                                <Button variant="light" className="" onClick={decreaseQty}>−</Button>
                                <div className="px-3">{quantity}</div>
                                <Button variant="light" className="" onClick={increaseQty}>+</Button>
                            </div>
                        </div>

                        <div className="px-5 w-100">
                            <Button variant="secondary" className="w-100 mt-2" onClick={handleAddNumber}>
                                Add to cart
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
            <br />

            <Row>
                <Col md={8}>
                    <Card className="p-4 border">
                        <h5 className="fw-bold mb-2">Customer Reviews <span className="fw-normal">(Filtered by 5 star)</span></h5>

                        <div className="d-flex align-items-center mb-3">
                            <h3 className="fw-bold mb-0 me-2">4.6</h3>
                            <span>Star</span>
                        </div>

                        <div className="mb-3">
                            <span className="me-2 text-primary" style={{ cursor: "pointer" }}>(3,134)</span>
                            <span className="me-2 text-primary">5 star (200)</span>
                            <span className="me-2 text-primary">4 star (100)</span>
                            <span className="me-2 text-primary">3 star (20)</span>
                            <span className="me-2 text-primary">2 star (5)</span>
                            <span className="text-primary">1 star (0)</span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                Showing {(currentPage - 1) * reviewsPerPage + 1}–{Math.min(currentPage * reviewsPerPage, totalReviews)} of {totalReviews} reviews
                            </div>
                            <div className="d-flex gap-2">
                                <Dropdown>
                                    <Dropdown.Toggle variant="secondary" size="sm">
                                        Sort by on sale
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Sort by date: newest to oldest</Dropdown.Item>
                                        <Dropdown.Item>Sort by date: oldest to newest</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                                <Dropdown>
                                    <Dropdown.Toggle variant="secondary" size="sm">
                                        Show 20
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Show 12</Dropdown.Item>
                                        <Dropdown.Item>Show 20</Dropdown.Item>
                                        <Dropdown.Item>Show 50</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Sample Review Item */}
                        <div className="mb-4">
                            <h6 className="fw-bold mb-1">Review Title <span className="fw-normal">| 5 stars</span></h6>
                            <p className="mb-1 text-muted">Review content. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <small className="text-muted">April 12, 2021</small>
                        </div>

                        <hr />

                        <div className="mb-4">
                            <h6 className="fw-bold mb-1">Amazing Story! You will LOVE it <span className="fw-normal">| 5 stars</span></h6>
                            <p className="mb-1 text-muted">Such an incredibly complex story! I had to buy it because there was a waiting list of 30+ at the local library for this book. Thrilled that I made the purchase</p>
                            <small className="text-muted">April 12, 2021</small>
                        </div>

                        <hr />

                        {/* Pagination */}
                        <Pagination className="justify-content-center">
                            <Pagination.Prev />
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === currentPage}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            )).slice(0, 5)} {/* chỉ hiển thị 5 trang đầu tiên */}
                            <Pagination.Next />
                        </Pagination>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="border">
                        <h5 className="fw-bold ps-4 pt-4">Write a Review</h5>
                        <hr className="w-100" />

                        <Form className='pb-4'>
                            <Form.Group className="px-4 mb-3">
                                <Form.Label>Add a title</Form.Label>
                                <Form.Control type="text" placeholder="Enter review title" required maxLength={120} />
                            </Form.Group>

                            <Form.Group className="px-4 mb-3">
                                <Form.Label>Details please! Your review helps other shoppers.</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Write your review here..." />
                            </Form.Group>

                            <Form.Group className="px-4 mb-4">
                                <Form.Label>Select a rating star</Form.Label>
                                <Form.Select>
                                    <option>1 Star</option>
                                    <option>2 Stars</option>
                                    <option>3 Stars</option>
                                    <option>4 Stars</option>
                                    <option>5 Stars</option>
                                </Form.Select>
                            </Form.Group>

                            <hr className="w-100" />
                            <div className=' px-5'>
                                <Button
                                    variant="secondary"
                                    className="w-100 fw-bold"
                                    type="submit"
                                >
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
