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
            // Trên mobile: chỉ hiển thị trang đầu, hiện tại, cuối (nếu cần)
            const pages = [];
            if (currentPage > 2) pages.push(1, '...');
            if (currentPage !== 1 && currentPage !== totalPages) pages.push(currentPage);
            if (currentPage < totalPages - 1) pages.push('...', totalPages);
            // Nếu chỉ có 1 trang hoặc đang ở đầu/cuối thì chỉ hiển thị trang đó
            if (currentPage === 1) pages.unshift(1);
            if (currentPage === totalPages && totalPages !== 1) pages.push(totalPages);
            // Loại bỏ trùng lặp
            return [...new Set(pages)];
        }

        const pages = [];

        if (totalPages <= 7) {
            // Nếu tổng số trang <= 7, hiển thị tất cả các trang
            return [...Array(totalPages)].map((_, i) => i + 1);
        }

        // Luôn hiển thị trang đầu tiên
        pages.push(1);

        // Hiển thị "..." nếu trang hiện tại quá xa trang đầu tiên
        if (currentPage > 3) pages.push("...");

        // Tính các trang xung quanh trang hiện tại
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            // Kiểm tra xem trang đã được thêm vào chưa để tránh lặp lại
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }

        // Hiển thị "..." nếu trang hiện tại quá xa trang cuối
        if (currentPage < totalPages - 2) pages.push("...");

        // Luôn hiển thị trang cuối cùng
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
