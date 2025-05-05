import "./styles.css"
import "./index.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Footer from "./components/Footer";
import ShopPage from "./pages/ShopPage";
import BookDetailPage from "./pages/BookDetailPage";
import CartPage from "./pages/CartPage";
import Header from "./components/Header";
import AboutPage from "./pages/AboutPage";
import { CurrencyProvider } from './contexts/CurrencyContext';

const App = () => {
    return (
        <CurrencyProvider>
            <div className="d-flex flex-column min-vh-100">
                <Header />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/book/:id" element={<BookDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </CurrencyProvider>
    )
}

export default App