import "./styles.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import ShopPage from "./components/ShopPage";
import BookDetailPage from "./components/BookDetailPage";
import CartPage from "./components/CartPage";

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/book/:id" element={<BookDetailPage />} />
                <Route path="/cart/:id" element={<CartPage/>}/>
            </Routes>
            <Footer/>
        </Router>

    )
}

export default App
