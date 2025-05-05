import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const LoginModal = ({ show, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng nhập đầy đủ email và mật khẩu!',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8003/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `grant_type=password&username=${email}&password=${password}&scope=&client_id=string&client_secret=string`,
                credentials: "include"
            });

            const data = await response.json();

            if (data.detail) {
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng nhập thất bại!',
                    confirmButtonText: 'OK'
                });
                setEmail('');
                setPassword('');
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công!',
                    showConfirmButton: true,
                    timer: 1500,
                    confirmButtonText: 'OK'
                });
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("user_id", data.user_id);
                localStorage.setItem("full_name", data.full_name);
                window.dispatchEvent(new Event("full_name_updated"));
                onClose();
                setEmail('');
                setPassword('');
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi khi đăng nhập!',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
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
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleLogin}>
                    Sign In
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LoginModal;
