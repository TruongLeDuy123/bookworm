import { Pagination } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const BookPagination = ({ currentPage, total, limit, onPageChange }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 576);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.ceil(total / limit);
    if (total === 0) return null;

    const getVisiblePages = () => {
        if (isMobile) {
            const pages = [];
            if (currentPage > 2) pages.push(1, '...');
            if (currentPage !== 1 && currentPage !== totalPages) pages.push(currentPage);
            if (currentPage < totalPages - 1) pages.push('...', totalPages);
            if (currentPage === 1) pages.unshift(1);
            if (currentPage === totalPages && totalPages !== 1) pages.push(totalPages);
            return [...new Set(pages)];
        }

        const pages = [];

        if (totalPages <= 7) {
            return [...Array(totalPages)].map((_, i) => i + 1);
        }

        pages.push(1);

        if (currentPage > 3) pages.push("...");

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }

        if (currentPage < totalPages - 2) pages.push("...");

        pages.push(totalPages);

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <Pagination>
            <Pagination.Prev disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} />
            {visiblePages.map((page, idx) =>
                page === "..." ? (
                    <Pagination.Ellipsis key={`ellipsis-${idx}`} />
                ) : (
                    <Pagination.Item
                        key={`page-${page}`}
                        active={currentPage === page}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </Pagination.Item>
                )
            )}
            <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            />
        </Pagination>
    );
};

export default BookPagination;
