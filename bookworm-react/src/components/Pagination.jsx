// components/PaginationControl.jsx
import { Pagination } from 'react-bootstrap';

const Pagination = ({ currentPage, totalBooks, limit, onPageChange }) => {
    const totalPages = Math.ceil(totalBooks / limit);

    if (totalBooks === 0) return null;

    return (
        <Pagination>
            <Pagination.Prev disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} />
            {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                    key={idx + 1}
                    active={currentPage === idx + 1}
                    onClick={() => onPageChange(idx + 1)}
                >
                    {idx + 1}
                </Pagination.Item>
            ))}
            <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            />
        </Pagination>
    );
};

export default Pagination;
