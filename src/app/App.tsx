// src/app/App.tsx
"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './home/page';
import SayurPage from './sayur/page';
import BuahPage from './buah/page';
import DairyPage from './dairy/page';
import DagingPage from './daging/page';
import SeafoodPage from './seafood/page';
import LoginPage from './login/page';
import RegisterPage from './register/page';
import ProfilePage from './profile/page';
import CheckoutPage from './checkout/page';
import RiwayatPage from './riwayat/page';
import CartPage from './cart/page'; // Import halaman keranjang

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sayur" element={<SayurPage />} />
                <Route path="/buah" element={<BuahPage />} />
                <Route path="/dairy" element={<DairyPage />} />
                <Route path="/daging" element={<DagingPage />} />
                <Route path="/seafood" element={<SeafoodPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/riwayat" element={<RiwayatPage />} />
                <Route path="/cart" element={<CartPage />} /> {/* Tambahkan rute ini */}
            </Routes>
        </Router>
    );
};

export default App;
