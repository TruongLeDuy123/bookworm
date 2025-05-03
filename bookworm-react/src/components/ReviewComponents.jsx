import React from 'react';

const ReviewHeader = ({ avgStar, checkTotal, starFilter, totalReviews, handleTotalReviews, selectedStar, handleSelectedStar, arrayStar }) => (
    <div>
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
    </div>
);

const ReviewFilters = ({ currentPage, limit, totalReviewsByStar, handleSortChange, handleLimitChange }) => (
    <div className="d-flex justify-content-between mb-3 flex-wrap gap-3">
        <p className="text-sm text-gray-700">
            Showing {totalReviewsByStar === 0 ? 0 : 1 + (currentPage - 1) * limit}–
            {Math.min(currentPage * limit, totalReviewsByStar)} of {totalReviewsByStar} reviews
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
                onChange={handleSortChange}
                className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto min-w-[200px]"
            >
                <option value="desc">Sort by date: newest to oldest</option>
                <option value="asc">Sort by date: oldest to newest</option>
            </select>

            <select
                onChange={handleLimitChange}
                className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto min-w-[120px]"
            >
                <option value="5">Show 5</option>
                <option value="15">Show 15</option>
                <option value="20">Show 20</option>
                <option value="25">Show 25</option>
            </select>
        </div>
    </div>
);

const ReviewList = ({ arrayReview }) => (
    <div>
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
    </div>
);

export { ReviewHeader, ReviewFilters, ReviewList };