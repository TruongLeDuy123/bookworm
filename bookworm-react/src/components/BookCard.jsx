// import React from 'react';
// import { Card } from 'react-bootstrap';

// function BookCard({ book }) {
//     return (
//         <Card className="h-100">
//             <Card.Img variant="top" src={book.book_img} />
//             <Card.Body>
//                 <Card.Title style={{ fontSize: '1rem' }}>{book.book_title}</Card.Title>
//                 <Card.Text className="text-muted mb-1">{book.author_name}</Card.Text>
//                 <Card.Text className="text-muted">
//                     {book.book_price - book.final_price > 0 ? (
//                         <>
//                             <span className="text-muted text-decoration-line-through me-2">
//                                 ${Number(book.book_price).toFixed(2)}
//                             </span>
//                             <strong>${Number(book.final_price).toFixed(2)}</strong>
//                         </>
//                     ) : (
//                         <strong>
//                             ${Number(book.book_price).toFixed(2)}
//                         </strong>
//                     )}
//                 </Card.Text>
//             </Card.Body>
//         </Card>
//     );
// }
// export default BookCard;



import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    // console.log("tr: ", book);
    
    return (
        <Col xs={6} md={3}>
            <Link to={`/book/${book.book_id}`} className="text-decoration-none text-dark">
                <Card style={{ height: '100%' }}>
                    <Card.Img variant="top" src=
                        // {book.book_img} 
                        "https://res.cloudinary.com/dfwr3z0ls/image/upload/v1733227995/bouhsa0hcabyl1gq7h0i.png"
                    />
                    <Card.Body className="d-flex flex-column justify-content-between" style={{ height: '100%' }}>
                        <Card.Title style={{ fontSize: '1rem', minHeight: '3em' }}>{book.book_title}</Card.Title>
                        <Card.Text className="text-muted" style={{ fontSize: '0.9rem', minHeight: '1.5em' }}>
                            {book.author_name}
                        </Card.Text>
                        <Card.Text className="mt-auto">
                            {book.discount_amount > 0 ? (
                                <>
                                    <span className="text-muted text-decoration-line-through me-2">
                                        ${Number(book.book_price).toFixed(2)}
                                    </span>
                                    <strong>${Number(book.discount_price).toFixed(2)}</strong>
                                </>
                            ) : (
                                <strong>${Number(book.book_price).toFixed(2)}</strong>
                            )}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Link>
        </Col>
    );
};

export default BookCard;
