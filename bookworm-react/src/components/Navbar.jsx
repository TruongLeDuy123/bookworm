import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import logo from "../assets/images/logo.png";
import LoginModal from './LoginModal';
import Swal from 'sweetalert2';
import { fetchWithAuth } from '../fetchWithAuth';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState("");
    const [cartQuantity, setCartQuantity] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const dropdownRef = useRef(null);

    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        const fullName = localStorage.getItem("full_name");
        if (fullName) setUser(fullName);

        const updateName = () => {
            const fullName = localStorage.getItem("full_name");
            setUser(fullName);
        };

        window.addEventListener("full_name_updated", updateName);
        return () => window.removeEventListener("full_name_updated", updateName);
    }, []);

    useEffect(() => {
        const handleCartUpdate = () => {
            const quantity = +localStorage.getItem("quantity") || 0;
            setCartQuantity(quantity);
        };

        handleCartUpdate();
        window.addEventListener("cartUpdated", handleCartUpdate);
        return () => window.removeEventListener("cartUpdated", handleCartUpdate);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const handleLogout = async () => {
        // Gọi API logout để xóa refresh_token ở cookie
        await fetch('http://127.0.0.1:8003/logout', {
            method: 'POST',
            credentials: 'include',
        });
        localStorage.removeItem("access_token");
        localStorage.removeItem("full_name");
        localStorage.removeItem("user_id");
        setUser("");
        Swal.fire({
            icon: 'success',
            title: 'Đăng xuất thành công!',
            showConfirmButton: true,
            timer: 1500,
            confirmButtonText: 'OK'
        });
        setMenuOpen(false);
        setDropdownOpen(false);
    };

    const handleLogin = () => {
        setMenuOpen(false);
        setShowLoginModal(true);
        setDropdownOpen(false);
    };

    const getLinkClass = (isActive) =>
        isActive
            ? "text-black underline font-semibold transition"
            : "text-black no-underline hover:underline hover:text-blue-600 transition";

    const renderDropdown = () => (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="bg-secondary inline-flex justify-between items-center max-w-[200px] px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md"
            >
                <span className="truncate">{user}</span>
            </button>
            {dropdownOpen && (
                <div className="absolute rounded-md bg-white border-2 shadow-lg">
                    <ul className="py-1 px-3 hover:bg-gray-100">
                        <li>
                            <button onClick={handleLogout} className="block w-full py-1 text-gray-700">Sign out</button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );

    const renderNavLinks = () => (
        <ul className="flex gap-10">
            <li><NavLink to="/" className={({ isActive }) => getLinkClass(isActive)}>Home</NavLink></li>
            <li><NavLink to="/shop" className={({ isActive }) => getLinkClass(isActive)}>Shop</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => getLinkClass(isActive)}>About</NavLink></li>
            <li><NavLink to="/cart" className={({ isActive }) => getLinkClass(isActive)}>Cart <span>({cartQuantity})</span></NavLink></li>
            <li>
                {user ? renderDropdown() : (
                    <button
                        onClick={handleLogin}
                        className="text-black hover:underline hover:text-blue-600 transition"
                    >
                        Sign in
                    </button>
                )}
            </li>
        </ul>
    );

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gray-50 px-1 flex justify-between items-center border-b border-gray-200 fixed top-0 left-0 w-full z-50">
                <div className="container flex justify-between items-center">
                    <div className="z-50">
                        <div className="flex items-center">
                            <div className="w-8 h-8 mr-2">
                                <img src={logo} alt="Logo" />
                            </div>
                            <h1 className="text-lg font-semibold text-black mt-2">BOOKWORM</h1>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-base text-gray-700 mt-4">
                        <nav>{renderNavLinks()}</nav>
                    </div>
                </div>

                <button onClick={toggleMenu} className="md:hidden z-50">
                    {menuOpen ? (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path d="M6 18L18 6M6 6l12 12" stroke="black" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path d="M4 6h16M4 12h16M4 18h16" stroke="black" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    )}
                </button>

                {menuOpen && (
                    <div className="fixed top-11 left-0 w-full bg-gray-50 border-t border-gray-200 shadow-md">
                        <nav className="px-6 py-4 text-sm text-gray-700">
                            <ul className="flex flex-col gap-4">
                                <li><NavLink to="/" className={({ isActive }) => getLinkClass(isActive)}>Home</NavLink></li>
                                <li><NavLink to="/shop" className={({ isActive }) => getLinkClass(isActive)}>Shop</NavLink></li>
                                <li><NavLink to="/about" className={({ isActive }) => getLinkClass(isActive)}>About</NavLink></li>
                                <li><NavLink to="/cart" className={({ isActive }) => getLinkClass(isActive)}>Cart <span>({cartQuantity})</span></NavLink></li>
                                <li>
                                    {user ? renderDropdown() : (
                                        <button
                                            onClick={handleLogin}
                                            className="text-black hover:underline hover:text-blue-600 transition"
                                        >
                                            Sign in
                                        </button>
                                    )}
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </header>

            <LoginModal
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </div>
    );
};

export default Header;
