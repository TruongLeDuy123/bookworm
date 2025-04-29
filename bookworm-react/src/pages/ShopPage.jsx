import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BookCarousel from '../components/BookCarousel';
import FilterSidebar from '../components/FilterSideBar';
import BookHeader from '../components/BookHeader';
import BookPagination from '../components/BookPagination';

const ShopPage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [books, setBooks] = useState([]);
    const [totalBooks, setTotalBooks] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [categoriesName, setCategoriesName] = useState([]);
    const [authorsName, setAuthorsName] = useState([]);
    const [nameFilter, setNameFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [authorFilter, setAuthorFilter] = useState("");
    const [starFilter, setStarFilter] = useState("");
    const [selectIdCategory, setSelectIdCategory] = useState(null);
    const [selectIdAuthor, setSelectIdAuthor] = useState(null);
    const [sortOption, setSortOption] = useState("on_sale");
    const [selectedStar, setSelectedStar] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                let url = `http://127.0.0.1:8002/books/pagination/?skip=${(page - 1) * limit}&limit=${limit}&sort=${sortOption}`;
                let url_count = `http://127.0.0.1:8002/books/count?`;
                
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
                const data = await fetch(url);
                const res = await data.json();
                const data_count = await fetch(url_count);
                const res1 = await data_count.json();
                setBooks(res);
                setTotalBooks(res1.count);
            } catch (e) {
                console.error('Error fetching books:', e);
            }
        };
        fetchBooks();
    }, [page, limit, selectIdCategory, selectIdAuthor, selectedStar, sortOption]);

    useEffect(() => {
        const arrayFilter = [];
        if (categoryFilter) arrayFilter.push(categoryFilter);
        if (authorFilter) arrayFilter.push(authorFilter);
        if (starFilter) arrayFilter.push(starFilter);
        setNameFilter(arrayFilter.join(' - '));
    }, [categoryFilter, authorFilter, starFilter]);

    useEffect(() => {
        const fetchAllCategoriesName = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8002/categories`);
                const data = await response.json();
                setCategoriesName(data);
            } catch (e) {
                console.error("Failed to fetch categories name", e);
            }
        };

        const fetchAllAuthorsName = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8002/authors`);
                const data = await response.json();
                setAuthorsName(data);
            } catch (e) {
                console.error("Failed to fetch authors name", e);
            }
        };

        fetchAllCategoriesName();
        fetchAllAuthorsName();
    }, []);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleLimitChange = (e) => {
        setLimit(Number(e.target.value));
        setPage(1);
    };

    const handleSelectedAuthor = (id, author_name, author_id) => {
        setSelectedAuthor(id);
        setAuthorFilter(author_name);
        setPage(1);
        setSelectIdAuthor(author_id);
    };

    const handleSelectedCategory = (id, category_name, category_id) => {
        setSelectedCategory(id);
        setCategoryFilter(category_name);
        setPage(1);
        setSelectIdCategory(category_id);
    };

    const handleSelectedStar = (id) => {
        setSelectedStar(id);
        setPage(1);
        setStarFilter(id + " stars");
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setPage(1);
    };

    return (
        <Container className="mt-4">
            <h5 className="fw-bold">
                Books <span className="fw-light fs-6">(Filtered by {nameFilter || "All"})</span>
            </h5>
            <hr />

            <Row className="flex-column-reverse flex-md-row">
                {/* Sidebar - nằm trên mobile, nằm trái desktop */}
                <Col xs={12} md={3} className="mb-4 mb-md-0">
                    <FilterSidebar
                        categoriesName={categoriesName}
                        authorsName={authorsName}
                        selectedCategory={selectedCategory}
                        selectedAuthor={selectedAuthor}
                        selectedStar={selectedStar}
                        handleSelectedCategory={handleSelectedCategory}
                        handleSelectedAuthor={handleSelectedAuthor}
                        handleSelectedStar={handleSelectedStar}
                    />
                </Col>

                {/* Main content */}
                <Col xs={12} md={9}>
                    <BookHeader
                        page={page}
                        limit={limit}
                        totalBooks={totalBooks}
                        handleSortChange={handleSortChange}
                        handleLimitChange={handleLimitChange}
                        nameFilter={nameFilter}
                    />

                    <div className="mt-5">
                        <BookCarousel group={books} />
                    </div>

                    <div className="d-flex justify-content-center mt-5">
                        <BookPagination
                            currentPage={page}
                            total={totalBooks}
                            limit={limit}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ShopPage;
