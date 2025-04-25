import "./styles.css"
import "./index.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import ShopPage from "./pages/ShopPage";
import BookDetailPage from "./components/BookDetailPage";
import CartPage from "./components/CartPage";
import Header from "./components/Header";
import AboutPage from "./components/AboutPage";

const App = () => {
    return (
        <div>
            {/* <Router> */}
            <Header />
            <main>
                {/* <Navbar /> */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/book/:id" element={<BookDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                </Routes>
            </main>
            <Footer />
            {/* </Router> */}
        </div>
    )
}

export default App
