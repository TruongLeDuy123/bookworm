import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';

const PriceAndQuantity = ({ book, bookData, quantity, increaseQty, decreaseQty, handleAddNumber }) => {
    const { currency, exchangeRate } = useCurrency();
    return (
        <Card className="h-100 pb-5">
            <div className="bg-light border rounded p-3 mb-3 text-center">
                <h6 className="mb-0">
                    {book.has_discount ? (
                        <>
                            <span className="text-muted text-decoration-line-through me-2">{formatCurrency(bookData.book_price, currency, exchangeRate)}</span>
                            <strong className="text-danger">{formatCurrency(book.discount_price, currency, exchangeRate)}</strong>
                        </>
                    ) : (
                        <strong>{formatCurrency(bookData.book_price, currency, exchangeRate)}</strong>
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