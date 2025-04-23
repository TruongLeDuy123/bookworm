import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const navLinkClass = ({ isActive }) =>
        isActive ? 'underline font-medium' : 'hover:underline';

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const [clicked, setClicked] = useState(false);
    const [user, setUser] = useState("");
    const [cartQuantity, setCartQuantity] = useState(0)
    const location = useLocation();
    const navigate = useNavigate();
    const user_id = localStorage.getItem("user_id");

    // const isActive = (path) => location.pathname === path;

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

    const getLinkClass = (isActive) =>
        isActive
            ? "text-black underline font-semibold transition"
            : "text-black no-underline hover:underline hover:text-blue-600 transition";

    return (
        <div className="flex flex-col min-h-screen">

            <header className="bg-gray-50 px-6 flex justify-between items-center border-b border-gray-200 fixed top-0 left-0 w-full z-50">
                {/* Logo */}
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="z-50">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-400 text-xs text-white flex items-center justify-center mr-2">
                                32x32
                            </div>
                            <h1 className="text-lg font-semibold text-black mt-2">BOOKWORM</h1>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6 text-base text-gray-700 mt-4">
                        <nav>
                            <ul className="flex gap-10 ">
                                <li><NavLink to="/" className={({ isActive }) => getLinkClass(isActive)}>Home</NavLink></li>
                                <li><NavLink to="/shop" className={({ isActive }) => getLinkClass(isActive)}>Shop</NavLink></li>
                                <li><NavLink to="/about" className={({ isActive }) => getLinkClass(isActive)}>About</NavLink></li>
                                <li><NavLink to={`/cart/${user_id}`} className={({ isActive }) => getLinkClass(isActive)}>Cart <span>({cartQuantity})</span></NavLink></li>
                                <li>
                                    {user ? (
                                        <div className="relative inline-block" ref={dropdownRef}>
                                            <button
                                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                                className="bg-secondary inline-flex justify-between items-center max-w-[200px] px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                                            >
                                                <span className="truncate">{user}</span>

                                            </button>

                                            {dropdownOpen && (
                                                <div className=" absolute mt-2 rounded-md bg-white border-2 shadow-lg ring-5 ring-black ring-opacity-5 focus:outline-none">
                                                    <ul className="py-1 px-3 hover:bg-gray-100">
                                                        <li>
                                                            <button
                                                                onClick={handleLogout}
                                                                className="block w-full py-1 text-gray-700"
                                                            >
                                                                Sign out
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <NavLink
                                            to="/login"
                                            className={({ isActive }) => getLinkClass(isActive)}
                                        >
                                            Sign in
                                        </NavLink>
                                    )}
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>


                {/* Hamburger icon for mobile */}
                <button onClick={toggleMenu} className="md:hidden z-50">
                    {menuOpen ? (
                        // Close Icon
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M6 18L18 6M6 6l12 12"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    ) : (
                        // Hamburger Icon
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M4 6h16M4 12h16M4 18h16"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </button>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="fixed top-16 left-0 w-full bg-gray-50 border-t border-gray-200 shadow-md md:hidden z-40">
                        <nav className="px-6 py-4 text-sm text-gray-700">
                            <ul className="flex flex-col gap-4">
                                <li><Link to="/" onClick={toggleMenu} className={navLinkClass}>Home</Link></li>
                                <li><Link to="/shop" onClick={toggleMenu} className={navLinkClass}>Shop</Link></li>
                                <li><Link to="/about" onClick={toggleMenu} className={navLinkClass}>About</Link></li>
                                <li><Link to="/cart" onClick={toggleMenu} className={navLinkClass}>Cart (0)</Link></li>
                                <li><Link to="/login" onClick={toggleMenu} className={navLinkClass}>Sign In</Link></li>
                            </ul>
                        </nav>
                    </div>
                )}
            </header>
        </div>
    );
};

export default Header;






// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import './NavbarStyles.css';
// import logo from '../assets/images/logo.png';

// const Navbar = () => {
//     const [clicked, setClicked] = useState(false);
//     const [user, setUser] = useState("");
//     const [cartQuantity, setCartQuantity] = useState(0)
//     const location = useLocation();
//     const navigate = useNavigate();
//     const user_id = localStorage.getItem("user_id");

//     const isActive = (path) => location.pathname === path;

//     useEffect(() => {
//         const fullName = localStorage.getItem("full_name");
//         if (fullName) {
//             setUser(fullName);
//         }
//     }, []);

//     useEffect(() => {
//         const updateName = () => {
//             const fullName = localStorage.getItem("full_name");
//             setUser(fullName);
//         };

//         updateName(); // khởi tạo lần đầu
//         window.addEventListener("full_name_updated", updateName);

//         return () => {
//             window.removeEventListener("full_name_updated", updateName);
//         };
//     }, []);

//     useEffect(() => {
//         let quantity = +localStorage.getItem("quantity") || 0
//         setCartQuantity(quantity)
//         const handleCartUpdate = () => {
//             let quantity = +localStorage.getItem("quantity") || 0
//             setCartQuantity(quantity)
//         }
//         window.addEventListener("cartUpdated", handleCartUpdate)

//         // return () => {
//         //     window.removeEventListener("cartUpdated", handleCartUpdate)
//         // }
//     }, [])

//     const handleLogout = () => {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("full_name");
//         localStorage.removeItem("user_id");
//         setUser("");
//         navigate('/login');
//     };

//     const handleClick = () => {
//         setClicked(!clicked);
//     };

//     return (
//         <nav className="relative flex items-center justify-between px-20 py-5 shadow-[0_5px_15px_rgba(0,0,0,0.06)]">
//             <a>
//                 <img src={logo} alt="Logo" className="logo-img" />
//                 <span className="fw-bold"> BOOKWORM</span>
//             </a>

//             <div>
//                 <ul id="navbar" className={clicked ? 'active flex items-center justify-center' : 'flex items-center justify-center'}>
//                     <li className="list-none px-5 relative"><Link className={isActive('/') ? 'active' : ''} to="/">Home</Link></li>
//                     <li className="list-none px-5 relative"><Link className={isActive('/shop') ? 'active' : ''} to="/shop">Shop</Link></li>
//                     <li className="list-none px-5 relative"><Link className={isActive('/about') ? 'active' : ''} to="/about">About</Link></li>
//                     <li className="list-none px-5 relative"><Link className={isActive('/cart') ? 'active' : ''} to={`/cart/${user_id}`}>Cart <span>({cartQuantity})</span></Link></li>
//                     {
//                         user ? (
//                             <div className="dropdown">
//                                 <button
//                                     className="btn btn-secondary dropdown-toggle"
//                                     type="button"
//                                     id="dropdownMenuButton"
//                                     data-bs-toggle="dropdown"
//                                     aria-expanded="false"
//                                 >
//                                     {user}
//                                 </button>
//                                 <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
//                                     <li><a className="dropdown-item" href="#" onClick={handleLogout}>Sign out</a></li>
//                                 </ul>
//                             </div>

//                         ) : (
//                             <li><Link className={isActive('/login') ? 'active' : ''} to="/login">Sign in</Link></li>
//                         )
//                     }
//                 </ul>
//             </div>
//             <div id="mobile" onClick={handleClick}>
//                 <i id="bars" className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
