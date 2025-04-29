import { Pagination } from 'react-bootstrap';

const BookPagination = ({ currentPage, total, limit, onPageChange }) => {
    const totalPages = Math.ceil(total / limit);
    if (total === 0) return null;

    const getVisiblePages = () => {
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
