import React from "react";
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';

const CartTable = ({ orderItems, increaseQty, decreaseQty }) => {
    const { currency, exchangeRate } = useCurrency();
    return (
        <div className="table-responsive">
            {(!orderItems || orderItems.length === 0) ? (
                <div className="text-center py-4 text-muted">No data available</div>
            ) : (
                <Table striped bordered hover responsive="sm" style={{ verticalAlign: "middle", textAlign: "center" }}>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems && orderItems.map((orderItem) => {
                            return (
                                <tr key={orderItem.book_id}>
                                    <td>
                                        <Link to={`/book/${orderItem.book_id}`} className="text-decoration-none text-dark" target="_blank"
                                        >
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={orderItem.book_cover_photo ? "https://nhasachphuongnam.com/images/thumbnails/270/290/detailed/174/Diary_of_a_Wimpy_Kid.jpg" : "https://res.cloudinary.com/dfwr3z0ls/image/upload/v1733227995/bouhsa0hcabyl1gq7h0i.png"}
                                                    alt="Book"
                                                    className="me-3 img-fluid"
                                                    style={{ maxWidth: '80px', maxHeight: '100px' }}
                                                />
                                                <div className="text-start">
                                                    <strong>{orderItem.book_title}</strong>
                                                    <p className="mb-0">{orderItem.author_name}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td>
                                        <div>
                                            {orderItem.has_discount ? (
                                                <>
                                                    <span className="fw-bold">
                                                        {formatCurrency(orderItem.price, currency, exchangeRate)}
                                                    </span>
                                                    <br />
                                                    <span className="text-decoration-line-through">
                                                        {formatCurrency(orderItem.book_price, currency, exchangeRate)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="fw-bold">
                                                    {formatCurrency(orderItem.price, currency, exchangeRate)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <Button variant="outline-secondary" size="sm" style={{ width: "30px" }} onClick={() => decreaseQty(orderItem.book_id)}>-</Button>
                                            <span className="mx-2">{orderItem.quantity}</span>
                                            <Button variant="outline-secondary" size="sm" style={{ width: "30px" }} onClick={() => increaseQty(orderItem.book_id)}>+</Button>
                                        </div>
                                    </td>
                                    <td className="fw-bold">{formatCurrency(orderItem.quantity * orderItem.price, currency, exchangeRate)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default CartTable;