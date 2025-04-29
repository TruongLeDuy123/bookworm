import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Form, Table, Modal } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const ShoppingCart = () => {
    const { id } = useParams()
    const [orderItems, setOrderItems] = useState(null)
    const [cartTotal, setCartTotal] = useState(0)
    const [quantity, setQuantity] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart")) || []
        setOrderItems(data);
        // console.log("check order: ", data);
    }, []);

    const checkout = async (cart, userId) => {
        const res = await fetch(`http://127.0.0.1:8002/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart, user_id: userId })
        });
        const data = await res.json();
        console.log("check data order: ", data);


        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Đặt hàng thành công!',
                text: 'Bạn sẽ được chuyển về trang chủ trong 10 giây hoặc nhấn OK để chuyển ngay.',
                confirmButtonText: 'OK',
                timer: 10000,
                timerProgressBar: true,
            }).then(() => {
                navigate('/');
            });

            localStorage.removeItem("cart");
            localStorage.removeItem("quantity");
            setOrderItems([]);
            window.dispatchEvent(new Event("cartUpdated"));
        } else {
            if (data.unavailable_books && data.unavailable_books.length > 0) {
                Swal.fire({
                    icon: 'error',
                    text: `Một số sách không còn tồn tại: ${data.unavailable_books.join(", ")}`,
                    confirmButtonText: 'OK',
                    timer: 10000,
                    timerProgressBar: true,
                }).then(() => {
                    const updatedCart = cart.filter(item => !data.unavailable_books.includes(item.book_id));
                    // console.log("check updatecard: ", data, updatedCart);
                    setOrderItems(updatedCart);
                    const updateQuantity = updatedCart.reduce((total, item) => total + item.quantity, 0)
                    localStorage.setItem("cart", JSON.stringify(updatedCart));
                    localStorage.setItem("quantity", updateQuantity)
                    window.dispatchEvent(new Event("cartUpdated"));
                })
            }
        }
    };

    const handlePlaceOrder = async () => {
        let access_token = localStorage.getItem("access_token")
        if (!access_token) {
            setShowLoginModal(true)
            return
        }

        const userId = localStorage.getItem("user_id");
        if (!orderItems || orderItems.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Giỏ hàng trống!',
                confirmButtonText: 'OK'
            });
            return;
        }

        await checkout(orderItems, userId);
    }

    const increaseQty = (bookId) => {
        setOrderItems(prevItems => {
            const updatedItems = prevItems.map(item => {
                if (item.book_id === bookId) {
                    if (item.quantity < 8) {
                        const quantityCart = localStorage.getItem("quantity")
                        localStorage.setItem("quantity", +quantityCart + 1)
                        return { ...item, quantity: item.quantity + 1 };
                    } else {
                        // Swal.fire({
                        //     icon: 'info',
                        //     title: 'Số lượng tối đa là 8',
                        //     confirmButtonText: 'OK'
                        // });
                    }
                }
                return item;
            });
            localStorage.setItem("cart", JSON.stringify(updatedItems));
            window.dispatchEvent(new Event("cartUpdated"))
            return updatedItems;
        });
    };

    const decreaseQty = (bookId) => {
        setOrderItems(prevItems => {
            const updatedItems = prevItems.map(item => {
                if (item.book_id === bookId) {
                    const quantityCart = localStorage.getItem("quantity")
                    localStorage.setItem("quantity", +quantityCart - 1)
                    if (item.quantity > 1) return { ...item, quantity: item.quantity - 1 }
                    return null
                }
                return item
            }).filter(item => item !== null);
            localStorage.setItem("cart", JSON.stringify(updatedItems));
            window.dispatchEvent(new Event("cartUpdated"))
            return updatedItems;
        });
    };

    useEffect(() => {
        if (orderItems) {
            const cartTotal = orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0)
            setCartTotal(cartTotal);
        }
    }, [orderItems]);

    const handleLogin = async (e) => {
        if (!email || !password) {
            setErrors("Please enter both email and password.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8002/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: JSON.stringify(`grant_type=password&username=${email}&password=${password}&scope=&client_id=string&client_secret=string`)
            });

            const data = await response.json();
            console.log("check auth: ", data);


            if (data.detail) {
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng nhập thất bại!',
                    confirmButtonText: 'OK'
                });
                setEmail('')
                setPassword('')
            }
            else {
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công!',
                    showConfirmButton: true,
                    timer: 1500,
                    confirmButtonText: 'OK'
                });
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);
                localStorage.setItem("user_id", data.user_id);
                localStorage.setItem("full_name", data.full_name);
                window.dispatchEvent(new Event("full_name_updated"));
                setShowLoginModal(false);
                navigate('/cart');
            }


        } catch (err) {
            alert("err")
        }
    };

    return (
        <Container className="mt-5" >
            <h5 className="mb-4 fw-bold">Your cart: {orderItems ? orderItems.length : 0} items</h5>
            <hr />

            <Row>
                <Col md={8} xs={12} className="mb-4">
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
                </Col>

                <Col md={4} xs={12}>
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

            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleLogin}>
                        Sign In
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container >


    );
};

export default ShoppingCart;