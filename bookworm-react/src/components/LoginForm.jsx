import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            navigate("/");
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            setErrors("Please enter both email and password.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8002/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: JSON.stringify(`grant_type=password&username=${form.email}&password=${form.password}&scope=&client_id=string&client_secret=string`)
            });

            const data = await response.json();

            if (data.detail) {
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng nhập thất bại!',
                    confirmButtonText: 'OK'
                });
                setForm({ email: '', password: '' })
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
                navigate('/');
            }


        } catch (err) {
            alert("err")
        }
    };

    return (
        <div className="App">
            <div className="login template d-flex justify-content-center align-items-center vh-100" style={{
                backgroundImage: 'url("https://bacala.vercel.app/assets/login-560UfFG9.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="form-container p-5 rounded bg-white">
                    {errors && (
                        <div className="alert alert-danger" role="alert">
                            {errors}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <h3 className='text-center'>Sign in</h3>
                        <div className="mb-3">
                            <label htmlFor="email" className='text-start'>Email address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter password"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='d-grid'>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
