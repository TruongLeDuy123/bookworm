import React from 'react';
import { Accordion } from 'react-bootstrap';

const FilterSideBar = ({
    categoriesName,
    authorsName,
    selectedCategory,
    selectedAuthor,
    selectedStar,
    handleSelectedCategory,
    handleSelectedAuthor,
    handleSelectedStar
}) => {
    return (
        <>
            <p className='fw-bold mt-4'>Filter By</p>

            <Accordion defaultActiveKey="0" className="mb-3">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <span className="fw-bold">Category</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        {categoriesName.map((category, id) => (
                            <p
                                key={category.id}
                                className={`mb-2 text-muted ${selectedCategory === id ? 'fw-bold' : ''}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSelectedCategory(id, category.category_name, category.id)}
                            >
                                {category.category_name}
                            </p>
                        ))}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <Accordion defaultActiveKey="0" className="mb-3">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <span className="fw-bold">Author</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        {authorsName.map((author, id) => (
                            <p
                                key={author.id}
                                className={`mb-2 text-muted ${selectedAuthor === id ? 'fw-bold' : ''}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSelectedAuthor(id, author.author_name, author.id)}
                            >
                                {author.author_name}
                            </p>
                        ))}
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
                            <div key={rating} className={`d-flex align-items-center mb-2 text-muted ${selectedStar === rating ? 'fw-bold' : ''}`}
                                onClick={() => handleSelectedStar(rating)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className="me-2">{rating} stars</span>
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
        </>
    );
};

export default FilterSideBar;
