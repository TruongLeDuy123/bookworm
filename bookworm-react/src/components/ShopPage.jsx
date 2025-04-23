import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Dropdown, Pagination, Accordion } from 'react-bootstrap';
import BookCard from './BookCard';
import { Link } from 'react-router-dom';

const ShopPage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [books, setBooks] = useState([]);
    const [totalBooks, setTotalBooks] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [categoriesName, setCategoriesName] = useState([])
    const [authorsName, setAuthorsName] = useState([])
    const [nameFilter, setNameFilter] = useState([])
    const [categoryFilter, setCategoryFilter] = useState("")
    const [authorFilter, setAuthorFilter] = useState("")
    const [starFilter, setStarFilter] = useState("")
    const [selectIdCategory, setSelectIdCategory] = useState(null)
    const [selectIdAuthor, setSelectIdAuthor] = useState(null)
    const [sortOption, setSortOption] = useState("0")
    const [selectedStar, setSelectedStar] = useState(null)

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                let url = `http://127.0.0.1:8003/books/pagination/?skip=${(page - 1) * limit}&limit=${limit}&sort=${sortOption}`;
                let url_count = `http://127.0.0.1:8003/books/count?`

                if (selectIdCategory !== null) {
                    url += `&category_id=${selectIdCategory}`;
                    url_count += `category_id=${selectIdCategory}`;
                }

                if (selectIdAuthor !== null) {
                    url += `&author_id=${selectIdAuthor}`;
                    url_count += `&author_id=${selectIdAuthor}`;
                }

                if (selectedStar !== null) {
                    url += `&min_rating=${selectedStar}`;
                    url_count += `&min_rating=${selectedStar}`;
                }

                let data = await fetch(url);
                let data_count = await fetch(url_count);
                let res = await data.json();
                let res1 = await data_count.json();
                setBooks(res);
                console.log("check books: ", res);

                setTotalBooks(res1.count)
                setNameFilter(categoryFilter + authorFilter + starFilter)
            }
            catch (e) {
                console.error('Error fetching books:', e);
            }
        }
        fetchBooks()
    }, [page, limit, selectIdCategory, selectIdAuthor, selectedStar, sortOption])

    useEffect(() => {
        const fetchAllCategoriesName = async () => {
            try {
                let allCategoriesName = await fetch(`http://127.0.0.1:8003/categories`);
                let res = await allCategoriesName.json()
                setCategoriesName(res)
            } catch (e) {
                console.log("Failed to fetch categories name", e);
            }
        }

        const fetchAllAuthorsName = async () => {
            try {
                let allAuthorsName = await fetch(`http://127.0.0.1:8003/authors`);
                let res = await allAuthorsName.json()
                setAuthorsName(res)
            } catch (e) {
                console.log("Failed to fetch authors name", e);
            }
        }
        fetchAllCategoriesName()
        fetchAllAuthorsName()
    }, []);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleLimitChange = (event) => {
        setLimit(Number(event.target.value));
    };

    const handleSelectedAuthor = (id, author_name, author_id) => {
        setSelectedAuthor(id)
        setAuthorFilter(author_name)
        setPage(1)
        setSelectIdAuthor(author_id)
    }

    const handleSelectedCategory = (id, category_name, category_id) => {
        setSelectedCategory(id)
        setCategoryFilter(category_name)
        setPage(1)
        setSelectIdCategory(category_id)
    }

    const handleSelectedStar = (id) => {
        setSelectedStar(id)
        setPage(1)
        setStarFilter(id + " stars")
    }

    const handleSortChange = (e) => {
        const sortValue = e.target.value;
        setSortOption(sortValue);
        setPage(1)
    }

    return (
        <Container className="mt-4">
            <h5 className="fw-bold">Books <span className='fw-light fs-6'> (Filtered by {nameFilter})</span></h5>
            <hr />

            <Row>
                {/* Sidebar */}
                <Col md={3}>
                    <p className='fw-bold mt-4'>Filter By</p>
                    <Accordion defaultActiveKey="0" className="mb-3">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <span className="fw-bold">Category</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                {categoriesName.map((category, id) => {
                                    return (
                                        <p
                                            className={`mb-2 text-muted ${selectedCategory === id ? 'fw-bold' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleSelectedCategory(id, category.category_name, category.id)}
                                        >
                                            {category.category_name}
                                        </p>
                                    )
                                })}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion defaultActiveKey="0" className="mb-3">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <span className="fw-bold">Author</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                {authorsName.map((author, id) => {
                                    return (
                                        <p
                                            className={`mb-2 text-muted ${selectedAuthor === id ? 'fw-bold' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleSelectedAuthor(id, author.author_name, author.id)}
                                        >
                                            {author.author_name}
                                        </p>
                                    )
                                })}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion defaultActiveKey="0" className="mb-3">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <span className="fw-bold">Rating Review</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <div key={rating} className={`d-flex align-items-center mb-1 mb-2 text-muted ${selectedStar === rating ? 'fw-bold' : ''}`}
                                        onClick={() => handleSelectedStar(rating)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <span className="me-2">
                                            {rating} stars
                                        </span>
                                        <div>
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} style={{ color: i < rating ? 'orange' : '#ccc' }}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>

                {/* Main content */}
                <Col md={9} className='mt-4'>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <p className="">Showing {1 + (page - 1) * limit}-{Math.min(page * limit, totalBooks)} of {totalBooks} books</p>
                        <div className="d-flex gap-4">
                            <Form.Select size="sm" onChange={handleSortChange} className="w-auto">
                                <option value="0">Sort by on sale</option>
                                <option value="popularity">Sort by popularity</option>
                                <option value="price_asc">Sort by price: low to high</option>
                                <option value="price_desc">Sort by price: high to low</option>
                            </Form.Select>
                            <Form.Select size="sm" onChange={handleLimitChange} className="w-auto">
                                <option value="5">Show 5</option>
                                <option value="15">Show 15</option>
                                <option value="20">Show 20</option>
                                <option value="25">Show 25</option>
                            </Form.Select>
                        </div>
                    </div>

                    <div className="">
                        <Row>
                            {books && books.length ? (
                                books.map((book, idx) => (
                                    <Col key={idx} xs={6} md={4} lg={3} xl={3} className="mb-4">
                                        <Link to={`/book/${book.id}`} key={book.id} className="text-decoration-none text-dark">
                                            <BookCard book={book} />
                                        </Link>
                                    </Col>
                                ))

                            ) : (
                                <Col xs={6} md={4} lg={3} xl={3} className="mb-4">
                                    <p className="text-muted mt-3">No data available</p>
                                </Col>
                            )}
                        </Row>
                    </div>

                    <div className="d-flex justify-content-center">
                        {totalBooks > 0 ? (
                            <Pagination>
                                <Pagination.Prev disabled={page === 1} onClick={() => handlePageChange(page - 1)} />
                                {[...Array(Math.ceil(totalBooks / limit))].map((_, idx) => (
                                    <Pagination.Item
                                        key={idx + 1}
                                        active={page === idx + 1}
                                        onClick={() => handlePageChange(idx + 1)}
                                    >
                                        {idx + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    disabled={page === Math.ceil(totalBooks / limit)}
                                    onClick={() => handlePageChange(page + 1)}
                                />
                            </Pagination>

                        ) : (
                            <></>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ShopPage;



