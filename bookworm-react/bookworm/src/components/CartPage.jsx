import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Form, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const ShoppingCart = () => {
    const { id } = useParams()
    const [orderItems, setOrderItems] = useState(null)
    const [cartTotal, setCartTotal] = useState(0)

    const handlePlaceOrder = async () => {
        let user_id = localStorage.getItem("user_id")
        if (!user_id) {
            alert("Please login to place order")
            return

        }
        alert()
    }

    const increaseQty = (bookId) => {
        setOrderItems(prevItems =>
            prevItems.map(item =>
                item.book_id === bookId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
        let cartTotal = orderItems?.reduce((acc, item) => acc + ((item.price - item.discount_price) * item.quantity || 0), 0);
        setCartTotal(cartTotal);
    };

    const decreaseQty = (bookId) => {
        setOrderItems(prevItems =>
            prevItems.map(item =>
                item.book_id === bookId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
        let cartTotal = orderItems?.reduce((acc, item) => acc + ((item.price - item.discount_price) * item.quantity || 0), 0);
        setCartTotal(cartTotal);
    };


    useEffect(() => {
        const fetchOrderItems = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8003/cart/${id}`);
                const data = await res.json();
                setOrderItems(data);
            } catch (err) {
                console.error("Failed to fetch books", err);
            }
        };
        fetchOrderItems()
    }, []);

    // useEffect(() => {

    // }, [cartTotal])

    return (
        <Container className="mt-5" >
            <h5 className="mb-4 fw-bold">Your cart: {orderItems ? orderItems.length : 0} items</h5>
            <hr />
            <Row>
                <Col md={8}>
                    <Table striped bordered hover responsive style={{ verticalAlign: "middle", textAlign: "center" }}>
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
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={orderItem.book_cover_photo}
                                                    alt="Book"
                                                    className="me-3"
                                                    style={{ width: '80px', height: '100px' }}
                                                />
                                                <div>
                                                    <strong>{orderItem.book_title}</strong>
                                                    <p className="mb-0">{orderItem.author_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                {orderItem.has_discount ? (
                                                    <>
                                                        <span className="fw-bold">${Number(orderItem.price - orderItem.discount_price).toFixed(2)}</span>
                                                        <br />
                                                        <span className="text-decoration-line-through">${Number(orderItem.price).toFixed(2)}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="fw-bold">${Number(orderItem.price).toFixed(2)}</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td >
                                            <div className="d-flex justify-content-center align-items-center">
                                                <Button variant="outline-secondary" size="sm" style={{ width: "30px" }} onClick={() => decreaseQty(orderItem.book_id)}>-</Button>
                                                <span className="" style={{ minWidth: "24px" }}>{orderItem.quantity}</span>
                                                <Button variant="outline-secondary" size="sm" style={{ width: "30px" }} onClick={() => increaseQty(orderItem.book_id)}>+</Button>
                                            </div>
                                        </td>
                                        <td className="fw-bold">${Number(orderItem.quantity * orderItem.price).toFixed(2)}</td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </Table>
                </Col>

                <Col md={4}>
                    <Card className="pb-5">
                        <div className="bg-light border p-3 mb-3">
                            <h6 className="mb-0 text-center fw-bold">
                                Cart Totals
                            </h6>
                        </div>

                        <div className="mb-3 px-5 w-100">
                            <div className="p-3 mb-3">
                                <h2 className="mb-0 text-center fw-bold">
                                    ${cartTotal ? cartTotal.toFixed(2) : 0}
                                </h2>
                            </div>
                        </div>

                        <div className="px-5 w-100">
                            <Button variant="secondary" className="w-100 mt-2" onClick={handlePlaceOrder}>
                                Place order
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ShoppingCart;