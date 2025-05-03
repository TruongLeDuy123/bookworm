import React from 'react';
import { Button, Card } from 'react-bootstrap';

const PriceAndQuantity = ({ book, bookData, quantity, increaseQty, decreaseQty, handleAddNumber }) => {
    return (
        <Card className="h-100 pb-5">
            <div className="bg-light border rounded p-3 mb-3 text-center">
                <h6 className="mb-0">
                    {book.has_discount ? (
                        <>
                            <span className="text-muted text-decoration-line-through me-2">${Number(bookData.book_price).toFixed(2)}</span>
                            <strong className="text-danger">${Number(book.discount_price).toFixed(2)}</strong>
                        </>
                    ) : (
                        <strong>${Number(bookData.book_price).toFixed(2)}</strong>
                    )}
                </h6>
            </div>

            <div className="mb-3 px-3">
                <label className="form-label fw-bold">Quantity</label>
                <div className="d-flex align-items-center justify-content-between border rounded">
                    <Button variant="light" onClick={decreaseQty}>−</Button>
                    <div className="px-3">{quantity}</div>
                    <Button variant="light" onClick={increaseQty}>+</Button>
                </div>
            </div>

            <div className="px-3">
                <Button variant="secondary" className="w-100 mt-2" onClick={handleAddNumber}>
                    Add to cart
                </Button>
            </div>
        </Card>
    );
};

export default PriceAndQuantity;