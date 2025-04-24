// import {React, useState} from 'react';

// const BookPagination = ({ currentPage, totalBooks, limit, onPageChange }) => {
//     const totalPages = Math.ceil(totalBooks / limit);
//     const [arrayVisiblePages, setArrayVisiblePages] = useState([])
//     if (totalPages <= 1) return null;

//     const getVisiblePages = () => {
//         const pages = [];

//         if (totalPages <= 7) {
//             return [...Array(totalPages)].map((_, i) => i + 1);
//         }

//         pages.push(1); // always show first page

//         if (currentPage > 3) pages.push("...");

//         const start = Math.max(2, currentPage - 1);
//         const end = Math.min(totalPages - 1, currentPage + 1);

//         for (let i = start; i <= end; i++) {
//             pages.push(i);
//         }

//         if (currentPage < totalPages - 2) pages.push("...");

//         pages.push(totalPages); // always show last page
//         // console.log("check paginate: ", pages);
//         return pages;
//     };

//     const visiblePages = getVisiblePages();
//     // setArrayVisiblePages(visiblePages)

//     return (
//         <div className="flex justify-center mt-6">
//             <nav className="inline-flex items-center text-sm">
//                 {/* Prev */}
//                 <button
//                     onClick={() => onPageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className={`px-3 py-1 border border-r-0 first:rounded-l-md transition ${currentPage === 1
//                             ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                             : 'hover:bg-blue-100'
//                         }`}
//                 >
//                     Previous
//                 </button>

//                 {/* Pages */}
//                 {visiblePages.map((page, index) =>
//                     page === "..." ? (
//                         <span key={index} className="px-3 py-1 border border-r-0 text-gray-400 select-none">
//                             ...
//                         </span>
//                     ) : (
//                         <button
//                             key={page}
//                             onClick={() => onPageChange(page)}
//                             className={`px-3 py-1 border border-r-0 transition ${currentPage === page
//                                     ? 'bg-blue-500 text-white'
//                                     : 'hover:bg-blue-100'
//                                 }`}
//                         >
//                             {page}
//                         </button>
//                     )
//                 )}

//                 {/* Next */}
//                 <button
//                     onClick={() => onPageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className={`px-3 py-1 border last:rounded-r-md transition ${currentPage === totalPages
//                             ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                             : 'hover:bg-blue-100'
//                         }`}
//                 >
//                     Next    
//                 </button>
//             </nav>
//         </div>
//     );
// };

// export default BookPagination;

// components/PaginationControl.jsx
import { Pagination } from 'react-bootstrap';

const BookPagination = ({ currentPage, totalBooks, limit, onPageChange }) => {
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

export default BookPagination;
