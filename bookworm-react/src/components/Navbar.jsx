import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavbarStyles.css';
import logo from '../assets/images/logo.png';

const Navbar = () => {
    const [clicked, setClicked] = useState(false);
    const [user, setUser] = useState("");
    const [cartQuantity, setCartQuantity] = useState(0)
    const location = useLocation();
    const navigate = useNavigate();
    const user_id = localStorage.getItem("user_id");

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const fullName = localStorage.getItem("full_name");
        if (fullName) {
            setUser(fullName);
        }
    }, []);

    useEffect(() => {
        const updateName = () => {
            const fullName = localStorage.getItem("full_name");
            setUser(fullName);
        };

        updateName(); // khởi tạo lần đầu
        window.addEventListener("full_name_updated", updateName);

        return () => {
            window.removeEventListener("full_name_updated", updateName);
        };
    }, []);

    useEffect(() => {
        let quantity = +localStorage.getItem("quantity") || 0
        setCartQuantity(quantity)
        const handleCartUpdate = () => {
            let quantity = +localStorage.getItem("quantity") || 0
            setCartQuantity(quantity)
        }
        window.addEventListener("cartUpdated", handleCartUpdate)

        // return () => {
        //     window.removeEventListener("cartUpdated", handleCartUpdate)
        // }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("full_name");
        localStorage.removeItem("user_id");
        setUser("");
        navigate('/login');
    };

    const handleClick = () => {
        setClicked(!clicked);
    };

    return (
        <nav>
            <a>
                <img src={logo} alt="Logo" className="logo-img" />
                <span className="fw-bold"> BOOKWORM</span>
            </a>

            <div>
                <ul id="navbar" className={clicked ? 'active' : ''}>
                    <li><Link className={isActive('/') ? 'active' : ''} to="/">Home</Link></li>
                    <li><Link className={isActive('/shop') ? 'active' : ''} to="/shop">Shop</Link></li>
                    <li><Link className={isActive('/about') ? 'active' : ''} to="/about">About</Link></li>
                    <li><Link className={isActive('/cart') ? 'active' : ''} to={`/cart/${user_id}`}>Cart <span>({cartQuantity})</span></Link></li>
                    {
                        user ? (
                            <div className="dropdown">
                                <button
                                    className="btn btn-secondary dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {user}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <li><a className="dropdown-item" href="#" onClick={handleLogout}>Sign out</a></li>
                                </ul>
                            </div>

                        ) : (
                            <li><Link className={isActive('/login') ? 'active' : ''} to="/login">Sign in</Link></li>
                        )
                    }
                </ul>
            </div>
            <div id="mobile" onClick={handleClick}>
                <i id="bars" className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
            </div>
        </nav>
    );
};

export default Navbar;
