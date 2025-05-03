import React from "react";
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CartTable = ({ orderItems, increaseQty, decreaseQty }) => {
    return (
        <div className="table-responsive">
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
                                    <Link to={`/book/${orderItem.book_id}`} className="text-decoration-none text-dark">
                                        <div className="d-flex align-items-center">
                                            <img
                                                src="https://res.cloudinary.com/dfwr3z0ls/image/upload/v1733227995/bouhsa0hcabyl1gq7h0i.png"
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
                                                    ${Number(orderItem.price).toFixed(2)}
                                                </span>
                                                <br />
                                                <span className="text-decoration-line-through">
                                                    ${Number(orderItem.book_price).toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="fw-bold">
                                                ${Number(orderItem.price).toFixed(2)}
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
                                <td className="fw-bold">${Number(orderItem.quantity * orderItem.price).toFixed(2)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

export default CartTable;