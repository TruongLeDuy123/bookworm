import React, { useState, useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import LoginModal from "../components/LoginModal";
import CartTable from "../components/CartTable";
import CartSummary from "../components/CartSummary";

const ShoppingCart = () => {
    const [orderItems, setOrderItems] = useState(null);
    const [cartTotal, setCartTotal] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setOrderItems(data);
    }, []);

    const checkout = async (cart, userId) => {
        const res = await fetch(`http://127.0.0.1:8002/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart, user_id: userId })
        });
        const data = await res.json();

        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Đặt hàng thành công!',
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
                    setOrderItems(updatedCart);
                    const updateQuantity = updatedCart.reduce((total, item) => total + item.quantity, 0);
                    localStorage.setItem("cart", JSON.stringify(updatedCart));
                    localStorage.setItem("quantity", updateQuantity);
                    window.dispatchEvent(new Event("cartUpdated"));
                });
            }
        }
    };

    const handlePlaceOrder = async () => {
        let access_token = localStorage.getItem("access_token");
        if (!access_token) {
            setShowLoginModal(true);
            return;
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
    };

    const increaseQty = (bookId) => {
        setOrderItems(prevItems => {
            const updatedItems = prevItems.map(item => {
                if (item.book_id === bookId) {
                    if (item.quantity < 8) {
                        const quantityCart = localStorage.getItem("quantity");
                        localStorage.setItem("quantity", +quantityCart + 1);
                        return { ...item, quantity: item.quantity + 1 };
                    }
                }
                return item;
            });
            localStorage.setItem("cart", JSON.stringify(updatedItems));
            window.dispatchEvent(new Event("cartUpdated"));
            return updatedItems;
        });
    };

    const decreaseQty = (bookId) => {
        setOrderItems(prevItems => {
            const updatedItems = prevItems.map(item => {
                if (item.book_id === bookId) {
                    const quantityCart = localStorage.getItem("quantity");
                    localStorage.setItem("quantity", +quantityCart - 1);
                    if (item.quantity > 1) return { ...item, quantity: item.quantity - 1 };
                    return null;
                }
                return item;
            }).filter(item => item !== null);
            localStorage.setItem("cart", JSON.stringify(updatedItems));
            window.dispatchEvent(new Event("cartUpdated"));
            return updatedItems;
        });
    };

    useEffect(() => {
        if (orderItems) {
            const cartTotal = orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            setCartTotal(cartTotal);
        }
    }, [orderItems]);

    return (
        <Container className="mt-5">
            <h5 className="mb-4 fw-bold">Your cart: {orderItems ? orderItems.length : 0} items</h5>
            <hr />

            <Row>
                <Col md={8} xs={12} className="mb-4">
                    <CartTable orderItems={orderItems} increaseQty={increaseQty} decreaseQty={decreaseQty} />
                </Col>

                <Col md={4} xs={12}>
                    <CartSummary cartTotal={cartTotal} handlePlaceOrder={handlePlaceOrder} />
                </Col>
            </Row>

            <LoginModal
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </Container>
    );
};

export default ShoppingCart;