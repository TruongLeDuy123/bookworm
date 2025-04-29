import React from 'react';

const BookHeader = ({ page, limit, totalBooks, handleSortChange, handleLimitChange }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
            <p className="text-sm text-gray-700 mt-1">
                Showing {totalBooks == 0 ? 0: 1 + (page - 1) * limit}-{Math.min(page * limit, totalBooks)} of {totalBooks} books
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <select
                    onChange={handleSortChange}
                    className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="on_sale">Sort by on sale</option>
                    <option value="popularity">Sort by popularity</option>
                    <option value="price_asc">Sort by price: low to high</option>
                    <option value="price_desc">Sort by price: high to low</option>
                </select>

                <select
                    onChange={handleLimitChange}
                    className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="5">Show 5</option>
                    <option value="15">Show 15</option>
                    <option value="20">Show 20</option>
                    <option value="25">Show 25</option>
                </select>
            </div>
        </div>
    );
};

export default BookHeader;
